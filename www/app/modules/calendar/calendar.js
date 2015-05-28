(function(){
	
	angular.module('app.calendar', ['calendar.controllers','calendar.services','calendar.directives'])

	.config( ['CONFIG','$stateProvider','$urlRouterProvider', configureRoute ] );

    function configureRoute (CONFIG,$stateProvider, $urlRouterProvider) {

        $stateProvider.state('oggr.tab.calendar', {
            url: '/calendar',
            views: {
                'tab-calendar': {
                    templateUrl: CONFIG.paths.screens + '/calendar/calendar.html',
                    controller: 'CalendarCtrl'
                }
            }
        })

    }

})();