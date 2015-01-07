'use strict';

// Configuring the Members module
angular.module('members').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mitglieder', 'members','', null, null, null, 2);
	}
]);

