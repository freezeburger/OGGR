(function() {

    var moduleDependencies = [];

    angular.module('pulse.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.pulse', {
                url: '/pulse',
                views: {
                    'tab-pulse': {
                        templateUrl: CONFIG.paths.screens + '/pulse/pulse.html',
                        controller: 'PulseCtrl'
                    }
                }
            })


    }


})();
