(function() {

    angular.module('calendar.controllers', [])

    .controller('CalendarCtrl', ['$scope', 'CalendarEvents', function($scope, CalendarEvents) {

        /* Events */
        $scope.$on('OGGR.Calendar.Events.CLICK', clickDateHandler);
        $scope.$on('OGGR.Calendar.Date.CLICK', clickDateHandler);
        /* Values */
        $scope.events = CalendarEvents.all();
        $scope.selectedEvents = angular.copy($scope.events) //Keep for pagination
        /* Hanlers */
        $scope.doRefresh = doRefresh;

        
        /* Implementation */
        function doRefresh() {
            $scope.events.unshift(angular.copy($scope.events[Math.floor(Math.random() * $scope.events.length)]));
            $scope.selectedEvents = angular.copy($scope.events);
            $scope.$broadcast('scroll.refreshComplete');
        };

        function clickDateHandler(evt, date) {
            $scope.selectedEvents = date.events;
        }

    }]);

})();