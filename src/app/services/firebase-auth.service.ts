import { User, auth } from 'firebase/app';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class FirebaseAuthService {
	currentUser: User;
  	userProviderAdditionalInfo: any;
  	redirectResult: Subject<any> = new Subject<any>();

	constructor(
		public angularFire: AngularFireAuth,
		public platform: Platform
	){
		this.angularFire.onAuthStateChanged((user) => {
			if (user) {
			  // User is signed in.
			  this.currentUser = user;
			} else {
			  // No user is signed in.
			  this.currentUser = null;
			}
		});

		// when using signInWithRedirect, this listens for the redirect results
		this.angularFire.getRedirectResult()
		.then((result) => {
			// result.credential.accessToken gives you the Provider Access Token.
			// You can use it to access the Provider API.
			if (result.user) {
				this.setProviderAdditionalInfo(result.additionalUserInfo.profile);
				this.currentUser = result.user;
				this.redirectResult.next(result);
			}
		}, (error) => {
		  	this.redirectResult.next({error: error.code});
		});
	}

	getRedirectResult(): Observable<any> {
		return this.redirectResult.asObservable();
	}
	
	setProviderAdditionalInfo(additionalInfo: any) {
		this.userProviderAdditionalInfo = {...additionalInfo};
	}
	
	// Get the currently signed-in user
	getLoggedInUser() {
		return this.currentUser;
	}

	signOut(): Observable<any> {
		return from(this.angularFire.signOut());
	}

	signInWithEmail(email: string, password: string): Promise<auth.UserCredential> {
		return this.angularFire.signInWithEmailAndPassword(email, password);
	}
	  
	signUpWithEmail(email: string, password: string): Promise<auth.UserCredential> {
		return this.angularFire.createUserWithEmailAndPassword(email, password);
	}

	socialSignIn(providerName: string, scopes?: Array<string>): Promise<any> {
		const provider = new auth.OAuthProvider(providerName);

		// add any permission scope you need
		if (scopes) {
			scopes.forEach(scope => {
				provider.addScope(scope);
			});
		}

		if (this.platform.is('desktop')) {
			return this.angularFire.signInWithPopup(provider);
		} else {
			// web but not desktop, for example mobile PWA
			return this.angularFire.signInWithRedirect(provider);
		}
	}

	signInWithGoogle() {
		const provider = new auth.GoogleAuthProvider();
		const scopes = ['profile', 'email'];
		return this.socialSignIn(provider.providerId, scopes);
	}
}
