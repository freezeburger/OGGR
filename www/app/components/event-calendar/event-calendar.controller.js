(function() {

    angular.module('event-calendar.controller',[])

    .controller('EventCalendarController', ['$scope', EventCalendarController])
    
    EventCalendarController.$inject = ['$scope'];

    function EventCalendarController($scope) {
        /* init function at the end */
        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            config = {};

        $scope.onClick = function() {
            if (!this.date || this.date.disabled) return;
            $scope.selectedDate = this.date;
            var eventName = (this.date.events) ? 'OGGR.Calendar.Events.CLICK' : 'OGGR.Calendar.Date.CLICK';
            $scope.$emit(eventName, this.date);
        };

        $scope.prevMonth = function() {
            renderView(config.view.period.previous);
        };

        $scope.nextMonth = function() {
            renderView(config.view.period.next)
        };

        $scope.isAllowedPrevMonth = function() {
            return isAllowedDate(config.view.period.previous);
        };

        $scope.isAllowedNextMonth = function() {
            return isAllowedDate(config.view.period.next);
        };

        function isAllowedDate(calendarDateObject) {
            var date = calendarDateObject.nativeDateObject;
            if (date < config.minDate) return false;
            if (date > config.maxDate) return false;
            return true;
        };

        function getPrevNextMonth(calendarDateObject) {
            var y = calendarDateObject.year
            m = calendarDateObject.month;
            period = {
                previous: getCalendarDateObject(new Date(y, m - 1, 0)),
                current: getCalendarDateObject(new Date(y, m, 0)),
                next: getCalendarDateObject(new Date(y, m + 1, 0))
            }
            return period;
        }

        function getDateEvents(date, events) {
            if (!date || !events) return;
            date.events = [];
            for (var i = events.length - 1; i >= 0; i--) {
                if (date.title === events[i].date.toString().substring(0, 15)) date.events.push(events[i]);
            };
        };

        /* calculateCalendarMonthView : prepare data for the view */
        function calculateCalendarMonthView(calendarDateObject, events) {
            var cdo = calendarDateObject;
            if (calculateCalendarMonthView.view[cdo.titleMY]) return calculateCalendarMonthView.view[cdo.titleMY];
            /* caching optimisation check */
            console.warn('calculateCalendarMonth');

            var weeks = [],
                daysInMonth = cdo.daysInMonth;

            for (var day = 1; day < daysInMonth + 1; day += 1) {

                var dayDate = new Date(cdo.year, cdo.month - 1, day),
                    dayWeekNumber = dayDate.getDay(),
                    week = week || [null, null, null, null, null, null, null];

                week[dayWeekNumber] = getCalendarDateObject(dayDate)

                if (isAllowedDate(week[dayWeekNumber])) {
                    if (events) getDateEvents(week[dayWeekNumber], events);
                } else {
                    week[dayWeekNumber].disabled = true;
                }

                if (dayWeekNumber === 6 || day === daysInMonth) {
                    weeks.push(week);
                    week = null;
                }
            }
            /* caching optimisation */
            calculateCalendarMonthView.view[cdo.titleMY] = {
                calendarTitle: cdo.titleMY,
                currentMonth: getPrevNextMonth(cdo).current,
                weeks: weeks,
                period: getPrevNextMonth(cdo)
            }
            return calculateCalendarMonthView.view[cdo.titleMY];
        };
        calculateCalendarMonthView.view = {};
        /* getCalendarDateObject : CalendarDateObject(cdo) factory */
        function getCalendarDateObject(nativeDateObject) {

            var label = nativeDateObject.toString();
            if (getCalendarDateObject.cache[label]) return getCalendarDateObject.cache[label];

            var date = nativeDateObject,
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            var cdo = {
                title: label.substring(0, 15),
                titleDMY: day + ' ' + MONTHS[month - 1] + ' ' + year,
                titleMY: MONTHS[month - 1] + ' ' + year,
                nativeDateObject: date,
                year: year,
                month: month,
                day: day,
                daysInMonth: new Date(year, month, 0).getDate()
            }
            getCalendarDateObject.cache[label] = cdo;
            return cdo;
        };
        getCalendarDateObject.cache = {};


        /* renderView : only way to update $scope after initCalendar */
        function renderView(calendarDateObject, force) {
            $scope.weeks = [];
            /* @force : boolean - clean calculateCalendarMonthView cache */
            if (force) calculateCalendarMonthView.view = {};
            config.view = calculateCalendarMonthView(calendarDateObject, $scope.events);

            $scope.calendarTitle = config.view.calendarTitle;
            $scope.weeks = config.view.weeks;
        };

        /* initCalendar : init function */
        (function initCalendar() {
            /* isDate : internal helper to check native Date */
            function isDate(date) {
                return (date && date.getDate) ? date : false;
            };

            config = angular.copy($scope.options) || {};
            /* configuration object from options attribute, such as :
            {
              defaultDate: "2016-05-16",
              minDate: new Date([2015, 03, 31]),
              maxDate: new Date([2020, 12, 31]),
              dayNamesLength: 1 
            }
            */
            config.defaultDate = isDate(config.defaultDate) || new Date();
            config.minDate = isDate(config.minDate) || new Date('2015-1-31');
            config.maxDate = isDate(config.maxDate) || new Date('2020-12-31');
            /* Display of weekdays (1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names; default is 1)*/
            config.dayNamesLength = config.dayNamesLength || 1;

            $scope.selectedDate = getCalendarDateObject(config.defaultDate);

            $scope.weekDayNames = WEEKDAYS.map(function(name) {
                return name.slice(0, config.dayNamesLength)
            });

            $scope.$watch('events', function() {
                renderView($scope.selectedDate, true)
            }, true);
        })();
    }

})();