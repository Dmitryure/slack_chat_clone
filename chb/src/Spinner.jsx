import React from 'react'
import {Loader, Dimmer } from 'semantic-ui-react'

class Spinner extends React.Component {
    state = {
        
    }
    render(){
        return(
            <Dimmer active>
            <Loader size = 'huge' content = {"Preparing chat..."}/>
            </Dimmer>
        )
    }
}



export default Spinner