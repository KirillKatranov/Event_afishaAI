from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from models import (
    User,
    get_db,
    Feedback,
)
from schemas import (
    FeedbackRequestSchema,
)
from loguru import logger

router_feedback = APIRouter(prefix="/api/v1", tags=["feedback"])


@router_feedback.post("/feedback", response_model=dict[str, str])
def create_feedback(data: FeedbackRequestSchema, db: Session = Depends(get_db)):
    logger.info(f"Feedback from {data.username}: {data.message}")
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        user = User(username=data.username)
        db.add(user)
        db.commit()
        db.refresh(user)
    feedback = Feedback(user_id=user.id, message=data.message)
    db.add(feedback)
    db.commit()
    logger.info("Feedback saved")
    return {"status": "ok"}
