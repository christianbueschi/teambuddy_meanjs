'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Team = mongoose.model('Team'),
	_ = require('lodash');


/**
 * Show the current Buddyevent
 */
exports.read = function(req, res) {
	res.jsonp(req.buddyevent);
};

/**
 * Update a Buddyevent inside his team
 */
exports.update = function(req, res) {
	var buddyevent = req.buddyevent;
	console.log(buddyevent);
	Team.findOne({'buddyevents._id' : buddyevent._id }, function (err, team){
		console.log(team);
		for (var i = 0; i < team.buddyevents.length; i++) {
			if(team.buddyevents[i]._id.equals(buddyevent._id)) {
				// the save() function will not work when we try to override the whole object
				// i.e. team.buddyevents[i] = req.body;
				// therefore we need to override all of its properties:
				team.buddyevents[i].title = req.body.title;
				team.buddyevents[i].description = req.body.description;
				team.buddyevents[i].from = req.body.from;
				team.buddyevents[i].to = req.body.to;
			} 
		}	
		// use save() method instead of update() to make middleware applicable (i.e. validators)
		// see: http://mongoosejs.com/docs/2.7.x/docs/updating-documents.html 
		team.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(buddyevent);
			}
		});
	});	
};


/**
 * Buddyevent middleware
 */
exports.buddyeventByID = function(req, res, next, id) { 

	Team.findOne(
		{'buddyevents._id' : id }, 
		{'buddyevents.$' : 1 })
	.populate('user', 'displayName')
	.exec(function(err, team) {
		if (err) return next(err);
		if (! team) return next(new Error('Failed to load Buddyevent ' + id));
		req.buddyevent = team.buddyevents[0];
		next();
	});

};