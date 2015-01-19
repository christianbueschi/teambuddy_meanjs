'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var buddyevents = require('../../app/controllers/buddyevents.server.controller');

	// Buddyevents Routes
	// app.route('/buddyevents')
	// 	.get(buddyevents.list)
	// 	.post(users.requiresLogin, buddyevents.create);

	app.route('/buddyevents/:buddyeventId')
		.get(buddyevents.read)
		.put(buddyevents.update);
		//.delete(users.requiresLogin, teams.hasAuthorization, teams.delete);
	
	// Finish by binding the Team middleware
	app.param('buddyeventId', buddyevents.buddyeventByID);
	
};
