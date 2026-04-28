from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("/place")
def place_order(
    user_id: int,
    restaurant_id: int,
    total: float,
    items: str,
    db: Session = Depends(get_db)
):
    order = Order(
        user_id=user_id,
        restaurant_id=restaurant_id,
        total=total,
        items=items
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "message": "Order placed",
        "order_id": order.id
    }


@router.get("/")
def all_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@router.put("/{order_id}")
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    order.status = status
    db.commit()

    return {"message": "Updated"}