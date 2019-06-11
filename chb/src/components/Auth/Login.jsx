import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
require('./register.css')

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
        isEmailError: null,
    }

    displayErrors = error => {
        return error
    }


    isEmailError = (errors, inputName) => {
        try {

            return errors.includes(inputName) ? 'error' : ''
        } catch (error) {
            return
        }
    }


    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            firebase.auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser)
                })
                .catch(e => {
                    console.error(e)
                    this.setState({ errors: e.message, loading: false })
                })
        }
    }


    isFormValid = ({ email, password }) => {
        return email && password
    }

    render() {
        const { email, password, errors, loading } = this.state
        return (
            <div>
                <Grid textAlign='center' verticalAlign='middle' className='app'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h1" icon color="orange" textAlign='center'>
                            <Icon name="code branch" color="violet" />
                            Login to DevChat
                    </Header>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment>
                                <Form.Input fluid name='email' icon='mail' iconPosition='left' placeholder="email" value={email}
                                    onChange={this.handleChange} type='email' className={this.isEmailError(errors, 'email')} />

                                <Form.Input fluid name='password' icon='lock' iconPosition='left' placeholder="password" value={password}
                                    onChange={this.handleChange} type='password' className={this.isEmailError(errors, 'Password')} />
                                <Button disabled={loading} className={loading ? 'loading' : ''} color='violet' fluid_size='large'> Submit </Button>
                                <Message>Don't have an account?<Link to='/register'> Register</Link>
                                </Message>
                            </Segment>
                        </Form>
                        {this.state.errors.length > 1 && (
                            <Transition animation={'fade right'} duration={500}>
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



export default Login