'use strict';

angular.module('users').controller('UsersController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication', 'Teams',
	function($scope, $http, $location, $stateParams, Users, Authentication, Teams) {

		$scope.user = Authentication.user;

		var Team = Teams.get({ 
			teamId: $stateParams.teamId
		});


		console.log(Team);

		$scope.createMember = function() {

			var Member = new Users({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				team: Team._id
			});

			Member.$save(function(res) {

			}, function(error) {
				console.log(error);
			}) ;

		};

	}

]);