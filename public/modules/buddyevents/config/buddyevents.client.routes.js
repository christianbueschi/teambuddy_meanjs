'use strict';

//Setting up route
angular.module('buddyevents').config(['$stateProvider',
	function($stateProvider) {
		// Buddyevents state routing
		$stateProvider.
		state('listBuddyevents', {
			url: '/buddyevents',
			templateUrl: 'modules/buddyevents/views/list-buddyevents.client.view.html'
		}).
		state('createBuddyevent', {
			url: '/buddyevents/create',
			templateUrl: 'modules/buddyevents/views/create-buddyevent.client.view.html'
		}).
		state('viewBuddyevent', {
			url: '/buddyevents/:buddyeventId',
			templateUrl: 'modules/buddyevents/views/view-buddyevent.client.view.html'
		}).
		state('editBuddyevent', {
			url: '/buddyevents/:buddyeventId/edit',
			templateUrl: 'modules/buddyevents/views/edit-buddyevent.client.view.html'
		});
	}
]);