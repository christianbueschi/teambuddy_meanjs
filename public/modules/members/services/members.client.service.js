'use strict';

//Teams service used to communicate Teams REST endpoints
angular.module('members').factory('Members', ['$resource', function($resource) {
		
		return $resource('members/:memberId', 
			{ 
				memberId: '@_id'
			}, {
				update: {
				method: 'PUT'
			}
		});
	}
]);