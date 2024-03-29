import React from 'react'
import {Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment} from 'semantic-ui-react'
import  { SliderPicker } from 'react-color'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import {setColors} from '../../actions/index'


class ColorPanel extends React.Component {

    state = {
         modal: false,
         primary: '',
         secondary: '',
         user: this.props.currentUser,
         usersRef: firebase.database().ref('users'),
         userColors: [],
    }

    componentDidMount() {
        if(this.state.user){
        this.addListener(this.state.user.uid)
        }
        console.log('component did mount')
    }


    addListener = (userId) => {
        let userColors = []
        this.state.usersRef.child(`${userId}/colors`)
        .on('child_added', snap => {
            userColors.push(snap.val())
            this.setState({userColors:userColors})
        })
       
    }

    openModal = () => this.setState({modal:true})

    closeModal = () => this.setState({modal:false})

    handleChangePrimary = (color) => {
        this.setState({primary: color.hex})
    }

    handleChangeSecondary = (color) => {
        this.setState({secondary: color.hex})
    }

    handleSaveColors = () => {
        const {primary, secondary} = this.state
        if (this.state.primary && this.state.secondary) {
            this.saveColors(primary, secondary)
        }
    }
    
    displayUserColors = (colors) => (
        
        colors.length > 0 && colors.map((color, i) => {
           return <React.Fragment key = {i}>
                <Divider/>
                <div className = 'color__container' onClick = {() => this.props.setColors(color.primary, color.secondary)}>
                    <div className = 'color__square' style= {{background:color.primary}}>
                        <div className = 'color__overlay' style= {{background:color.secondary}}>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        })
    )

    saveColors = (primary, secondary) => {
        this.state.usersRef
        .child(`${this.state.user.uid}/colors`)
        .push()
        .update({
            primary, secondary
        })
        .then(() => {
            console.log('colors added')
            this.closeModal()})
        .catch(e => console.log(e))
    }

    render(){
        const {modal, primary, secondary, userColors} = this.state
        console.log(userColors)
        return(
            <Sidebar
            as={Menu}
            icon = 'labeled'
            inverted
            vertical
            visible
            width='very thin'>
                <Divider/>
                <Button icon = 'add' size = 'small' color = 'blue' onClick = {this.openModal}/>
                {this.displayUserColors(userColors)}
                <Modal basic open ={modal} onClose ={this.closeModal}>
                <Modal.Header> 
                    Choose App Colors
                </Modal.Header>
                <Modal.Content>
                    <Segment inverted>
                <Label content = 'Primary Color'/>
                <SliderPicker color = {primary} onChange = {this.handleChangePrimary} className='primary'/>
                </Segment>
                <Segment inverted>
                <Label content = 'Secondary Color' />
                <SliderPicker color = {secondary} onChange = {this.handleChangeSecondary} className='secondary'/>
                </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button color = 'green' inverted onClick = {this.handleSaveColors}>
                    <Icon name = 'checkmark' /> Save Colors
                    </Button>
                    <Button color = 'red' inverted onClick = {this.closeModal}>
                    <Icon name = 'remove' /> Cancel
                    </Button>
                </Modal.Actions>
                </Modal>
            </Sidebar>
        )
    }
}



export default connect(null, {setColors})(ColorPanel)