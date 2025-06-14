from fastapi import (
    FastAPI,
    Request,
)
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from api.contents import router_contents
from api.users import router_users
from api.cities import router_cities
from api.preferences import router_preferences
from api.likes import router_likes
from api.organisations import router_organisations
from api.feedback import router_feedback
from api.tags import router_tags


class TrailingSlashMiddleware(BaseHTTPMiddleware):
    """Middleware для автоматической обработки слешей в конце URL"""

    async def dispatch(self, request: Request, call_next):
        # Если URL заканчивается на слеш и это не корневой путь
        if request.url.path.endswith("/") and request.url.path != "/":
            # Создаем новый URL без слеша
            new_path = request.url.path.rstrip("/")
            # Создаем новый request с измененным путем
            request.scope["path"] = new_path
            request.scope["raw_path"] = new_path.encode()

        response = await call_next(request)
        return response


app = FastAPI()

# Добавляем middleware для обработки слешей ПЕРЕД CORS
app.add_middleware(TrailingSlashMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_contents)
app.include_router(router_users)
app.include_router(router_cities)
app.include_router(router_preferences)
app.include_router(router_likes)
app.include_router(router_organisations)
app.include_router(router_feedback)
app.include_router(router_tags)
