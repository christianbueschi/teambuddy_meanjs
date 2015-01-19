'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Member Schema
 */
var MemberSchema = new Schema({
	firstname: {
		type: String,
		default: '',
		required: 'Please fill firstname',
		trim: true
	},
	lastname: {
		type: String,
		default: '',
		required: 'Please fill lastname',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	going: {
		type: Schema.ObjectId,
		ref: 'Event'
	},
});

/**
 * Happening Schema
 */
var BuddyeventSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill title',
		trim: true
	},
	from: {
		type: Date,
		default: ''
	},
	to: {
		type: Date,
		default: ''
	}
});

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
	events: [BuddyeventSchema]
});

mongoose.model('Team', TeamSchema);

mongoose.model('Member', MemberSchema);