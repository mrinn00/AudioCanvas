import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const CLIENT_ID = "6fd0679bcd0246798720194c06b94911";
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = "token";
  const scopes = "user-library-read";

  const [token, setToken] = useState("");
  useEffect(() => {
    // the hash is the url that contains the access_token and other info
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        // get the token from the hash by spliting the hash
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
        // console.log(token)
        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }
    setToken(token)
  }, [])


  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  } 

  const getTracks = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.get("https://api.spotify.com/v1/me/tracks", {
      params: { limit: 10, offset: 0 },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
    console.log(data)

    }
    catch(error) {
      console.error("Error retreiving user tracks; ", error);
    }
  }
  
  return (
  
    <div className="App">
      <header className='App-header'>
      {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes}`}>Login
            to Spotify</a>
        : <button onClick={logout}>Logout</button>}

    {token ? 
    <button onClick={getTracks}>Get Tracks</button>
      : <h2> Please login</h2>}
      </header>      


    </div>
  );
}

export default App;
