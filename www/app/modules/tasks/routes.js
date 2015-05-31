(function() {

    var moduleDependencies = [];
    angular.module('tasks.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.taskManager', {
                url: '/taskManager',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-tasks.html',
                    }
                }
            })
    }


})();
