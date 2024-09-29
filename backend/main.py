from fastapi import FastAPI
from routes.userRoutes import userRouter

app = FastAPI()

app.include_router(userRouter, prefix="/api/v1", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Fast API is up and running"}