import { Subscription } from 'rxjs';
import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.page.html',
	styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
	signUpForm: FormGroup;
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

	constructor(public angularFire: AngularFireAuth,
		public router: Router,
		public alertController: AlertController,
		private ngZone: NgZone,
		private authService: FirebaseAuthService
	) {
		this.signUpForm = new FormGroup({
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
				this.presentAlert();
			}
		});
	}

	async presentAlert() {
		const alert = await this.alertController.create({
		  cssClass: 'my-custom-alert',
		  header: 'Sign In',
		  message: this.submitError,
		  buttons: ['OK']
		});
	
		await alert.present();
	}

	// Once the auth provider finished the authentication flow, and the auth redirect completes,
  	// redirect the user to the tabs page
	redirectLoggedUserToTabsPage() {
		// As we are calling the Angular router navigation inside a subscribe method,
		// the navigation will be triggered outside Angular zone.
		// That's why we need to wrap the router navigation call inside an ngZone wrapper
		this.ngZone.run(() => this.router.navigateByUrl('app/tabs/home'));
	}

	signUpWithEmail() {
		this.authService.signUpWithEmail(this.signUpForm.value['email'], this.signUpForm.value['password'])
		.then(user => {
		  // navigate to user profile
		  this.redirectLoggedUserToTabsPage();
		})
		.catch(error => {
		  this.submitError = error.message;
		});
	}

	googleSignUp() {
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
