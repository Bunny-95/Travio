from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    restaurant_id = Column(Integer)
    total = Column(Float)
    status = Column(String, default="Pending")
    
    # ✅ REQUIRED for your current routes
    estimated_ready_time = Column(String)

    # OPTIONAL (if you still want items)
    items = Column(String)