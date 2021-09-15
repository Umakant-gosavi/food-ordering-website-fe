import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

import '../Styles/header.css';

const constants = require('../constants');
const API_URL = constants.API_URL;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '450px'
    },
};

Modal.setAppElement('#root');

class Header extends Component {

    constructor() {
        super();
        this.state = {
            backgroundStyle: '',
            isLoginModalOpen: false,
            isSignupModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined,

            googleEmail: '',
            familyName: '',
            givenName: '',
            googleId: '',

            email: '',
            name: '',
            id: ''
        };
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);

        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname);
        });
    }

    setHeaderStyle = (path) => {
        let bg = '';
        if (path === '/' || path === '/home') {
            bg = 'transparent';
        } else {
            bg = 'coloured';
        }
        this.setState({
            backgroundStyle: bg
        });
    }

    goToHome = () => {
        this.props.history.push('/');
    }

    openLoginModal = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }

    closeLoginModal = () => {
        this.setState({
            isLoginModalOpen: false
        });
    }

    loginHandler = () => {
        // check the value, show the message
        const { username, password } = this.state;
        const obj = {
            username: username,
            password: password
        };
        axios({
            method: 'POST',
            url: `${API_URL}/login`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            });
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong"
            });
        })
    }

    signupHandler = () => {
        const { firstName, lastName, username, password } = this.state;
        const obj = {
            firstName: firstName,
            lastName: lastName,
            email: username,
            password: password
        };

        axios({
            method: 'POST',
            url: `${API_URL}/signUp`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            });
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong"
            });
        })
    }


    loginCancelHandler = () => {
        this.closeLoginModal();
    }

    openSignupModal = () => {
        this.setState({
            isSignupModalOpen: true
        })
    }

    closeSignupModal = () => {
        this.setState({
            isSignupModalOpen: false
        });
    }


    signupCancelHandler = () => {
        this.closeSignupModal();
    }

    responseFacebook = (res) => {
        console.log(res);
        const obj = {
            firstName: res.name,
            lastName: res.name,
            email: res.name,
            password: res.id
        }
        console.log(obj.firstName);
        console.log(obj.lastName);
        console.log(obj.email);
        console.log(obj.password);
        axios({
            method: 'POST',
            url: `${API_URL}/signUp`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            });
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong"
            });
        })

    }

    responseGoogle = (res) => {
        //const { googleEmail, familyName, givenName, googleId } = this.state;
        const obj = {
            firstName: res.profileObj.familyName,
            lastName: res.profileObj.givenName,
            email: res.profileObj.email,
            password: res.profileObj.googleId
        };
        console.log(obj.firstName);
        console.log(obj.lastName);
        console.log(obj.email);
        console.log(obj.password);
        axios({
            method: 'POST',
            url: `${API_URL}/signUp`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                isLoginModalOpen: false
            });
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                loginError: "Username or password is wrong"
            });
        })
    }

    /*responseGoogle = (data) => {
        //debugger
        console.log(data.response);
    }
    responseGoogle = (response) => {
        console.log(response);
        axios({
            method: 'POST',
            url: `${API_URL}/loginGoogle`,

            data: { tokenId: response.tokenId }
        }).then(response => {
            console.log("Google login sucess!!!", response);
        })
    }*/


    toggleAuth = (auth) => {
        if (auth === 'login') {
            this.signupCancelHandler();
            this.openLoginModal();
        } else {
            this.loginCancelHandler();
            this.openSignupModal();
        }
    }

    handleChange = (e, field) => {
        const val = e.target.value;
        this.setState({
            [field]: val,
            loginError: undefined,
            signUpError: undefined
        });
    }

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
    }

    render() {
        const { backgroundStyle, isLoginModalOpen, isSignupModalOpen, username, password, firstName, lastName, user, loginError, isLoggedIn } = this.state;
        return (
            <React.Fragment>
                <div className="header" style={{ 'background': backgroundStyle == 'transparent' ? 'transparent' : '#eb2929' }}>
                    <div className="container">
                        <div className="row">
                            <div className="logoSection col-6">
                                {
                                    backgroundStyle == 'transparent'
                                        ?
                                        null
                                        :
                                        <div className="logo-small" onClick={this.goToHome}>e!</div>
                                }

                            </div>
                            <div className="loginSection col-6">
                                {
                                    isLoggedIn
                                        ?
                                        <>
                                            <span className="text-white m-4">{user.firstName}</span>
                                            <button className="signup-button" onClick={this.logout}>Logout</button>
                                        </>
                                        :
                                        <>
                                            <button className="login-button" onClick={this.openLoginModal}>Login</button>
                                            <button className="signup-button" onClick={this.openSignupModal}>Create an account</button>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isLoginModalOpen} style={customStyles}>
                    <h2 className="popup-heading">
                        Login
                        <button className="float-end btn btn-close mt-2" onClick={this.closeLoginModal}></button>
                    </h2>
                    <form className="my-4">
                        <input className="form-control" type="text" placeholder="Email" value={username} required onChange={(e) => this.handleChange(e, 'username')} />
                        <input className="form-control my-2" type="password" placeholder="Password" value={password} required onChange={(e) => this.handleChange(e, 'password')} />
                        <input type="button" className="btn form-control login-btn" onClick={this.loginHandler} value="Login" />
                        <button className="btn form-control" onClick={this.loginCancelHandler}>Cancel</button>
                    </form>
                    <div className="text-center mt-2">
                        <FacebookLogin
                            appId="1076238476480871"
                            textButton="Continue with Facebook"
                            autoLoad={false}
                            //fields="name,email,picture"
                            //onClick={this.componentClicked}
                            callback={this.responseFacebook}
                            cssClass="my-facebook-button-class mb-2"
                            icon="fa-facebook"
                        />
                        <GoogleLogin
                            clientId="204065092676-hesvde26qu8phqekk9gqq21mg8rfd68o.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            className="my-facebook-button-class"
                        />
                    </div>
                    <hr className="mt-5" />
                    <div className="bottom-text">
                        Don’t have account? <button className="text-danger btn m-0 p-0" onClick={() => this.toggleAuth('signup')}>Sign UP</button>
                    </div>
                </Modal>
                <Modal isOpen={isSignupModalOpen} style={customStyles}>
                    <h2 className="popup-heading">
                        Create an account
                        <button className="float-end btn btn-close mt-2" onClick={this.closeSignupModal}></button>
                    </h2>
                    <form className="my-4">
                        <input className="form-control" type="text" placeholder="Firstname" value={firstName} onChange={(e) => this.handleChange(e, 'firstName')} />
                        <input className="form-control my-2" type="text" placeholder="Lastname" value={lastName} onChange={(e) => this.handleChange(e, 'lastName')} />
                        <input className="form-control" type="text" placeholder="Email" value={username} onChange={(e) => this.handleChange(e, 'username')} />
                        <input className="form-control my-2" type="password" placeholder="Password" value={password} onChange={(e) => this.handleChange(e, 'password')} />
                        <button className="btn form-control login-btn" onClick={this.signupHandler}>Create account</button>
                        <button className="btn form-control" onClick={this.signupCancelHandler}>Cancel</button>
                    </form>
                    <div className="text-center mt-2">
                        <FacebookLogin
                            appId="1076238476480871"
                            textButton="Continue with Facebook"
                            autoLoad={false}
                            //fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="my-facebook-button-class mb-2"
                            icon="fa-facebook"
                        />
                        <GoogleLogin
                            clientId="204065092676-hesvde26qu8phqekk9gqq21mg8rfd68o.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            className="my-facebook-button-class"
                        />
                    </div>
                    <hr className="mt-5" />
                    <div className="bottom-text">
                        Already have an account? <button className="text-danger btn m-0 p-0" onClick={() => this.toggleAuth('login')}>Login</button>
                    </div>
                </Modal>

            </React.Fragment>
        )
    }
}

export default withRouter(Header);
