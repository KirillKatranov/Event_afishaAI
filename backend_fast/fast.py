from fastapi import (
    FastAPI,
)
from fastapi.middleware.cors import CORSMiddleware

from api.contents import router_contents
from api.users import router_users
from api.cities import router_cities
from api.preferences import router_preferences
from api.likes import router_likes
from api.organisations import router_organisations
from api.feedback import router_feedback
from api.tags import router_tags
from api.reviews import router_reviews
from api.ratings import router_ratings
from api.search import router_search
from api.macro_categories import router_macro_categories

app = FastAPI()
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
app.include_router(router_reviews)
app.include_router(router_ratings)
app.include_router(router_search)
app.include_router(router_macro_categories)
