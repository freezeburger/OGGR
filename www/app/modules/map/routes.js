(function() {

    var moduleDependencies = [];
    angular.module('map.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('oggr.tab.map', {
                url: '/map',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/map/map.html',
                        controller: 'MapCtrl'
                    }
                }
            })

    }




})();
