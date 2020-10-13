import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.page.html',
	styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage {
	signInForm: FormGroup;
	submitError: string;
	authRedirectResult: Subscription;

	validation_messages = {
		'email': [
		  { type: 'required', message: 'Email is required.' },
		  { type: 'pattern', message: 'Enter a valid email.' }
		],
		'password': [
		  { type: 'required', message: 'Password is required.' },
		  { type: 'minlength', message: 'Password must be at least 6 characters long.' }
		]
	};

	constructor(
		public angularFire: AngularFireAuth,
		public router: Router,
		private ngZone: NgZone,
		private authService: FirebaseAuthService
	) {
		this.signInForm = new FormGroup({
			'email': new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])),
			'password': new FormControl('', Validators.compose([
				Validators.minLength(6),
				Validators.required
			]))
		});

		// Get firebase authentication redirect result invoken when using signInWithRedirect()
    	// signInWithRedirect() is only used when client is in web but not desktop
    	this.authRedirectResult = this.authService.getRedirectResult()
    	.subscribe(result => {
			if (result.user) {
				this.redirectLoggedUserToTabsPage();
			} else if (result.error) {
				this.submitError = result.error;
			}
    	});
	}

	// Once the auth provider finished the authentication flow, and the auth redirect completes,
  	// redirect the user to the tabs page
	redirectLoggedUserToTabsPage() {
		// As we are calling the Angular router navigation inside a subscribe method,
		// the navigation will be triggered outside Angular zone.
		// That's why we need to wrap the router navigation call inside an ngZone wrapper
		this.ngZone.run(() => this.router.navigateByUrl('app/tabs/tab1'));
	}

	signInWithEmail() {
		this.authService.signInWithEmail(this.signInForm.value['email'], this.signInForm.value['password'])
		.then(user => {
			this.redirectLoggedUserToTabsPage();
		})
	}

	googleSignIn() {
		this.authService.signInWithGoogle()
		.then((result: any) => {
			if (result.additionalUserInfo) {
			  this.authService.setProviderAdditionalInfo(result.additionalUserInfo.profile);
			}
			// This gives you a Google Access Token. You can use it to access the Google API.
			// const token = result.credential.accessToken;
			// The signed-in user info is in result.user;
			this.redirectLoggedUserToTabsPage();
		}).catch((error) => {
			// Handle Errors here.
			console.log(error);
		});
	}

}
