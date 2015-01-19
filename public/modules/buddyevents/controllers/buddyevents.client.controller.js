'use strict';

// Buddyevents controller
angular.module('buddyevents').controller('BuddyeventsController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Buddyevents', 'Teams',
	function($scope, $stateParams, $location, $rootScope, Authentication, Buddyevents, Teams) {
		$scope.authentication = Authentication;

		// Find a list of Teams
		$scope.init = function() {
			$scope.teams = Teams.query();

		};

		// Change Team by choosing one in the dropdown
		$scope.changeTeam = function($event, _id) {
			$event.preventDefault();
			$rootScope.team = Teams.get({ 
				teamId: _id
			});
		};

		// Update existing Team
		$scope.add = function() {
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





		// Create new Buddyevent
		$scope.create = function() {
			// Create new Buddyevent object
			var buddyevent = new Buddyevents ({
				name: this.name
			});

			// Redirect after save
			buddyevent.$save(function(response) {
				$location.path('buddyevents/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Buddyevent
		$scope.remove = function(buddyevent) {
			if ( buddyevent ) { 
				buddyevent.$remove();

				for (var i in $scope.buddyevents) {
					if ($scope.buddyevents [i] === buddyevent) {
						$scope.buddyevents.splice(i, 1);
					}
				}
			} else {
				$scope.buddyevent.$remove(function() {
					$location.path('buddyevents');
				});
			}
		};

		// Update existing Buddyevent
		$scope.update = function() {
			var buddyevent = $scope.buddyevent;

			buddyevent.$update(function() {
				$location.path('buddyevents/' + buddyevent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Buddyevents
		$scope.find = function() {
			$scope.buddyevents = Buddyevents.query();
		};

		// Find existing Buddyevent
		$scope.findOne = function() {
			$scope.buddyevent = Buddyevents.get({ 
				buddyeventId: $stateParams.buddyeventId
			});
		};
	}
]);