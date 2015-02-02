'use strict';

angular.module('core').service('AcitveTeamFactory', ['Teams', function(Teams) {	

	this.setActiveTeam =  function(id) {
		this.activeTeam = id;
	};
	this.getActiveTeam = function() {
		return this.activeTeam;
	};

}]);