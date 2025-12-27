import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session, select, desc

class SavedRoast(SQLModel, table=True):
    id:Optional[int] = Field(default=None, primary_key=True)
    #the code the user sent
    code_snippet: str

    #the AI's response
    roast_text: str
    vibe_code_check: str
    rating: int
    fixed_code: str


    #auto timestamp, so we know when it happened
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


#DB Connection
sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url)


#creates the file & Tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)





load_dotenv()
client = OpenAI(
    api_key = os.getenv("GROQ_API_KEY"),
    base_url = "https://api.groq.com/openai/v1",
)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeSubmission(BaseModel):
    code: str = Field(..., min_length=10, max_length=5000)


def get_roast_logic(code_snippet: str):
    system_prompt = """
    You are a savage, witty senior developer who loves to roast bad code.
    Output strictly in JSON:
    {
        "roast": "joke",
        "rating": 0-10,
        "vibe_code_check": "Yes or No",
        "fixed_code": "code"
    }
    """
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": code_snippet},
        ],
        response_format={"type": "json_object"}
    )
    return json.loads(completion.choices[0].message.content)

@app.post("/roast")
async def roast_endpoint(submission: CodeSubmission):
    result = get_roast_logic(submission.code)

    with Session(engine) as session:
        new_entry = SavedRoast(
            code_snippet = submission.code,
            roast_text = result["roast"],
            rating = result["rating"],
            vibe_code_check = result["vibe_code_check"],
            fixed_code = result["fixed_code"]
        )
        session.add(new_entry)
        session.commit()

        session.refresh(new_entry)
    return result
    
@app.get("/leaderboard")
async def get_leaderboard():
    with Session(engine) as session:

        statement = select(SavedRoast)

        statement = select(SavedRoast).order_by(desc(SavedRoast.timestamp)).limit(5)

        results = session.exec(statement).all()

        return results