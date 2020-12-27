import {
    SET_BOT,
    BOT_LOADING,
} from '../actions/types';

const initialState = {
    bot: {},
    loading: false,
};

const botReducer = (state = initialState, action) => {
    console.log(action);
    switch(action.type) {
        case SET_BOT:
            return {
                ...state,
                bot: action.payload,
            };
        case BOT_LOADING:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
}

export default botReducer;