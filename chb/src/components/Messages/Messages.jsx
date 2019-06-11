import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import Message from "./Message";
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messagesLoading:true, 
        messages: [],
        channel: this.props.currentChannel,
        user: this.props.currentUser
    }


    componentDidMount() {
       const { channel, user } = this.state 
       if (channel && user) {
       this.addListeners(channel.id)
       }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId)   
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message=> (
            <Message 
            key = {message.timestamp}
            message = {message}
            user = {this.state.user}
            />
        ))
    )

    addMessageListener = channelId => {
        let loadedMessages = []
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
            this.setState({
                messages:loadedMessages,
                messagesLoading:false
            })
        })
    }

    render() {
        const { messagesRef, channel, user, messages } = this.state
        return (
            <React.Fragment>
                <MessagesHeader />
                <Segment>
                    <Comment.Group className='messages'>
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                currentChannel={channel}
                messagesRef={messagesRef}
                currentUser={user}
                />
            </React.Fragment>
        )
    }
}



export default Messages