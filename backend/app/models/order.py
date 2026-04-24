from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base
from datetime import datetime


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    status = Column(String, default="Placed")
    total = Column(Float, default=0)
    estimated_ready_time = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)