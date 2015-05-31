(function(){

    var moduleDependencies = [];
	angular.module('chat.routes', moduleDependencies )

	.config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

    	$stateProvider
    	    .state('oggr.tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'app/layout/tabs/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('oggr.tab.chats-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'app/layout/tabs/tab-chats-detail.html',
                        controller: 'ChatsDetailCtrl'
                    }
                }
            });

    }


})();