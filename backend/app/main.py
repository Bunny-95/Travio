from fastapi import FastAPI
from app.database import Base, engine

from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.menu_item import MenuItem
from app.models.order import Order
from app.models.order_item import OrderItem

from app.routes.auth import router as auth_router
from app.routes.restaurants import router as restaurant_router
from app.routes.orders import router as order_router

app = FastAPI(title="Easy Eats API")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(restaurant_router)
app.include_router(order_router)


@app.get("/")
def home():
    return {"message": "Easy Eats Backend Running"}