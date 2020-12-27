import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import { logoutUser, setCurrentUser } from './actions/authActions';
import PrivateRoute from './components/private-route/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';

import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import jwt_decode from 'jwt-decode';

if (Cookies.get('discord-user-token')) {
    const token = Cookies.get('discord-user-token');
    const decoded = jwt_decode(token);

    const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2();

    oauth.getUser(decoded.accessToken)
        .then(user => {
            store.dispatch(setCurrentUser(user));

            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                store.dispatch(logoutUser());

                window.location.href = '/';
            }
        })
        .catch(err => {
            store.dispatch(logoutUser());

            window.location.href = '/';
        });
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Route exact path="/" component={Landing} />
                        <Switch>
                            <PrivateRoute exact path="/dashboard" component={Dashboard} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;