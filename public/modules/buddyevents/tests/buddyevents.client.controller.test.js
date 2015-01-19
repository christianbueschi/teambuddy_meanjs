'use strict';

(function() {
	// Buddyevents Controller Spec
	describe('Buddyevents Controller Tests', function() {
		// Initialize global variables
		var BuddyeventsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Buddyevents controller.
			BuddyeventsController = $controller('BuddyeventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Buddyevent object fetched from XHR', inject(function(Buddyevents) {
			// Create sample Buddyevent using the Buddyevents service
			var sampleBuddyevent = new Buddyevents({
				name: 'New Buddyevent'
			});

			// Create a sample Buddyevents array that includes the new Buddyevent
			var sampleBuddyevents = [sampleBuddyevent];

			// Set GET response
			$httpBackend.expectGET('buddyevents').respond(sampleBuddyevents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.buddyevents).toEqualData(sampleBuddyevents);
		}));

		it('$scope.findOne() should create an array with one Buddyevent object fetched from XHR using a buddyeventId URL parameter', inject(function(Buddyevents) {
			// Define a sample Buddyevent object
			var sampleBuddyevent = new Buddyevents({
				name: 'New Buddyevent'
			});

			// Set the URL parameter
			$stateParams.buddyeventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/buddyevents\/([0-9a-fA-F]{24})$/).respond(sampleBuddyevent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.buddyevent).toEqualData(sampleBuddyevent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Buddyevents) {
			// Create a sample Buddyevent object
			var sampleBuddyeventPostData = new Buddyevents({
				name: 'New Buddyevent'
			});

			// Create a sample Buddyevent response
			var sampleBuddyeventResponse = new Buddyevents({
				_id: '525cf20451979dea2c000001',
				name: 'New Buddyevent'
			});

			// Fixture mock form input values
			scope.name = 'New Buddyevent';

			// Set POST response
			$httpBackend.expectPOST('buddyevents', sampleBuddyeventPostData).respond(sampleBuddyeventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Buddyevent was created
			expect($location.path()).toBe('/buddyevents/' + sampleBuddyeventResponse._id);
		}));

		it('$scope.update() should update a valid Buddyevent', inject(function(Buddyevents) {
			// Define a sample Buddyevent put data
			var sampleBuddyeventPutData = new Buddyevents({
				_id: '525cf20451979dea2c000001',
				name: 'New Buddyevent'
			});

			// Mock Buddyevent in scope
			scope.buddyevent = sampleBuddyeventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/buddyevents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/buddyevents/' + sampleBuddyeventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid buddyeventId and remove the Buddyevent from the scope', inject(function(Buddyevents) {
			// Create new Buddyevent object
			var sampleBuddyevent = new Buddyevents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Buddyevents array and include the Buddyevent
			scope.buddyevents = [sampleBuddyevent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/buddyevents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBuddyevent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.buddyevents.length).toBe(0);
		}));
	});
}());