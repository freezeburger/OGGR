(function() {

    var moduleDependencies = [];
    angular.module('files.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.files', {
                url: '/files',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-files.html',
                    }
                }
            })

    }


})();
