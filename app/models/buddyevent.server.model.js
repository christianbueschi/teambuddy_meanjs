'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Buddyevent Schema
 */
var BuddyeventSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill title',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	from: {
		type: Date,
		default: ''
	},
	to: {
		type: Date,
		default: ''
	},
	membersIn: [
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
	],
	membersOut: [],
	membersOutstanding: [
		{
			type: Schema.ObjectId,
			ref: 'User'
		}
	],
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Buddyevent', BuddyeventSchema);