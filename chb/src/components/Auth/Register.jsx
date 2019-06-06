import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import { isError } from 'util';
require('./register.css')

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        isEmailError: null
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username || !email || !password || !passwordConfirmation
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password !== passwordConfirmation) {
            let error = { message: 'passwords did not match' }
            this.setState({ errors: (error) })
            return false
        } else {
            return true
        }
    }

    displayErrors = error => {
        return error.message
    }

    isFormValid = () => {
        let error
        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill all fields' }
            this.setState({ errors: (error) })
            return false
        } else if (!this.isPasswordValid(this.state)) {
            return false
        } else {
            return true
        }
    }

    isEmailerror = () => {
        if(this.state.errors.message.includes('email')){
            return true
        }else{
            return false
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true })
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    this.setState({ loading: false })
                })
                .catch(e => {
                    console.error(e)
                    this.setState({ errors: e.message, loading: false })
                })
        } else {
            console.log('error')
        }
    }

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state
        return (
            <div>
                <Grid textAlign='center' verticalAlign='middle' className='app'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h2" icon color="orange" textAlign='center'>
                            <Icon name="puzzle piece" color="orange" />
                            Register for DevChat
                    </Header>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment>
                                <Form.Input fluid name='username' icon='user' iconPosition='left' placeholder="username" value={username}
                                    onChange={this.handleChange} type='text' />

                                <Form.Input fluid name='email' icon='mail' iconPosition='left' placeholder="email" value={email}
                                    onChange={this.handleChange} type='email' className = {this.isEmailError ? 'error' : ''}/>

                                <Form.Input fluid name='password' icon='lock' iconPosition='left' placeholder="password" value={password}
                                    onChange={this.handleChange} type='password' />
                                <Form.Input fluid name='passwordConfirmation' icon='lock' iconPosition='left' placeholder="confirm password"
                                    value={passwordConfirmation}
                                    onChange={this.handleChange} type='password' />
                                <Button disabled = {loading} className = {loading ? 'loading' :''} color='orange' fluid_size='large'> Submit </Button>
                                <Message>Already a user?<Link to='login'> Login</Link>
                                </Message>
                            </Segment>
                        </Form>
                        {this.state.errors.message && (
                            <Transition animation = {'fade right'} duration ={500}>
                                <Message error >
                                    <h3>Error</h3>
                                    <h5>{this.displayErrors(this.state.errors)}</h5>
                                </Message>
                            </Transition>
                        )}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}



export default Register