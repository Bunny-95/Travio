def predict_prep_time(total: float, active_orders: int):
    base_time = 5

    # order size factor
    if total > 200:
        base_time += 8
    elif total > 100:
        base_time += 5
    else:
        base_time += 3

    # live queue factor
    queue_delay = active_orders * 2

    return base_time + queue_delay