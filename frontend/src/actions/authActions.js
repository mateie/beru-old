import { DiscordAPIError } from 'discord.js';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from './types';

export const loginUser = () => dispatch => {
    const userToken = Cookies.get('discord-user-token');
    if (!userToken) {
        window.location.assign('http://localhost:5000/discord');
    } else {
        setAuthToken(userToken);
        const decoded = jwt_decode(userToken);
        console.log(decoded);
        const DiscordOauth2 = require("discord-oauth2");
        const oauth = new DiscordOauth2();

        oauth.getUser(decoded.accessToken)
        .then(user => {
            dispatch(setCurrentUser(user));
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err,
            });
        });
    }
};

// Set logged in user
export const setCurrentUser = user => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const logoutUser = () => dispatch => {
    Cookies.remove('discord-user-token');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};