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
	email: {
		type: String,
		default: '',
		required: 'Please fill email',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	eventsIn: [
		{
			type: Schema.ObjectId,
			ref: 'Event'
		}
	],
	eventsOut: [
		{
			type: Schema.ObjectId,
			ref: 'Event'
		}
	],
	eventsOutstanding: [
		{
			type: Schema.ObjectId,
			ref: 'Event'
		}
	]
});

mongoose.model('Member', MemberSchema);