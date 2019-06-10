import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import Messages from './Messages/Messages'
import SidePanel from './SidePanel/SidePanel'
import MetaPanel from './MetaPanel/MetaPanel'
import { connect } from 'react-redux'

const App = ({ currentUser }) => (
  <Grid columns style={{ backgroundColor: 'eee' }} >
      <Grid.Column >
        <ColorPanel />
      </Grid.Column>

      <Grid.Column>
        <SidePanel currentUser={currentUser} />
      </Grid.Column>

      <Grid.Column>
        <Messages />
      </Grid.Column>

      <Grid.Column>
        <MetaPanel />
      </Grid.Column>
  </Grid>
    )
    
const mapStateToProps = state => ({
      currentUser: state.user.currentUser
  })
  
  export default connect(mapStateToProps)(App);
