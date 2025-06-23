from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from models import (
    User,
    Content,
    Like,
    get_db,
)
from schemas import (
    LikeSchema,
    LikeRequestSchema,
)
from loguru import logger

app = FastAPI()

router_likes = APIRouter(prefix="/api/v1", tags=["likes"])


@router_likes.post("/like", response_model=LikeSchema)
def set_like(request_data: LikeRequestSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request_data.username).first()
    if not user:
        user = User(username=request_data.username)
        db.add(user)
        db.commit()
        db.refresh(user)

    content = db.query(Content).filter(Content.id == request_data.content_id).first()

    if not content:
        logger.warning(f"Content {request_data.content_id} not found")
        raise HTTPException(status_code=404, detail="Content not found")

    like = (
        db.query(Like)
        .filter(Like.user_id == user.id, Like.content_id == content.id)
        .first()
    )
    if like:
        like.value = True
    else:
        like = Like(user_id=user.id, content_id=content.id, value=True)
        db.add(like)

    db.commit()
    logger.info(f"Like saved from {user.username} for content {content.id}")
    return {
        "user": user.username,
        "content": content.id,
        "value": True,
    }


@router_likes.post("/dislike", response_model=LikeSchema)
def set_dislike(request_data: LikeRequestSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request_data.username).first()
    if not user:
        user = User(username=request_data.username)
        db.add(user)
        db.commit()
        db.refresh(user)

    content = db.query(Content).filter(Content.id == request_data.content_id).first()
    if not content:
        logger.warning(f"Content {request_data.content_id} not found")
        raise HTTPException(status_code=404, detail="Content not found")

    like = (
        db.query(Like)
        .filter(Like.user_id == user.id, Like.content_id == content.id)
        .first()
    )
    if like:
        like.value = False
    else:
        like = Like(user_id=user.id, content_id=content.id, value=False)
        db.add(like)

    db.commit()
    logger.info(f"Dislike saved from {user.username} for content {content.id}")
    return {
        "user": user.username,
        "content": content.id,
        "value": False,
    }
