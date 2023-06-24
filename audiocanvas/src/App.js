import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const CLIENT_ID = "6fd0679bcd0246798720194c06b94911";
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = "token";
  const scopes = "user-library-read";
  const NUMSONGSLIMIT = 2;

  const [token, setToken] = useState("");
  useEffect(() => {
    // the hash is the url that contains the access_token and other info
    const hash = window.location.hash
    let token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))
    // if the token exists then split the token
    if (token) {
      token = token.split("=")[1];
    } 
    setToken(token)
  }, [])


  const logout = () => {
    setToken("")
  } 

  // returns a list of the users saved tracks
  const getTracks = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.get("https://api.spotify.com/v1/me/tracks", {
        params: { limit: NUMSONGSLIMIT, offset: 0 },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })

      console.log(data)
      // get the id for a track
      // console.log(data.items[0].track.id)

      for (let i = 0; i < NUMSONGSLIMIT; i++) {
        let trackId = data.items[i].track.id
        console.log(trackId)
        getAudioFeatures(trackId)
        getAudioAnalysis(trackId)
      }

      // test track id
      // getAudioFeatures("11dFghVXANMlKmJXsNCbNl")
      // getAudioAnalysis("11dFghVXANMlKmJXsNCbNl")
    }
    catch(error) {
      console.error("Error retreiving user tracks; ", error);
    }
  }
  
  
  // audio features function
  async function getAudioFeatures (trackID) {
    try {
      const {data} = await axios.get(`https://api.spotify.com/v1/audio-features/`+trackID, {
          // params: { id: trackID.toString()},
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
      })
      console.log(data)
    }
    catch(error) {
      console.error("Error retreiving audio features; ", error);
    }
  }

  // audio analysis function
  async function getAudioAnalysis (trackID) {
    try {
      const {data} = await axios.get(`https://api.spotify.com/v1/audio-analysis/`+trackID, {
          // params: { id: trackID.toString()},
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
      })
      console.log(data)
    }
    catch(error) {
      console.error("Error retreiving audio analysis; ", error);
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
