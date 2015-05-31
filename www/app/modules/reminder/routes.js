(function() {

    var moduleDependencies = [];
    angular.module('reminder.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.reminder', {
                url: '/reminder',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-reminder.html',
                    }
                }
            })


    }


})();
