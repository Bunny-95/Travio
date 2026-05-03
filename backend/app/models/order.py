from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    restaurant_id = Column(Integer)
    total = Column(Float)
    status = Column(String, default="Pending")
    items = Column(String, nullable=True)
    estimated_ready_time = Column(String, nullable=True)