from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine
from models import Base
from schemas import NoteCreate
import crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/notes")
def get_notes():

    db = SessionLocal()

    notes = crud.get_notes(db)

    db.close()

    return notes


@app.post("/notes")
def create_note(note: NoteCreate):

    db = SessionLocal()

    new_note = crud.create_note(db, note.text)

    db.close()

    return new_note


@app.put("/notes/{note_id}")
def update_note(note_id: int, note: NoteCreate):

    db = SessionLocal()

    updated = crud.update_note(db, note_id, note.text)

    db.close()

    return updated


@app.delete("/notes/{note_id}")
def delete_note(note_id: int):

    db = SessionLocal()

    crud.delete_note(db, note_id)

    db.close()

    return {"message": "Note Deleted Successfully"}