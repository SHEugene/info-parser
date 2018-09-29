import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import registration from './registration'
import languages from './languages'
import notificationSystem from './notificationSystem'

const rootReducer = combineReducers({
    user,
    registration,
    languages,
    notificationSystem,
    routing: routerReducer
});

export default rootReducer
