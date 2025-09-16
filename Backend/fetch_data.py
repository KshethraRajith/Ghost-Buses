import aiohttp
import time
from google.transit import gtfs_realtime_pb2
from detection import detect_ghost_bus

GTFS_URL = "https://cdn.mbta.com/realtime/VehiclePositions.pb"

async def fetch_buses():
    """
    Fetch bus data from GTFS feed and annotate with detection status.
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(GTFS_URL) as response:
            if response.status == 200:
                raw_data = await response.read()
                feed = gtfs_realtime_pb2.FeedMessage()
                feed.ParseFromString(raw_data)

                buses = []
                now = int(time.time())

                for entity in feed.entity:
                    if entity.HasField("vehicle"):
                        bus = entity.vehicle
                        status = detect_ghost_bus(bus, now)

                        buses.append({
                            "id": bus.vehicle.id,
                            "latitude": bus.position.latitude,
                            "longitude": bus.position.longitude,
                            "timestamp": bus.timestamp,
                            "status": status
                        })

                return buses
            else:
                print(f"Error fetching data: {response.status}")
                return []
