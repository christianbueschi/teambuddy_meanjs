'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Team Schema
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
	members: [MemberSchema]
});

mongoose.model('Team', TeamSchema);