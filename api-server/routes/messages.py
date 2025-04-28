from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Message
from schemas import MessageCreate  

# Create an API router for all /messages/ endpoints
router = APIRouter(prefix="/messages", tags=["Messages"])

# Dependency to get a database session
def get_db():
    """
    Provides a new SQLAlchemy database session for each request.
    Closes the session after request is completed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database (create tables if they don't exist)
init_db()

@router.get("/")
def get_messages(db: Session = Depends(get_db)):
    """
    Retrieve a list of all messages from the database.
    """
    return db.query(Message).all()

@router.post("/")
def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    """
    Create a new message in the database.

    Args:
        message: The message content provided by the client.
    
    Returns:
        The newly created message object.
    """
    new_message = Message(content=message.content)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.put("/{message_id}")
def update_message(message_id: int, message: MessageCreate, db: Session = Depends(get_db)):
    """
    Update the content of an existing message.

    Args:
        message_id: The ID of the message to update.
        message: The new content for the message.
    
    Raises:
        HTTPException: If the message with the given ID is not found.
    
    Returns:
        The updated message object.
    """
    existing_message = db.query(Message).filter(Message.id == message_id).first()
    if not existing_message:
        raise HTTPException(status_code=404, detail="Message not found")
    existing_message.content = message.content
    db.commit()
    db.refresh(existing_message)
    return existing_message

@router.delete("/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    """
    Delete an existing message from the database.

    Args:
        message_id: The ID of the message to delete.
    
    Raises:
        HTTPException: If the message with the given ID is not found.
    
    Returns:
        A confirmation message indicating successful deletion.
    """
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"detail": "Message deleted"}
