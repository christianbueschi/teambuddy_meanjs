'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Buddyevent = mongoose.model('Buddyevent'),
	_ = require('lodash');

/**
 * Create a Buddyevent
 */
exports.create = function(req, res) {
	var buddyevent = new Buddyevent(req.body);
	buddyevent.user = req.user;

	buddyevent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buddyevent);
		}
	});
};

/**
 * Show the current Buddyevent
 */
exports.read = function(req, res) {
	res.jsonp(req.buddyevent);
};

/**
 * Update a Buddyevent
 */
exports.update = function(req, res) {
	var buddyevent = req.buddyevent ;

	buddyevent = _.extend(buddyevent , req.body);

	buddyevent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buddyevent);
		}
	});
};

/**
 * Delete an Buddyevent
 */
exports.delete = function(req, res) {
	var buddyevent = req.buddyevent ;

	buddyevent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buddyevent);
		}
	});
};

/**
 * List of Buddyevents
 */
exports.list = function(req, res) { 
	Buddyevent.find().sort('-created').populate('user', 'displayName').exec(function(err, buddyevents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(buddyevents);
		}
	});
};

/**
 * Buddyevent middleware
 */
exports.buddyeventByID = function(req, res, next, id) { 
	Buddyevent.findById(id).populate('user', 'displayName').exec(function(err, buddyevent) {
		if (err) return next(err);
		if (! buddyevent) return next(new Error('Failed to load Buddyevent ' + id));
		req.buddyevent = buddyevent ;
		next();
	});
};

/**
 * Buddyevent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.buddyevent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
