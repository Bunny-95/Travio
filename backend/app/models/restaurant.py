from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database import Base

class Restaurant(Base):
    __tablename__= "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    category = Column(String)
    is_open = Column(Boolean, default=True)

