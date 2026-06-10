from pydantic import BaseModel

class NoteCreate(BaseModel):
    text: str

class NoteResponse(NoteCreate):
    id: int

    class Config:
        from_attributes = True