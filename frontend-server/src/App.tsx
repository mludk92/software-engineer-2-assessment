import { useState, useEffect } from 'react';
import './App.css';

// Define the shape of a Message
interface Message {
  id: number;
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [editedMessages, setEditedMessages] = useState<Record<number, string>>({});

  // Fetch messages from API on page load
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('http://127.0.0.1:8000/messages/');
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  // Submit new message to API
  const submitMessage = async () => {
    if (message.trim() === '') {
      setError(true);
      return;
    }
    setError(false);

    await fetch('http://127.0.0.1:8000/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });

    // Refresh messages after submit
    const response = await fetch('http://127.0.0.1:8000/messages/');
    const data = await response.json();
    setMessages(data);

    setMessage('');
  };

  // Delete a message by ID
  const deleteMessage = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/messages/${id}`, {
      method: 'DELETE',
    });

    // Refresh messages after delete
    const response = await fetch('http://127.0.0.1:8000/messages/');
    const data = await response.json();
    setMessages(data);
  };

  // Move a message up
  const moveMessageUp = (id: number) => {
    const idx = messages.findIndex(m => m.id === id);
    if (idx > 0) {
      const newMessages = [...messages];
      [newMessages[idx - 1], newMessages[idx]] = [newMessages[idx], newMessages[idx - 1]];
      setMessages(newMessages);
    }
  };

  // Move a message down
  const moveMessageDown = (id: number) => {
    const idx = messages.findIndex(m => m.id === id);
    if (idx < messages.length - 1) {
      const newMessages = [...messages];
      [newMessages[idx], newMessages[idx + 1]] = [newMessages[idx + 1], newMessages[idx]];
      setMessages(newMessages);
    }
  };
  const updateMessage = async (id: number) => {
    const updatedContent = editedMessages[id];
    if (updatedContent === undefined || updatedContent.trim() === "") {
      return;
    }
  
    await fetch(`http://127.0.0.1:8000/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: updatedContent }),
    });
  
    // Refresh after update
    const response = await fetch('http://127.0.0.1:8000/messages/');
    const data = await response.json();
    setMessages(data);
  
    // Clear edit state for this message
    setEditedMessages(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };
  
  return (
    <div className="container">
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
                <input
                  value={editedMessages[msg.id] ?? msg.content}
                  onChange={(e) => {
                    setEditedMessages(prev => ({ ...prev, [msg.id]: e.target.value }));
                  }}
                />
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
  
      <div className="form">
        <h3>Submit a new message</h3>
        <div className="input-group">
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
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
