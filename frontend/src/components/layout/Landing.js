import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import { getBot } from '../../actions/botActions';
import { Button, Container } from 'semantic-ui-react';

class Landing extends Component {
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        this.props.getBot();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    login = e => {
        e.preventDefault();

        this.props.loginUser();
    }

    render() {
        const { bot } = this.props.bot;
        return (
            <Container>
                <Button onClick={this.login}>Log in</Button>
            </Container>
        );
    }
}

Landing.propTypes = {
    loginUser: PropTypes.func.isRequired,
    getBot: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    bot: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    bot: state.bot,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser, getBot }
)(Landing);