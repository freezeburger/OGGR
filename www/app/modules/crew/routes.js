(function() {

    var moduleDependencies = [];
    angular.module('crew.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.crew', {
                url: '/crew',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/crew/crew.html',
                    }
                }
            })


    }


})();
