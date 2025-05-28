from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    HTTPException,
    Query,
    File,
    UploadFile,
    Form,
)
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy import and_, exists
from datetime import date, datetime
from sqlalchemy.sql import func, select, case
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
import shutil
from pathlib import Path
import json

from models import (
    User,
    Content,
    Tags,
    Like,
    RemovedFavorite,
    UserCategoryPreference,
    SessionLocal,
    MacroCategory,
    Organisation,
    EventType,
    PublisherType,
)
from schemas import (
    ContentSchema,
    TagsResponseSchema,
    TagSchema,
    UserSchema,
    OrganisationCreate,
    OrganisationResponse,
    OrganisationListResponse,
    OrganisationContentListResponse,
)

app = FastAPI()
router = APIRouter(prefix="/api/v1", tags=["contents"])

# Настройка хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Создаем директорию для загрузки файлов, если её нет
UPLOAD_DIR = Path("images")
UPLOAD_DIR.mkdir(exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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


def create_filter_excluded_contend(db, current_user):
    excluded_content_subquery = (
        db.query(Like.content_id)
        .filter(Like.user_id == current_user.id)
        .union(
            db.query(RemovedFavorite.content_id).filter(
                RemovedFavorite.user_id == current_user.id
            )
        )
        .subquery()
    )
    return excluded_content_subquery


@router.get("/contents_feed", response_model=list[ContentSchema])
def get_content_for_feed(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    db: Session = Depends(get_db),
):
    q_filter = create_date_filter(date_start, date_end)
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    preferred_tags_subquery = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == current_user.id)
        .subquery()
    )
    excluded_content_subquery = create_filter_excluded_contend(db, current_user)
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(Content.city == current_user.city)
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(selectinload(Content.tags))
    )

    if db.query(preferred_tags_subquery).count() > 0:
        content_query = content_query.filter(
            Content.tags.any(Tags.id.in_(select(preferred_tags_subquery)))
        )

    return content_query.all()


@app.get("/api/v1/tags", response_model=TagsResponseSchema)
def get_tags(username: str, macro_category: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    macro_category_obj = (
        db.query(MacroCategory).filter(MacroCategory.name == macro_category).first()
    )

    if not macro_category_obj:
        return TagsResponseSchema(tags=[], preferences=[])

    liked_content_ids = (
        db.query(Like.content_id).filter(Like.user_id == user.id).subquery()
    )
    removed_content_ids = (
        db.query(RemovedFavorite.content_id)
        .filter(RemovedFavorite.user_id == user.id)
        .subquery()
    )
    tags_query = (
        db.query(
            Tags.id,
            Tags.name,
            Tags.description,
            func.coalesce(
                func.count(case((Content.city == user.city, Content.id)))
                - func.count(case((Content.id.in_(liked_content_ids), Content.id)))
                - func.count(case((Content.id.in_(removed_content_ids), Content.id))),
                0,
            ).label("content_count"),
        )
        .outerjoin(Tags.contents)
        .filter(Tags.macro_category_id == macro_category_obj.id)
        .filter(Content.city == user.city)
        .group_by(Tags.id, Tags.name, Tags.description)
    )
    tags = tags_query.all()
    preferences = (
        db.query(UserCategoryPreference.tag_id)
        .filter(UserCategoryPreference.user_id == user.id)
        .all()
    )

    return TagsResponseSchema(
        tags=[
            TagSchema(
                id=tag.id,
                name=tag.name,
                description=tag.description,
                count=tag.content_count,
            )
            for tag in tags
        ],
        preferences=[p.tag_id for p in preferences],
    )


@app.get("/api/v1/contents", response_model=List[ContentSchema])
def get_content(
    username: str,
    tag: Optional[str] = None,
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    db: Session = Depends(get_db),
) -> List[ContentSchema]:
    q_filter = create_date_filter(date_start, date_end)
    q_filter.append(Content.tags.any(Tags.name == tag))
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    if current_user.city:
        q_filter.append(Content.city == current_user.city)

    excluded_content_subquery = create_filter_excluded_contend(db, current_user)
    content_query = (
        db.query(Content)
        .filter(and_(*q_filter))
        .filter(~Content.id.in_(select(excluded_content_subquery)))
        .options(selectinload(Content.tags))
    )

    return content_query.all()


@router.get("/contents/liked", response_model=list[ContentSchema])
def get_liked_content(
    username: str,
    date_start: date | None = None,
    date_end: date | None = None,
    value: bool = True,
    db: Session = Depends(get_db),
) -> list[ContentSchema]:
    user_id = db.query(User.id).filter(User.username == username).scalar()

    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")

    likes_subquery = (
        db.query(Like.content_id, Like.created)
        .filter(
            Like.user_id == user_id,
            Like.value.is_(value),
            Like.content_id == Content.id,
        )
        .subquery()
    )
    likes_exists = (
        exists().where(likes_subquery.c.content_id == Content.id).correlate(Content)
    )
    date_filters = create_date_filter(date_start, date_end)
    filters = [likes_exists] + date_filters if date_filters else [likes_exists]
    content_query = (
        db.query(Content)
        .filter(*filters)
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
        .options(joinedload(Content.tags).joinedload(Tags.macro_category))
        .join(likes_subquery, Content.id == likes_subquery.c.content_id)
        .order_by(likes_subquery.c.created.desc())
    )
    content = content_query.all()

    for item in content:
        if item.tags and item.tags[0].macro_category:
            macro_category = item.tags[0].macro_category.name
        else:
            macro_category = None
        item.macro_category = macro_category

    return content


@app.post("/api/v1/register", status_code=201)
def register_user(user_data: UserSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    new_user = User(username=user_data.username, city=user_data.city)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Пользователь успешно зарегистрирован", "user_id": new_user.id}


@router.post("/organisations", response_model=OrganisationResponse, status_code=201)
def create_organisation(
    username: str, organisation: OrganisationCreate, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверяем, не существует ли уже организация с таким email
    if db.query(Organisation).filter(Organisation.email == organisation.email).first():
        raise HTTPException(
            status_code=400, detail="Organisation with this email already exists"
        )

    # Хешируем пароль
    hashed_password = pwd_context.hash(organisation.password)

    # Создаем новую организацию
    db_organisation = Organisation(
        name=organisation.name,
        phone=organisation.phone,
        email=organisation.email,
        password=hashed_password,
        user_id=user.id,
    )

    db.add(db_organisation)
    db.commit()
    db.refresh(db_organisation)

    return db_organisation


@router.post("/contents", response_model=ContentSchema, status_code=201)
async def create_content(
    username: str,
    name: str = Form(...),
    description: str = Form(...),
    contact: str = Form("{}"),  # JSON строка
    date_start: Optional[str] = Form(None),
    date_end: Optional[str] = Form(None),
    time: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    cost: Optional[int] = Form(None),
    city: str = Form("nn"),
    event_type: EventType = Form(EventType.OFFLINE),
    tags: str = Form(...),  # список ID через запятую или одно значение
    publisher_type: PublisherType = Form(...),
    organisation_id: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    # Парсим JSON поля
    try:
        contact_dict = json.loads(contact)
        # Преобразуем contact в список словарей, если это не список
        if not isinstance(contact_dict, list):
            contact_dict = [contact_dict] if contact_dict else []

        # Парсим теги
        try:
            # Пробуем распарсить как JSON
            tags_list = json.loads(tags)
            if not isinstance(tags_list, list):
                tags_list = [tags_list]
        except json.JSONDecodeError:
            # Если не JSON, разбиваем по запятой
            tags_list = [int(tag.strip()) for tag in tags.split(",") if tag.strip()]
        except ValueError:
            # Если одиночное значение
            tags_list = [int(tags)]

    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")

    # Преобразуем даты если они предоставлены
    try:
        date_start_obj = date.fromisoformat(date_start) if date_start else None
        date_end_obj = date.fromisoformat(date_end) if date_end else None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")

    # Определяем тип публикации и проверяем права
    if publisher_type == "organisation":
        if not organisation_id:
            raise HTTPException(
                status_code=400,
                detail="organisation_id is required when publishing as organisation",
            )

        # Проверяем существование пользователя и его права на организацию
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        organisation = (
            db.query(Organisation)
            .filter(Organisation.id == organisation_id, Organisation.user_id == user.id)
            .first()
        )
        if not organisation:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to publish content for this organisation",
            )
        publisher_id = organisation_id
    else:  # publisher_type == "user"
        if organisation_id is not None:
            raise HTTPException(
                status_code=400,
                detail="organisation_id should not be set when publishing as user",
            )

        # Проверяем существование пользователя
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        publisher_id = user.id

    # Проверяем существование всех тегов
    tags = db.query(Tags).filter(Tags.id.in_(tags_list)).all()
    if len(tags) != len(tags_list):
        raise HTTPException(status_code=400, detail="Some tags not found")

    # Создаем уникальный идентификатор
    unique_id = f"{name}_{publisher_type}_{publisher_id}_{datetime.now().timestamp()}"

    # Обрабатываем загрузку изображения
    image_path = None
    if image:
        # Проверяем тип файла
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Создаем имя файла и сохраняем его
        file_extension = image.filename.split(".")[-1]
        image_filename = f"{unique_id}.{file_extension}"
        image_path = UPLOAD_DIR / image_filename

        with image_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_path = str(image_path)

    # Создаем новый контент
    db_content = Content(
        name=name,
        description=description,
        contact=contact_dict,
        date_start=date_start_obj,
        date_end=date_end_obj,
        time=time,
        location=location,
        cost=cost,
        city=city,
        event_type=event_type,
        unique_id=unique_id,
        image=image_path,
        publisher_type=publisher_type,
        publisher_id=publisher_id,
    )
    db_content.tags = tags

    db.add(db_content)
    db.commit()
    db.refresh(db_content)

    # Определяем macro_category на основе первого тега
    macro_category = None
    if tags and tags[0].macro_category:
        macro_category = tags[0].macro_category.name

    # Создаем объект ответа
    return ContentSchema(
        id=db_content.id,
        name=db_content.name,
        description=db_content.description,
        image=db_content.image,
        contact=contact_dict,
        date_start=db_content.date_start,
        date_end=db_content.date_end,
        time=db_content.time,
        location=db_content.location,
        cost=db_content.cost,
        city=db_content.city,
        event_type=db_content.event_type,
        publisher_type=db_content.publisher_type,
        publisher_id=db_content.publisher_id,
        tags=[TagSchema.model_validate(tag) for tag in tags],
        macro_category=macro_category,
    )


@router.get("/organisations", response_model=OrganisationListResponse)
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

    return OrganisationListResponse(
        organisations=organisations, total_count=total_count
    )


@router.get(
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


@router.get("/users/{username}/contents", response_model=List[ContentSchema])
def get_user_contents(
    username: str,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    event_type: Optional[EventType] = None,
    db: Session = Depends(get_db),
):
    # Проверяем существование пользователя
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Базовый запрос для контента
    query = (
        db.query(Content)
        .options(selectinload(Content.tags))
        .filter(
            Content.publisher_type == "user",
            Content.publisher_id == user.id,
        )
    )

    # Применяем фильтры по датам
    if date_start or date_end:
        date_filters = create_date_filter(date_start, date_end)
        query = query.filter(and_(*date_filters))

    # Фильтр по типу мероприятия
    if event_type:
        query = query.filter(Content.event_type == event_type)

    # Применяем пагинацию и сортировку
    contents = (
        query.order_by(Content.date_start.asc().nullslast(), Content.created.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    # Добавляем macro_category для каждого контента
    for content in contents:
        if content.tags and content.tags[0].macro_category:
            content.macro_category = content.tags[0].macro_category.name
        else:
            content.macro_category = None

    return contents


app.include_router(router)
