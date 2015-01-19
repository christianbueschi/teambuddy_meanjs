'use strict';

// Teams controller
angular.module('members').controller('MembersController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Teams', 'Members',
	function($scope, $stateParams, $location, $rootScope, Authentication, Teams, Members) {
		$scope.authentication = Authentication;

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();

		};

		// Find existing Member
		$scope.findOne = function() {

			$scope.member = Members.get({ 
				memberId: $stateParams.memberId
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

		// Update existing Team
		$scope.update = function() {
			var member = $scope.member;

			member.$update(function() {
				$location.path('members/' + member._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Member
		$scope.remove = function(member) {
			var team = $scope.team;
			
			for (var i in team.members) {
				if (team.members[i] === member) {
					team.members.splice(i, 1);
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