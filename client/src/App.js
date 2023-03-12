import logo from './logo.svg';
import './App.css';
import './normal.css';
import { useState, useEffect } from 'react'

function App() {
  useEffect(() => {
    // const intervalId = setInterval(() => {
    getEngines()
    //   clearChat()
    // }, 10000);
    // return () => clearInterval(intervalId);
  }, [])

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('')
  const [models, setModels] = useState([])
  const [currentModel, setCurrentModel] = useState('ada')
  const [Chatlog, setChatlog] = useState([]
    // [{
    //   user: 'gpt',
    //   message: 'Hi there'
    // }, {
    //   user: 'me',
    //   message: 'i want to use chatgpt today'
    // }]
  )

  const clearChat = () => {
    setChatlog([])
  }

  const getEngines = () => {
    fetch('http://localhost:3080/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.models.data)
      })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    let chatLogNew = [...Chatlog,
    { user: 'me', message: `${input}` },
    ]
    setInput('')
    setChatlog(chatLogNew)
    const messages = chatLogNew.map((message) => message.message).join("\n")
    const response = await fetch('http://localhost:3080/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      })
    })
    const data = await response.json()
    setChatlog([...chatLogNew, { user: 'gpt', message: `${data.message}` }
    ])
    console.log(Chatlog)
    console.log(chatLogNew)
  }

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleModelChange = (event) => {
    setCurrentModel(event.target.value);
  };

  return (
    <div className="App">
      <aside className='sidemenu'>
        <div className='side-menu-button' onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className='models'>
          <select id="model-select" onChange={handleModelChange}>
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.id}</option>
            ))}
          </select>
        </div>
      </aside>
      <section className='chatbox'>
        <div className='chat-log'>
          {Chatlog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
            <input
              rows='1'
              value={input ?? ''}
              onChange={handleInputChange}
              className='chat-input-textarea'
              placeholder='what do you want to search today?'
            />
          </form>
        </div>
      </section >
    </div >
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === ' gpt' && 'chatgpt'}`} >
      <div className='chat-message-center'>
        <div className={`avatar ${message.user === 'gpt' && 'chatgpt'} `}>
          {message.user === 'gpt'}
        </div>
        <div className='message'>
          {message.message}
        </div>
      </div>
    </div >
  )
}

export default App;