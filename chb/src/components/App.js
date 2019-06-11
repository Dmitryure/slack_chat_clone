import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import Messages from './Messages/Messages'
import SidePanel from './SidePanel/SidePanel'
import MetaPanel from './MetaPanel/MetaPanel'
import { connect } from 'react-redux'

const App = ({ currentUser, currentChannel, isPrivateChannel }) => (
  <Grid columns = 'four' divided style={{ backgroundColor: 'eee' }} >
      <ColorPanel />
      <SidePanel 
      key = {currentUser && currentUser.uid}
      currentUser={currentUser} />
    <Grid.Column style = {{marginLeft:'350px'}} width = {7}>
      <Messages 
      key={currentChannel && currentChannel.id}
      currentChannel = {currentChannel}
      isPrivateChannel = {isPrivateChannel}
      currentUser = {currentUser}/>
    </Grid.Column>
    <Grid.Column width={4}>
      <MetaPanel 
      key = {currentChannel && currentChannel.id} 
      isPrivateChannel={isPrivateChannel} 
      currentChannel = {currentChannel}/>
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(App);
