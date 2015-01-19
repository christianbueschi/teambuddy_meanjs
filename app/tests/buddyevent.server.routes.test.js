'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Buddyevent = mongoose.model('Buddyevent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, buddyevent;

/**
 * Buddyevent routes tests
 */
describe('Buddyevent CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Buddyevent
		user.save(function() {
			buddyevent = {
				name: 'Buddyevent Name'
			};

			done();
		});
	});

	it('should be able to save Buddyevent instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buddyevent
				agent.post('/buddyevents')
					.send(buddyevent)
					.expect(200)
					.end(function(buddyeventSaveErr, buddyeventSaveRes) {
						// Handle Buddyevent save error
						if (buddyeventSaveErr) done(buddyeventSaveErr);

						// Get a list of Buddyevents
						agent.get('/buddyevents')
							.end(function(buddyeventsGetErr, buddyeventsGetRes) {
								// Handle Buddyevent save error
								if (buddyeventsGetErr) done(buddyeventsGetErr);

								// Get Buddyevents list
								var buddyevents = buddyeventsGetRes.body;

								// Set assertions
								(buddyevents[0].user._id).should.equal(userId);
								(buddyevents[0].name).should.match('Buddyevent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Buddyevent instance if not logged in', function(done) {
		agent.post('/buddyevents')
			.send(buddyevent)
			.expect(401)
			.end(function(buddyeventSaveErr, buddyeventSaveRes) {
				// Call the assertion callback
				done(buddyeventSaveErr);
			});
	});

	it('should not be able to save Buddyevent instance if no name is provided', function(done) {
		// Invalidate name field
		buddyevent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buddyevent
				agent.post('/buddyevents')
					.send(buddyevent)
					.expect(400)
					.end(function(buddyeventSaveErr, buddyeventSaveRes) {
						// Set message assertion
						(buddyeventSaveRes.body.message).should.match('Please fill Buddyevent name');
						
						// Handle Buddyevent save error
						done(buddyeventSaveErr);
					});
			});
	});

	it('should be able to update Buddyevent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buddyevent
				agent.post('/buddyevents')
					.send(buddyevent)
					.expect(200)
					.end(function(buddyeventSaveErr, buddyeventSaveRes) {
						// Handle Buddyevent save error
						if (buddyeventSaveErr) done(buddyeventSaveErr);

						// Update Buddyevent name
						buddyevent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Buddyevent
						agent.put('/buddyevents/' + buddyeventSaveRes.body._id)
							.send(buddyevent)
							.expect(200)
							.end(function(buddyeventUpdateErr, buddyeventUpdateRes) {
								// Handle Buddyevent update error
								if (buddyeventUpdateErr) done(buddyeventUpdateErr);

								// Set assertions
								(buddyeventUpdateRes.body._id).should.equal(buddyeventSaveRes.body._id);
								(buddyeventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Buddyevents if not signed in', function(done) {
		// Create new Buddyevent model instance
		var buddyeventObj = new Buddyevent(buddyevent);

		// Save the Buddyevent
		buddyeventObj.save(function() {
			// Request Buddyevents
			request(app).get('/buddyevents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Buddyevent if not signed in', function(done) {
		// Create new Buddyevent model instance
		var buddyeventObj = new Buddyevent(buddyevent);

		// Save the Buddyevent
		buddyeventObj.save(function() {
			request(app).get('/buddyevents/' + buddyeventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', buddyevent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Buddyevent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Buddyevent
				agent.post('/buddyevents')
					.send(buddyevent)
					.expect(200)
					.end(function(buddyeventSaveErr, buddyeventSaveRes) {
						// Handle Buddyevent save error
						if (buddyeventSaveErr) done(buddyeventSaveErr);

						// Delete existing Buddyevent
						agent.delete('/buddyevents/' + buddyeventSaveRes.body._id)
							.send(buddyevent)
							.expect(200)
							.end(function(buddyeventDeleteErr, buddyeventDeleteRes) {
								// Handle Buddyevent error error
								if (buddyeventDeleteErr) done(buddyeventDeleteErr);

								// Set assertions
								(buddyeventDeleteRes.body._id).should.equal(buddyeventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Buddyevent instance if not signed in', function(done) {
		// Set Buddyevent user 
		buddyevent.user = user;

		// Create new Buddyevent model instance
		var buddyeventObj = new Buddyevent(buddyevent);

		// Save the Buddyevent
		buddyeventObj.save(function() {
			// Try deleting Buddyevent
			request(app).delete('/buddyevents/' + buddyeventObj._id)
			.expect(401)
			.end(function(buddyeventDeleteErr, buddyeventDeleteRes) {
				// Set message assertion
				(buddyeventDeleteRes.body.message).should.match('User is not logged in');

				// Handle Buddyevent error error
				done(buddyeventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Buddyevent.remove().exec();
		done();
	});
});