import axios from 'axios';
import {
    SET_BOT,
    GET_ERRORS,
    BOT_LOADING
} from './types';

export const getBot = () => dispatch => {
    axios.post('http://localhost:5000/bot/self')
    .then(res => {
        const bot = res.data.bot;
        dispatch(setBot(bot));
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err
        });
    });
};

export const setBot = bot => {
    return {
        type: SET_BOT,
        payload: bot
    };
};

export const setBotLoading = () => {
    return {
        type: BOT_LOADING
    };
};