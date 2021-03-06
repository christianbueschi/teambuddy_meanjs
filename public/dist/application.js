'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ui.bootstrap.datetimepicker'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('buddyevents');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('members');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('teams');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('buddyevents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Buddyevents', 'buddyevents', '', null, null, null, 3);
	}
]);
'use strict';

//Setting up route
angular.module('buddyevents').config(['$stateProvider',
	function($stateProvider) {
		// Buddyevents state routing
		$stateProvider.
		state('listBuddyevents', {
			url: '/buddyevents',
			templateUrl: 'modules/buddyevents/views/list-buddyevents.client.view.html'
		}).
		state('createBuddyevent', {
			url: '/buddyevents/create',
			templateUrl: 'modules/buddyevents/views/create-buddyevent.client.view.html'
		}).
		state('viewBuddyevent', {
			url: '/buddyevents/:buddyeventId',
			templateUrl: 'modules/buddyevents/views/view-buddyevent.client.view.html'
		}).
		state('editBuddyevent', {
			url: '/buddyevents/:buddyeventId/edit',
			templateUrl: 'modules/buddyevents/views/edit-buddyevent.client.view.html'
		});
	}
]);
'use strict';

// Buddyevents controller
angular.module('buddyevents').controller('BuddyeventsController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Buddyevents', 'Teams', 'AcitveTeamFactory',
	function($scope, $stateParams, $location, $rootScope, Authentication, Buddyevents, Teams, AcitveTeamFactory) {
		$scope.authentication = Authentication;

		// Find a list of Teams
		$scope.init = function() {
			$scope.teams = Teams.query();

			var teamId = AcitveTeamFactory.getActiveTeam(); 
			if(teamId) {
				$scope.team = Teams.get({ 
					teamId: teamId
				});
			}
		};

		// Find existing Member
		$scope.findOne = function() {

			$scope.buddyevent = Buddyevents.get({ 
				buddyeventId: $stateParams.buddyeventId
			});
		};


		// Update existing Team
		$scope.add = function() {
			var team = this.team;

			var buddyevent = {
				title: this.title,
				description: this.description,
				from: this.data.from,
				to: this.data.to
			};

			team.buddyevents.push(buddyevent);

			var _this = this;

			team.$update(function() {
				// _this.firstname = '';
				// _this.lastname = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Team
		$scope.update = function() {
			var buddyevent = this.buddyevent;

			buddyevent.$update(function() {
				$location.path('buddyevents/' + buddyevent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Member
		$scope.remove = function(buddyevent) {
			var team = this.team;
			
			for (var i in team.buddyevents) {
				if (team.buddyevents[i] === buddyevent) {
					team.buddyevents.splice(i, 1);
				}
			}

			team.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Change Team by choosing one in the dropdown
		$scope.changeTeam = function($event, _id) {
			$event.preventDefault();
			$rootScope.team = Teams.get({ 
				teamId: _id
			});
		};

	}
]);
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
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

angular.module('core').directive('chooseTeam', ['Teams', 'AcitveTeamFactory', function(Teams, AcitveTeamFactory) {
	
	return {
		restrict: 'E',
    	templateUrl: 'modules/core/directives/core.client.chooseTeam.directive.html',
    
    	controller: ["$scope", "$element", function($scope, $element){
    		// Change Team by choosing one in the dropdown
			$scope.changeTeam = function($event, _id) {
				$event.preventDefault();
			
				AcitveTeamFactory.setActiveTeam(_id);
			
				$scope.team = Teams.get({ 
					teamId: _id
				});
			};
    	}]
	};

}]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

angular.module('core').service('AcitveTeamFactory', ['Teams', function(Teams) {	

	this.setActiveTeam =  function(id) {
		this.activeTeam = id;
	};
	this.getActiveTeam = function() {
		return this.activeTeam;
	};

}]);
'use strict';

// Configuring the Members module
angular.module('members').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mitglieder', 'members','', null, null, null, 2);
	}
]);


'use strict';

//Setting up route
angular.module('members').config(['$stateProvider',
	function($stateProvider) {
		// Teams state routing
		$stateProvider.
		state('listMembers', {
			url: '/members',
			templateUrl: 'modules/members/views/list-members.client.view.html'
		}).
		state('createMember', {
			url: '/members/create',
			templateUrl: 'modules/members/views/create-members.client.view.html'
		}).
			state('viewMember', {
			url: '/members/:memberId',
			templateUrl: 'modules/members/views/view-members.client.view.html'
		}).
		state('editMember', {
			url: '/team/:teamId/members/:memberId/edit',
			templateUrl: 'modules/members/views/edit-members.client.view.html'
		});
	}
]);
'use strict';

// Teams controller
angular.module('members').controller('MembersController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Teams', 'Members', 'AcitveTeamFactory',
	function($scope, $stateParams, $location, $rootScope, Authentication, Teams, Members, AcitveTeamFactory) {
		$scope.authentication = Authentication;

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();

			var teamId = AcitveTeamFactory.getActiveTeam(); 
			if(teamId) {
				$scope.team = Teams.get({ 
					teamId: teamId
				});
			}
		};

		// Find existing Member
		$scope.findOne = function() {

			$scope.member = Members.get({ 
				memberId: $stateParams.memberId
			});
		};

		$scope.add = function() {

			//console.log(this.team);
			var team = this.team;

			var member = {
				firstname: this.firstname,
				lastname: this.lastname
			};

			team.members.push(member);

			var _this = this;

			team.$update(function() {
				_this.firstname = '';
				_this.lastname = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Team


		// Update existing Team
		$scope.update = function() {
			var member = $scope.member;

			member.$update(function() {
				$location.path('members/' + member._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Member
		$scope.remove = function(member) {
			var team = $scope.team;
			
			for (var i in team.members) {
				if (team.members[i] === member) {
					team.members.splice(i, 1);
				}
			}

			team.$update(function() {
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Change Team by choosing one in the dropdown
		$scope.changeTeam = function($event, _id) {
			$event.preventDefault();
			
			AcitveTeamFactory.setActiveTeam(_id);
			
			$scope.team = Teams.get({ 
				teamId: _id
			});
		};
	}
]);
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
'use strict';

// Configuring the Articles module
angular.module('teams').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Team', 'teams', '', null, null, null, 1);
	}
]);
'use strict';

//Setting up route
angular.module('teams').config(['$stateProvider',
	function($stateProvider) {
		// Teams state routing
		$stateProvider.
		state('listTeams', {
			url: '/teams',
			templateUrl: 'modules/teams/views/list-teams.client.view.html'
		}).
		state('createTeam', {
			url: '/teams/create',
			templateUrl: 'modules/teams/views/create-team.client.view.html'
		}).
		state('viewTeam', {
			url: '/teams/:teamId',
			templateUrl: 'modules/teams/views/view-team.client.view.html'
		}).
		state('editTeam', {
			url: '/teams/:teamId/edit',
			templateUrl: 'modules/teams/views/edit-team.client.view.html'
		});
	}
]);
'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', '$rootScope', 'Authentication', 'Teams',
	function($scope, $stateParams, $location, $rootScope, Authentication, Teams) {
		$scope.authentication = Authentication;

		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name,
				description: this.description
			});

			// Redirect after save
			team.$save(function(response) {
				
				$location.path('teams');

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.teams = Teams.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// $scope.createMember = function() {
		// 	var user =  new Users ({
		// 		firstName: this.firstName,
		// 		lastName: this.lastName
		// 	});
		// 	console.log(user);

		// 	user.$save(function(res) {
		// 		$location.path('teams');
		// 	}, function(error) {
		// 		console.log(error);
		// 	});

		// };

		$scope.addMember = function() {

			var member = {
				firstname: this.firstname,
				lastname: this.lastname,
				email: this.email,
				password: 'password'
			};

			var team = $scope.team;
			team.members.push(member);

			console.log(team);

			team.$update(function() {
				$location.path('team/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


		};

		// Update existing Team
		$scope.add = function() {

			//console.log(this.team);
			var team = this.team;

			var member = {
				firstName: this.firstName,
				lastName: this.lastName
			};

			team.members.push(member);

			var _this = this;

			team.$update(function() {
				_this.firstName = '';
				_this.lastName = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Team
		$scope.remove = function(team) {
			if ( team ) { 
				team.$remove();

				for (var i in $scope.teams) {
					if ($scope.teams [i] === team) {
						$scope.teams.splice(i, 1);
					}
				}
			}
		};

		// Update existing Team
		$scope.update = function() {
			var team = $scope.team;

			team.$update(function() {
				$location.path('teams/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();
		};

		// Find existing Team
		$scope.findOne = function() {

			$scope.team = Teams.get({ 
				teamId: $stateParams.teamId
			});

		};

		// Change Team by choosing one in the dropdown
		$scope.changeTeam = function($event, _id) {
			$event.preventDefault();
			$rootScope.team = Teams.get({ 
				teamId: _id
			});
		};
	}
]);
'use strict';

//Teams service used to communicate Teams REST endpoints
angular.module('teams').factory('Teams', ['$resource',
	function($resource) {
		return $resource('teams/:teamId', { teamId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		state('create', {
			url: '/team/:teamId/members/create',
			templateUrl: 'modules/users/views/create-user.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('UsersController', ['$scope', '$http', '$location', '$stateParams', 'Users', 'Authentication', 'Teams',
	function($scope, $http, $location, $stateParams, Users, Authentication, Teams) {

		$scope.user = Authentication.user;

		var Team = Teams.get({ 
			teamId: $stateParams.teamId
		});


		console.log(Team);

		$scope.createMember = function() {

			var Member = new Users({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				team: Team._id
			});

			Member.$save(function(res) {

			}, function(error) {
				console.log(error);
			}) ;

		};

	}

]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);