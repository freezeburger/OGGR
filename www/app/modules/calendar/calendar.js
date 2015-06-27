(function(){

    var moduleDependencies = [
        'calendar.controllers',
        'calendar.services',
        'event-calendar'//component
    ];
	
	angular.module('app.calendar', moduleDependencies )

	.config( ['CONFIG','$stateProvider','$urlRouterProvider', configureRoute ] );

    function configureRoute (CONFIG, $stateProvider, $urlRouterProvider) {

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