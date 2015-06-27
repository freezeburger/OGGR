(function() {

    var moduleDependencies = [];
    angular.module('reminder.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.reminder', {
                url: '/reminder',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/reminder/reminder.html',
                    }
                }
            })


    }


})();
