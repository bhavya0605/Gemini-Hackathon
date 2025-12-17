from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import session,chat
app = FastAPI(title="Reverse Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router)
app.include_router(chat.router)

@app.get("/")
def health():
    return {"status": "Reverse Tutor backend running"}

