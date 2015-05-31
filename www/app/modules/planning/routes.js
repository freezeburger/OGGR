(function() {

    var moduleDependencies = [];
    angular.module('planning.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('oggr.tab.planning', {
                url: '/planning',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-planning.html',
                    }
                }
            })

    }




})();
