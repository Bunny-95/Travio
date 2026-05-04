from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    restaurant_id = Column(Integer)
    total = Column(Float)
    status = Column(String, default="Pending")
    items = Column(String)