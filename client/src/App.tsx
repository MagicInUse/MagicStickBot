import './App.css'

function App() {
  
  const handleLogin = async () => {
    try {
      // Redirect to server login endpoint
      window.location.href = '/twitch/login';
    } catch (error) {
      console.error('Login failed:', error);
    }
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