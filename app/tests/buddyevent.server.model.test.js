'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Buddyevent = mongoose.model('Buddyevent');

/**
 * Globals
 */
var user, buddyevent;

/**
 * Unit tests
 */
describe('Buddyevent Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			buddyevent = new Buddyevent({
				name: 'Buddyevent Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return buddyevent.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			buddyevent.name = '';

			return buddyevent.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Buddyevent.remove().exec();
		User.remove().exec();

		done();
	});
});