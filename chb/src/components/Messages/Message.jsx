import React from 'react'
import {Comment} from 'semantic-ui-react'
import moment from 'moment'

const isOwnMessage = (message,user) => {
    return message.user.id === user.uid ? 'message__self' : ''
}

const timeFromNow = timestamp => {
    return 
}

const Message = () => (
    <Comment>
        <Comment.Avatar src = {message.user.avatar}/>
        <Comment.Content clasName ={isOwnMessage(message, user)}>
        <Comment.Author as = 'a'>{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        </Comment.Content>
    </Comment>
)



export default Message