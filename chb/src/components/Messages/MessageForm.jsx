import React from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'
import uuidv4 from 'uuid/v4'

import ProgressBar from './ProgressBar'
import FileModal from './FileModal'

class MessageForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadTask: null,
        uploadState: '',
        percentUploaded: 0,
        message: '',
        channel: this.props.currentChannel,
        loading: false,
        user: this.props.currentUser,
        errors: [],
        modal: false,
    }

    openModal = () => {
        this.setState({ modal: true })
    }

    closeModal = () => {
        this.setState({ modal: false })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    getPath = () => {
        if(this.props.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`
        }else{
            return 'chat/public'
        }
    }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id
        const ref = this.props.getMessagesRef()
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100, 2)
                    this.setState({ percentUploaded })
                }, err => {
                    console.log(err)
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadtask: null
                    })
                },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUpload)
                        }).catch(err => {
                                console.log(err)
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadtask: null
                                })
                            })
                    }
                )
            }
        )
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch((e) => {
                console.log(e)
                this.setState({
                    errors: this.state.errors.concat(e)
                })
            })
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                avatar: this.state.user.photoURL,
                name: this.state.user.displayName
            },
        }
        if (fileUrl !== null) {
            message['image'] = fileUrl
        } else {
            message['content'] = this.state.message
        }
        return message
    }

    sendMessage = () => {
        const { getMessagesRef } = this.props
        const { message, channel } = this.state

        if (message) {
            this.setState({ loading: true })
            getMessagesRef()
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
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    }

    render() {
        return (
            <Segment className='message__form'>
                <Input
                    fluid
                    onChange={this.handleChange}
                    name='message'
                    value={this.state.message}
                    className={this.state.errors.some(err => err.message.includes('message')) ? 'error' : ''}
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
                        disabled = {this.state.uploadState ==='uploading'}
                        onClick={this.openModal}
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                </Button.Group>
                    <FileModal
                        modal={this.state.modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                    <ProgressBar 
                    uploadState={this.state.uploadState}
                    percentUploaded={this.state.percentUploaded}
                    />
            </Segment>
        )
    }
}



export default MessageForm