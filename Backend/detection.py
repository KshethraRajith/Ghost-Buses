import time

def detect_ghost_bus(bus, now=None):
    """
    Returns 'ghost' if bus timestamp is stale (> 5 min), otherwise 'healthy'.
    """
    if now is None:
        now = int(time.time())

    last_update = getattr(bus, "timestamp", 0)
    if not last_update:
        return "ghost"

    if (now - last_update) > 300:  # 5 minutes
        return "ghost"
    return "healthy"
