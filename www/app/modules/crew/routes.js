(function() {

    var moduleDependencies = [];
    angular.module('crew.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.crew', {
                url: '/crew',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-crew.html',
                    }
                }
            })


    }


})();
