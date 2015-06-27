(function() {

    var moduleDependencies = [];
    angular.module('login.routes', moduleDependencies)

    .config(['CONFIG', '$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('start.signin', {
                url: "/signin",
                abstract: false,
                templateUrl: CONFIG.paths.screens + '/login/login.html'
            })
            .state('start.forgot', {
                url: "/forgot",
                abstract: false,
                templateUrl: CONFIG.paths.screens + 'login/forgot.html'
            })


    }


})();
