import 'babel/polyfill';

import page      from 'page';
import React     from 'react';
import fastclick from 'fastclick';

import socket    from './utils/socket';
import UserStore from './stores/user';

import BoardView      from './views/board';
import WorkspaceView  from './views/workspace';
import LoginView      from './views/form';
import RegisterView   from './views/form';
import GuestLoginView from './views/form';

// This should fix some of the issues with clicking and touch enabled devices.
fastclick(document.body);

// Define middleware to be used with 'page' routes (or pages, whatever).
const middleware = {
	user: {
		is: (...types) => {
			return function(ctx, next) {
				if((ctx.user = UserStore.getUser())) {
					let userHasType = types.reduce((has, type) => {
						return has || ctx.user.type === type;
					}, false);

					// If the user is a regular 'user', we can access anything!
					if(userHasType && ctx.user.type === 'user') {
						return next();
					}

					// If the user is a guest, we need to make sure he or she
					// has access to the resource being accessed. Guests only
					// have access to a specific board.
					if(userHasType && ctx.user.type === 'guest') {
						if(ctx.params.hasOwnProperty('id')) {
							if(ctx.params.id === ctx.user.access) {
								return next();
							}
						}
						return page.redirect(`/boards/${ctx.user.access}`);
					}
				}
				return page.redirect('/login');
			}
		},

		notGuest: (ctx, next) => {
			if(ctx.user = UserStore.getUser()) {
				if(ctx.user.type === 'guest') {
					if(ctx.params.hasOwnProperty('id')) {
						if(ctx.params.id === ctx.user.access) {
							return page.redirect(`/boards/${ctx.user.access}`);
						}
					}
				}
			}
			return next();
		},

		loggedOut: (ctx, next) => {
			if(ctx.user = UserStore.getUser()) {
				if(ctx.user.type === 'guest') {
					// If the logged in user a 'guest', he or she is redirected
					// to the board the guest has access to.
					return page.redirect(`/boards/${ctx.user.access}`);
				} else {
					return page.redirect('/boards');
				}
			}
			return next();
		}
	},
	socket: {
		connect: (ctx, next) => {
			socket.connect({ token: UserStore.getToken() }).then(next);
		},
		disconnect: (ctx, next) => {
			socket.disconnect().then(next);
		}
	}
}

// The router, in a sense, is also a view. Thus it should be able to listen to
// stores the same as other views.
// We listen to changes to the UserStore, so that when the user is logged out
// for various reasons, we can redirect the user to the 'login' page. This, in
// a sense, works very similarly to the AngularJS '$http.interceptor'.
UserStore.addChangeListener(() => {
	if(!UserStore.getUser() || !UserStore.getToken()) {
		return page.redirect('/login');
	}
});

page('/login',
	middleware.user.loggedOut,
	middleware.socket.disconnect,
	() => {
		return React.render(
			<LoginView formProfile="loginForm" />,
			document.getElementById('application')
		);
	});

page('/register',
	middleware.user.loggedOut,
	middleware.socket.disconnect,
	() => {
		return React.render(
			<RegisterView formProfile="registerForm" />,
			document.getElementById('application')
		);
	});

page('/boards/:id/access/:code',
	middleware.user.notGuest,
	middleware.socket.disconnect,
	(ctx) => {
		return React.render(
			<GuestLoginView formProfile="guestLoginForm" boardID={ctx.params.id}
				accessCode={ctx.params.code} />,
			document.getElementById('application')
		);
	});

page('/boards',
	middleware.user.is('user'),
	middleware.socket.connect,
	(ctx) => {
		return React.render(
			<WorkspaceView user={ctx.user} />,
			document.getElementById('application')
		);
	});

page('/boards/:id',
	middleware.user.is('user', 'guest'),
	middleware.socket.connect,
	(ctx) => {
		return React.render(
			<BoardView id={ctx.params.id} user={ctx.user} />,
			document.getElementById('application')
		);
	});

page('*', () => page.redirect('/boards'));
page.start();
