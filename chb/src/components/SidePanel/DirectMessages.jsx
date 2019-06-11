import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import firebase from '../../firebase'
import {connect} from 'react-redux'
import {setCurrentChannel, setPrivateChannel} from '../../actions/index'

class DirectMessages extends React.Component {
    state = {
        activeChannel: '',
        users: [],
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence')
    }

    componentDidMount() {
        if(this.state.user) {
            this.addListeners(this.state.user.uid)
        }
    }

    addListeners = currentUserUid => {
        let loadedUsers = []
        this.state.usersRef.on('child_added', snap => {
            if(currentUserUid !== snap.key){
                let user = snap.val()
                user['uid'] =snap.key
                user['status'] = 'offline'
                loadedUsers.push(user)
                this.setState({users: loadedUsers})
            }
        })
            this.state.connectedRef.on('value', snap => {
                if(snap.val() ===true){
                    let ref = this.state.presenceRef.child(currentUserUid)
                    ref.set(true)
                    ref.onDisconnect().remove(err => {
                        if(err!==null){
                            console.log(err)
                    }
                })
            }
        })
        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUid !== snap.key){
                this.addStatusToUser(snap.key)
            }
            
        })
        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUid !== snap.key){
                this.addStatusToUser(snap.key, false)
            }
            
        })
    }

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid)
        const channelData = {
            id: channelId, 
            name: user.name
        }
        this.props.setCurrentChannel(channelData)
        this.props.setPrivateChannel(true)
        this.setActiveChannel(user.uid)
    }

    setActiveChannel = (userId) => {
        this.setState({activeChannel:userId})
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }

    isUserOnline = user => user.status === 'online'

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if(user.uid === userId){
                user['status'] = `${connected ? 'online' : 'offline'}`
            }
            return acc.concat(user)
        }, [])
        this.setState({users: updatedUsers})
    }

    render() {
        const { users, activeChannel } = this.state
        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name = 'mail' /> DIRECT MESSAGES
                    </span>{" "} 
                    ({users.length})
                 </Menu.Item>
                {users.map(user => (
                    <Menu.Item
                    key={user.uid}
                    active = {user.uid === activeChannel}
                    onClick = {() => this.changeChannel(user)}
                    style={{opacity:0.7, fontStyle:'italic'}}
                    >
                    <Icon
                    name ='circle'
                    color = {this.isUserOnline(user) ? 'green' : 'red'}
                    />
                    @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        )
    }
}



export default connect(null, {setCurrentChannel, setPrivateChannel})(DirectMessages)