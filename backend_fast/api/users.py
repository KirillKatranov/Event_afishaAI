from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session
from models import (
    User,
    get_db,
)
from schemas import (
    UserSchema,
)
from loguru import logger

router_users = APIRouter(prefix="/api/v1", tags=["users"])

CITY_CHOICES = [
    ("spb", "Санкт-Петербург"),
    ("msk", "Москва"),
    ("ekb", "Екатеринбург"),
    ("nsk", "Новосибирск"),
    ("nn", "Нижний Новгород"),
]


@router_users.post("/register", status_code=201)
def register_user(user_data: UserSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        logger.warning(f"User {user_data.username} already exists")
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    new_user = User(username=user_data.username, city=user_data.city)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"User {user_data.username} registered successfully")
    return {"message": "Пользователь успешно зарегистрирован", "user_id": new_user.id}


@router_users.patch("/users", response_model=dict)
def change_city(
    request_data: UserSchema,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == request_data.username).first()

    if not user:
        logger.warning(f"User {request_data.username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    if request_data.city not in [item[0] for item in CITY_CHOICES]:
        logger.warning(f"Invalid city {request_data.city}")
        raise HTTPException(status_code=400, detail="Invalid city")

    user.city = request_data.city
    db.commit()
    logger.info(f"City for user {request_data.username} changed to {request_data.city}")
    return {"status": "ok"}


@router_users.get("/users", response_model=UserSchema)
def get_user(
    username: str = Query(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.warning(f"User {username} not found")
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"User {username} found")
    return UserSchema(id=user.id, city=user.city, username=user.username)
