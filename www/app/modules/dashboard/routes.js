(function() {

    var moduleDependencies = [];
    angular.module('dashboard.routes', moduleDependencies)

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: 'app/layout/tabs/tab-dashboard.html',
                    controller: 'DashCtrl'
                }
            }
        })


    }


})();
