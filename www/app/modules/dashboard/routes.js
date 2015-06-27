(function() {

    var moduleDependencies = [];
    angular.module('dashboard.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: CONFIG.paths.screens + '/dashboard/dashboard.html',
                    controller: 'DashCtrl'
                }
            }
        })


    }


})();
