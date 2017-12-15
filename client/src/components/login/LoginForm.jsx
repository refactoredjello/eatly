
/*
this file takes care of all authentication through firebase.
the firebase script is hard-loaded into the index.html rather than using the node module
*/
import React from 'react'
import NavBar from '../NavBar'
import Axios from 'axios'

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: '',
			txtEmail: '',
			txtPassword: '',
			loggedIn: 'false',
			googleProvider: new firebase.auth.GoogleAuthProvider(),
			facebookProvider: new firebase.auth.FacebookAuthProvider(),
		}
		this.firebase = this.props.firebase
	}
	handleInputChange({ target }) {
		this.setState({[target.name]: target.value})
	}
	//intitiates oAuth
	signInWithProvider(providerName) {
		let provider;
		if (providerName === 'google') {
			provider = this.state.googleProvider
			provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
		}
		if (providerName === 'facebook') {
			provider = this.state.facebookProvider
		}
		firebase.auth().signInWithRedirect(provider).then(function(result) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			let token = result.credential.accessToken;
			// The signed-in user info.
			let user = result.user;
			let name = user.displayName || '-'
			console.log('here: ', user)
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});
	}
  //handles log in event, bound to the log in button
	handleLogIn() {
		let { txtEmail, txtPassword } = this.state
		//firebase does the heavy lifting of valid email input verification
		this.firebase.auth().signInWithEmailAndPassword(txtEmail, txtPassword)
			.then((data) => console.log('logged in with: ', data))
			.catch((error) => console.log('error in user login: ' +error.code+ " --" + error.message))
	}


	//handles sign up event, bound to the sign up button
	handleSignUp() {
		let { txtEmail, txtPassword } = this.state
		//all users created this way are visible on the online firebase console
		this.firebase.auth().createUserWithEmailAndPassword(txtEmail, txtPassword)
			.then((user) => {
				user.updateProfile({displayName : this.state.name})
				this.postNewUser(user.email, user.uid, this.state.name)
				console.log('new user: ', user, this.state.name)
			})
			.catch((error) => console.log('error in user sign up: ' +error.code+ +"--"+ error.message))
	}

	render() {
		return (
			<div className="loginSignUpForm">
			<input name="name" type="text" placeholder="your name" onChange={this.handleInputChange.bind(this)}></input>
			<input name="txtEmail" type="text" placeholder="email" onChange={this.handleInputChange.bind(this)}></input>
			<input name="txtPassword" type="text" placeholder="password" onChange={this.handleInputChange.bind(this)}></input>
            	
			<div className="buttons">
					<button id="btnLogin" className="loginButton" onClick={this.handleLogIn.bind(this)}>Log In</button>
					<button id="btnSignUp" className="signupButton" onClick={this.handleSignUp.bind(this)}>Sign Up</button>
					
			</div>
			<div className="signInWithOAuth">
				<button className="signOnWithGoogle" onClick={this.signInWithProvider.bind(this, 'google')}>Sign On With Google</button>
				<button className="signOnWithGoogle" onClick={this.signInWithProvider.bind(this, 'facebook')}>Sign On With Facebook</button>
			</div>
		</div>
		)
	}
}