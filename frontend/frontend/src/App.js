import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = 'https://4m1f9x7927.execute-api.eu-north-1.amazonaws.com/dev';

function App() {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ username: '', text: '' });
  const [editMessage, setEditMessage] = useState({ id: '', createdAt: '', text: '' });


  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/messages`);
  
      const sortedMessages = response.data.sort((a, b) => {
        return parseInt(b.createdAt.N) - parseInt(a.createdAt.N);
      });
  
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const postMessage = async () => {
    try {
      await axios.post(`${apiBaseUrl}/messages`, newMessage);
      fetchMessages();
      setNewMessage({ username: '', text: '' });
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };


  const prepareEdit = (message) => {
    setEditMessage({
      id: message.id.S,
      createdAt: message.createdAt.N,
      text: message.text.S,
    });
  };


  const updateMessage = async (id, createdAt, currentText) => {

    const updatedText = prompt('Ange ny text för meddelandet:', currentText);
    
    if (updatedText && updatedText !== currentText) {
      try {

        await axios.put(`${apiBaseUrl}/messages/${id}`, {
          id: id,
          createdAt: createdAt,
          text: updatedText
        });
        fetchMessages();
      } catch (error) {
        console.error('Error updating message:', error);
      }
    }
  };

  return (
    <div className="style-container">
      <div className="cont">
        <h1>Message Board</h1>

        <YourComponent />

        {/* Lista över meddelanden */}
        <ul className="container">
          {messages.map((message) => (
            <li key={message.id.S} className="list-container">
              <p className="message-message">{message.text.S}</p>
              <p className="message-user">- {message.username.S}</p>
              <div className="button-div">
                <button 
                  onClick={() => updateMessage(
                    message.id.S, 
                    message.createdAt.N, 
                    message.text.S
                  )}
                >
                  Edit
                </button>
              </div>
            </li>     
          ))}
        </ul>

        {editMessage.id && (
          <div>
            <h2>Edit Message</h2>
            <textarea
              value={editMessage.text}
              onChange={(e) => setEditMessage({ ...editMessage, text: e.target.value })}
            />
            <button onClick={updateMessage}>Update Message</button>
          </div>
        )}
        
      </div>
    </div>
  );
}


function YourComponent() {
  const navigate = useNavigate();

  const goBackToHome = () => {
    navigate('/');
  };

  return (
    <button onClick={goBackToHome} className="Backtohome-button">
      Back to Home
    </button>
  );
}

export default App;