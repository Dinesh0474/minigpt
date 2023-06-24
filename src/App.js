import React from 'react';
import './index.css';
import { useState, useEffect } from 'react';


const App = () => {
  const [value, setValue]= useState(null)
  const [ message,setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  const createNewChat=()=>{
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }
  
  
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        messages: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      console.log(data);
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error);
    }
  };
 
 useEffect(() => {
    console.log(currentTitle, value, message)

    if (!currentTitle && value && message){
        setCurrentTitle(value) 
    }
    if (currentTitle&& value && message){
      setPreviousChats(prevChats=>([...prevChats, 
        {
        title: currentTitle,
        role:"user",
        content: value
      },
      {
        title: currentTitle,
        role: message.role,
        content: message.content
      }
    ]))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitle = Array.from( new Set(previousChats.map(previousChat=> previousChat.title)))
  return (
    <div className="app">
      <section className="side-bar">
        <button className="side-text"onClick={createNewChat}>+ New Chat </button>
        <ul className='history'>
          {uniqueTitle?.map((uniqueTitle,index) => <li key={index} onClick={() =>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Onion</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle &&<h1>MicroGPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index)=>
          <li key={index}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>

          )}
        </ul>
        <div className='bottom-section'>
          <div className="input-container">
            <input onChange={(e)=>setValue(e.target.value)}/>
            <button id='submit' onClick={getMessages}>➣</button>
          </div>
          <p className='info'>
            MicroGPT is made by
          </p>

        </div>
      </section>
    </div>
  );
};

export default App;
