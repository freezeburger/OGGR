(function() {

    var moduleDependencies = [];
    angular.module('settings.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.language', {
                url: '/language',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/settings/settings-language.html',
                        controller: 'LanguageCtrl'
                    }
                }
            })
            .state('oggr.tab.profile', {
                url: '/profile',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/settings/settings-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
    }


})();
