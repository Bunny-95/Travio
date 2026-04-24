from fastapi import APIRouter, HTTPException
import razorpay

router = APIRouter(prefix="/payment", tags=["Payment"])

client = razorpay.Client(
    auth=("rzp_test_SgwHdywMCxal2c", "nmefn58e6A0u0AqPJlHH4zDZ")
)

@router.post("/create-order")
def create_order(amount: int):
    try:
        amount_paise = int(amount) * 100

        order = client.order.create({
            "amount": amount_paise,
            "currency": "INR"
        })

        return order

    except Exception as e:
        print("RAZORPAY ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )