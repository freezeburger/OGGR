(function() {

    var moduleDependencies = [];
    angular.module('map.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('oggr.tab.map', {
                url: '/map',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-map.html',
                        controller: 'MapCtrl'
                    }
                }
            })

    }




})();