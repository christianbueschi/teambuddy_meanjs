'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Teams',
	function($scope, $stateParams, $location, $rootScope, Authentication, Teams) {
		$scope.authentication = Authentication;

		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			team.$save(function(response) {
				
				$location.path('teams');

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.teams = Teams.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Team
		$scope.add = function() {

			//console.log(this.team);
			var team = this.team;

			var member = {
				firstname: this.firstname,
				lastname: this.lastname
			};

			team.members.push(member);

			var _this = this;

			team.$update(function() {
				_this.firstname = '';
				_this.lastname = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Team
		$scope.remove = function(team) {
			if ( team ) { 
				team.$remove();

				for (var i in $scope.teams) {
					if ($scope.teams [i] === team) {
						$scope.teams.splice(i, 1);
					}
				}
			}
		};

		// Update existing Team
		$scope.update = function() {
			var team = $scope.team;

			team.$update(function() {
				$location.path('teams/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();
		};

		// Find existing Team
		$scope.findOne = function() {

			$scope.team = Teams.get({ 
				teamId: $stateParams.teamId
			});

		};

		// Change Team by choosing one in the dropdown
		$scope.changeTeam = function($event, _id) {
			$event.preventDefault();
			$rootScope.team = Teams.get({ 
				teamId: _id
			});
		};
	}
]);