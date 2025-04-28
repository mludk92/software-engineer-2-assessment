import { useState, useEffect } from 'react';
import './App.css';

// Define the structure of a Message object
interface Message {
  id: number;
  content: string;
}

function App() {
  // State to store the list of messages
  const [messages, setMessages] = useState<Message[]>([]);

  // State to store the new message input value
  const [message, setMessage] = useState<string>('');

  // State to track validation errors for empty submissions
  const [error, setError] = useState<boolean>(false);

  // State to track edits for existing messages by ID
  const [editedMessages, setEditedMessages] = useState<Record<number, string>>({});

  // Fetch all messages from the backend API on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('http://127.0.0.1:8000/messages/');
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  // Submit a new message to the backend
  const submitMessage = async () => {
    if (message.trim() === '') {
      setError(true); // Show error if input is empty
      return;
    }
    setError(false);

    // Send POST request to create a new message
    await fetch('http://127.0.0.1:8000/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });

    // Refresh message list after submission
    const response = await fetch('http://127.0.0.1:8000/messages/');
    const data = await response.json();
    setMessages(data);

    // Clear the input box after submission
    setMessage('');
  };

  // Delete a message by its ID
  const deleteMessage = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/messages/${id}`, {
      method: 'DELETE',
    });

    // Refresh message list after deletion
    const response = await fetch('http://127.0.0.1:8000/messages/');
    const data = await response.json();
    setMessages(data);
  };

  // Move a message up in the list visually
  const moveMessageUp = (id: number) => {
    const idx = messages.findIndex(m => m.id === id);
    if (idx > 0) {
      const newMessages = [...messages];
      [newMessages[idx - 1], newMessages[idx]] = [newMessages[idx], newMessages[idx - 1]];
      setMessages(newMessages);
    }
  };

  // Move a message down in the list visually
  const moveMessageDown = (id: number) => {
    const idx = messages.findIndex(m => m.id === id);
    if (idx < messages.length - 1) {
      const newMessages = [...messages];
      [newMessages[idx], newMessages[idx + 1]] = [newMessages[idx + 1], newMessages[idx]];
      setMessages(newMessages);
    }
  };

  // Update an existing message on the backend
  const updateMessage = async (id: number) => {
    const updatedContent = editedMessages[id];
    if (updatedContent === undefined || updatedContent.trim() === "") {
      return; // Do nothing if no change or empty edit
    }

    // Send PUT request to update the message
    await fetch(`http://127.0.0.1:8000/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: updatedContent }),
    });

    // Refresh message list after update
    const response = await fetch('http://127.0.0.1:8000/messages/');
    const data = await response.json();
    setMessages(data);

    // Clear the edited text from local state
    setEditedMessages(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="container">
      {/* Message List Section */}
      <div className="messages">
        <h3>Messages</h3>
        <ol>
          {messages.map(msg => (
            <li className="message" key={msg.id}>
              <div className="button-group">
                <button onClick={() => deleteMessage(msg.id)}>❌</button>
                <div className="button-column-group">
                  <button onClick={() => moveMessageUp(msg.id)}>🔼</button>
                  <button onClick={() => moveMessageDown(msg.id)}>🔽</button>
                </div>
              </div>
              <div className="message-content">
                {/* Editable input for the message */}
                <input
                  value={editedMessages[msg.id] ?? msg.content}
                  onChange={(e) => {
                    setEditedMessages(prev => ({ ...prev, [msg.id]: e.target.value }));
                  }}
                />
                {/* Update button enabled only if text has changed */}
                <button
                  disabled={(editedMessages[msg.id] ?? msg.content) === msg.content}
                  onClick={() => updateMessage(msg.id)}
                >
                  💾 Update
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* New Message Form Section */}
      <div className="form">
        <h3>Submit a new message</h3>
        <div className="input-group">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (message.trim().length >= 1) {
                submitMessage();
              } else {
                setError(true); // Show error if they press Enter with empty input
              }
            }
          }}
        />
          <button onClick={submitMessage}>submit</button>
          <p style={{ color: "hotPink", visibility: error ? "visible" : "hidden" }}>
            Message cannot be empty
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
