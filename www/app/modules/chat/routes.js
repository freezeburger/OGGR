(function(){

    var moduleDependencies = [];
	angular.module('chat.routes', moduleDependencies )

	.config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

    	$stateProvider
    	    .state('oggr.tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: CONFIG.paths.screens + '/chat/chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('oggr.tab.chats-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: CONFIG.paths.screens + '/chat/chats-detail.html',
                        controller: 'ChatsDetailCtrl'
                    }
                }
            });

    }


})();