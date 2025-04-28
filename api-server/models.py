from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

# ================================================================
# Purpose of this file (models.py)
#
# Defines the SQLAlchemy ORM model representing the "messages" table
# in the SQLite database.
#
# SQLAlchemy ORM allows us to interact with the database using
# Python classes and objects instead of raw SQL queries.
#
# This model maps to the "messages" table with the following columns:
# - id (Integer, primary key, auto-incremented)
# - content (String, required)
#
# This structure is used by SQLAlchemy to:
# - Create tables automatically
# - Insert, query, update, delete rows easily using Python code
# ================================================================

# Create a base class for the ORM models
Base = declarative_base()

# Define the Message model, representing a message record in the database
class Message(Base):
    __tablename__ = "messages"  # Name of the table in SQLite database

    # Primary key ID (unique identifier for each message)
    id = Column(Integer, primary_key=True, index=True)

    # Message content (text of the message)
    content = Column(String, nullable=False)
