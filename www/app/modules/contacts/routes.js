(function() {

    var moduleDependencies = [];
    angular.module('contacts.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.contacts', {
                url: '/contacts',
                views: {
                    'tab-contacts': {
                        templateUrl: 'app/layout/tabs/tab-contacts.html',
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('oggr.tab.contacts-detail', {
                url: '/contacts/:contactId',
                views: {
                    'tab-contacts': {
                        templateUrl: 'app/layout/tabs/tab-contacts-detail.html',
                        controller: 'ContactsDetailCtrl'
                    }
                }
            })


    }


})();
