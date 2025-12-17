from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import session,chat
app = FastAPI(title="Reverse Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(session.router)
app.include_router(chat.router)

@app.get("/")
def health():
    return {"status": "Reverse Tutor backend running"}

