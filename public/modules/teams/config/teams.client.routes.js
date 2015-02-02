'use strict';

//Setting up route
angular.module('teams').config(['$stateProvider',
	function($stateProvider) {
		// Teams state routing
		$stateProvider.
		state('listTeams', {
			url: '/teams',
			templateUrl: 'modules/teams/views/list-teams.client.view.html'
		}).
		state('createTeam', {
			url: '/teams/create',
			templateUrl: 'modules/teams/views/create-team.client.view.html'
		}).
		state('viewTeam', {
			url: '/team/:teamId',
			templateUrl: 'modules/teams/views/view-team.client.view.html'
		}).
		state('editTeam', {
			url: '/team/:teamId/edit',
			templateUrl: 'modules/teams/views/edit-team.client.view.html'
		});
	}
]);