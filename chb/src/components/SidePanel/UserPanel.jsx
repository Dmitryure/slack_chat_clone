import React from 'react'
import { Grid, Header, Icon, Dropdown, Image, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import firebase from 'firebase'

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [

        {
            key: 'user',
            text: <span>Signed in as <strong> {this.state.user.displayName} </strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'singout',
            text: <Button style = {{width:'100%'}} onClick={this.handleSignout}><span>Sign out</span></Button>
        }
    ]

    handleSignout = () => {
        firebase
            .auth().signOut().then(() => console.log('signout')).catch(e => console.log(e))
    }

    render() {
        console.log(this.props)
        const { user } = this.state
        return (
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1em', margin: 0 }}>
                        <Header inverted floated='left' as='h2'>
                            {/* App header */}
                            <Icon name="code"></Icon>
                            <Header.Content>Chatclone</Header.Content>
                        </Header>
                        {/* user dropdown */}
                        <Header style={{ padding: '0.25em' }} as='h4' inverted>
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image src = {user.photoURL} spaced = 'right' avatar/>
                                        {user.displayName}
                                    </span>
                                } options={this.dropdownOptions()} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.currentUser
})



export default connect(mapStateToProps)(UserPanel)