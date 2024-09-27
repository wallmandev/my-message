import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import { useNavigate } from 'react-router-dom';

// Ange din API-bas-URL
const apiBaseUrl = 'https://4m1f9x7927.execute-api.eu-north-1.amazonaws.com/dev';

function App() {
  // State för att lagra meddelanden och formulärdata
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ username: '', text: '' });
  const [editMessage, setEditMessage] = useState({ id: '', createdAt: '', text: '' }); // State för redigering

  // Hämtar meddelanden när komponenten laddas
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/messages`);
  
      // Sortera meddelandena baserat på createdAt i fallande ordning
      const sortedMessages = response.data.sort((a, b) => {
        return parseInt(b.createdAt.N) - parseInt(a.createdAt.N);
      });
  
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Funktion för att skicka ett nytt meddelande
  const postMessage = async () => {
    try {
      await axios.post(`${apiBaseUrl}/messages`, newMessage);
      fetchMessages(); // Uppdatera listan med meddelanden efter att ett nytt har skickats
      setNewMessage({ username: '', text: '' }); // Återställ inmatningsfälten
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  // Funktion för att förbereda redigering av ett meddelande
  const prepareEdit = (message) => {
    setEditMessage({
      id: message.id.S,
      createdAt: message.createdAt.N,
      text: message.text.S,
    });
  };

  // Funktion för att uppdatera ett meddelande
  const updateMessage = async (id, createdAt, currentText) => {
    // Visa prompt med nuvarande text
    const updatedText = prompt('Ange ny text för meddelandet:', currentText);
    
    if (updatedText && updatedText !== currentText) {
      try {
        // Skicka PUT-anropet med rätt ID, createdAt och uppdaterad text
        await axios.put(`${apiBaseUrl}/messages/${id}`, {
          id: id, // Skicka med ID
          createdAt: createdAt, // Skicka med createdAt
          text: updatedText // Den nya texten som ska uppdateras
        });
        fetchMessages(); // Uppdatera listan med meddelanden efter uppdatering
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

        {/* Formulär för att redigera ett meddelande */}
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

// Flytta YourComponent utanför App-komponenten
function YourComponent() {
  const navigate = useNavigate();

  const goBackToHome = () => {
    navigate('/'); // Navigera till startsidan
  };

  return (
    <button onClick={goBackToHome} className="Backtohome-button">
      Back to Home
    </button>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css'
// import { useNavigate } from 'react-router-dom';

// // Ange din API-bas-URL
// const apiBaseUrl = 'https://4m1f9x7927.execute-api.eu-north-1.amazonaws.com/dev';

// function App() {
//   // State för att lagra meddelanden och formulärdata
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState({ username: '', text: '' });
//   const [editMessage, setEditMessage] = useState({ id: '', createdAt: '', text: '' }); // State för redigering

//   // Hämtar meddelanden när komponenten laddas
//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(`${apiBaseUrl}/messages`);
  
//       // Sortera meddelandena baserat på createdAt i fallande ordning
//       const sortedMessages = response.data.sort((a, b) => {
//         return parseInt(b.createdAt.N) - parseInt(a.createdAt.N);
//       });
  
//       setMessages(sortedMessages);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   // Funktion för att skicka ett nytt meddelande
//   const postMessage = async () => {
//     try {
//       await axios.post(`${apiBaseUrl}/messages`, newMessage);
//       fetchMessages(); // Uppdatera listan med meddelanden efter att ett nytt har skickats
//       setNewMessage({ username: '', text: '' }); // Återställ inmatningsfälten
//     } catch (error) {
//       console.error('Error posting message:', error);
//     }
//   };

//   // Funktion för att förbereda redigering av ett meddelande
//   const prepareEdit = (message) => {
//     setEditMessage({
//       id: message.id.S,
//       createdAt: message.createdAt.N,
//       text: message.text.S,
//     });
//   };

//   // Funktion för att uppdatera ett meddelande
//   const updateMessage = async (id, createdAt, currentText) => {
//     // Visa prompt med nuvarande text
//     const updatedText = prompt('Ange ny text för meddelandet:', currentText);
    
//     if (updatedText && updatedText !== currentText) {
//       try {
//         // Skicka PUT-anropet med rätt ID, createdAt och uppdaterad text
//         await axios.put(`${apiBaseUrl}/messages/${id}`, {
//           id: id, // Skicka med ID
//           createdAt: createdAt, // Skicka med createdAt
//           text: updatedText // Den nya texten som ska uppdateras
//         });
//         fetchMessages(); // Uppdatera listan med meddelanden efter uppdatering
//       } catch (error) {
//         console.error('Error updating message:', error);
//       }
//     }
//   };

//   return (
//     <div className="style-container">
//       <div className="cont">
//         <h1>Message Board</h1>

//         {/* Lista över meddelanden */}
//         <ul className="container">
//               {messages.map((message) => (
//                 <li key={message.id.S} className="list-container">
//                   <p className="message-message">{message.text.S}</p>
//                   <p className="message-user">- {message.username.S}</p>
//                   <div className="button-div">
//                     <button 
//                       onClick={() => updateMessage(
//                         message.id.S, 
//                         message.createdAt.N, 
//                         message.text.S
//                       )}
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </li>     
//               ))}
//         </ul>

//         {/* Formulär för att redigera ett meddelande */}
//         {editMessage.id && (
//           <div>
//             <h2>Edit Message</h2>
//             <textarea
//               value={editMessage.text}
//               onChange={(e) => setEditMessage({ ...editMessage, text: e.target.value })}
//             />
//             <button onClick={updateMessage}>Update Message</button>
//           </div>
//         )}
        
//       </div>
//     </div>
//   );
// }
// function YourComponent() {
//   const navigate = useNavigate();

//   const goBackToHome = () => {
//     navigate('/'); // Navigera till startsidan
//   };

//   return (
//     <button onClick={goBackToHome}>
//       Back to Home
//     </button>
//   );
// }

// export default App;
