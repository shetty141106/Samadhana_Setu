from fastapi import FastAPI
from app.routers.analyze import router as analyze_router

app = FastAPI(title="SamadhanSetu AI Service", version="0.1.0")
app.include_router(analyze_router)


@app.get("/api/v1/health")
def health() -> dict:
    return {"status": "UP", "service": "samadhansetu-ai"}
