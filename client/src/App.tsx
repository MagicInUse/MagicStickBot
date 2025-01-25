import './App.css'

function App() {

  const handleLogin = () => {
    window.location.href = '/twitch/login';
  }

  return (
    <>
      <h1>MagicStickBot</h1>
      <h4>by MagicApps</h4>
      <button onClick={handleLogin}>Log in with Twitch</button>
    </>
  )
}

export default App;