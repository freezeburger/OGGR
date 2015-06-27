(function() {

    var moduleDependencies = [];
    angular.module('settings.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.language', {
                url: '/language',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/settings/language.html',
                        controller: 'LanguageCtrl'
                    }
                }
            })
            .state('oggr.tab.profile', {
                url: '/profile',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/settings/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
    }


})();
