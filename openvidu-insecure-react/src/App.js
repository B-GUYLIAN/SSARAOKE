import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import './App.css';
import UserVideoComponent from './UserVideoComponent';
import { useState } from 'react';

const OPENVIDU_SERVER_URL = 'https://i6a306.p.ssafy.io';
const OPENVIDU_SERVER_SECRET = 'qwer1234';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mySessionId: 'SessionA',
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            session: undefined,
            // mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.handleChangeUserName = this.handleChangeUserName.bind(this);
        // this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);

        this.sendMessage = this.sendMessage.bind(this);
        this.sendYTUrl = this.sendYTUrl.bind(this);
        this.audioMute = this.audioMute.bind(this);
        this.videoMute = this.videoMute.bind(this);
        this.videoFilter = this.videoFilter.bind(this);
        
    }

    

    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        this.leaveSession();
    }

    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleChangeUserName(e) {
        this.setState({
            myUserName: e.target.value,
        });
    }

    // handleMainVideoStream(stream) {
    //     if (this.state.mainStreamManager !== stream) {
    //         this.setState({
    //             mainStreamManager: stream
    //         });
    //     }
    // }

    deleteSubscriber(streamManager) {
        let subscribers = this.state.subscribers;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1) {
            subscribers.splice(index, 1);
            this.setState({
                subscribers: subscribers,
            });
        }
    }

    joinSession() {
        // --- 1) Get an OpenVidu object ---

        this.OV = new OpenVidu();

        // --- 2) Init a session ---

        this.setState(
            {
                session: this.OV.initSession(),
            },
            () => {
                var mySession = this.state.session;

                // --- 3) Specify the actions when events take place in the session ---

                // my-chat
                mySession.on('signal:my-chat', (event) => {
                    // console.log(event.data); // Message
                    // console.log(event.from); // Connection object of the sender
                    // console.log(event.type); // The type of message ("my-chat")
                    console.log('[ReceiveMessage]' + event.data);
                });
                mySession.on('signal:YTUrl', (event) => {
                    console.log('[ReceiveURL]' + event.data);
                });

                // On every new Stream received...
                mySession.on('streamCreated', (event) => {
                    // Subscribe to the Stream to receive it. Second parameter is undefined
                    // so OpenVidu doesn't create an HTML video by its own
                    var subscriber = mySession.subscribe(event.stream, undefined);
                    var subscribers = this.state.subscribers;
                    subscribers.push(subscriber);

                    // Update the state with the new subscribers
                    this.setState({
                        subscribers: subscribers,
                    });
                });

                // On every Stream destroyed...
                mySession.on('streamDestroyed', (event) => {

                    // Remove the stream from 'subscribers' array
                    this.deleteSubscriber(event.stream.streamManager);
                });

                // On every asynchronous exception...
                mySession.on('exception', (exception) => {
                    console.warn(exception);
                });

                // --- 4) Connect to the session with a valid user token ---

                // 'getToken' method is simulating what your server-side should do.
                // 'token' parameter should be retrieved and returned by your own backend
                this.getToken().then((token) => {
                    // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                    // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                    mySession
                        .connect(
                            token,
                            { clientData: this.state.myUserName },
                        )
                        .then(() => {

                            // --- 5) Get your own camera stream ---

                            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                            // element: we will manage it on our own) and with the desired properties
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: undefined, // The source of audio. If undefined default microphone
                                videoSource: undefined, // The source of video. If undefined default webcam
                                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                                resolution: '640x480', // The resolution of your video
                                frameRate: 30, // The frame rate of your video
                                insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                                mirror: false, // Whether to mirror your local video or not
                            });

                            // --- 6) Publish your stream ---

                            mySession.publish(publisher);

                            // Set the main video in the page to display our webcam and store our Publisher
                            this.setState({
                                // mainStreamManager: publisher,
                                publisher: publisher,
                            });
                        })
                        .catch((error) => {
                            console.log('There was an error connecting to the session:', error.code, error.message);
                        });
                });
            },
        );
    }

    sendMessage(){
        console.log('[sendMessage] 이것은 채ㅣㅌㅇ임');
        const mySession = this.state.session;
        mySession.signal({
            data: '이것은 채팅임',  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'my-chat'             // The type of message (optional)
          })
          .then(() => {
              console.log('Message successfully sent');
          })
          .catch(error => {
              console.error(error);
          });
    }


    sendYTUrl(){
        console.log('[sendYTUrl] 이것은 유튜브');
        const mySession = this.state.session;
        mySession.signal({
            data: '이것은 유튜브',  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'YTUrl'             // The type of message (optional)
          })
          .then(() => {
              console.log('Url successfully sent');
          })
          .catch(error => {
              console.error(error);
          });
    }

    audioMute(){
        const me = this.state.publisher;
        if (me.stream.audioActive) {
          me.publishAudio(false);
          console.log("마이크 끄기");
        } else {
          me.publishAudio(true);
          console.log("마이크 켜기");
        }
    }
    
    videoMute(){
        const me = this.state.publisher;
        if (me.stream.videoActive) {
          me.publishVideo(false);
          console.log("비디오 끄기");
        } else {
          me.publishVideo(true);
          console.log("비디오 켜기");
        }
    }

    videoFilter() {
        const me = this.state.publisher;
        
        me.stream.applyFilter("GStreamerFilter", { command: "audioecho delay=75000000 intensity=0.3 feedback=0.4" });
    //     me.stream.applyFilter("GStreamerFilter", { command: "videoflip method=vertical-flip" })
    // .then(() => {
    //     console.log("Video rotated!");
    // })
    // .catch(error => {
    //     console.error(error);
    // });
                
    // me.stream.removeFilter()
    // .then(() => {
    //     console.log("Filter removed");
    // })
    // .catch(error => {
    //     console.error(error);
    // });
    }


    leaveSession() {

        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        // Empty all properties...
        this.OV = null;
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: 'SessionA',
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            // mainStreamManager: undefined,
            publisher: undefined
        });
    }

    render() {
        const mySessionId = this.state.mySessionId;
        const myUserName = this.state.myUserName;

        return (
            <div className="container">
                {/* 세션이 없으면 생김 state로 세션 감지 */}
                {this.state.session === undefined ? (
                    <div id="join">
                            <form className="form-group" onSubmit={this.joinSession}>
                                <p>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="userName"
                                        value={myUserName}
                                        onChange={this.handleChangeUserName}
                                        required
                                    />
                                </p>
                                <p>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="sessionId"
                                        value={mySessionId}
                                        onChange={this.handleChangeSessionId}
                                        required
                                    />
                                </p>
                                <p className="text-center">
                                    <input  name="commit" type="submit" value="JOIN" />
                                </p>
                            </form>
                    </div>
                ) : null}

                {/* 세션이 생기면 생김 */}
                {this.state.session !== undefined ? (
                    <div id="session">
                        <div id="session-header">
                            <h1 id="session-title">{mySessionId}</h1>
                            <input
                                className="btn btn-large btn-danger"
                                type="button"
                                id="buttonLeaveSession"
                                onClick={this.leaveSession}
                                value="Leave session"
                            />
                            <button type='text' defaultValue={'채팅'} onClick={this.sendMessage}>채팅</button>
                            <button type='text' defaultValue={'유튜브'} onClick={this.sendYTUrl}>유튭</button>
                            <button type='text' defaultValue={'마이크'} onClick={this.audioMute}>마이크</button>
                            <button type='text' defaultValue={'캠'} onClick={this.videoMute}>캠</button>
                            <button type='text' defaultValue={'필터 적용'} onClick={this.videoFilter}>필터적용</button>
                        </div>
                        {/*mainStreamManager(화면에 크게 뜨는 애 지워버림) */}
                        {/* {this.state.mainStreamManager !== undefined ? (
                            <div id="main-video" className="col-md-6">
                                <UserVideoComponent streamManager={this.state.mainStreamManager} />
                            </div>
                        ) : null} */}
                        <div id="video-container" className="col-md-6">
                            {this.state.publisher !== undefined ? (
                                <div className="stream-container col-md-6 col-xs-6">
                                    <UserVideoComponent
                                        streamManager={this.state.publisher} />
                                </div>
                            ) : null}
                            {this.state.subscribers.map((sub, i) => (
                                <div key={i} className="stream-container col-md-6 col-xs-6">
                                    <UserVideoComponent streamManager={sub} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
     *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
     *   3) The Connection.token must be consumed in Session.connect() method
     */

    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error?.response?.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        // var data = {
        //     kurentoOptions: {
        //         allowedFilters: ['FaceOverlayFilter', 'ChromaFilter', 'GStreamerFilter']
        //     }
        // };
        return new Promise((resolve, reject) => {
            axios
                .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", JSON.stringify({
                    "kurentoOptions": {
                      "allowedFilters": ["GStreamerFilter", "FaceOverlayFilter"]
                    }
                            }), {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }



}

export default App;
