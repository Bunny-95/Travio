from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.menu_item import MenuItem
from app.models.order import Order
from app.models.order_item import OrderItem

from app.routes.auth import router as auth_router
from app.routes.restaurants import router as restaurant_router
from app.routes.orders import router as order_router
from app.routes import payment

app = FastAPI(title="Easy Eats API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://easy-eats-two.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

import sqlite3
try:
    conn = sqlite3.connect("easyeats.db")
    conn.execute("ALTER TABLE orders ADD COLUMN items VARCHAR")
    conn.commit()
except Exception:
    pass

try:
    conn = sqlite3.connect("easyeats.db")
    conn.execute("ALTER TABLE orders ADD COLUMN estimated_ready_time VARCHAR")
    conn.commit()
except Exception:
    pass

app.include_router(auth_router)
app.include_router(restaurant_router)
app.include_router(payment.router)
app.include_router(order_router)

@app.get("/")
def home():
    return {"message": "Easy Eats Backend Running"}