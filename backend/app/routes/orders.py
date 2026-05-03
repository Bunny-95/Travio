from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models.order import Order
from app.services.ai_predictor import predict_prep_time

router = APIRouter(prefix="/orders", tags=["Orders"])


# -----------------------------------
# SETTINGS (for demo/testing)
# -----------------------------------
DEMO_MODE = False
DEMO_HOUR = 10
DEMO_MINUTE = 30


# -----------------------------------
# PLACE ORDER
# -----------------------------------
@router.post("/place")
def place_order(
    user_id: int,
    restaurant_id: int,
    total: float,
    items: str = "",
    db: Session = Depends(get_db)
):
    # Current time (demo mode or real time)
    if DEMO_MODE:
        now = datetime.now().replace(
            hour=DEMO_HOUR,
            minute=DEMO_MINUTE,
            second=0,
            microsecond=0
        )
    else:
        now = datetime.now()

    # Count active orders
    active_orders = db.query(Order).filter(
        Order.restaurant_id == restaurant_id,
        Order.status != "Ready"
    ).count()

    # Base AI prediction
    prep_minutes = predict_prep_time(total, active_orders)

    # -----------------------------------
    # Kitchen Capacity AI
    # -----------------------------------
    if active_orders <= 5:
        capacity_delay = 0
    elif active_orders <= 10:
        capacity_delay = 1
    elif active_orders <= 15:
        capacity_delay = 2
    else:
        capacity_delay = 3

    prep_minutes += capacity_delay
    
    if prep_minutes > 12:
        prep_minutes = 12

    # -----------------------------------
    # Rush Hour Bonus Delay
    # Example demo rush hour: 10:20 to 10:45
    # -----------------------------------
    if (
        now.hour == 10 and
        20 <= now.minute <= 45
    ):
        prep_minutes += 3

    # Ready time
    ready_time = now + timedelta(minutes=prep_minutes)

    # Save order
    order = Order(
        user_id=user_id,
        restaurant_id=restaurant_id,
        status="Placed",
        total=total,
        items=items,
        estimated_ready_time=ready_time.strftime("%H:%M")
    )

    db.add(order)
    db.commit()
    db.refresh(order)
    

    slot_size = 5          # minutes
    orders_per_slot = 10

    slot_number = active_orders // orders_per_slot
    slot_start = ready_time
    slot_end = slot_start + timedelta(minutes=5)

    return {
        "message": "Order placed",
        "order_id": order.id,
        "active_orders": active_orders,
        "predicted_minutes": prep_minutes,
        "ready_time": order.estimated_ready_time,
        "pickup_slot": f"{slot_start.strftime('%H:%M')} - {slot_end.strftime('%H:%M')}"
    }


# -----------------------------------
# GET ALL ORDERS
# -----------------------------------
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


# -----------------------------------
# UPDATE ORDER STATUS
# -----------------------------------
@router.put("/{order_id}/status")
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = status
    db.commit()
    db.refresh(order)

    return {
        "message": "Status updated",
        "order_id": order.id,
        "status": order.status
    }


# -----------------------------------
# TRACK ORDER
# -----------------------------------
@router.get("/{order_id}/track")
def track_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # ALWAYS use real current time here
    now = datetime.now()

    ready_dt = datetime.strptime(
        order.estimated_ready_time,
        "%H:%M"
    ).replace(
        year=now.year,
        month=now.month,
        day=now.day
    )

    remaining = int(
        (ready_dt - now).total_seconds() / 60
    )

    if remaining < 0:
        remaining = 0

    # Better status progression
    if remaining > 8:
        status = "Placed"
    elif remaining > 6:
        status = "Accepted"
    elif remaining > 4:
        status = "Preparing"
    elif remaining > 2:
        status = "Almost Ready"
    else:
        status = "Ready"

    order.status = status
    db.commit()

    return {
        "order_id": order.id,
        "status": status,
        "predicted_minutes": remaining,
        "ready_time": order.estimated_ready_time,
        "items": order.items,
        "total": order.total,
        "restaurant_id": order.restaurant_id
    }

# -----------------------------------
# DELETE ORDER
# -----------------------------------
@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    
    return {"message": "Order deleted", "order_id": order_id}