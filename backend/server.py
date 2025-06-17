from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import whisper
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")  

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_audio(
    audio: UploadFile = File(...),
    roomId: str = Query(...)
):
    filename = f"{roomId}.webm"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as f:
        f.write(await audio.read())

    
    result = model.transcribe(filepath)
    transcript = result["text"]
    print("transcript:",transcript)

    
    if len(transcript) > 1000:
        transcript = transcript[:1000]  

    summary = summarizer(transcript, max_length=150, min_length=30, do_sample=False)[0]["summary_text"]
    print("summary",summary)

    return {"transcript": transcript, "summary": summary}
