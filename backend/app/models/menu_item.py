from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class MenuItem(Base):
    __tablename__= "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    prep_time = Column(Integer, default=10)

