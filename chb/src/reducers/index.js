import * as actionTypes from '../actions/types'
import { combineReducers } from 'redux' 

const initialUserState = {
    currentUser: null,
    isLoading: true,
    userPosts: null,
}

const user_reducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
        console.log(action)
        return {
            currentUser: action.payload.currentUser,
            isLoading:false
        }
        case actionTypes.CLEAR_USER:
        return {
            ...state,
            isLoading:false
        }
        default:
            return state
    }
}

const initialChannelState = { 
    currentChannel:null,
    isPrivateChannel:false,
    userPosts: []
}

const channel_reducer = (state = initialChannelState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }    
            
        case actionTypes.SET_PRIVATE_CHANNEL:
            return{
                ...state,
                isPrivateChannel:action.payload.isPrivateChannel
            }
        
        case actionTypes.SET_USER_POSTS:
        return{
            ...state,
            userPosts:action.payload.userPosts
        }
        default:
            return state
    }
}

const initialColorsState = {
    primaryColor: '#4c3c4c',
    secondaryColor: '#eee'
}

const colors_reducer = (state = initialColorsState, action) => {
    switch (action.type) {
        case actionTypes.SET_COLORS:
            return {
                primaryColor: action.payload.primary,
                secondaryColor: action.payload.secondary
            }
        default:
            return state

    }
}

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
    colors: colors_reducer
})

export default rootReducer