'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Team = mongoose.model('Team'),
	_ = require('lodash');


/**
 * Show the current Member
 */
exports.read = function(req, res) {
	res.jsonp(req.member);
};

/**
 * Update a Member inside his team
 */
exports.update = function(req, res) {
	var member = req.member;
	Team.findOne({'members._id' : member._id }, function (err, team){
		for (var i = 0; i < team.members.length; i++) {
			if(team.members[i]._id.equals(member._id)) {
				// the save() function will not work when we try to override the whole object
				// i.e. team.members[i] = req.body;
				// therefore we need to override all of its properties:
				team.members[i].firstname = req.body.firstname;
				team.members[i].lastname = req.body.lastname;
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
				res.jsonp(member);
			}
		});
	});	
};

/**
 * Member middleware
 */
exports.memberByID = function(req, res, next, id) { 

	Team.findOne(
		{'members._id' : id }, 
		{'members.$' : 1 })
	.populate('user', 'displayName')
	.exec(function(err, team) {
		if (err) return next(err);
		if (! team) return next(new Error('Failed to load Member ' + id));
		req.member = team.members[0];
		next();
	});

};

/**
 * Team middleware
 */
exports.listByTeamId = function(req, res, next, id) { 
	console.log('members list', id);
	Team.findById(id).populate('user', 'displayName').exec(function(err, team) {
		if (err) return next(err);
		if (! team) return next(new Error('Failed to load Team ' + id));
		req.team = team;
		next();
	});
};
	