'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var members = require('../../app/controllers/members.server.controller');
	var teams = require('../../app/controllers/teams.server.controller');

	// Members Routes
	//app.route('/members');
		//.get(members.list);
		//.post(users.requiresLogin, members.create);


	app.route('/members/:memberId')
		.get(members.read)
		.put(members.update);
		//.delete(users.requiresLogin, teams.hasAuthorization, teams.delete);
	
	// Finish by binding the Team middleware
	app.param('memberId', members.memberByID);
};
