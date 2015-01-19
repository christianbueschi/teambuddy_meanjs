'use strict';

// Buddyevents controller
angular.module('buddyevents').controller('BuddyeventsController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Buddyevents', 'Teams',
	function($scope, $stateParams, $location, $rootScope, Authentication, Buddyevents, Teams) {
		$scope.authentication = Authentication;

		// Find a list of Teams
		$scope.init = function() {
			$scope.teams = Teams.query();

		};

		// Find existing Member
		$scope.findOne = function() {

			$scope.buddyevent = Buddyevents.get({ 
				buddyeventId: $stateParams.buddyeventId
			});
		};


		// Update existing Team
		$scope.add = function() {
			var team = this.team;

			var buddyevent = {
				title: this.title,
				description: this.description,
				from: this.data.from,
				to: this.data.to
			};

			team.buddyevents.push(buddyevent);

			var _this = this;

			team.$update(function() {
				// _this.firstname = '';
				// _this.lastname = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Team
		$scope.update = function() {
			var buddyevent = this.buddyevent;

			buddyevent.$update(function() {
				$location.path('buddyevents/' + buddyevent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Member
		$scope.remove = function(buddyevent) {
			var team = this.team;
			
			for (var i in team.buddyevents) {
				if (team.buddyevents[i] === buddyevent) {
					team.buddyevents.splice(i, 1);
				}
			}

			team.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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