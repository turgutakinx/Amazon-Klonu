import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { userDetailss } from '../actions/user'

export default function ChatBox() {

    const ENDPOINT = window.location.host.indexOf('localhost') >= 0 ?
        'http://127.0.0.1:5000' : window.location.host;

    const [toggleSupport, setToggleSupport] = useState(false)
    const [socket, setSocket] = useState(null)
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('');
    const uiMessagesRef = useRef(null)

    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn
    const userDetails = useSelector(state => state.userDetailsReducer)
    const { loading, error, user } = userDetails

    const dispatch = useDispatch()

    useEffect(() => {
        if (uiMessagesRef.current) {
            uiMessagesRef.current.scrollBy({
                top: uiMessagesRef.current.clientHeight + 100,
                left: 0,
                behavior: 'smooth',
            });
        }

        if (!user) {
            dispatch(userDetailss(userInfo.data.user._id))
        }
        if (socket) {
            socket.emit("onLogin", {
                _id: userInfo.data.user._id,
                name: userInfo.data.user.name,
                isAdmin: user.isAdmin
            })
            socket.on('recieveMessage', (data) => {
                setMessages([...messages, { body: data.body, name: data.name }])
                console.log(messages);
            });
        }

    }, [dispatch, user, socket, messages])

    const openSupportHandler = () => {
        setToggleSupport(!toggleSupport)
        const sk = socketIOClient(ENDPOINT)
        setSocket(sk)
    }

    const closeSupportHandler = () => {
        setToggleSupport(!toggleSupport)
        socket.disconnect()
    }

    const submitHandler = (e) => {
        e.preventDefault()
        setMessages([...messages, { body: messageBody, name: userInfo.data.user.name }])
        setMessageBody('')
        socket.emit('sendMessage', {
            body: messageBody,
            name: userInfo.data.user.name,
            isAdmin: user.isAdmin,
            _id: userInfo.data.user._id,
        })
    }

    return (
        <div className="contact">
            {toggleSupport ? (<div className="contact-box">
                <div className="box-header">
                    <h2>Support</h2>
                    <button onClick={closeSupportHandler} className="close"><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>

                <div ref={uiMessagesRef} className="message-box">
                    {messages.map((message, i) => 
                        <div key={i} className="message-info">
                            <h2>{message.name}</h2>
                            <p>{message.body}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={submitHandler} className="chat-form">
                    <input value={messageBody} onChange={(e) => setMessageBody(e.target.value)} type="text" placeholder="Contact an admin" />
                    <button type="submit">Send</button>
                </form>
            </div>) :
                (<div className="contact-icon">
                    <button className="primary" onClick={openSupportHandler}><i className="fas fa-headset"></i></button>
                </div>)}
        </div>
    )
}
