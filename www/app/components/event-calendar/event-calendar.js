(function() {

    angular.module('event-calendar', ['event-calendar.controller'])
    .directive('eventCalendar', eventCalendar);

    function eventCalendar() {
        return {
            restrict: 'E',
            scope: {
                options: '=',
                events: '='
            },
            templateUrl: 'app/components/event-calendar/event-calendar.html',
            controller: 'EventCalendarController',
            link: function(scope, element, attrs, tabsCtrl) {
              angular.element(document.getElementsByTagName('head')[0])
              .append("<link href='app/components/event-calendar/event-calendar.css' rel='stylesheet'/>");
            }
        }
    }

    


})();