import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import Messages from './Messages/Messages'
import SidePanel from './SidePanel/SidePanel'
import MetaPanel from './MetaPanel/MetaPanel'
import { connect } from 'react-redux'

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor }) => (
  <Grid columns = 'four' divided style={{ background: secondaryColor }} >
      <ColorPanel 
      key = {currentUser && currentUser.name}
      currentUser = {currentUser}
      />
      <SidePanel 
      key = {currentUser && currentUser.uid}
      currentUser={currentUser} 
      primaryColor= {primaryColor}
      />
    <Grid.Column style = {{marginLeft:'350px'}} width = {7}>
      <Messages 
      key={currentChannel && currentChannel.id}
      currentChannel = {currentChannel}
      isPrivateChannel = {isPrivateChannel}
      currentUser = {currentUser}/>
    </Grid.Column>
    <Grid.Column width={4}>
      <MetaPanel 
      key = {currentChannel && currentChannel.name}
      userPosts = {userPosts} 
      isPrivateChannel={isPrivateChannel} 
      currentChannel = {currentChannel}/>
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
})

export default connect(mapStateToProps)(App);
