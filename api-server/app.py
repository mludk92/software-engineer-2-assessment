from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.messages import router as messages_router

# Initialize FastAPI application
app = FastAPI()

# Configure CORS to allow frontend (localhost:3000) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ List allowed frontend origin explicitly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the message-related routes with the application
app.include_router(messages_router)

# Root endpoint to verify server is running
@app.get("/")
def root():
    return {"message": "Welcome to the API server!"}
