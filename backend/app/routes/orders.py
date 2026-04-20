from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models.order import Order

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/place")
def place_order(
    user_id: int,
    restaurant_id: int,
    total: float,
    db: Session = Depends(get_db)
):
    ready_time = datetime.now() + timedelta(minutes=15)

    order = Order(
        user_id=user_id,
        restaurant_id=restaurant_id,
        status="Placed",
        total=total,
        estimated_ready_time=str(ready_time.strftime("%H:%M"))
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "message": "Order placed",
        "order_id": order.id,
        "status": order.status,
        "ready_time": order.estimated_ready_time
    }


@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.put("/{order_id}/status")
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    db.commit()

    return {
        "message": "Status updated",
        "order_id": order.id,
        "status": order.status
    }