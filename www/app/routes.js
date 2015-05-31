(function() {

    angular.module('app.routes', [])

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        // openFB.init({
        //     appId: '855624561176943' 
        // });

        $stateProvider

            .state('start', {
                url: "/start",
                abstract: true,
                templateUrl: "app/layout/screen-start.html",
                controller: 'StartCtrl'
            })
            .state('start.signin', {
                url: "/signin",
                abstract: false,
                templateUrl: "app/layout/start/start-login.html"
            })
            .state('start.forgot', {
                url: "/forgot",
                abstract: false,
                templateUrl: "app/layout/start/start-forgot.html"
            })

            // setup abstracts states for the nested side-menu/tabs directive    
            .state('oggr', {
                url: "/o",
                abstract: true,
                templateUrl: "app/layout/screen-main.html"
            })
            // Each tab has its own nav history stack:
            .state('oggr.tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "app/layout/screen-sub-tabs.html"
            })

        $urlRouterProvider.otherwise('/start/signin');
    }

})();
