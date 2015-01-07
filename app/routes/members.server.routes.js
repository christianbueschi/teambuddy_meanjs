'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var members = require('../../app/controllers/members.server.controller');

	// Members Routes
	app.route('/members');
		//.get(members.list);
		//.post(users.requiresLogin, members.create);

	
	// Finish by binding the Team middleware
	//app.param('memberId', members.membersByID);
};
