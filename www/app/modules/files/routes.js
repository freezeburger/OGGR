(function() {

    var moduleDependencies = [];
    angular.module('files.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.files', {
                url: '/files',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/files/files.html',
                    }
                }
            })

    }


})();
