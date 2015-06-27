(function() {

    var moduleDependencies = [];
    angular.module('tasks.routes', moduleDependencies)

    .config(['CONFIG', $stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.taskManager', {
                url: '/taskManager',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/tasks/tasks.html',
                    }
                }
            })
    }


})();
