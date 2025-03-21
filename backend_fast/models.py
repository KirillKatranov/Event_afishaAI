import datetime
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    Date,
    Text,
    Boolean,
    ForeignKey,
    JSON,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import relationship, sessionmaker, declarative_base

# Создаем движок SQLAlchemy (engine)
engine = create_engine("postgresql://afisha:password@db/afisha", echo=True)

# Создаем фабрику сессий (SessionLocal)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс моделей
Base = declarative_base()


# Общая абстрактная модель для всех сущностей
class GenericModel(Base):
    __abstract__ = True
    created = Column(DateTime, default=datetime.datetime.utcnow)
    updated = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )


# Модель пользователя (event_user)
class User(GenericModel):
    __tablename__ = "event_user"

    id = Column(Integer, primary_key=True)
    username = Column(String(250), index=True)
    city = Column(String(50), default="nn")

    def __str__(self):
        return f"{self.username}"


User.likes = relationship("Like", back_populates="user")
User.feedback = relationship("Feedback", back_populates="user")
User.removed_favorites = relationship("RemovedFavorite", back_populates="user")
User.category_preferences = relationship(
    "UserCategoryPreference", back_populates="user"
)


# Модель категории (event_macrocategory)
class MacroCategory(Base):
    __tablename__ = "event_macrocategory"

    id = Column(Integer, primary_key=True)
    name = Column(String(250), index=True)
    description = Column(Text, nullable=True)
    image = Column(String(300), nullable=True)

    def __str__(self):
        return self.name


MacroCategory.tags = relationship("Tags", back_populates="macro_category")


# Модель тегов (event_tags)
class Tags(GenericModel):
    __tablename__ = "event_tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(250), index=True)
    description = Column(Text)
    macro_category_id = Column(
        Integer, ForeignKey("event_macrocategory.id"), nullable=True
    )
    macro_category = relationship("MacroCategory", back_populates="tags")

    def __str__(self):
        return self.name


Tags.contents = relationship("Content", secondary="event_content_tags")
Tags.user_preferences = relationship("UserCategoryPreference", back_populates="tag")


# Модель контента (event_content)
class Content(GenericModel):
    __tablename__ = "event_content"

    id = Column(Integer, primary_key=True)
    name = Column(String(250))
    description = Column(Text)
    image = Column(String(300), nullable=True)
    contact = Column(JSON, default={})
    date_start = Column(Date, index=True, nullable=True)
    date_end = Column(Date, index=True, nullable=True)
    time = Column(String(250), nullable=True)
    location = Column(String(250), nullable=True)
    cost = Column(Integer, nullable=True)
    city = Column(String(50), default="nn")
    unique_id = Column(String(250), unique=True)

    tags = relationship("Tags", secondary="event_content_tags")

    def get_tags(self):
        return "\n".join([t.name for t in self.tags])

    def __str__(self):
        return self.name

    __table_args__ = (
        Index("ix_event_content_date_start", "date_start"),
        Index("ix_event_content_date_end", "date_end"),
    )


# Связь контента и тегов (many-to-many) (event_content_tags)
class ContentTags(Base):
    __tablename__ = "event_content_tags"

    content_id = Column(
        Integer, ForeignKey("event_content.id", ondelete="CASCADE"), primary_key=True
    )
    tags_id = Column(
        Integer, ForeignKey("event_tags.id", ondelete="CASCADE"), primary_key=True
    )


# Модель лайков (event_like)
class Like(GenericModel):
    __tablename__ = "event_like"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("event_user.id"))
    content_id = Column(Integer, ForeignKey("event_content.id"))
    value = Column(Boolean)

    user = relationship("User", back_populates="likes")
    content = relationship("Content", back_populates="likes")

    __table_args__ = (
        UniqueConstraint("user_id", "content_id", name="uix_event_like_user_content"),
        Index("ix_event_like_user_content", "user_id", "content_id"),
    )

    def __str__(self):
        return f"{self.user.username} - {self.content.name} - {self.value} - {self.created}"


Content.likes = relationship("Like", back_populates="content")


# Модель обратной связи (event_feedback)
class Feedback(GenericModel):
    __tablename__ = "event_feedback"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("event_user.id"))
    message = Column(Text)

    user = relationship("User", back_populates="feedback")


# Модель удаленных из избранного (event_removedfavorite)
class RemovedFavorite(Base):
    __tablename__ = "event_removedfavorite"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("event_user.id"))
    content_id = Column(Integer, ForeignKey("event_content.id"))
    removed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="removed_favorites")
    content = relationship("Content", back_populates="removed_favorites")

    __table_args__ = (
        UniqueConstraint("user_id", "content_id", name="uix_event_removedfavorite"),
        Index("ix_event_removedfavorite_user_content", "user_id", "content_id"),
    )


Content.removed_favorites = relationship("RemovedFavorite", back_populates="content")


# Модель предпочтений пользователя по категориям (event_usercategorypreference)
class UserCategoryPreference(Base):
    __tablename__ = "event_usercategorypreference"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("event_user.id"))
    tag_id = Column(Integer, ForeignKey("event_tags.id"))

    user = relationship("User", back_populates="category_preferences")
    tag = relationship("Tags", back_populates="user_preferences")

    __table_args__ = (
        UniqueConstraint("user_id", "tag_id", name="uix_event_usercategorypreference"),
    )

    def __str__(self):
        return f"{self.user.username} - {self.tag.name}"
