import React, { Component } from "react";
import Button from '@material-ui/core/Button';

import "../Styles/Lyrics.css"

class Lyrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: props.action,
            token: props.token,
            artist: "",
            song: "",
            lyrics: ""
        }
        this.timeout = null;
        this.controller = new AbortController();
    }

    componentDidMount() {
        this.loadData(this)
        this.timeout = setInterval(this.loadData, 5000, this);
      }

    componentWillUnmount() {
        this.setState({token:null})
        this.controller.abort();
        clearTimeout(this.timeout);
    }

    async loadData(_this) {
        console.log("spotify request");
        const url = "https://api.spotify.com/v1/me/player";
        try {
            const response = await fetch(url, {
            signal: _this.controller.signal,
              method: 'GET', // or 'PUT'// data can be `string` or {object}!
              headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + _this.state.token
              }
            });
            try {
                const json = await response.json();
                console.log(json);
                var artists = [];
                var currSong = json.item.name;
                json.item.artists.forEach(element => {
                    artists.push(element.name);
                });
                var artistsString = artists.join()

                if(currSong !== _this.state.song) {
                    console.log("Getting lyrics for new song");
                    await _this.setState({song: currSong, artist: artistsString});
                    await _this.getLyrics(_this);
                }
            } catch(error) {
                _this.setState({song:"Not Listening", artist:"Nobody", lyrics: "Nope"});
            }
            //console.log('Success:', JSON.stringify(json));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    formatSong(song) {
        song = song.split('-')[0];
        song = song.replace(/[^\w\s]/gi, '');
        song = song.toLowerCase();
        return song;
    }

    async getLyrics(_this) {
        const url = process.env.REACT_APP_FUNCTION_URL
        let data = new FormData();
        data.append("song", _this.formatSong(_this.state.song));
        data.append("artist", _this.state.artist);

        console.log(_this.formatSong(_this.state.song))
        console.log(_this.state.artist)

        try {
            const response = await fetch(url, {
                signal: _this.controller.signal,
                method: 'POST',
                body: data,
                headers: {
                    'x-functions-key': process.env.REACT_APP_FUNCTION_KEY
                }
            });
            const json = await response.json();
            //lyrics = lyrics.replace(/\n/g, "<br />");
            if(response.ok) {
                var lyrics = json.lyrics.split('\n').map((item, i) => {
                    return <p className="noMargins" key={i}>{item}</p>;
                });
                _this.setState({lyrics})
            }
        }catch(e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div className="Lyrics">
                <div className="fill">
                    <div className="strip">
                        <h1>Currently Playing: {this.state.song}</h1>
                    </div>
                    <div className="strip">
                        <h3>By: {this.state.artist}</h3>
                    </div>
                    <div className="strip">
                        <h4>Lyrics: </h4>
                        {this.state.lyrics}
                    </div>
                    <div className="logout">
                        <Button
                                style={{
                                    borderRadius: 35,
                                    backgroundColor: "#808080",
                                    padding: "5px 36px",
                                    fontSize: "12px",
                                    color: "#F5F5F5",
                                    fontFamily: "CircularStd",
                                    alignSelf: "center"
                                }}
                                variant="contained"
                                onClick={this.state.action}
                                >
                                <b>Logout</b>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Lyrics;