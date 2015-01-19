'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var buddyevents = require('../../app/controllers/buddyevents.server.controller');

	// Buddyevents Routes
	app.route('/buddyevents')
		.get(buddyevents.list)
		.post(users.requiresLogin, buddyevents.create);

	app.route('/buddyevents/:buddyeventId')
		.get(buddyevents.read)
		.put(users.requiresLogin, buddyevents.hasAuthorization, buddyevents.update)
		.delete(users.requiresLogin, buddyevents.hasAuthorization, buddyevents.delete);

	// Finish by binding the Buddyevent middleware
	app.param('buddyeventId', buddyevents.buddyeventByID);
};
