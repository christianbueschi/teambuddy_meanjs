'use strict';

// Configuring the Articles module
angular.module('buddyevents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Buddyevents', 'buddyevents', '', null, null, null, 3);
	}
]);