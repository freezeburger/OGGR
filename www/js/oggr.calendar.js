angular.module('oggr.calendar', []).directive('oggrCalendar', function() {
    return {
        restrict: 'E',
        scope: {
            options: '=',
            events: '='
        },
        template: '<div class="calendar">' +
            '<div class="current-month">' +
            '<div class="move-month prev-month" ng-click="prevMonth()">' +
            '<span ng-show="isAllowedPrevMonth()"><i class="ion-chevron-left"></i></span>' +
            '</div>' +
            '<b style="font-size: 16px;"><a>' +
            '<span>{{ selectedDate.titleMY }}</span>' +
            '</a></b>' +
            '<div class="move-month next-month" ng-click="nextMonth()">' +
            '<span ng-show="isAllowedNextMonth()"><i class="ion-chevron-right"></i></span>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div ng-repeat="day in ::weekDayNames track by $index" class="weekday">{{ ::day }}</div>' +
            '</div>' +
            '<div>' +
            '<div ng-repeat="week in weeks track by $index" class="week">' +
            '<div class="day"' +
            'ng-class="{default: isSelectedDate(date), event: date.events.length, disabled: date.disabled || !date}"' +
            'ng-repeat="date in week  track by $index"' +
            'ng-click="onClick(date)">' +
            '<div class="day-number">{{ date.day || "&nbsp;" }}' +
            '<span class="badge badge-assertive" ng-if="date.events.length">{{ date.events.length }}</span></div>' +
            '</div>' +
            ' </div>' +
            '</div>' +
            '</div>' +
            '</div>',
        controller: ['$scope', function($scope) {

            var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            $scope.onClick = function(date) {
                if (!date || date.disabled) return;
                $scope.selectedDate = date;
                var eventName = (date.events) ? 'OGGR.Calendar.Events.CLICK' : 'OGGR.Calendar.Date.CLICK';
                $scope.$emit(eventName, date);
            };

            $scope.isSlectedDate = function(date) {
                if (!date) return false;
                return date.year === $scope.selectedDate.year &&
                    date.month === $scope.selectedDate.month &&
                    date.day === $scope.selectedDate.day
            };

            $scope.prevMonth = function() {
                $scope.selectedDate = getPrevNextMonth($scope.selectedDate).previous;
                calculateCalendarMonth();
            };

            $scope.nextMonth = function() {
                $scope.selectedDate = getPrevNextMonth($scope.selectedDate).next;
                calculateCalendarMonth();
            };


            function isAllowedDate(calendarDateObject) {
                if (!config.minDate && !config.maxDate) return true;

                if (calendarDateObject.object < config.minDate) return false;
                if (calendarDateObject.object > config.maxDate) return false;

                return true;
            };

            $scope.isAllowedPrevMonth = function() {
                return true;
            };

            $scope.isAllowedNextMonth = function() {
                return true;
            };

            function getPrevNextMonth(date) {
                
                if (getPrevNextMonth.periods[date]) return getPrevNextMonth.periods[date];
                period = {
                    previous: getCalendarDateObject(new Date(date.year, date.month +1 , 0)),
                    next: getCalendarDateObject(new Date(date.year, date.month -1, 0)),
                }
                getPrevNextMonth.periods[date] = period;
                console.log(period)
                return period;
            }
            getPrevNextMonth.periods = {};

            function bindEvent(date,events) {
                if (!date || !events) return;

                date.events = [];

                events.forEach(function(event) {
                    if (date.title === event.date.toString().substring(0,15)) date.events.push(event);
                });
                
            };

            function calculateCalendarMonth() {
                $scope.weeks = [];
                var week = null;
                var daysInMonth = $scope.selectedDate.daysInMonth;

                for (var day = 1; day < daysInMonth + 1; day += 1) {

                    var dayDate = new Date($scope.selectedDate.year, $scope.selectedDate.month, day),
                        dayWeekNumber = dayDate.getDay();

                    week = week || [null, null, null, null, null, null, null];

                    week[dayWeekNumber] = getCalendarDateObject(dayDate)

                    if (isAllowedDate(week[dayWeekNumber])) {
                        if ($scope.events) bindEvent(week[dayWeekNumber],$scope.events);
                    } else {
                        week[dayWeekNumber].disabled = true;
                    }

                    if (dayWeekNumber === 6 || day === daysInMonth) {
                        $scope.weeks.push(week);
                        week = null;
                    }
                }
            };

            function getCalendarDateObject(date) {
                var day = date.getDate(),
                    month = date.getMonth(),
                    year = date.getFullYear();
                return {
                    title: date.toString().substring(0,15),
                    titleDMY: day + ' ' + MONTHS[month] + ' ' + year,
                    titleMY: MONTHS[month] + ' ' + year,
                    dateObject: date,
                    year: year,
                    month: month,
                    day: day,
                    daysInMonth: new Date(year, month + 1, 0).getDate()
                }
            }

            function isDate(date) {
                return (date.getDate) ? date : false;
            }

            var config = {};
            (function initCalendar() {

              console.log($scope.events)
                config = angular.copy($scope.options) || {};

                config.defaultDate = isDate(config.defaultDate) || new Date();
                config.minDate = isDate(config.minDate) || new Date('2015-1-31');
                config.maxDate = isDate(config.maxDate) || new Date('2020-12-31');
                config.dayNamesLength = config.dayNamesLength || 1;

                $scope.selectedDate = getCalendarDateObject(config.defaultDate);

                $scope.weekDayNames = WEEKDAYS.map(function(name) {
                    return name.slice(0, config.dayNamesLength)
                });

                $scope.$watch('events', function() {
                    calculateCalendarMonth();
                }, true);

            })();

        }]
    }
});