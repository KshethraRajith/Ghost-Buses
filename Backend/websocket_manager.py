import asyncio
from fetch_data import fetch_buses

async def bus_websocket(ws, interval: int = 1):
    await ws.accept()
    try:
        while True:
            buses = await fetch_buses()
            print(f"Sending {len(buses)} buses at interval")  # 🔹 log every loop
            await ws.send_json({"buses": buses})
            await asyncio.sleep(interval)
    except Exception as e:
        print("WebSocket closed:", e)
    finally:
        await ws.close()
