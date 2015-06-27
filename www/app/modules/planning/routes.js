(function() {

    var moduleDependencies = [];
    angular.module('planning.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('oggr.tab.planning', {
                url: '/planning',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/planning/planning.html',
                    }
                }
            })

    }




})();
