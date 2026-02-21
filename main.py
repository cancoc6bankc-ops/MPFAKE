import os, uvicorn
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"msg": "Railway Python"}

@app.get("/healthz")
def health():
    return "ok"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
