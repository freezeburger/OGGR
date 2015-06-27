(function() {

    angular.module('app.routes', [])

    .config(['CONFIG', '$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        // openFB.init({
        //     appId: '855624561176943' 
        // });

        $stateProvider

            .state('start', {
                url: "/start",
                abstract: true,
                templateUrl: CONFIG.paths.layouts + '/screen-start.html',
                controller: 'StartCtrl'
            })
            // setup abstracts states for the nested side-menu/tabs directive    
            .state('oggr', {
                url: "/o",
                abstract: true,
                templateUrl: CONFIG.paths.layouts + '/screen-main.html'
            })
            // Each tab has its own nav history stack:
            .state('oggr.tab', {
                url: "/tab",
                abstract: true,
                templateUrl: CONFIG.paths.layouts + '/screen-sub-tabs.html'
            })

        $urlRouterProvider.otherwise('/start/signin');
    }

})();
