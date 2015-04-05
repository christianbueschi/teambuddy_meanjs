'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MemberSchema = require('./member.server.model');
var BuddyeventSchema = require('./buddyevent.server.model');

/**
 * Team Schema
 */
var TeamSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Team name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Team description',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	members: [MemberSchema],
	buddyevents: [BuddyeventSchema]
});

mongoose.model('Team', TeamSchema);