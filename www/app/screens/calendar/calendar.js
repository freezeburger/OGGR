(function(){

	var BASE_PATH = 'app/screens'
	
	angular.module('app.calendar', ['calendar.controllers','calendar.services','calendar.directives'])

	.config( ['$stateProvider','$urlRouterProvider', configureRoute ] );

    function configureRoute ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('oggr.tab.calendar', {
            url: '/calendar',
            views: {
                'tab-calendar': {
                    templateUrl: BASE_PATH + '/calendar/calendar.html',
                    controller: 'CalendarCtrl'
                }
            }
        })

    }




})();