'use strict';

//Buddyevents service used to communicate Buddyevents REST endpoints
angular.module('buddyevents').factory('Buddyevents', ['$resource',
	function($resource) {
		return $resource('buddyevents/:buddyeventId', { buddyeventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);