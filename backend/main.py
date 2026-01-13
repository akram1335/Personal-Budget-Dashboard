from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    id: Optional[str] = None
    description: str
    amount: float
    type: str
    date: Optional[str] = None

transactions_db: List[dict] = []

@app.get("/transactions", response_model=List[Transaction])
def get_transactions():
    return transactions_db

@app.post("/transactions", response_model=Transaction)
def create_transaction(transaction: Transaction):
    new_transaction = transaction.dict()
    new_transaction["id"] = str(uuid.uuid4())
    new_transaction["date"] = datetime.now().isoformat()
    transactions_db.append(new_transaction)
    return new_transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: str):
    for i, t in enumerate(transactions_db):
        if t["id"] == transaction_id:
            transactions_db.pop(i)
            return {"message": "Transaction deleted"}
    raise HTTPException(status_code=404, detail="Transaction not found")
