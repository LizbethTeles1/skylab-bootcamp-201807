import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchPanel from './components/SearchPanel'
import ResultList from './components/ResultList'
import TrackPlayer from './components/TrackPlayer'
import logic from './logic'

logic.token = 'BQBFRvu8hUm1s983F46QYWkPZNmRW7NkgO7pWC2RF9esPt5xkIUThPhagKbwvVAR20UpUabNEwm8ETy8CNmJ0P0NfSgkbqlabdvouNhQMqGvYQFDaKRHxSzSb8OQ0fUPeeDVOOqE6Nyr'

class App extends Component {
  state = {
    artists: [],
    albums: [],
    tracks: [],
    track: undefined // { title, image, file, url }
  }

  onSearch = query => {
    logic.searchArtists(query)
      .then(artists => {
        this.setState({
          // artists: artists.map(function (artist) {
          //   return {
          //     id: artist.id,
          //     text: artist.name
          //   }
          // })

          // artists: artists.map(artist => {
          //   return {
          //     id: artist.id,
          //     text: artist.name
          //   }
          // })

          // artists: artists.map(({ id, name }) => {
          //   return {
          //     id,
          //     text: name
          //   }
          // })

          // artists: artists.map(({ id, name }) => ({ id, text: name }))

          artists: artists.map(({ id, name: text }) => ({ id, text })),
          albums: [],
          tracks: [],
          track: undefined
        })
      })
      .catch(console.error)
  }

  onArtistClick = id => {
    logic.retrieveAlbumsByArtistId(id)
      .then(albums => {
        this.setState({
          albums: albums.map(({ id, name: text }) => ({ id, text })),
          tracks: [],
          track: undefined
        })
      })
      .catch(console.error)
  }

  onAlbumClick = id => {
    logic.retrieveTracksByAlbumId(id)
      .then(tracks => {
        this.setState({
          tracks: tracks.map(({ id, name: text }) => ({ id, text })),
          track: undefined
        })
      })
      .catch(console.error)
  }

  onTrackClick = id => {
    logic.retrieveTrackById(id)
      .then(track => {
        this.setState({
          track: {
            title: track.name,
            image: track.album.images[0].url,
            file: track.preview_url,
            url: track.external_urls.spotify
          }
        })
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Spotify App</h1>
        </header>

        <SearchPanel onSearch={this.onSearch} />

        <ResultList results={this.state.artists} onItemClick={this.onArtistClick} />

        <ResultList results={this.state.albums} onItemClick={this.onAlbumClick} />

        <ResultList results={this.state.tracks} onItemClick={this.onTrackClick} />

        {this.state.track && <TrackPlayer track={this.state.track} />}
      </div>
    );
  }
}

export default App;
