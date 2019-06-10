import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import Messages from './Messages/Messages'
import SidePanel from './SidePanel/SidePanel'
import MetaPanel from './MetaPanel/MetaPanel'
import { connect } from 'react-redux'

const App = ({ currentUser }) => (
  <Grid style={{ backgroundColor: 'eee' }} >
      <ColorPanel />
      <SidePanel currentUser={currentUser} />
    <Grid.Column>
      <Messages />
    </Grid.Column>
    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(App);
