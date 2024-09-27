import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Importera din CSS-fil om du har en

const apiBaseUrl = 'https://4m1f9x7927.execute-api.eu-north-1.amazonaws.com/dev';

function Home() {
  // State för att lagra användarens input
  const [newMessage, setNewMessage] = useState({ username: '', text: '' });
  const navigate = useNavigate(); // Använd useNavigate för navigering

  // Funktion för att skicka ett nytt meddelande
  const postMessage = async () => {
    // Kontrollera att meddelandet inte är tomt
    if (newMessage.text.trim() === '') {
      alert('Meddelandet kan inte vara tomt');
      return;
    }

    // Kontrollera att användarnamnet inte är tomt
    if (newMessage.username.trim() === '') {
      alert('Användarnamnet kan inte vara tomt');
      return;
    }

    try {
      // Skicka det nya meddelandet till servern
      await axios.post(`${apiBaseUrl}/messages`, newMessage, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Återställ inmatningsfälten
      setNewMessage({ username: '', text: '' });
      
      // Navigera till sidan med alla meddelanden
      navigate('/messages');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className="holder">
        <div className="home-container">
        {/* Inmatningsfält för användarnamn */}
        
        {/* Textfält för meddelande */}
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


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Använd useNavigate istället för useHistory
// import axios from 'axios';
// import './App.css'; // Importera stilblad om du har ett sådant

// const apiBaseUrl = 'https://kyacy3wdag.execute-api.eu-north-1.amazonaws.com/dev'; // Ersätt med din API URL

// function Home() {
//   // State för att lagra användarens input
//   const [newMessage, setNewMessage] = useState({ username: '', text: '' });
//   const navigate = useNavigate(); // Använd useNavigate istället för useHistory

//   // Funktion för att skicka ett nytt meddelande
//   const postMessage = async () => {
//     // Kontrollera att meddelandet inte är tomt
//     if (newMessage.text.trim() === '') {
//       alert('Meddelandet kan inte vara tomt');
//       return;
//     }

//     // Kontrollera att användarnamnet inte är tomt
//     if (newMessage.username.trim() === '') {
//       alert('Användarnamnet kan inte vara tomt');
//       return;
//     }

//     try {
//       // Skicka det nya meddelandet till servern
//       await axios.post(`${apiBaseUrl}/messages`, newMessage);
      
//       // Återställ inmatningsfälten
//       setNewMessage({ username: '', text: '' });
      
//       // Navigera till sidan med alla meddelanden
//       navigate('/messages'); // Använd navigate istället för history.push
//     } catch (error) {
//       console.error('Error posting message:', error);
//     }
//   };

//   return (
//     <div className="home-container">
//       <h1>Skapa ett meddelande</h1>
      
//       {/* Inmatningsfält för användarnamn */}
//       <input
//         type="text"
//         placeholder="Användarnamn"
//         value={newMessage.username}
//         onChange={(e) => setNewMessage({ ...newMessage, username: e.target.value })}
//       />
      
//       {/* Textfält för meddelande */}
//       <textarea
//         placeholder="Ditt meddelande"
//         value={newMessage.text}
//         onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
//       />

//       {/* Knapp för att skicka meddelandet */}
//       <button onClick={postMessage}>Publicera</button>
//     </div>
//   );
// }

// export default Home;