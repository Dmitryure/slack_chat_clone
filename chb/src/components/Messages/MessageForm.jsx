import React from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'

class MessageForm extends React.Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        loading: false,
        user: this.props.currentUser,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const message = {
            user: {
                id: this.state.user.uid,
                avatar: this.state.user.photoURL,
                name: this.state.user.displayName
            },
            content: this.state.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
        return message
    }

    sendMessage = () => {
        const { messagesRef } = this.props
        const { message, channel } = this.state

        if (message) {
            this.setState({ loading: true })
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(e => {
                    this.setState({
                        errors: this.state.errors.concat(e),
                        loading: false
                    })
                    console.log(e)
                })
        }else{
            this.setState({
                errors: this.state.errors.concat({message: 'Add a message'})
            })
        }
    }

    render() {
        return (
            <Segment className='message__form'>
                <Input
                    fluid
                    onChange = {this.handleChange}
                    name='message'
                    value={this.state.message}
                    className = {this.state.errors.some(err => err.message.includes('message')) ? 'error' : ''}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition='left'
                    placeholder='Write your message'
                />

                <Button.Group icon widths='2'>
                    <Button
                        onClick={this.sendMessage}
                        color='orange'
                        disabled={this.state.loading}
                        content='Add Reply'
                        labelPosition='left'
                        icon='edit'
                    />
                    <Button
                        color='teal'
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                </Button.Group>
            </Segment>
        )
    }
}



export default MessageForm