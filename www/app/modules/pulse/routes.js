(function() {

    var moduleDependencies = [];

    angular.module('pulse.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.pulse', {
                url: '/pulse',
                views: {
                    'tab-pulse': {
                        templateUrl: 'app/layout/tabs/tab-pulse.html',
                        controller: 'PulseCtrl'
                    }
                }
            })


    }


})();
