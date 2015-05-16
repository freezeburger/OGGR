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
            '<span ng-show="allowedPrevMonth()"><i class="ion-chevron-left"></i></span>' +
            '</div>' +
            '<b style="font-size: 16px;"><a>' +
            '<span>{{ selectedDate.month }}</span>' +
            '&nbsp;' +
            '<span>{{ selectedDate.year }}</span>' +
            '</a></b>' +
            '<div class="move-month next-month" ng-click="nextMonth()">' +
            '<span ng-show="allowedNextMonth()"><i class="ion-chevron-right"></i></span>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div ng-repeat="day in weekDays(options.dayNamesLength) track by $index" class="weekday">{{ day }}</div>' +
            '</div>' +
            '<div>' +
            '<div ng-repeat="week in weeks track by $index" class="week">' +
            '<div class="day"' +
            'ng-class="{default: isDefaultDate(date)|| isSelectedDate(date), event: date.events.length, disabled: date.disabled || !date}"' +
            'ng-repeat="date in week  track by $index"' +
            'ng-click="onClick(date)">' +
            '<div class="day-number">{{ date.day || "&nbsp;" }}' +
            //'<div class="event-title">{{ date.event.title || "&nbsp;" }}'+
            '<span class="badge badge-assertive" ng-if="date.events.length">{{ date.events.length }}</span></div>' +
            '</div>' +
            ' </div>' +
            '</div>' +
            '</div>' +
            '</div>',
        controller: ['$scope', function($scope) {

            var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var alculateWeeks, isAllowedDate, bindEvent;

            $scope.onClick = function(date) {
                if (!date || date.disabled) return;
                console.log(date)
                $scope.selectedDate = date;
                var eventName = (date.events) ? 'OGGR.Calendar.Events.CLICK' : 'OGGR.Calendar.Date.CLICK';
                $scope.$emit(eventName, date);
            };

            $scope.weekDays = function(size) {
                return WEEKDAYS.map(function(name) {
                    return name.slice(0, size)
                });
            };

            $scope.isDefaultDate = function(date) {
                if (!date) return;
                return date.year === $scope.options._defaultDate.getFullYear() &&
                    date.month === $scope.options._defaultDate.getMonth() &&
                    date.day === $scope.options._defaultDate.getDate()
            };

            $scope.isDefaultDate = function(date) {
                if (!date) return;
                return date.year === $scope.selectedDate.year &&
                    date.month === $scope.selectedDate.month &&
                    date.day === $scope.selectedDate.day
            };

            $scope.prevMonth = function() {
                if (!$scope.allowedPrevMonth()) {
                    return;
                }
                var currIndex = MONTHS.indexOf($scope.selectedDate.month);
                if (currIndex === 0) {
                    $scope.selectedDate.year -= 1;
                    $scope.selectedDate.month = MONTHS[11];
                } else {
                    $scope.selectedDate.month = MONTHS[currIndex - 1];
                }
                calculateWeeks();
            };

            $scope.nextMonth = function() {
                if (!$scope.allowedNextMonth()) {
                    return;
                }
                var currIndex = MONTHS.indexOf($scope.selectedDate.month);
                if (currIndex === 11) {
                    $scope.selectedDate.year += 1;
                    $scope.selectedDate.month = MONTHS[0];
                } else {
                    $scope.selectedDate.month = MONTHS[currIndex + 1];
                }
                calculateWeeks();
            };



            bindEvent = function(date) {
                if (!date || !$scope.events) {
                    return;
                }
                date.events = [];
                $scope.events.forEach(function(event) {
                    event.date = new Date(event.date);
                    if (date.year === event.date.getFullYear() && date.month === event.date.getMonth() && date.day === event.date.getDate()) {
                        date.events.push(event);
                    }
                });
            };

            function getCurrentDate(date) {
                if (getCurrentDate.dates[date]) return getCurrentDate.dates[date];
                return new Date([date.year, date.month + 1, date.day]);
            }
            getCurrentDate.dates = {};

            isAllowedDate = function(date) {
                if (!$scope.options.minDate && !$scope.options.maxDate) return true;

                var currentDate = getCurrentDate(date);
                if (currentDate < $scope.options.minDate) return false;
                if (currentDate > $scope.options.maxDate) return false;

                return true;
            };

            $scope.allowedPrevMonth = function() {
                var prevYear = null;
                var prevMonth = null;
                if (!$scope.options.minDate) {
                    return true;
                }
                var currMonth = MONTHS.indexOf($scope.selectedDate.month);
                if (currMonth === 0) {
                    prevYear = ($scope.selectedDate.year - 1);
                } else {
                    prevYear = $scope.selectedDate.year;
                }
                if (currMonth === 0) {
                    prevMonth = 11;
                } else {
                    prevMonth = (currMonth - 1);
                }
                if (prevYear < $scope.options.minDate.getFullYear()) {
                    return false;
                }
                if (prevYear === $scope.options.minDate.getFullYear()) {
                    if (prevMonth < $scope.options.minDate.getMonth()) {
                        return false;
                    }
                }
                return true;
            };

            $scope.allowedNextMonth = function() {
                var nextYear = null;
                var nextMonth = null;
                if (!$scope.options.maxDate) {
                    return true;
                }
                var currMonth = MONTHS.indexOf($scope.selectedDate.month);
                if (currMonth === 11) {
                    nextYear = ($scope.selectedDate.year + 1);
                } else {
                    nextYear = $scope.selectedDate.year;
                }
                if (currMonth === 11) {
                    nextMonth = 0;
                } else {
                    nextMonth = (currMonth + 1);
                }
                if (nextYear > $scope.options.maxDate.getFullYear()) {
                    return false;
                }
                if (nextYear === $scope.options.maxDate.getFullYear()) {
                    if (nextMonth > $scope.options.maxDate.getMonth()) {
                        return false;
                    }
                }
                return true;
            };

            calculateWeeks = function() {
                $scope.weeks = [];
                var week = null;
                var daysInCurrentMonth = new Date($scope.selectedDate.year, MONTHS.indexOf($scope.selectedDate.month) + 1, 0).getDate();
                //console.log($scope.selectedDate.month)

                for (var day = 1; day < daysInCurrentMonth + 1; day += 1) {
                    var dayNumber = new Date($scope.selectedDate.year, MONTHS.indexOf($scope.selectedDate.month), day).getDay();
                    week = week || [null, null, null, null, null, null, null];
                    week[dayNumber] = {
                        year: $scope.selectedDate.year,
                        month: MONTHS.indexOf($scope.selectedDate.month),
                        day: day
                    };

                    if (isAllowedDate(week[dayNumber])) {
                        if ($scope.events) {
                            bindEvent(week[dayNumber]);
                        }
                    } else {
                        week[dayNumber].disabled = true;
                    }

                    if (dayNumber === 6 || day === daysInCurrentMonth) {
                        $scope.weeks.push(week);
                        week = null;
                    }
                }
            };

            function getPrevNextDate(date) {
                //if (getPrevNextDate.periods[date]) return getPrevNextDate.periods[date];
                period = {
                    previous: getSelectedDate(date.getDate() - 1),
                    next: getSelectedDate(date.getDate() + 1),
                }
                //getPrevNextMonth.periods[date] = period;
                return period;
            }
            getPrevNextDate.periods = {};

            function getSelectedDate(date) {
              console.log(111,date)
                return {
                    date: date,
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate()
                }
            }

            function isDate (date) {
              return (date.getDate)?true:false;
            }

            var config = {};
            (function initCalendar() {
                config = angular.copy($scope.options) || {};

                config.defaultDate = isDate(config.defaultDate) || new Date();
                config.minDate = isDate(config.minDate) || new Date('2015-1-31');
                config.maxDate = isDate(config.maxDate) || new Date('2020-12-31');
                config.dayNamesLength = config.dayNamesLength || 1;

                $scope.selectedDate = getSelectedDate(config.defaultDate);

                console.log(12,getPrevNextDate(config.defaultDate))

                $scope.$watch('events', function() {
                    calculateWeeks();
                }, true);
            })();

        }]
    }
});