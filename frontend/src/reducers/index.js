import { combineReducers } from 'redux';
import authReducer from './authReducer';
import botReducer from './botReducer';
import errorReducer from './errorReducer';

export default combineReducers({
    auth: authReducer,
    bot: botReducer,
    errors: errorReducer,
});