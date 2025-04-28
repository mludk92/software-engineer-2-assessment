from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.messages import router as messages_router

app = FastAPI()

# Add CORS middleware!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins — OK for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the messages router
app.include_router(messages_router)

@app.get("/")
def root():
    return {"message": "Welcome to the API server!"}
