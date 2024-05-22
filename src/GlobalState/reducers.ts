import { combineReducers } from 'redux'
import user from '../app/UserReducer'
import logState from '../app/LoginStateReducer'

export const rootReducer = combineReducers({
    user,
    logState
})
