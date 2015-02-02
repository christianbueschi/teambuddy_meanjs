'use strict';

angular.module('core').directive('chooseTeam', ['Teams', 'AcitveTeamFactory', function(Teams, AcitveTeamFactory) {
	
	return {
		restrict: 'E',
    	templateUrl: 'modules/core/directives/core.client.chooseTeam.directive.html',
    
    	controller: function($scope, $element){
    		// Change Team by choosing one in the dropdown
			$scope.changeTeam = function($event, _id) {
				$event.preventDefault();
			
				AcitveTeamFactory.setActiveTeam(_id);
			
				$scope.team = Teams.get({ 
					teamId: _id
				});
			};
    	}
	};

}]);