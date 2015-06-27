(function() {

    var moduleDependencies = [];
    angular.module('contacts.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.contacts', {
                url: '/contacts',
                views: {
                    'tab-contacts': {
                        templateUrl: CONFIG.paths.screens + '/contacts/contacts.html',
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('oggr.tab.contacts-detail', {
                url: '/contacts/:contactId',
                views: {
                    'tab-contacts': {
                        templateUrl: CONFIG.paths.screens + '/contacts/contacts-detail.html',
                        controller: 'ContactsDetailCtrl'
                    }
                }
            })


    }


})();
