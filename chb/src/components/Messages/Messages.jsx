import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import Message from "./Message";
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import {connect} from 'react-redux'
import {setUserPosts } from '../../actions/index'

class Messages extends React.Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        messagesLoading: true,
        messages: [],
        isChannelStarred: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        numUniqueUsers: '',
        searchTeam: '',
        searchLoading: false,
        searchResults: [],
        usersRef: firebase.database().ref('users')
    }


    componentDidMount() {
        const { channel, user } = this.state
        if (channel && user) {
            this.addListeners(channel.id)
            this.addUserStarsListener(channel.id, user.uid)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.messagesEnd){
             this.scrollToBottom()
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior:'smooth'})
    }

    addListeners = channelId => {
        this.addMessageListener(channelId)
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef
        .child(userId)
        .child('starred')
        .once('value')
        .then(data=> {
            if(data.val() !== null) {
                const channelIds = Object.keys(data.val())
                const prevStarred = channelIds.includes(channelId)
                this.setState({isChannelStarred:prevStarred})
            }
        })
    }

    addMessageListener = channelId => {
        let loadedMessages = []
        const ref = this.getMessagesRef()
        console.log(this.state.privateChannel)
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
            this.countUniqueUsers(loadedMessages)
            this.countUserPosts(loadedMessages)
        })
    }

    getMessagesRef = () => {
        const {messagesRef, privateMessagesRef, privateChannel} = this.state
        return privateChannel ? privateMessagesRef : messagesRef
    }

    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count +=1
            }else{
                acc[message.user.name] = {
                    avatar:message.user.avatar,
                    count:1
                }
            }
            return acc
        }, {})
        this.props.setUserPosts(userPosts)
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc
        }, [])
        const plural = uniqueUsers.length === 1 || uniqueUsers.length === 0
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? '' : 's'}`
        this.setState({ numUniqueUsers })
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, 'gi')
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message)
            }
            return acc
        }, [])
        this.setState({ searchResults })
        setTimeout(()=> this.setState({searchLoading:false}), 300)
    }

    isChannelStarred = () => {

    }

    starChannel = () => {
        if(this.state.isChannelStarred) {
           this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .update({
                [this.state.channel.id]:{
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name:this.state.channel.createdBy.name,
                        avatar:this.state.channel.createdBy.avatar
                    }
                }
            })
        }else{
            this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .child(this.state.channel.id)
            .remove(err => {
                if(err!==null) {
                    console.error(err)
                }
            })

        }
    }

    handleStar = () => {
        this.setState(prevState=> ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel())
    }

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
    }

    render() {
        const { messagesRef, channel, user, messages, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred } = this.state
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading = {searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar = {this.handleStar}
                    isChannelStarred = {isChannelStarred}
                />
                <Segment>
                    <Comment.Group className='messages'>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                        <div ref = {node => {this.messagesEnd =node}}></div>
                    </Comment.Group>
                </Segment>

                <MessageForm
                    currentChannel={channel}
                    messagesRef={messagesRef}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef = {this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}



export default connect(null, {setUserPosts})(Messages)