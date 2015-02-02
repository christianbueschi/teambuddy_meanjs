'use strict';

//Setting up route
angular.module('members').config(['$stateProvider',
	function($stateProvider) {
		// Teams state routing
		$stateProvider.
		state('listMembers', {
			url: '/members',
			templateUrl: 'modules/members/views/list-members.client.view.html'
		}).
		state('createMember', {
			url: '/members/create',
			templateUrl: 'modules/members/views/create-members.client.view.html'
		}).
			state('viewMember', {
			url: '/members/:memberId',
			templateUrl: 'modules/members/views/view-members.client.view.html'
		}).
		state('editMember', {
			url: '/team/:teamId/members/:memberId/edit',
			templateUrl: 'modules/members/views/edit-members.client.view.html'
		});
	}
]);