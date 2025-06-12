from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    File,
    UploadFile,
    Form,
    status,
)
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy import and_, exists
from datetime import date
from typing import Optional
import os
import uuid
from io import BytesIO
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from utils.minio_utils import minio_client, bucket_name

from models import (
    User,
    Content,
    get_db,
    Organisation,
    EventType,
)
from schemas import (
    OrganisationResponse,
    OrganisationListResponse,
    OrganisationContentListResponse,
)

router_organisations = APIRouter(prefix="/api/v1", tags=["organisations"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_date_filter(date_start: date, date_end: date):
    q_filter = []

    if date_start and date_end:
        q_filter.append(Content.date_start <= date_end)
        q_filter.append(Content.date_end >= date_start)
    elif date_start:
        q_filter.append(Content.date_start == date_start)
    elif date_end:
        q_filter.append(Content.date_end <= date_end)

    return q_filter


@router_organisations.post(
    "/organisations", response_model=OrganisationResponse, status_code=201
)
async def create_organisation(
    username: str,
    name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    # Проверяем существование пользователя
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверяем уникальность email
    if db.query(exists().where(Organisation.email == email)).scalar():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Хешируем пароль
    hashed_password = pwd_context.hash(password)

    # Создаем организацию
    organisation = Organisation(
        name=name,
        phone=phone,
        email=email,
        password=hashed_password,
        user_id=user.id,
    )

    # Если есть изображение, загружаем его в MinIO
    if image:
        try:
            # Генерируем уникальное имя файла
            file_ext = os.path.splitext(image.filename)[1]
            object_name = f"organisation_images/{str(uuid.uuid4())}{file_ext}"

            # Читаем содержимое файла
            file_content = await image.read()

            # Загружаем файл в MinIO
            minio_client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=BytesIO(file_content),
                length=len(file_content),
                content_type=image.content_type,
            )

            # Сохраняем только путь к файлу, без полного URL
            organisation.image = object_name

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error uploading image: {str(e)}"
            )

    db.add(organisation)
    db.commit()
    db.refresh(organisation)

    # Преобразуем URL изображения для ответа
    if organisation.image:
        organisation.image = f"http://{os.getenv('MINIO_ENDPOINT', 'minio:9000')}/{bucket_name}/{organisation.image}"

    return organisation


@router_organisations.get("/organisations", response_model=OrganisationListResponse)
def get_organisations(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # Базовый запрос с подгрузкой пользователя
    query = db.query(Organisation).options(joinedload(Organisation.user))

    # Если есть поисковый запрос, фильтруем по имени или email
    if search:
        search = f"%{search}%"
        query = query.filter(
            Organisation.name.ilike(search) | Organisation.email.ilike(search)
        )

    # Получаем общее количество организаций
    total_count = query.count()

    # Применяем пагинацию
    organisations = (
        query.order_by(Organisation.created.desc()).offset(skip).limit(limit).all()
    )

    # Преобразуем URL изображений в полные URL, если они еще не являются полными URL
    for org in organisations:
        if org.image and not org.image.startswith("http"):
            org.image = f"http://{os.getenv('MINIO_ENDPOINT', 'minio:9000')}/{bucket_name}/{org.image}"

    return OrganisationListResponse(
        organisations=organisations, total_count=total_count
    )


@router_organisations.get(
    "/organisations/{organisation_id}/contents",
    response_model=OrganisationContentListResponse,
)
def get_organisation_contents(
    organisation_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    event_type: Optional[EventType] = None,
    db: Session = Depends(get_db),
):
    # Проверяем существование организации и загружаем её данные
    organisation = (
        db.query(Organisation)
        .options(joinedload(Organisation.user))
        .filter(Organisation.id == organisation_id)
        .first()
    )

    if not organisation:
        raise HTTPException(status_code=404, detail="Organisation not found")

    # Преобразуем URL изображения организации в полный URL, если он еще не является полным URL
    if organisation.image and not organisation.image.startswith("http"):
        organisation.image = f"http://{os.getenv('MINIO_ENDPOINT', 'minio:9000')}/{bucket_name}/{organisation.image}"

    # Базовый запрос для контента
    query = (
        db.query(Content)
        .options(selectinload(Content.tags))
        .filter(
            Content.publisher_type == "organisation",
            Content.publisher_id == organisation_id,
        )
    )

    # Применяем фильтры по датам
    if date_start or date_end:
        date_filters = create_date_filter(date_start, date_end)
        query = query.filter(and_(*date_filters))

    # Фильтр по типу мероприятия
    if event_type:
        query = query.filter(Content.event_type == event_type)

    # Получаем общее количество контента
    total_count = query.count()

    # Применяем пагинацию и сортировку
    contents = (
        query.order_by(Content.date_start.asc().nullslast(), Content.created.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return OrganisationContentListResponse(
        organisation=organisation, contents=contents, total_count=total_count
    )


@router_organisations.get(
    "/users/{username}/organisations", response_model=OrganisationListResponse
)
def get_user_organisations(
    username: str,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Проверяем существование пользователя
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Получаем организации пользователя
    query = (
        db.query(Organisation)
        .options(joinedload(Organisation.user))  # Подгружаем пользователя
        .filter(Organisation.user_id == user.id)
        .order_by(Organisation.created.desc())
    )

    # Получаем общее количество организаций
    total_count = query.count()

    # Применяем пагинацию
    organisations = query.offset(skip).limit(limit).all()

    # Преобразуем URL изображений в полные URL, если они еще не являются полными URL
    for org in organisations:
        if org.image and not org.image.startswith("http"):
            org.image = f"http://{os.getenv('MINIO_ENDPOINT', 'minio:9000')}/{bucket_name}/{org.image}"

    return OrganisationListResponse(
        organisations=organisations,
        total_count=total_count,
    )


@router_organisations.delete(
    "/organisations/{organisation_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_organisation(
    organisation_id: int,
    username: str = Query(..., description="Username of the user requesting deletion"),
    db: Session = Depends(get_db),
):
    # Получаем организацию
    organisation = (
        db.query(Organisation).filter(Organisation.id == organisation_id).first()
    )

    if not organisation:
        raise HTTPException(status_code=404, detail="Organisation not found")

    # Получаем пользователя
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверка, что пользователь владелец организации
    if organisation.user_id != user.id:
        raise HTTPException(
            status_code=403, detail="You are not allowed to delete this organisation"
        )

    # Удаляем организацию
    db.delete(organisation)
    db.commit()

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)
