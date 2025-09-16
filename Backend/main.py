from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fetch_data import fetch_buses
from websocket_manager import bus_websocket   # <-- FIXED import

app = FastAPI()

# Allow frontend (React on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running successfully!"}

@app.get("/buses")
async def get_buses():
    buses = await fetch_buses()
    return {"buses": buses}

@app.websocket("/ws/buses")
async def websocket_endpoint(ws: WebSocket):
    await bus_websocket(ws, interval=1)  