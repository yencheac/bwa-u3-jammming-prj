const clientID = '8359c53a73ba492e9e017a057c53c646';
const redirectURI = 'http://yencheng.surge.sh';
const spotifyURL = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientID}&redirect_uri=${redirectURI}`;
let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenURL = window.location.href.match(/access_token=([^&]*)/);
    const expirationTime = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenURL && expirationTime) {
      accessToken = accessTokenURL[1];
      expiresIn = expirationTime[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = spotifyURL;
    }
  },

  search(term) {
    const searchURL = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`;
    return fetch (searchURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) return [];
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
      }
    );
  },


savePlaylist (name, trackURIs) {
  if (!name || !trackURIs ) return;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  let userID;
  let playlistID;
  fetch('https://api.spotify.com/v1/me', {
    headers: headers
  }).then( response => {
    return response.json();
  }).then(jsonResponse =>
    userID = jsonResponse.id
  ).then(() => {
    const createList = `https://api.spotify.com/v1/users/${userID}/playlists`;
    fetch(createList, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        name: name
      })
    }).then( response => {
      return response.json();
    }).then(jsonResponse =>
      playlistID = jsonResponse.id
    ).then(() => {
      const addPlaylistTracksURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
      fetch(addPlaylistTracksURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          uris: trackURIs
        })
      });
    })
  })
}

};



export default Spotify;
