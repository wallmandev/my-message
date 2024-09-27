import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; 

const apiBaseUrl = 'https://4m1f9x7927.execute-api.eu-north-1.amazonaws.com/dev';

function Home() {

  const [newMessage, setNewMessage] = useState({ username: '', text: '' });
  const navigate = useNavigate();


  const postMessage = async () => {

    if (newMessage.text.trim() === '') {
      alert('Meddelandet kan inte vara tomt');
      return;
    }


    if (newMessage.username.trim() === '') {
      alert('Användarnamnet kan inte vara tomt');
      return;
    }

    try {

      await axios.post(`${apiBaseUrl}/messages`, newMessage, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setNewMessage({ username: '', text: '' });

      navigate('/messages');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className="holder">
        <div className="home-container">

        <textarea className="home-message"
            placeholder="Ditt meddelande"
            value={newMessage.text}
            onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
        />
        <input className="home-user"
            type="text"
            placeholder="Användarnamn"
            value={newMessage.username}
            onChange={(e) => setNewMessage({ ...newMessage, username: e.target.value })}
        />

        {/* Knapp för att skicka meddelandet */}
        <button onClick={postMessage} className="home-button">Publicera</button>
        </div>
    </div>
  );
}

export default Home;