(function() {

    angular.module('app', [
        'app.core',
        'ionic', 
        'app.controllers',
        'app.routes',
        'app.calendar',
        'app.chat',
        'app.contacts',
        'app.crew',
        'app.dashboard',
        'app.files',
        'app.login',
        'app.map',
        'app.planning',
        'app.pulse',
        'app.reminder',
        'app.settings',
        'app.tasks'
        ])

    .run(function(CONFIG, $ionicPlatform, $rootScope, UI) {
        $rootScope.UI = UI;

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    });

})();
(function() {

    angular.module('app.controllers', [])

})();


(function() {

    angular.module('app.routes', [])

    .config(['CONFIG', '$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        // openFB.init({
        //     appId: '855624561176943' 
        // });

        $stateProvider

            .state('start', {
                url: "/start",
                abstract: true,
                templateUrl: CONFIG.paths.layouts + '/screen-start.html',
            })
            // setup abstracts states for the nested side-menu/tabs directive    
            .state('oggr', {
                url: "/o",
                abstract: true,
                templateUrl: CONFIG.paths.layouts + '/screen-main.html'
            })
            // Each tab has its own nav history stack:
            .state('oggr.tab', {
                url: "/tab",
                abstract: true,
                templateUrl: CONFIG.paths.layouts + '/screen-sub-tabs.html'
            })

        $urlRouterProvider.otherwise('/start/signin');
    }

})();

(function() {

    angular.module('core.config', [])

    .constant('CONFIG', configFactory())

    function configFactory() {
        return {
            version: '0.1.0',
            paths: {
                screens: 'app/modules',
                layouts: 'app/layout',
            },
            server : 'http://localhost:8100/',
        };
    }


})();
(function() {

    var moduleDependencies = [
        'core.config',
        'core.directives',
        'core.services',
        'core.debug'
    ];

    angular.module('app.core', moduleDependencies);

})();
(function() {

    var moduleDependencies = [];

    angular.module('core.debug', moduleDependencies)

    .factory('$exceptionHandler', function() {
        return function errorCatcherHandler(exception, cause) {
            console.error(exception.stack);
            exception.message += ' (caused by "' + cause + '")';
    		throw exception;
        };
    });

})();
(function() {

    var moduleDependencies=['oggr'];

    angular.module('core.directives', moduleDependencies)


})();
(function() {


    var moduleDependencies = [
        'firebase', //External
        'ui', 
        'calendar-events',
        'odb'
    ];

    angular.module('core.services', moduleDependencies);

})();
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
(function() {

    var moduleDependencies = [];

    angular.module('oggr.chat-message', moduleDependencies)

    .directive('oggrChatMessage', ['$ionicActionSheet', '$timeout', factory]);

    function factory($ionicActionSheet, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div><p ng-bind="message.content" ng-if="!isImage()"></p><img ng-if="isImage()" ng-src="{{message.content}}"></div>',
            link:linkFn,

        };
    }

    function linkFn(scope, iElement, iAttrs) {
        scope.isImage = function() {
            return /data:/.test(scope.message.content) || /http/.test(scope.message.content);
        }
    };

})();
(function() {

    var moduleDependencies = [];

    angular.module('oggr.hide-sub-header-on-scroll', moduleDependencies)

    .directive('oggrHideSubHeaderOnScroll', ['$timeout', factory]);

    function factory($timeout) {
        return {
            restrict: 'A',
            priority: 0,
            link: linkFn
        };
    };

    function linkFn($scope, $element, $attrs, ctrls, transcludeFn) {
        var start = 0;
        var threshold = 150;
        $scope.$parent.slideHeader = false;

        $element.addClass('will-hide-subheader');

        $element.bind('scroll', function(e) {
            var hidden = (e.detail.scrollTop - start > threshold);
            $timeout(function() {
                $scope.$parent.slideHeader = hidden;
                $element[(hidden) ? 'addClass' : 'removeClass']('subheader-hidden');
            }, 0)
        });
    };

})();
(function() {

    var moduleDependencies = [
        'oggr.chat-message',
        'oggr.hide-sub-header-on-scroll',
        'oggr.on-pull-down',
        'oggr.zoomable'
    ];

    angular.module('oggr', moduleDependencies);

})();
(function() {

    var moduleDependencies = [];

    angular.module('oggr.on-pull-down', moduleDependencies)

    .directive('oggrOnPullDown', ['$compile', factory])

    function factory($compile) {
        return {
            restrict: 'A',
            require: ['?^$ionicScroll'], //^ ^^ ?^ ?^^
            priority: 1000,
            compile: compileFn
        };
    };

    function compileFn(tElement, tAttrs, transcludeFn) {

        tElement.addClass('oggr').addClass('bar-subheader');
        tAttrs.$set('name', '{{UI.labels[UI.lang].nav.calendar}}');
        tElement.attr('ng-click', 'toggle()');

        return linkFn;
    };

    function linkFn($scope, $element, $attrs, ctrls, transcludeFn) {

        console.log('link', ctrls)

        $scope.toggle = function(argument) {
            console.log('toggle')
        }

        $element.removeAttr('oggr-on-pull-down');
        $compile($element)($scope);

        var start = 0;
        var threshold = 150;

        ctrls[0].$element.bind('scroll', function(e) {
            console.log('scroll')
            if (e.detail.scrollTop - start > threshold) {
                $element.addClass('bar-subheader-slide-away');
            } else {
                $element.removeClass('bar-subheader-slide-away');
            }
            if (slideHeaderPrevious >= e.detail.scrollTop - start) {
                $element.removeClass('bar-subheader-slide-away');
            }
            var slideHeaderPrevious = e.detail.scrollTop - start;
        });

    };

})();
(function() {

    var moduleDependencies = [];

    angular.module('oggr.zoomable', moduleDependencies)

    .directive('oggrZoomable', [factory]);

    function factory() {
        return {
            restrict: 'A',
            link: linkFn
        };
    };

    function linkFn(scope, iElement, iAttrs) {};

})();
(function() {

    var moduleDependencies = [];

    angular.module('calendar-events', moduleDependencies)

    .factory('CalendarEvents', ['CONFIG', factory]);

    function factory(CONFIG) {

        // Some fake testing data
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'app/core/data/calendar-events.json', false);//CONFIG.server + 
        xhr.send();

        var fakeData = JSON.parse(xhr.responseText);

        var events = fakeData;

        var CalendarEvents = {
            all: all,
            remove: remove,
            get: get
        };

        return CalendarEvents;

        function all() {
            return events;
        };

        function remove(event) {
            events.splice(events.indexOf(event), 1);
        };

        function get(eventId) {
            for (var i = 0; i < events.length; i++) {
                if (events[i].id === parseInt(eventId)) {
                    return events[i];
                }
            }
            return null;
        };
    };

})();

(function() {

    var moduleDependencies = ['firebase'];

    angular.module('odb', moduleDependencies)

    .service('ODB', ['CONFIG', '$q', Constructor]);

    var baseRef = 'http://oggr.firebaseio.com/';
    var $injector = angular.injector();

    
    /**
     * [Constructor ODB handle DTO from Firebase]
     * @param {[service]} CONFIG [Global configuration]
     * @param {[service]} $q     [Native Angular Promise API]
     */
    function Constructor(CONFIG, $q) {
        Constructor.ODB = this;
        this.$q = $q;
    };

    /**
     * User Mangement 
     * @return {user}               
     * [ A user Object wrapper for user management function ]
     */
    Constructor.prototype.user = (function() {
        var ref = new Firebase(baseRef);

        return {
            current: {},
            connect: function(user) {
                return setConnection(user, 'authWithPassword');
            },
            disconnect: function() {
                ref.unAuth();
            },
            register: function(user) {
                return setConnection(user, 'createUser');
            }
        }

        function setConnection(user, mode) {
            mode = mode || 'createUser';

            var defer = Constructor.ODB.$q.defer()
            ref[mode](user, function(error, data) {
                if (error) {
                    defer.reject(error);
                    console.log(mode + " Failed!", error);
                } else {
                    Constructor.ODB.user.current = data;
                    defer.resolve(data);
                    console.log(mode + " successfully with payload:", data);
                }
            });
            return defer.promise;
        };

    })();

})();

(function() {

    var moduleDependencies = [];

    angular.module('ui', moduleDependencies)

    .service('UI', ['CONFIG', constructor]);

    function constructor(CONFIG) {

        //TODO of course remove;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'app/core/data/ui.labels.json', false);//CONFIG.server + 
        //xhr.open('GET', 'app/core/data/ui.labels.json', false);
        xhr.send();

        var labels = JSON.parse(xhr.responseText);

        //var labels = {};

        this.lang = DEFAULT_LANGUAGE;
        this.languages = languages;
        this.labels = labels;
    };

    var DEFAULT_LANGUAGE = 'en' ;

    var languages = [{
        name: 'Français',
        code: 'fr'
    }, {
        name: 'English',
        code: 'en'
    }, {
        name: 'Spanish',
        code: 'es'
    }, {
        name: 'Chinese',
        code: 'cn'
    }, {
        name: 'Russian',
        code: 'ru'
    }];

})();

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
(function() {

    angular.module('calendar.services', []);

    

})();
(function() {

    var moduleDependencies = ['firebase'];

    angular.module('chat-room', moduleDependencies)

    .factory('ChatRoom', ['$firebaseArray', factory]);

    function factory($firebaseArray) {
        var messagesRef = new Firebase('https://oggr.firebaseio.com/messages'),
            messagesFBA = $firebaseArray(messagesRef.limitToLast(15)),
            messageIter = 0;

        return {
            create: createRoom
        };

        function createRoom(contactId, id) {
            var id = id;

            var room = Object.create({}, {
                id: {
                    writable: true,
                    configurable: true,
                    value: id
                },
                data: {
                    writable: true,
                    configurable: true,
                    value: [createMessage()]
                },
                contacts: {
                    writable: true,
                    configurable: true,
                    value: [contactId]
                },
                messages: {
                    configurable: false,
                    get: function() {
                        return messagesFBA.$loaded()
                    },
                    set: function(msg) {
                        //Keep for initializing
                    }
                },
                nextMessage: {
                    configurable: false,
                    set: function(msg) {
                        messagesFBA.$add(createMessage(msg));
                    }
                },
                previousMessage: {
                    configurable: false,
                    set: function(msg) {
                        this.data.unshift(createMessage(msg));
                    }
                },
                lastMessage: {
                    configurable: false,
                    get: function() {
                        return this.data[this.data.length - 1].content;
                    }
                },

            });

            room.deleteMessage = function(msg) {
                this.data.splice(this.data.indexOf(msg), 1);
            }
            return room;
        };

    };

    function createMessage(msg) {
        if (msg) return {
            content: msg
        };
        return false;
    }

})();
(function(){

    var moduleDependencies = ['chat.services','chat.controllers','chat.routes'];
    
	angular.module('app.chat', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('chat.controllers', moduleDependencies)

    .controller('ChatsCtrl', function($scope, Chats, Contacts) {
        $scope.chats = Chats.all();

        //Move into Room object
        $scope.getUser = function(chat) {
            return Contacts.get(chat.contacts[0])
        }

        $scope.remove = function(chat) {
            Chats.remove(chat);
        }

    })

    .controller('ChatsDetailCtrl', function($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout, Contacts, $state) {

        if (!Chats.get($stateParams.chatId)) return $state.go('oggr.tab.chats');

        var chatRoom = Chats.get($stateParams.chatId);


        $ionicScrollDelegate.resize();

        chatRoom.messages.then(function(roomMessages) {
                $scope.$watchCollection('messages', function(newNames, oldNames) {
                    $timeout(function() {
                        $ionicScrollDelegate.$getByHandle('chat').scrollBottom(true);
                    }, 500, false);
                });
                $scope.messages = roomMessages; // true
            })
            .catch(function(error) {
                console.log("Error:", error);
            });

        $scope.chatRoomName = Contacts.get(chatRoom.contacts[0]).name

        $scope.add = function() {
            chatRoom.nextMessage = $scope.message;
            $scope.message = '';
        };

        $scope.searchMessage = function() {
            console.log('search')
        };

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop(true);
        };

        $scope.scrollDown = function() {
            $ionicScrollDelegate.scrollBottom(true);
        };

        $scope.doRefresh = function() {
            for (var i = 0, m = Math.floor(Math.random() * 15); i < m; i++) {
                chatRoom.previousMessage = Math.random();
            };
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.getActions = function() {
            var message = this.message;

            /* Show the action sheet */
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    id: 1,
                    text: '<b>Copy</b> message'
                }, {
                    id: 2,
                    text: 'Repeat'
                }],
                destructiveText: 'Delete',
                titleText: 'Select you action',
                cancelText: 'Cancel',
                cancel: function() {
                    return true;
                },
                buttonClicked: function(index, button) {
                    if (button.id === 1) $scope.message = message.content;
                    if (button.id === 2) chatRoom.nextMessage = message.content;
                    $ionicScrollDelegate.scrollBottom(true);
                    return true;
                },
                destructiveButtonClicked: function() {
                    chatRoom.deleteMessage(message);
                    return true;
                }
            });

            $timeout(function() {
                hideSheet();
            }, 3000);

        };
    })


})();

(function(){

    var moduleDependencies = [];
	angular.module('chat.routes', moduleDependencies )

	.config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

    	$stateProvider
    	    .state('oggr.tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: CONFIG.paths.screens + '/chat/chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('oggr.tab.chats-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: CONFIG.paths.screens + '/chat/chats-detail.html',
                        controller: 'ChatsDetailCtrl'
                    }
                }
            });

    }


})();
(function(){

    var moduleDependencies = ['chat-room','app.contacts'];

    angular.module('chat.services', moduleDependencies)

    .factory('Chats', ['Contacts','ChatRoom',factory]);

    function factory(Contacts, ChatRoom) {

        var chats = [];
        //TODO remove
        chats.push(ChatRoom.create(2, chats.length))
        chats.push(ChatRoom.create(3, chats.length))

        var Chats = {
            all: function() {
                return chats;
            },
            get: function(chatId) {
                return chats[chatId];
            },
            remove: function(chat) {
                return chats.splice(chats.indexOf(chat), 1);
            },
            create: function(contactId) {
                chats.push(ChatRoom.create(contactId));
                return true;
            }
        };
        return Chats;
    };


})();
(function(){

    var moduleDependencies = ['contacts.services','contacts.controllers','contacts.routes'];
	
	angular.module('app.contacts', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('contacts.controllers', moduleDependencies)

    .controller('ContactsCtrl', function($scope, Contacts) {
        $scope.contacts = Contacts.all();
        $scope.remove = function(contact) {
            Contacts.remove(contact);
        }
    })

    .controller('ContactsDetailCtrl', function($scope, $stateParams, Contacts) {
        $scope.contact = Contacts.get($stateParams.contactId);
    })


})();

(function() {

    var moduleDependencies = [];
    angular.module('contacts.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.contacts', {
                url: '/contacts',
                views: {
                    'tab-contacts': {
                        templateUrl: CONFIG.paths.screens + '/contacts/contacts.html',
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('oggr.tab.contacts-detail', {
                url: '/contacts/:contactId',
                views: {
                    'tab-contacts': {
                        templateUrl: CONFIG.paths.screens + '/contacts/contacts-detail.html',
                        controller: 'ContactsDetailCtrl'
                    }
                }
            })


    }


})();

(function() {

    var moduleDependencies = [];

    angular.module('contacts.services', moduleDependencies)

    .factory('Contacts', [factory]);

    function factory() {
        var contacts = fakeData

        var Contacts = {
            all: all,
            remove: remove,
            get: get
        };

        return Contacts;

        function all() {
            return contacts;
        };

        function remove(contact) {
            contacts.splice(contacts.indexOf(contact), 1);
        };

        function get(contactId) {
            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i].id === parseInt(contactId)) {
                    return contacts[i];
                }
            }
            return null;
        };
    };
    // Some fake testing data
    var fakeData = [{
        id: 0,
        name: 'Ludwig Toczek',
        title: 'Lead Architect',
        email: 'renaud.dubuis@oggr.io',
        phone: '+971 (0)5 57 08 08 89',
        face: 'https://scontent-sin.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/168180_485824402701_4783114_n.jpg?oh=5b0be9d4492dca623aa4db8bf3c58c5a&oe=56036982'
    }, {
        id: 1,
        name: 'Renaud Dubuis',
        title: 'Lead Architect',
        email: 'renaud.dubuis@oggr.io',
        phone: '+971 (0)5 57 08 08 89',
        face: 'https://scontent-sin.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/68946_10154630841865643_1183282455237224596_n.jpg?oh=4b7cc233aa1001f37d63f4042224aa35&oe=55C94E61'
    }, {
        id: 2,
        name: 'Zoé Gourdon',
        title: 'Serial Shopper',
        email: 'zoe.gourdon@oggr.io',
        phone: '+971 (0)5 57 08 08 89',
        face: 'data:image/jpeg;base64,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'
    }, {
        id: 3,
        name: 'Adam Bradleyson',
        title: 'Random User',
        email: 'renaud.dubuis@decryptage.net',
        phone: '+971 (0)5 57 08 08 89',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 4,
        name: 'Ben Sparrow',
        title: 'Pirate',
        email: 'r.dubuis@free.fr',
        phone: '+971 (0)5 57 08 08 89',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }, {
        id: 5,
        name: 'Mike Harrington',
        title: 'Cool Dude',
        email: 'zoe.gourdon@oggr.io',
        phone: '+971 (0)5 57 08 08 89',
        face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

    //TODO remove
    fakeData.forEach(function(element, index) {
        fakeData.push(angular.copy(element))
    });


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('crew.controllers', moduleDependencies )


})();
(function(){

    var moduleDependencies = ['crew.services','crew.controllers','crew.routes'];
	
	angular.module('app.crew', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];
    angular.module('crew.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.crew', {
                url: '/crew',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/crew/crew.html',
                    }
                }
            })


    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('crew.services', moduleDependencies )


})();
(function(){

    var moduleDependencies = [];
	
	angular.module('dashboard.controllers', moduleDependencies )

	.controller('DashCtrl', function($scope, $http) {
        $scope.doRefresh = function() {
            $scope.items.push(Math.random())
            $http.get('/new-items')
                .success(function(newItems) {
                    //
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    })


})();
(function(){

    var moduleDependencies = ['dashboard.services','dashboard.controllers','dashboard.routes'];
	
	angular.module('app.dashboard', moduleDependencies )


})();
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

(function(){

    var moduleDependencies = [];
	
	angular.module('dashboard.services', moduleDependencies )


})();
(function(){

    var moduleDependencies = [];
	
	angular.module('files.controllers', moduleDependencies )


})();
(function(){

    var moduleDependencies = ['files.services','files.controllers','files.routes'];
	
	angular.module('app.files', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];
    angular.module('files.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.files', {
                url: '/files',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/files/files.html',
                    }
                }
            })

    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('files.services', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('login.controllers', moduleDependencies)

    .controller('LoginCtrl', ['$scope','$state','$timeout','ODB', LoginCtrl])

    function LoginCtrl($scope, $state, $timeout, ODB) {

        var user ={
            email:'renaud.dubuis@decryptage.net',
            password:''
        };
        shakeReset();
        
        $scope.signIn = function() {ODB.user.connect($scope.user).then(redirect,shakeReset)};

        $scope.signUp = function() {ODB.user.register($scope.user).then(redirect,shakeReset)};

        /*$scope.fbLogin = function() {
            openFB.login(
                function(response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        console.log(response);
                        $state.go('oggr.tab.dashboard');
                    } else {
                        alert('Facebook login failed');
                    }
                }, {
                    scope: 'email,publish_actions,user_friends'
                });
        };*/

        function redirect(){
            $state.go('oggr.tab.dashboard');
        }

        function shakeReset(){
            $timeout(function(){
                $scope.shake = false;
                $scope.user = angular.copy(user);
                $scope.$apply();
            },500);
            $scope.shake = true;
        }
    }


})();

(function(){

    var moduleDependencies = ['login.services','login.controllers','login.routes'];
	
	angular.module('app.login', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];
    angular.module('login.routes', moduleDependencies)

    .config(['CONFIG', '$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('start.signin', {
                url: "/signin",
                abstract: false,
                templateUrl: CONFIG.paths.screens + '/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('start.forgot', {
                url: "/forgot",
                abstract: false,
                templateUrl: CONFIG.paths.screens + '/login/forgot.html'
            })


    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('login.services', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('map.controllers', moduleDependencies)

    .controller('MapCtrl', function($scope, $ionicLoading, $compile) {
        function initialize() {
            var myLatlng = new google.maps.LatLng(43.07493, -89.381388);


            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                style: mapStyles
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            map.setOptions({
                styles: mapStyles
            });

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            $scope.map = map;
        };
        initialize();

        $scope.centerOnMe = function() {
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function() {
            alert('Example of infowindow with ng-click')
        };

    });


})();

var mapStyles = [{
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "road.arterial",
    "stylers": [{
        "hue": 149
    }, {
        "saturation": -78
    }, {
        "lightness": 0
    }]
}, {
    "featureType": "road.highway",
    "stylers": [{
        "hue": -45
    }, {
        "saturation": -20
    }, {
        "lightness": 2.8
    }]
}, {
    "featureType": "poi",
    "elementType": "label",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "landscape",
    "stylers": [{
        "hue": 163
    }, {
        "saturation": -26
    }, {
        "lightness": -1.1
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "water",
    "stylers": [{
        "hue": 3
    }, {
        "saturation": -24.24
    }, {
        "lightness": -18.57
    }]
}];

(function() {

    var moduleDependencies = ['map.services','map.controllers','map.routes'];
    
    angular.module('app.map', moduleDependencies)

    


})();

(function() {

    var moduleDependencies = [];
    angular.module('map.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('oggr.tab.map', {
                url: '/map',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/map/map.html',
                        controller: 'MapCtrl'
                    }
                }
            })

    }




})();

(function(){

    var moduleDependencies = [];
	
	angular.module('map.services', moduleDependencies )


})();
(function(){

    var moduleDependencies = [];
	
	angular.module('planning.controllers', moduleDependencies )


})();
(function() {

    var moduleDependencies = ['planning.services','planning.controllers','planning.routes'];

    angular.module('app.planning', moduleDependencies)




})();

(function() {

    var moduleDependencies = [];
    angular.module('planning.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('oggr.tab.planning', {
                url: '/planning',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/planning/planning.html',
                    }
                }
            })

    }




})();

(function(){

    var moduleDependencies = [];
	
	angular.module('planning.services', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('pulse.controllers', moduleDependencies)

    .controller('PulseCtrl', function($scope) {

        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');

        };
    })


})();

(function(){

    var moduleDependencies = ['pulse.services','pulse.controllers','pulse.routes'];
	
	angular.module('app.pulse', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('pulse.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.pulse', {
                url: '/pulse',
                views: {
                    'tab-pulse': {
                        templateUrl: CONFIG.paths.screens + '/pulse/pulse.html',
                        controller: 'PulseCtrl'
                    }
                }
            })


    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('pulse.services', moduleDependencies )


})();
(function(){

    var moduleDependencies = [];
	
	angular.module('reminder.controllers', moduleDependencies )


})();
(function(){

    var moduleDependencies = ['reminder.services','reminder.controllers','reminder.routes'];
	
	angular.module('app.reminder', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];
    angular.module('reminder.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.reminder', {
                url: '/reminder',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/reminder/reminder.html',
                    }
                }
            })


    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('reminder.services', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];

    angular.module('settings.controllers', moduleDependencies)

    .controller('LanguageCtrl', function($scope, $ionicHistory) {
        $scope.close = function() {
            console.log($ionicHistory.viewHistory());
            //TODO not working
            $ionicHistory.goBack();
        }
    })

    .controller('ProfileCtrl', function($scope, $stateParams, Contacts) {
        $scope.profile = {}

        function getList(user) {
            openFB.api({
                path: '/me/taggable_friends',
                success: function(data) {
                    console.log(data)
                },
                error: function(error) {
                    alert('Facebook error: ' + error.error_description);
                }
            });
        }


        openFB.api({
            path: '/me',
            params: {
                fields: 'id,name,email'
            },
            success: function(user) {
                console.log(user)
                getList(user);
                $scope.$apply(function() {
                    $scope.profile.user = user;
                });
            },
            error: function(error) {
                alert('Facebook error: ' + error.error_description);
            }
        });
    })


})();

(function() {

    var moduleDependencies = [];
    angular.module('settings.routes', moduleDependencies)

    .config(['CONFIG','$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.language', {
                url: '/language',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/settings/language.html',
                        controller: 'LanguageCtrl'
                    }
                }
            })
            .state('oggr.tab.profile', {
                url: '/profile',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/settings/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('settings.services', moduleDependencies )


})();
(function(){

    var moduleDependencies = ['settings.services','settings.controllers','settings.routes'];
	
	angular.module('app.settings', moduleDependencies )


})();
(function(){

    var moduleDependencies = [];
	
	angular.module('tasks.controllers', moduleDependencies )


})();
(function() {

    var moduleDependencies = [];
    angular.module('tasks.routes', moduleDependencies)

    .config(['CONFIG', '$stateProvider', '$urlRouterProvider', configFn]);

    function configFn(CONFIG, $stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('oggr.tab.taskManager', {
                url: '/taskManager',
                views: {
                    'out-of-tabs': {
                        templateUrl: CONFIG.paths.screens + '/tasks/tasks.html',
                    }
                }
            })
    }


})();

(function(){

    var moduleDependencies = [];
	
	angular.module('tasks.services', moduleDependencies )


})();
(function(){

    var moduleDependencies = ['tasks.services','tasks.controllers','tasks.routes'];
	
	angular.module('app.tasks', moduleDependencies )


})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwicm91dGVzLmpzIiwiY29yZS9jb25maWcuanMiLCJjb3JlL2NvcmUuanMiLCJjb3JlL2RlYnVnLmpzIiwiY29yZS9kaXJlY3RpdmVzLmpzIiwiY29yZS9zZXJ2aWNlcy5qcyIsImNvbXBvbmVudHMvZXZlbnQtY2FsZW5kYXIvZXZlbnQtY2FsZW5kYXIuY29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvZXZlbnQtY2FsZW5kYXIvZXZlbnQtY2FsZW5kYXIuanMiLCJjb3JlL2RpcmVjdGl2ZXMvb2dnci5jaGF0LW1lc3NhZ2UuanMiLCJjb3JlL2RpcmVjdGl2ZXMvb2dnci5oaWRlLXN1Yi1oZWFkZXItb24tc2Nyb2xsLmpzIiwiY29yZS9kaXJlY3RpdmVzL29nZ3IuanMiLCJjb3JlL2RpcmVjdGl2ZXMvb2dnci5vbi1wdWxsLWRvd24uanMiLCJjb3JlL2RpcmVjdGl2ZXMvb2dnci56b29tYWJsZS5qcyIsImNvcmUvc2VydmljZXMvY2FsZW5kYXItZXZlbnRzLmpzIiwiY29yZS9zZXJ2aWNlcy9vZGIuanMiLCJjb3JlL3NlcnZpY2VzL3VpLmpzIiwibW9kdWxlcy9jYWxlbmRhci9jYWxlbmRhci5qcyIsIm1vZHVsZXMvY2FsZW5kYXIvY29udHJvbGxlcnMuanMiLCJtb2R1bGVzL2NhbGVuZGFyL3NlcnZpY2VzLmpzIiwibW9kdWxlcy9jaGF0L2NoYXQtcm9vbS5zZXJ2aWNlcy5qcyIsIm1vZHVsZXMvY2hhdC9jaGF0LmpzIiwibW9kdWxlcy9jaGF0L2NvbnRyb2xsZXJzLmpzIiwibW9kdWxlcy9jaGF0L3JvdXRlcy5qcyIsIm1vZHVsZXMvY2hhdC9zZXJ2aWNlcy5qcyIsIm1vZHVsZXMvY29udGFjdHMvY29udGFjdHMuanMiLCJtb2R1bGVzL2NvbnRhY3RzL2NvbnRyb2xsZXJzLmpzIiwibW9kdWxlcy9jb250YWN0cy9yb3V0ZXMuanMiLCJtb2R1bGVzL2NvbnRhY3RzL3NlcnZpY2VzLmpzIiwibW9kdWxlcy9jcmV3L2NvbnRyb2xsZXJzLmpzIiwibW9kdWxlcy9jcmV3L2NyZXcuanMiLCJtb2R1bGVzL2NyZXcvcm91dGVzLmpzIiwibW9kdWxlcy9jcmV3L3NlcnZpY2VzLmpzIiwibW9kdWxlcy9kYXNoYm9hcmQvY29udHJvbGxlcnMuanMiLCJtb2R1bGVzL2Rhc2hib2FyZC9kYXNoYm9hcmQuanMiLCJtb2R1bGVzL2Rhc2hib2FyZC9yb3V0ZXMuanMiLCJtb2R1bGVzL2Rhc2hib2FyZC9zZXJ2aWNlcy5qcyIsIm1vZHVsZXMvZmlsZXMvY29udHJvbGxlcnMuanMiLCJtb2R1bGVzL2ZpbGVzL2ZpbGVzLmpzIiwibW9kdWxlcy9maWxlcy9yb3V0ZXMuanMiLCJtb2R1bGVzL2ZpbGVzL3NlcnZpY2VzLmpzIiwibW9kdWxlcy9sb2dpbi9jb250cm9sbGVycy5qcyIsIm1vZHVsZXMvbG9naW4vbG9naW4uanMiLCJtb2R1bGVzL2xvZ2luL3JvdXRlcy5qcyIsIm1vZHVsZXMvbG9naW4vc2VydmljZXMuanMiLCJtb2R1bGVzL21hcC9jb250cm9sbGVycy5qcyIsIm1vZHVsZXMvbWFwL21hcC5qcyIsIm1vZHVsZXMvbWFwL3JvdXRlcy5qcyIsIm1vZHVsZXMvbWFwL3NlcnZpY2VzLmpzIiwibW9kdWxlcy9wbGFubmluZy9jb250cm9sbGVycy5qcyIsIm1vZHVsZXMvcGxhbm5pbmcvcGxhbm5pbmcuanMiLCJtb2R1bGVzL3BsYW5uaW5nL3JvdXRlcy5qcyIsIm1vZHVsZXMvcGxhbm5pbmcvc2VydmljZXMuanMiLCJtb2R1bGVzL3B1bHNlL2NvbnRyb2xsZXJzLmpzIiwibW9kdWxlcy9wdWxzZS9wdWxzZS5qcyIsIm1vZHVsZXMvcHVsc2Uvcm91dGVzLmpzIiwibW9kdWxlcy9wdWxzZS9zZXJ2aWNlcy5qcyIsIm1vZHVsZXMvcmVtaW5kZXIvY29udHJvbGxlcnMuanMiLCJtb2R1bGVzL3JlbWluZGVyL3JlbWluZGVyLmpzIiwibW9kdWxlcy9yZW1pbmRlci9yb3V0ZXMuanMiLCJtb2R1bGVzL3JlbWluZGVyL3NlcnZpY2VzLmpzIiwibW9kdWxlcy9zZXR0aW5ncy9jb250cm9sbGVycy5qcyIsIm1vZHVsZXMvc2V0dGluZ3Mvcm91dGVzLmpzIiwibW9kdWxlcy9zZXR0aW5ncy9zZXJ2aWNlcy5qcyIsIm1vZHVsZXMvc2V0dGluZ3Mvc2V0dGluZ3MuanMiLCJtb2R1bGVzL3Rhc2tzL2NvbnRyb2xsZXJzLmpzIiwibW9kdWxlcy90YXNrcy9yb3V0ZXMuanMiLCJtb2R1bGVzL3Rhc2tzL3NlcnZpY2VzLmpzIiwibW9kdWxlcy90YXNrcy90YXNrcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICdhcHAuY29yZScsXG4gICAgICAgICdpb25pYycsIFxuICAgICAgICAnYXBwLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5yb3V0ZXMnLFxuICAgICAgICAnYXBwLmNhbGVuZGFyJyxcbiAgICAgICAgJ2FwcC5jaGF0JyxcbiAgICAgICAgJ2FwcC5jb250YWN0cycsXG4gICAgICAgICdhcHAuY3JldycsXG4gICAgICAgICdhcHAuZGFzaGJvYXJkJyxcbiAgICAgICAgJ2FwcC5maWxlcycsXG4gICAgICAgICdhcHAubG9naW4nLFxuICAgICAgICAnYXBwLm1hcCcsXG4gICAgICAgICdhcHAucGxhbm5pbmcnLFxuICAgICAgICAnYXBwLnB1bHNlJyxcbiAgICAgICAgJ2FwcC5yZW1pbmRlcicsXG4gICAgICAgICdhcHAuc2V0dGluZ3MnLFxuICAgICAgICAnYXBwLnRhc2tzJ1xuICAgICAgICBdKVxuXG4gICAgLnJ1bihmdW5jdGlvbihDT05GSUcsICRpb25pY1BsYXRmb3JtLCAkcm9vdFNjb3BlLCBVSSkge1xuICAgICAgICAkcm9vdFNjb3BlLlVJID0gVUk7XG5cbiAgICAgICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkIGZvciBmb3JtIGlucHV0cylcbiAgICAgICAgICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgICAgICAgICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbXSlcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5yb3V0ZXMnLCBbXSlcblxuICAgIC5jb25maWcoWydDT05GSUcnLCAnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgY29uZmlnRm5dKTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0ZuKENPTkZJRywgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gICAgICAgIC8vIG9wZW5GQi5pbml0KHtcbiAgICAgICAgLy8gICAgIGFwcElkOiAnODU1NjI0NTYxMTc2OTQzJyBcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcblxuICAgICAgICAgICAgLnN0YXRlKCdzdGFydCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3N0YXJ0XCIsXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5sYXlvdXRzICsgJy9zY3JlZW4tc3RhcnQuaHRtbCcsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gc2V0dXAgYWJzdHJhY3RzIHN0YXRlcyBmb3IgdGhlIG5lc3RlZCBzaWRlLW1lbnUvdGFicyBkaXJlY3RpdmUgICAgXG4gICAgICAgICAgICAuc3RhdGUoJ29nZ3InLCB7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9vXCIsXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5sYXlvdXRzICsgJy9zY3JlZW4tbWFpbi5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuICAgICAgICAgICAgLnN0YXRlKCdvZ2dyLnRhYicsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3RhYlwiLFxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDT05GSUcucGF0aHMubGF5b3V0cyArICcvc2NyZWVuLXN1Yi10YWJzLmh0bWwnXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zdGFydC9zaWduaW4nKTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29yZS5jb25maWcnLCBbXSlcblxuICAgIC5jb25zdGFudCgnQ09ORklHJywgY29uZmlnRmFjdG9yeSgpKVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRmFjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZlcnNpb246ICcwLjEuMCcsXG4gICAgICAgICAgICBwYXRoczoge1xuICAgICAgICAgICAgICAgIHNjcmVlbnM6ICdhcHAvbW9kdWxlcycsXG4gICAgICAgICAgICAgICAgbGF5b3V0czogJ2FwcC9sYXlvdXQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcnZlciA6ICdodHRwOi8vbG9jYWxob3N0OjgxMDAvJyxcbiAgICAgICAgfTtcbiAgICB9XG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAnY29yZS5jb25maWcnLFxuICAgICAgICAnY29yZS5kaXJlY3RpdmVzJyxcbiAgICAgICAgJ2NvcmUuc2VydmljZXMnLFxuICAgICAgICAnY29yZS5kZWJ1ZydcbiAgICBdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5jb3JlJywgbW9kdWxlRGVwZW5kZW5jaWVzKTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29yZS5kZWJ1ZycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5mYWN0b3J5KCckZXhjZXB0aW9uSGFuZGxlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZXJyb3JDYXRjaGVySGFuZGxlcihleGNlcHRpb24sIGNhdXNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGV4Y2VwdGlvbi5zdGFjayk7XG4gICAgICAgICAgICBleGNlcHRpb24ubWVzc2FnZSArPSAnIChjYXVzZWQgYnkgXCInICsgY2F1c2UgKyAnXCIpJztcbiAgICBcdFx0dGhyb3cgZXhjZXB0aW9uO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXM9WydvZ2dyJ107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29yZS5kaXJlY3RpdmVzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAnZmlyZWJhc2UnLCAvL0V4dGVybmFsXG4gICAgICAgICd1aScsIFxuICAgICAgICAnY2FsZW5kYXItZXZlbnRzJyxcbiAgICAgICAgJ29kYidcbiAgICBdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2NvcmUuc2VydmljZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdldmVudC1jYWxlbmRhci5jb250cm9sbGVyJyxbXSlcblxuICAgIC5jb250cm9sbGVyKCdFdmVudENhbGVuZGFyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgRXZlbnRDYWxlbmRhckNvbnRyb2xsZXJdKVxuICAgIFxuICAgIEV2ZW50Q2FsZW5kYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xuXG4gICAgZnVuY3Rpb24gRXZlbnRDYWxlbmRhckNvbnRyb2xsZXIoJHNjb3BlKSB7XG4gICAgICAgIC8qIGluaXQgZnVuY3Rpb24gYXQgdGhlIGVuZCAqL1xuICAgICAgICB2YXIgTU9OVEhTID0gWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ10sXG4gICAgICAgICAgICBXRUVLREFZUyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXSxcbiAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xuXG4gICAgICAgICRzY29wZS5vbkNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZGF0ZSB8fCB0aGlzLmRhdGUuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZERhdGUgPSB0aGlzLmRhdGU7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gKHRoaXMuZGF0ZS5ldmVudHMpID8gJ09HR1IuQ2FsZW5kYXIuRXZlbnRzLkNMSUNLJyA6ICdPR0dSLkNhbGVuZGFyLkRhdGUuQ0xJQ0snO1xuICAgICAgICAgICAgJHNjb3BlLiRlbWl0KGV2ZW50TmFtZSwgdGhpcy5kYXRlKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUucHJldk1vbnRoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZW5kZXJWaWV3KGNvbmZpZy52aWV3LnBlcmlvZC5wcmV2aW91cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm5leHRNb250aCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVuZGVyVmlldyhjb25maWcudmlldy5wZXJpb2QubmV4dClcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaXNBbGxvd2VkUHJldk1vbnRoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBbGxvd2VkRGF0ZShjb25maWcudmlldy5wZXJpb2QucHJldmlvdXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0FsbG93ZWROZXh0TW9udGggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0FsbG93ZWREYXRlKGNvbmZpZy52aWV3LnBlcmlvZC5uZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBpc0FsbG93ZWREYXRlKGNhbGVuZGFyRGF0ZU9iamVjdCkge1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBjYWxlbmRhckRhdGVPYmplY3QubmF0aXZlRGF0ZU9iamVjdDtcbiAgICAgICAgICAgIGlmIChkYXRlIDwgY29uZmlnLm1pbkRhdGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChkYXRlID4gY29uZmlnLm1heERhdGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFByZXZOZXh0TW9udGgoY2FsZW5kYXJEYXRlT2JqZWN0KSB7XG4gICAgICAgICAgICB2YXIgeSA9IGNhbGVuZGFyRGF0ZU9iamVjdC55ZWFyXG4gICAgICAgICAgICBtID0gY2FsZW5kYXJEYXRlT2JqZWN0Lm1vbnRoO1xuICAgICAgICAgICAgcGVyaW9kID0ge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzOiBnZXRDYWxlbmRhckRhdGVPYmplY3QobmV3IERhdGUoeSwgbSAtIDEsIDApKSxcbiAgICAgICAgICAgICAgICBjdXJyZW50OiBnZXRDYWxlbmRhckRhdGVPYmplY3QobmV3IERhdGUoeSwgbSwgMCkpLFxuICAgICAgICAgICAgICAgIG5leHQ6IGdldENhbGVuZGFyRGF0ZU9iamVjdChuZXcgRGF0ZSh5LCBtICsgMSwgMCkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGVyaW9kO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0ZUV2ZW50cyhkYXRlLCBldmVudHMpIHtcbiAgICAgICAgICAgIGlmICghZGF0ZSB8fCAhZXZlbnRzKSByZXR1cm47XG4gICAgICAgICAgICBkYXRlLmV2ZW50cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGV2ZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRlLnRpdGxlID09PSBldmVudHNbaV0uZGF0ZS50b1N0cmluZygpLnN1YnN0cmluZygwLCAxNSkpIGRhdGUuZXZlbnRzLnB1c2goZXZlbnRzW2ldKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogY2FsY3VsYXRlQ2FsZW5kYXJNb250aFZpZXcgOiBwcmVwYXJlIGRhdGEgZm9yIHRoZSB2aWV3ICovXG4gICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUNhbGVuZGFyTW9udGhWaWV3KGNhbGVuZGFyRGF0ZU9iamVjdCwgZXZlbnRzKSB7XG4gICAgICAgICAgICB2YXIgY2RvID0gY2FsZW5kYXJEYXRlT2JqZWN0O1xuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZUNhbGVuZGFyTW9udGhWaWV3LnZpZXdbY2RvLnRpdGxlTVldKSByZXR1cm4gY2FsY3VsYXRlQ2FsZW5kYXJNb250aFZpZXcudmlld1tjZG8udGl0bGVNWV07XG4gICAgICAgICAgICAvKiBjYWNoaW5nIG9wdGltaXNhdGlvbiBjaGVjayAqL1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdjYWxjdWxhdGVDYWxlbmRhck1vbnRoJyk7XG5cbiAgICAgICAgICAgIHZhciB3ZWVrcyA9IFtdLFxuICAgICAgICAgICAgICAgIGRheXNJbk1vbnRoID0gY2RvLmRheXNJbk1vbnRoO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBkYXkgPSAxOyBkYXkgPCBkYXlzSW5Nb250aCArIDE7IGRheSArPSAxKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGF5RGF0ZSA9IG5ldyBEYXRlKGNkby55ZWFyLCBjZG8ubW9udGggLSAxLCBkYXkpLFxuICAgICAgICAgICAgICAgICAgICBkYXlXZWVrTnVtYmVyID0gZGF5RGF0ZS5nZXREYXkoKSxcbiAgICAgICAgICAgICAgICAgICAgd2VlayA9IHdlZWsgfHwgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xuXG4gICAgICAgICAgICAgICAgd2Vla1tkYXlXZWVrTnVtYmVyXSA9IGdldENhbGVuZGFyRGF0ZU9iamVjdChkYXlEYXRlKVxuXG4gICAgICAgICAgICAgICAgaWYgKGlzQWxsb3dlZERhdGUod2Vla1tkYXlXZWVrTnVtYmVyXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50cykgZ2V0RGF0ZUV2ZW50cyh3ZWVrW2RheVdlZWtOdW1iZXJdLCBldmVudHMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdlZWtbZGF5V2Vla051bWJlcl0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkYXlXZWVrTnVtYmVyID09PSA2IHx8IGRheSA9PT0gZGF5c0luTW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Vla3MucHVzaCh3ZWVrKTtcbiAgICAgICAgICAgICAgICAgICAgd2VlayA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogY2FjaGluZyBvcHRpbWlzYXRpb24gKi9cbiAgICAgICAgICAgIGNhbGN1bGF0ZUNhbGVuZGFyTW9udGhWaWV3LnZpZXdbY2RvLnRpdGxlTVldID0ge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVGl0bGU6IGNkby50aXRsZU1ZLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRNb250aDogZ2V0UHJldk5leHRNb250aChjZG8pLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgd2Vla3M6IHdlZWtzLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogZ2V0UHJldk5leHRNb250aChjZG8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FsY3VsYXRlQ2FsZW5kYXJNb250aFZpZXcudmlld1tjZG8udGl0bGVNWV07XG4gICAgICAgIH07XG4gICAgICAgIGNhbGN1bGF0ZUNhbGVuZGFyTW9udGhWaWV3LnZpZXcgPSB7fTtcbiAgICAgICAgLyogZ2V0Q2FsZW5kYXJEYXRlT2JqZWN0IDogQ2FsZW5kYXJEYXRlT2JqZWN0KGNkbykgZmFjdG9yeSAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDYWxlbmRhckRhdGVPYmplY3QobmF0aXZlRGF0ZU9iamVjdCkge1xuXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBuYXRpdmVEYXRlT2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAoZ2V0Q2FsZW5kYXJEYXRlT2JqZWN0LmNhY2hlW2xhYmVsXSkgcmV0dXJuIGdldENhbGVuZGFyRGF0ZU9iamVjdC5jYWNoZVtsYWJlbF07XG5cbiAgICAgICAgICAgIHZhciBkYXRlID0gbmF0aXZlRGF0ZU9iamVjdCxcbiAgICAgICAgICAgICAgICBkYXkgPSBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgICAgICAgICBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgICAgICAgICAgICAgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICAgICAgdmFyIGNkbyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogbGFiZWwuc3Vic3RyaW5nKDAsIDE1KSxcbiAgICAgICAgICAgICAgICB0aXRsZURNWTogZGF5ICsgJyAnICsgTU9OVEhTW21vbnRoIC0gMV0gKyAnICcgKyB5ZWFyLFxuICAgICAgICAgICAgICAgIHRpdGxlTVk6IE1PTlRIU1ttb250aCAtIDFdICsgJyAnICsgeWVhcixcbiAgICAgICAgICAgICAgICBuYXRpdmVEYXRlT2JqZWN0OiBkYXRlLFxuICAgICAgICAgICAgICAgIHllYXI6IHllYXIsXG4gICAgICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgICAgIGRheTogZGF5LFxuICAgICAgICAgICAgICAgIGRheXNJbk1vbnRoOiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZXRDYWxlbmRhckRhdGVPYmplY3QuY2FjaGVbbGFiZWxdID0gY2RvO1xuICAgICAgICAgICAgcmV0dXJuIGNkbztcbiAgICAgICAgfTtcbiAgICAgICAgZ2V0Q2FsZW5kYXJEYXRlT2JqZWN0LmNhY2hlID0ge307XG5cblxuICAgICAgICAvKiByZW5kZXJWaWV3IDogb25seSB3YXkgdG8gdXBkYXRlICRzY29wZSBhZnRlciBpbml0Q2FsZW5kYXIgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyVmlldyhjYWxlbmRhckRhdGVPYmplY3QsIGZvcmNlKSB7XG4gICAgICAgICAgICAkc2NvcGUud2Vla3MgPSBbXTtcbiAgICAgICAgICAgIC8qIEBmb3JjZSA6IGJvb2xlYW4gLSBjbGVhbiBjYWxjdWxhdGVDYWxlbmRhck1vbnRoVmlldyBjYWNoZSAqL1xuICAgICAgICAgICAgaWYgKGZvcmNlKSBjYWxjdWxhdGVDYWxlbmRhck1vbnRoVmlldy52aWV3ID0ge307XG4gICAgICAgICAgICBjb25maWcudmlldyA9IGNhbGN1bGF0ZUNhbGVuZGFyTW9udGhWaWV3KGNhbGVuZGFyRGF0ZU9iamVjdCwgJHNjb3BlLmV2ZW50cyk7XG5cbiAgICAgICAgICAgICRzY29wZS5jYWxlbmRhclRpdGxlID0gY29uZmlnLnZpZXcuY2FsZW5kYXJUaXRsZTtcbiAgICAgICAgICAgICRzY29wZS53ZWVrcyA9IGNvbmZpZy52aWV3LndlZWtzO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIGluaXRDYWxlbmRhciA6IGluaXQgZnVuY3Rpb24gKi9cbiAgICAgICAgKGZ1bmN0aW9uIGluaXRDYWxlbmRhcigpIHtcbiAgICAgICAgICAgIC8qIGlzRGF0ZSA6IGludGVybmFsIGhlbHBlciB0byBjaGVjayBuYXRpdmUgRGF0ZSAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gaXNEYXRlKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGRhdGUgJiYgZGF0ZS5nZXREYXRlKSA/IGRhdGUgOiBmYWxzZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbmZpZyA9IGFuZ3VsYXIuY29weSgkc2NvcGUub3B0aW9ucykgfHwge307XG4gICAgICAgICAgICAvKiBjb25maWd1cmF0aW9uIG9iamVjdCBmcm9tIG9wdGlvbnMgYXR0cmlidXRlLCBzdWNoIGFzIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZGVmYXVsdERhdGU6IFwiMjAxNi0wNS0xNlwiLFxuICAgICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShbMjAxNSwgMDMsIDMxXSksXG4gICAgICAgICAgICAgIG1heERhdGU6IG5ldyBEYXRlKFsyMDIwLCAxMiwgMzFdKSxcbiAgICAgICAgICAgICAgZGF5TmFtZXNMZW5ndGg6IDEgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uZmlnLmRlZmF1bHREYXRlID0gaXNEYXRlKGNvbmZpZy5kZWZhdWx0RGF0ZSkgfHwgbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbmZpZy5taW5EYXRlID0gaXNEYXRlKGNvbmZpZy5taW5EYXRlKSB8fCBuZXcgRGF0ZSgnMjAxNS0xLTMxJyk7XG4gICAgICAgICAgICBjb25maWcubWF4RGF0ZSA9IGlzRGF0ZShjb25maWcubWF4RGF0ZSkgfHwgbmV3IERhdGUoJzIwMjAtMTItMzEnKTtcbiAgICAgICAgICAgIC8qIERpc3BsYXkgb2Ygd2Vla2RheXMgKDEgZm9yIFwiTVwiLCAyIGZvciBcIk1vXCIsIDMgZm9yIFwiTW9uXCI7IDkgd2lsbCBzaG93IGZ1bGwgZGF5IG5hbWVzOyBkZWZhdWx0IGlzIDEpKi9cbiAgICAgICAgICAgIGNvbmZpZy5kYXlOYW1lc0xlbmd0aCA9IGNvbmZpZy5kYXlOYW1lc0xlbmd0aCB8fCAxO1xuXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWREYXRlID0gZ2V0Q2FsZW5kYXJEYXRlT2JqZWN0KGNvbmZpZy5kZWZhdWx0RGF0ZSk7XG5cbiAgICAgICAgICAgICRzY29wZS53ZWVrRGF5TmFtZXMgPSBXRUVLREFZUy5tYXAoZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lLnNsaWNlKDAsIGNvbmZpZy5kYXlOYW1lc0xlbmd0aClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdldmVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJWaWV3KCRzY29wZS5zZWxlY3RlZERhdGUsIHRydWUpXG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2V2ZW50LWNhbGVuZGFyJywgWydldmVudC1jYWxlbmRhci5jb250cm9sbGVyJ10pXG4gICAgLmRpcmVjdGl2ZSgnZXZlbnRDYWxlbmRhcicsIGV2ZW50Q2FsZW5kYXIpO1xuXG4gICAgZnVuY3Rpb24gZXZlbnRDYWxlbmRhcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG9wdGlvbnM6ICc9JyxcbiAgICAgICAgICAgICAgICBldmVudHM6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvZXZlbnQtY2FsZW5kYXIvZXZlbnQtY2FsZW5kYXIuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRDYWxlbmRhckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB0YWJzQ3RybCkge1xuICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSlcbiAgICAgICAgICAgICAgLmFwcGVuZChcIjxsaW5rIGhyZWY9J2FwcC9jb21wb25lbnRzL2V2ZW50LWNhbGVuZGFyL2V2ZW50LWNhbGVuZGFyLmNzcycgcmVsPSdzdHlsZXNoZWV0Jy8+XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnb2dnci5jaGF0LW1lc3NhZ2UnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuZGlyZWN0aXZlKCdvZ2dyQ2hhdE1lc3NhZ2UnLCBbJyRpb25pY0FjdGlvblNoZWV0JywgJyR0aW1lb3V0JywgZmFjdG9yeV0pO1xuXG4gICAgZnVuY3Rpb24gZmFjdG9yeSgkaW9uaWNBY3Rpb25TaGVldCwgJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2PjxwIG5nLWJpbmQ9XCJtZXNzYWdlLmNvbnRlbnRcIiBuZy1pZj1cIiFpc0ltYWdlKClcIj48L3A+PGltZyBuZy1pZj1cImlzSW1hZ2UoKVwiIG5nLXNyYz1cInt7bWVzc2FnZS5jb250ZW50fX1cIj48L2Rpdj4nLFxuICAgICAgICAgICAgbGluazpsaW5rRm4sXG5cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5rRm4oc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcbiAgICAgICAgc2NvcGUuaXNJbWFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIC9kYXRhOi8udGVzdChzY29wZS5tZXNzYWdlLmNvbnRlbnQpIHx8IC9odHRwLy50ZXN0KHNjb3BlLm1lc3NhZ2UuY29udGVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdvZ2dyLmhpZGUtc3ViLWhlYWRlci1vbi1zY3JvbGwnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuZGlyZWN0aXZlKCdvZ2dySGlkZVN1YkhlYWRlck9uU2Nyb2xsJywgWyckdGltZW91dCcsIGZhY3RvcnldKTtcblxuICAgIGZ1bmN0aW9uIGZhY3RvcnkoJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBwcmlvcml0eTogMCxcbiAgICAgICAgICAgIGxpbms6IGxpbmtGblxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaW5rRm4oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBjdHJscywgdHJhbnNjbHVkZUZuKSB7XG4gICAgICAgIHZhciBzdGFydCA9IDA7XG4gICAgICAgIHZhciB0aHJlc2hvbGQgPSAxNTA7XG4gICAgICAgICRzY29wZS4kcGFyZW50LnNsaWRlSGVhZGVyID0gZmFsc2U7XG5cbiAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3dpbGwtaGlkZS1zdWJoZWFkZXInKTtcblxuICAgICAgICAkZWxlbWVudC5iaW5kKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgaGlkZGVuID0gKGUuZGV0YWlsLnNjcm9sbFRvcCAtIHN0YXJ0ID4gdGhyZXNob2xkKTtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS4kcGFyZW50LnNsaWRlSGVhZGVyID0gaGlkZGVuO1xuICAgICAgICAgICAgICAgICRlbGVtZW50WyhoaWRkZW4pID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdzdWJoZWFkZXItaGlkZGVuJyk7XG4gICAgICAgICAgICB9LCAwKVxuICAgICAgICB9KTtcbiAgICB9O1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXG4gICAgICAgICdvZ2dyLmNoYXQtbWVzc2FnZScsXG4gICAgICAgICdvZ2dyLmhpZGUtc3ViLWhlYWRlci1vbi1zY3JvbGwnLFxuICAgICAgICAnb2dnci5vbi1wdWxsLWRvd24nLFxuICAgICAgICAnb2dnci56b29tYWJsZSdcbiAgICBdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ29nZ3InLCBtb2R1bGVEZXBlbmRlbmNpZXMpO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdvZ2dyLm9uLXB1bGwtZG93bicsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5kaXJlY3RpdmUoJ29nZ3JPblB1bGxEb3duJywgWyckY29tcGlsZScsIGZhY3RvcnldKVxuXG4gICAgZnVuY3Rpb24gZmFjdG9yeSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6IFsnP14kaW9uaWNTY3JvbGwnXSwgLy9eIF5eID9eID9eXlxuICAgICAgICAgICAgcHJpb3JpdHk6IDEwMDAsXG4gICAgICAgICAgICBjb21waWxlOiBjb21waWxlRm5cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY29tcGlsZUZuKHRFbGVtZW50LCB0QXR0cnMsIHRyYW5zY2x1ZGVGbikge1xuXG4gICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdvZ2dyJykuYWRkQ2xhc3MoJ2Jhci1zdWJoZWFkZXInKTtcbiAgICAgICAgdEF0dHJzLiRzZXQoJ25hbWUnLCAne3tVSS5sYWJlbHNbVUkubGFuZ10ubmF2LmNhbGVuZGFyfX0nKTtcbiAgICAgICAgdEVsZW1lbnQuYXR0cignbmctY2xpY2snLCAndG9nZ2xlKCknKTtcblxuICAgICAgICByZXR1cm4gbGlua0ZuO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaW5rRm4oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBjdHJscywgdHJhbnNjbHVkZUZuKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ2xpbmsnLCBjdHJscylcblxuICAgICAgICAkc2NvcGUudG9nZ2xlID0gZnVuY3Rpb24oYXJndW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2dnbGUnKVxuICAgICAgICB9XG5cbiAgICAgICAgJGVsZW1lbnQucmVtb3ZlQXR0cignb2dnci1vbi1wdWxsLWRvd24nKTtcbiAgICAgICAgJGNvbXBpbGUoJGVsZW1lbnQpKCRzY29wZSk7XG5cbiAgICAgICAgdmFyIHN0YXJ0ID0gMDtcbiAgICAgICAgdmFyIHRocmVzaG9sZCA9IDE1MDtcblxuICAgICAgICBjdHJsc1swXS4kZWxlbWVudC5iaW5kKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2Nyb2xsJylcbiAgICAgICAgICAgIGlmIChlLmRldGFpbC5zY3JvbGxUb3AgLSBzdGFydCA+IHRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdiYXItc3ViaGVhZGVyLXNsaWRlLWF3YXknKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2Jhci1zdWJoZWFkZXItc2xpZGUtYXdheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNsaWRlSGVhZGVyUHJldmlvdXMgPj0gZS5kZXRhaWwuc2Nyb2xsVG9wIC0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5yZW1vdmVDbGFzcygnYmFyLXN1YmhlYWRlci1zbGlkZS1hd2F5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc2xpZGVIZWFkZXJQcmV2aW91cyA9IGUuZGV0YWlsLnNjcm9sbFRvcCAtIHN0YXJ0O1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ29nZ3Iuem9vbWFibGUnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuZGlyZWN0aXZlKCdvZ2dyWm9vbWFibGUnLCBbZmFjdG9yeV0pO1xuXG4gICAgZnVuY3Rpb24gZmFjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBsaW5rRm5cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGlua0ZuKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7fTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FsZW5kYXItZXZlbnRzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmZhY3RvcnkoJ0NhbGVuZGFyRXZlbnRzJywgWydDT05GSUcnLCBmYWN0b3J5XSk7XG5cbiAgICBmdW5jdGlvbiBmYWN0b3J5KENPTkZJRykge1xuXG4gICAgICAgIC8vIFNvbWUgZmFrZSB0ZXN0aW5nIGRhdGFcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgJ2FwcC9jb3JlL2RhdGEvY2FsZW5kYXItZXZlbnRzLmpzb24nLCBmYWxzZSk7Ly9DT05GSUcuc2VydmVyICsgXG4gICAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgICAgdmFyIGZha2VEYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICB2YXIgZXZlbnRzID0gZmFrZURhdGE7XG5cbiAgICAgICAgdmFyIENhbGVuZGFyRXZlbnRzID0ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICByZW1vdmU6IHJlbW92ZSxcbiAgICAgICAgICAgIGdldDogZ2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIENhbGVuZGFyRXZlbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcbiAgICAgICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudHMuc3BsaWNlKGV2ZW50cy5pbmRleE9mKGV2ZW50KSwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGV2ZW50SWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50c1tpXS5pZCA9PT0gcGFyc2VJbnQoZXZlbnRJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50c1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFsnZmlyZWJhc2UnXTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdvZGInLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuc2VydmljZSgnT0RCJywgWydDT05GSUcnLCAnJHEnLCBDb25zdHJ1Y3Rvcl0pO1xuXG4gICAgdmFyIGJhc2VSZWYgPSAnaHR0cDovL29nZ3IuZmlyZWJhc2Vpby5jb20vJztcbiAgICB2YXIgJGluamVjdG9yID0gYW5ndWxhci5pbmplY3RvcigpO1xuXG4gICAgXG4gICAgLyoqXG4gICAgICogW0NvbnN0cnVjdG9yIE9EQiBoYW5kbGUgRFRPIGZyb20gRmlyZWJhc2VdXG4gICAgICogQHBhcmFtIHtbc2VydmljZV19IENPTkZJRyBbR2xvYmFsIGNvbmZpZ3VyYXRpb25dXG4gICAgICogQHBhcmFtIHtbc2VydmljZV19ICRxICAgICBbTmF0aXZlIEFuZ3VsYXIgUHJvbWlzZSBBUEldXG4gICAgICovXG4gICAgZnVuY3Rpb24gQ29uc3RydWN0b3IoQ09ORklHLCAkcSkge1xuICAgICAgICBDb25zdHJ1Y3Rvci5PREIgPSB0aGlzO1xuICAgICAgICB0aGlzLiRxID0gJHE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZXIgTWFuZ2VtZW50IFxuICAgICAqIEByZXR1cm4ge3VzZXJ9ICAgICAgICAgICAgICAgXG4gICAgICogWyBBIHVzZXIgT2JqZWN0IHdyYXBwZXIgZm9yIHVzZXIgbWFuYWdlbWVudCBmdW5jdGlvbiBdXG4gICAgICovXG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlLnVzZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWYgPSBuZXcgRmlyZWJhc2UoYmFzZVJlZik7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IHt9LFxuICAgICAgICAgICAgY29ubmVjdDogZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZXRDb25uZWN0aW9uKHVzZXIsICdhdXRoV2l0aFBhc3N3b3JkJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVmLnVuQXV0aCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldENvbm5lY3Rpb24odXNlciwgJ2NyZWF0ZVVzZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldENvbm5lY3Rpb24odXNlciwgbW9kZSkge1xuICAgICAgICAgICAgbW9kZSA9IG1vZGUgfHwgJ2NyZWF0ZVVzZXInO1xuXG4gICAgICAgICAgICB2YXIgZGVmZXIgPSBDb25zdHJ1Y3Rvci5PREIuJHEuZGVmZXIoKVxuICAgICAgICAgICAgcmVmW21vZGVdKHVzZXIsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVyLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1vZGUgKyBcIiBGYWlsZWQhXCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3Rvci5PREIudXNlci5jdXJyZW50ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobW9kZSArIFwiIHN1Y2Nlc3NmdWxseSB3aXRoIHBheWxvYWQ6XCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICB9KSgpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3VpJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLnNlcnZpY2UoJ1VJJywgWydDT05GSUcnLCBjb25zdHJ1Y3Rvcl0pO1xuXG4gICAgZnVuY3Rpb24gY29uc3RydWN0b3IoQ09ORklHKSB7XG5cbiAgICAgICAgLy9UT0RPIG9mIGNvdXJzZSByZW1vdmU7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsICdhcHAvY29yZS9kYXRhL3VpLmxhYmVscy5qc29uJywgZmFsc2UpOy8vQ09ORklHLnNlcnZlciArIFxuICAgICAgICAvL3hoci5vcGVuKCdHRVQnLCAnYXBwL2NvcmUvZGF0YS91aS5sYWJlbHMuanNvbicsIGZhbHNlKTtcbiAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICB2YXIgbGFiZWxzID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICAvL3ZhciBsYWJlbHMgPSB7fTtcblxuICAgICAgICB0aGlzLmxhbmcgPSBERUZBVUxUX0xBTkdVQUdFO1xuICAgICAgICB0aGlzLmxhbmd1YWdlcyA9IGxhbmd1YWdlcztcbiAgICAgICAgdGhpcy5sYWJlbHMgPSBsYWJlbHM7XG4gICAgfTtcblxuICAgIHZhciBERUZBVUxUX0xBTkdVQUdFID0gJ2VuJyA7XG5cbiAgICB2YXIgbGFuZ3VhZ2VzID0gW3tcbiAgICAgICAgbmFtZTogJ0ZyYW7Dp2FpcycsXG4gICAgICAgIGNvZGU6ICdmcidcbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdFbmdsaXNoJyxcbiAgICAgICAgY29kZTogJ2VuJ1xuICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ1NwYW5pc2gnLFxuICAgICAgICBjb2RlOiAnZXMnXG4gICAgfSwge1xuICAgICAgICBuYW1lOiAnQ2hpbmVzZScsXG4gICAgICAgIGNvZGU6ICdjbidcbiAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdSdXNzaWFuJyxcbiAgICAgICAgY29kZTogJ3J1J1xuICAgIH1dO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW1xuICAgICAgICAnY2FsZW5kYXIuY29udHJvbGxlcnMnLFxuICAgICAgICAnY2FsZW5kYXIuc2VydmljZXMnLFxuICAgICAgICAnZXZlbnQtY2FsZW5kYXInLy9jb21wb25lbnRcbiAgICBdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jYWxlbmRhcicsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblx0LmNvbmZpZyggWydDT05GSUcnLCckc3RhdGVQcm92aWRlcicsJyR1cmxSb3V0ZXJQcm92aWRlcicsIGNvbmZpZ3VyZVJvdXRlIF0gKTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ3VyZVJvdXRlIChDT05GSUcsICRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnb2dnci50YWIuY2FsZW5kYXInLCB7XG4gICAgICAgICAgICB1cmw6ICcvY2FsZW5kYXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLWNhbGVuZGFyJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL2NhbGVuZGFyL2NhbGVuZGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FsZW5kYXJDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FsZW5kYXIuY29udHJvbGxlcnMnLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDYWxlbmRhckN0cmwnLCBbJyRzY29wZScsICdDYWxlbmRhckV2ZW50cycsIGZ1bmN0aW9uKCRzY29wZSwgQ2FsZW5kYXJFdmVudHMpIHtcblxuICAgICAgICAvKiBFdmVudHMgKi9cbiAgICAgICAgJHNjb3BlLiRvbignT0dHUi5DYWxlbmRhci5FdmVudHMuQ0xJQ0snLCBjbGlja0RhdGVIYW5kbGVyKTtcbiAgICAgICAgJHNjb3BlLiRvbignT0dHUi5DYWxlbmRhci5EYXRlLkNMSUNLJywgY2xpY2tEYXRlSGFuZGxlcik7XG4gICAgICAgIC8qIFZhbHVlcyAqL1xuICAgICAgICAkc2NvcGUuZXZlbnRzID0gQ2FsZW5kYXJFdmVudHMuYWxsKCk7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEV2ZW50cyA9IGFuZ3VsYXIuY29weSgkc2NvcGUuZXZlbnRzKSAvL0tlZXAgZm9yIHBhZ2luYXRpb25cbiAgICAgICAgLyogSGFubGVycyAqL1xuICAgICAgICAkc2NvcGUuZG9SZWZyZXNoID0gZG9SZWZyZXNoO1xuXG4gICAgICAgIFxuICAgICAgICAvKiBJbXBsZW1lbnRhdGlvbiAqL1xuICAgICAgICBmdW5jdGlvbiBkb1JlZnJlc2goKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXZlbnRzLnVuc2hpZnQoYW5ndWxhci5jb3B5KCRzY29wZS5ldmVudHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogJHNjb3BlLmV2ZW50cy5sZW5ndGgpXSkpO1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkRXZlbnRzID0gYW5ndWxhci5jb3B5KCRzY29wZS5ldmVudHMpO1xuICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5yZWZyZXNoQ29tcGxldGUnKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBjbGlja0RhdGVIYW5kbGVyKGV2dCwgZGF0ZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkRXZlbnRzID0gZGF0ZS5ldmVudHM7XG4gICAgICAgIH1cblxuICAgIH1dKTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FsZW5kYXIuc2VydmljZXMnLCBbXSk7XG5cbiAgICBcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gWydmaXJlYmFzZSddO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2NoYXQtcm9vbScsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5mYWN0b3J5KCdDaGF0Um9vbScsIFsnJGZpcmViYXNlQXJyYXknLCBmYWN0b3J5XSk7XG5cbiAgICBmdW5jdGlvbiBmYWN0b3J5KCRmaXJlYmFzZUFycmF5KSB7XG4gICAgICAgIHZhciBtZXNzYWdlc1JlZiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9vZ2dyLmZpcmViYXNlaW8uY29tL21lc3NhZ2VzJyksXG4gICAgICAgICAgICBtZXNzYWdlc0ZCQSA9ICRmaXJlYmFzZUFycmF5KG1lc3NhZ2VzUmVmLmxpbWl0VG9MYXN0KDE1KSksXG4gICAgICAgICAgICBtZXNzYWdlSXRlciA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlUm9vbVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJvb20oY29udGFjdElkLCBpZCkge1xuICAgICAgICAgICAgdmFyIGlkID0gaWQ7XG5cbiAgICAgICAgICAgIHZhciByb29tID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogW2NyZWF0ZU1lc3NhZ2UoKV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRhY3RzOiB7XG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBbY29udGFjdElkXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlc0ZCQS4kbG9hZGVkKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vS2VlcCBmb3IgaW5pdGlhbGl6aW5nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5leHRNZXNzYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlc0ZCQS4kYWRkKGNyZWF0ZU1lc3NhZ2UobXNnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByZXZpb3VzTWVzc2FnZToge1xuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnVuc2hpZnQoY3JlYXRlTWVzc2FnZShtc2cpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbGFzdE1lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdLmNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcm9vbS5kZWxldGVNZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNwbGljZSh0aGlzLmRhdGEuaW5kZXhPZihtc2cpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByb29tO1xuICAgICAgICB9O1xuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1lc3NhZ2UobXNnKSB7XG4gICAgICAgIGlmIChtc2cpIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50OiBtc2dcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbJ2NoYXQuc2VydmljZXMnLCdjaGF0LmNvbnRyb2xsZXJzJywnY2hhdC5yb3V0ZXMnXTtcbiAgICBcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jaGF0JywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjaGF0LmNvbnRyb2xsZXJzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0NoYXRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhdHMsIENvbnRhY3RzKSB7XG4gICAgICAgICRzY29wZS5jaGF0cyA9IENoYXRzLmFsbCgpO1xuXG4gICAgICAgIC8vTW92ZSBpbnRvIFJvb20gb2JqZWN0XG4gICAgICAgICRzY29wZS5nZXRVc2VyID0gZnVuY3Rpb24oY2hhdCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbnRhY3RzLmdldChjaGF0LmNvbnRhY3RzWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgICAgICAgIENoYXRzLnJlbW92ZShjaGF0KTtcbiAgICAgICAgfVxuXG4gICAgfSlcblxuICAgIC5jb250cm9sbGVyKCdDaGF0c0RldGFpbEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ2hhdHMsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkaW9uaWNBY3Rpb25TaGVldCwgJHRpbWVvdXQsIENvbnRhY3RzLCAkc3RhdGUpIHtcblxuICAgICAgICBpZiAoIUNoYXRzLmdldCgkc3RhdGVQYXJhbXMuY2hhdElkKSkgcmV0dXJuICRzdGF0ZS5nbygnb2dnci50YWIuY2hhdHMnKTtcblxuICAgICAgICB2YXIgY2hhdFJvb20gPSBDaGF0cy5nZXQoJHN0YXRlUGFyYW1zLmNoYXRJZCk7XG5cblxuICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5yZXNpemUoKTtcblxuICAgICAgICBjaGF0Um9vbS5tZXNzYWdlcy50aGVuKGZ1bmN0aW9uKHJvb21NZXNzYWdlcykge1xuICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdtZXNzYWdlcycsIGZ1bmN0aW9uKG5ld05hbWVzLCBvbGROYW1lcykge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnY2hhdCcpLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2VzID0gcm9vbU1lc3NhZ2VzOyAvLyB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLmNoYXRSb29tTmFtZSA9IENvbnRhY3RzLmdldChjaGF0Um9vbS5jb250YWN0c1swXSkubmFtZVxuXG4gICAgICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYXRSb29tLm5leHRNZXNzYWdlID0gJHNjb3BlLm1lc3NhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5zZWFyY2hNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoJylcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc2Nyb2xsVG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AodHJ1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnNjcm9sbERvd24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZG9SZWZyZXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE1KTsgaSA8IG07IGkrKykge1xuICAgICAgICAgICAgICAgIGNoYXRSb29tLnByZXZpb3VzTWVzc2FnZSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5yZWZyZXNoQ29tcGxldGUnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2U7XG5cbiAgICAgICAgICAgIC8qIFNob3cgdGhlIGFjdGlvbiBzaGVldCAqL1xuICAgICAgICAgICAgdmFyIGhpZGVTaGVldCA9ICRpb25pY0FjdGlvblNoZWV0LnNob3coe1xuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnPGI+Q29weTwvYj4gbWVzc2FnZSdcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnUmVwZWF0J1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIGRlc3RydWN0aXZlVGV4dDogJ0RlbGV0ZScsXG4gICAgICAgICAgICAgICAgdGl0bGVUZXh0OiAnU2VsZWN0IHlvdSBhY3Rpb24nLFxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICdDYW5jZWwnLFxuICAgICAgICAgICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oaW5kZXgsIGJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uLmlkID09PSAxKSAkc2NvcGUubWVzc2FnZSA9IG1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1dHRvbi5pZCA9PT0gMikgY2hhdFJvb20ubmV4dE1lc3NhZ2UgPSBtZXNzYWdlLmNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZXN0cnVjdGl2ZUJ1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjaGF0Um9vbS5kZWxldGVNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGlkZVNoZWV0KCk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcblxuICAgICAgICB9O1xuICAgIH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRhbmd1bGFyLm1vZHVsZSgnY2hhdC5yb3V0ZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cdC5jb25maWcoWydDT05GSUcnLCckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBjb25maWdGbl0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnRm4oQ09ORklHLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICBcdCRzdGF0ZVByb3ZpZGVyXG4gICAgXHQgICAgLnN0YXRlKCdvZ2dyLnRhYi5jaGF0cycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY2hhdHMnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0YWItY2hhdHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL2NoYXQvY2hhdHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhdHNDdHJsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb2dnci50YWIuY2hhdHMtZGV0YWlsJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jaGF0cy86Y2hhdElkJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAndGFiLWNoYXRzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9jaGF0L2NoYXRzLWRldGFpbC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0RldGFpbEN0cmwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cblxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFsnY2hhdC1yb29tJywnYXBwLmNvbnRhY3RzJ107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2hhdC5zZXJ2aWNlcycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5mYWN0b3J5KCdDaGF0cycsIFsnQ29udGFjdHMnLCdDaGF0Um9vbScsZmFjdG9yeV0pO1xuXG4gICAgZnVuY3Rpb24gZmFjdG9yeShDb250YWN0cywgQ2hhdFJvb20pIHtcblxuICAgICAgICB2YXIgY2hhdHMgPSBbXTtcbiAgICAgICAgLy9UT0RPIHJlbW92ZVxuICAgICAgICBjaGF0cy5wdXNoKENoYXRSb29tLmNyZWF0ZSgyLCBjaGF0cy5sZW5ndGgpKVxuICAgICAgICBjaGF0cy5wdXNoKENoYXRSb29tLmNyZWF0ZSgzLCBjaGF0cy5sZW5ndGgpKVxuXG4gICAgICAgIHZhciBDaGF0cyA9IHtcbiAgICAgICAgICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYXRzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYXRzW2NoYXRJZF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihjaGF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKGNvbnRhY3RJZCkge1xuICAgICAgICAgICAgICAgIGNoYXRzLnB1c2goQ2hhdFJvb20uY3JlYXRlKGNvbnRhY3RJZCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ2hhdHM7XG4gICAgfTtcblxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFsnY29udGFjdHMuc2VydmljZXMnLCdjb250YWN0cy5jb250cm9sbGVycycsJ2NvbnRhY3RzLnJvdXRlcyddO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5jb250YWN0cycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY29udGFjdHMuY29udHJvbGxlcnMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29udHJvbGxlcignQ29udGFjdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDb250YWN0cykge1xuICAgICAgICAkc2NvcGUuY29udGFjdHMgPSBDb250YWN0cy5hbGwoKTtcbiAgICAgICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIENvbnRhY3RzLnJlbW92ZShjb250YWN0KTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAuY29udHJvbGxlcignQ29udGFjdHNEZXRhaWxDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIENvbnRhY3RzKSB7XG4gICAgICAgICRzY29wZS5jb250YWN0ID0gQ29udGFjdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jb250YWN0SWQpO1xuICAgIH0pXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcbiAgICBhbmd1bGFyLm1vZHVsZSgnY29udGFjdHMucm91dGVzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmNvbmZpZyhbJ0NPTkZJRycsJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGNvbmZpZ0ZuXSk7XG5cbiAgICBmdW5jdGlvbiBjb25maWdGbihDT05GSUcsICRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdvZ2dyLnRhYi5jb250YWN0cycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29udGFjdHMnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICd0YWItY29udGFjdHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL2NvbnRhY3RzL2NvbnRhY3RzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RzQ3RybCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ29nZ3IudGFiLmNvbnRhY3RzLWRldGFpbCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29udGFjdHMvOmNvbnRhY3RJZCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3RhYi1jb250YWN0cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDT05GSUcucGF0aHMuc2NyZWVucyArICcvY29udGFjdHMvY29udGFjdHMtZGV0YWlsLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RzRGV0YWlsQ3RybCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzLnNlcnZpY2VzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmZhY3RvcnkoJ0NvbnRhY3RzJywgW2ZhY3RvcnldKTtcblxuICAgIGZ1bmN0aW9uIGZhY3RvcnkoKSB7XG4gICAgICAgIHZhciBjb250YWN0cyA9IGZha2VEYXRhXG5cbiAgICAgICAgdmFyIENvbnRhY3RzID0ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICByZW1vdmU6IHJlbW92ZSxcbiAgICAgICAgICAgIGdldDogZ2V0XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIENvbnRhY3RzO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250YWN0cztcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiByZW1vdmUoY29udGFjdCkge1xuICAgICAgICAgICAgY29udGFjdHMuc3BsaWNlKGNvbnRhY3RzLmluZGV4T2YoY29udGFjdCksIDEpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldChjb250YWN0SWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udGFjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFjdHNbaV0uaWQgPT09IHBhcnNlSW50KGNvbnRhY3RJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhY3RzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgLy8gU29tZSBmYWtlIHRlc3RpbmcgZGF0YVxuICAgIHZhciBmYWtlRGF0YSA9IFt7XG4gICAgICAgIGlkOiAwLFxuICAgICAgICBuYW1lOiAnTHVkd2lnIFRvY3playcsXG4gICAgICAgIHRpdGxlOiAnTGVhZCBBcmNoaXRlY3QnLFxuICAgICAgICBlbWFpbDogJ3JlbmF1ZC5kdWJ1aXNAb2dnci5pbycsXG4gICAgICAgIHBob25lOiAnKzk3MSAoMCk1IDU3IDA4IDA4IDg5JyxcbiAgICAgICAgZmFjZTogJ2h0dHBzOi8vc2NvbnRlbnQtc2luLnh4LmZiY2RuLm5ldC9ocGhvdG9zLXhwZjEvdi90MS4wLTkvMTY4MTgwXzQ4NTgyNDQwMjcwMV80NzgzMTE0X24uanBnP29oPTViMGJlOWQ0NDkyZGNhNjIzYWE0ZGI4YmYzYzU4YzVhJm9lPTU2MDM2OTgyJ1xuICAgIH0sIHtcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIG5hbWU6ICdSZW5hdWQgRHVidWlzJyxcbiAgICAgICAgdGl0bGU6ICdMZWFkIEFyY2hpdGVjdCcsXG4gICAgICAgIGVtYWlsOiAncmVuYXVkLmR1YnVpc0BvZ2dyLmlvJyxcbiAgICAgICAgcGhvbmU6ICcrOTcxICgwKTUgNTcgMDggMDggODknLFxuICAgICAgICBmYWNlOiAnaHR0cHM6Ly9zY29udGVudC1zaW4ueHguZmJjZG4ubmV0L2hwaG90b3MteHBhMS92L3QxLjAtOS82ODk0Nl8xMDE1NDYzMDg0MTg2NTY0M18xMTgzMjgyNDU1MjM3MjI0NTk2X24uanBnP29oPTRiN2NjMjMzYWExMDAxZjM3ZDYzZjQwNDIyMjRhYTM1Jm9lPTU1Qzk0RTYxJ1xuICAgIH0sIHtcbiAgICAgICAgaWQ6IDIsXG4gICAgICAgIG5hbWU6ICdab8OpIEdvdXJkb24nLFxuICAgICAgICB0aXRsZTogJ1NlcmlhbCBTaG9wcGVyJyxcbiAgICAgICAgZW1haWw6ICd6b2UuZ291cmRvbkBvZ2dyLmlvJyxcbiAgICAgICAgcGhvbmU6ICcrOTcxICgwKTUgNTcgMDggMDggODknLFxuICAgICAgICBmYWNlOiAnZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNGdJY1NVTkRYMUJTVDBaSlRFVUFBUUVBQUFJTWJHTnRjd0lRQUFCdGJuUnlVa2RDSUZoWldpQUgzQUFCQUJrQUF3QXBBRGxoWTNOd1FWQlFUQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUE5dFlBQVFBQUFBRFRMV3hqYlhNQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBcGtaWE5qQUFBQS9BQUFBRjVqY0hKMEFBQUJYQUFBQUF0M2RIQjBBQUFCYUFBQUFCUmlhM0IwQUFBQmZBQUFBQlJ5V0ZsYUFBQUJrQUFBQUJSbldGbGFBQUFCcEFBQUFCUmlXRmxhQUFBQnVBQUFBQlJ5VkZKREFBQUJ6QUFBQUVCblZGSkRBQUFCekFBQUFFQmlWRkpEQUFBQnpBQUFBRUJrWlhOakFBQUFBQUFBQUFOak1nQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQjBaWGgwQUFBQUFFWkNBQUJZV1ZvZ0FBQUFBQUFBOXRZQUFRQUFBQURUTFZoWldpQUFBQUFBQUFBREZnQUFBek1BQUFLa1dGbGFJQUFBQUFBQUFHK2lBQUE0OVFBQUE1QllXVm9nQUFBQUFBQUFZcGtBQUxlRkFBQVkybGhaV2lBQUFBQUFBQUFrb0FBQUQ0UUFBTGJQWTNWeWRnQUFBQUFBQUFBYUFBQUF5d0hKQTJNRmtnaHJDL1lRUHhWUkd6UWg4U21RTWhnN2trWUZVWGRkN1d0d2VnV0pzWnA4ckdtL2ZkUEQ2VEQvLy8vZ0FCQktSa2xHQUFFQkFBQUJBQUVBQVAvdEFEWlFhRzkwYjNOb2IzQWdNeTR3QURoQ1NVMEVCQUFBQUFBQUdSd0Nad0FVZUhKZlFWTTFTa2RsWnpWVU5rWlhOSGxsTmprQS85c0FRd0FJQmdZSEJnVUlCd2NIQ1FrSUNnd1VEUXdMQ3d3WkVoTVBGQjRhSHg4ZEdoMGNJU1V2S0NFakxDTWNIU2s0S1N3eE1qVTFOU0FuT2o0NU16MHZORFV6LzlzQVF3RUpDUWtNQ3d3WURRMFlNeUlkSWpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXpNek16TXovOElBRVFnQ2dBS0FBd0VpQUFJUkFRTVJBZi9FQUJzQUFBSURBUUVCQUFBQUFBQUFBQUFBQUFFRUFBSURCUVlILzhRQUdRRUFBd0VCQVFBQUFBQUFBQUFBQUFBQUFBRUNBd1FGLzlvQURBTUJBQUlRQXhBQUFBSDBVclpTVFVoRENCTUlBa29CTUNHRUFUQWtKQUdGQWxvQWhnU1NNQmdBVmk0Mkp6T083OVRuNHF4WHQ5UEc5ZFQzaXRxb3NhRUxHbGd0SVJDR0FJWUFoQUNHQldXQVZsZ0FoZ1ZGd01Dd0ZXV0F3REFBc0FyREFyQ0FBc0FBTUNzSUFRZ2VSTnFtcHNRb2JrS1d0RUFrZ0xTQVpDbkpDQmhJQXdpcVpCeUdvR21WUjVMamdPOStSVExXN1RQWnM3S3N5MmVsbnZrTjQ4M2x1ZTVmaldwK2hmOEFNOUhOZWgzNEhSbUg1Uzk1Q0dBSVlBaGdBR0FCWUFJWUZZWUFoaUtpMFpTV0E2d2dBTEFBREFyQ0FBc0FBTUNvc0FFc1dWTUlwREFoa0FtRUlaRXpJUUJoQ0VFVU1nNFJtQm9ham5GNS9sNzE2dk9VMjJadm5vTTZUZVhaZ2E1TmpwODVuSVc0bnArUm9ralJ6UlpQUnJOc2I4emZOOWJvY1ppWjdNWDMwNXpER2dEQUVNQVNRQkNBRU1BQXhBRmdBRmd5b3NBckRCMUZvRlJZQUFZRlJZQUFZQUlMRElRRmdSU0VqQk1GRENuRElFTUlTUWlnTldWZ3FuUEpiK04wMW1OVDBPOTYyQmc0N1JWbVZXb2IyMkRPTmJiWnRadk5UcEpOY2U4eTNUYjNMZmhkVGRKckl4WnZwTHM2bkZQVG1HKzNQSkkxSklnUXhsWVlBQmdBV0FDRUFJUWdDd0FDd2JxTEFBREFxTEFLd2dBTEFLbUZxU0VJWVFoaENHRUlaRVF3amhrYWhnUU1OTE4xNDdQbERYamMvVExyYzBwcTBkQnBOVjB0ckZEZU5aM2Q1ZHZGN2JSakpUTml3Y1ZIMHlsUHpUVGlXcWY2SEQ2Y0xwYXFOWnp2VzFVc251YVdkZVo2N2N3aGpCSkFra0FRZ0JDQWdNQ3NJQVF4QUJBQVdBVkZnMkFZRlJZQldFQUpDMURJQmtnV0lnV0lJUXlBU0NFaGlKVzJReGpweFMxdkxkcnordXlsTDE2SW04NldkcU45QnZDK1p1L3RGSXN1YlFMdGFhd3M5TDJsVnRZaFNtOEVrdDBzeXVHdDZSV2hmcDhEVnJ2YWMxeUlITjdQTkc1MHZKZWowemJrbXVFa2dDRUJKSUVraUFDR1FHQUFRRUJpS3dnQUxCdWtJQUN3QUFnS21Ha0NZRU1JUXdvaE1BeUVJWkVRZ2hYSzZ4V1BEY1FXM044OTNPSDB1bTFPbzN2MXMranlhMTAwdkN5MXZjUXZDbGE5Ym9OaFpCTmJKR1N6VlJjaXpydVFTNS9jb3E4MzBtT2U2NmVlTGNUNS9wVGo2VjdTeUwydkpKSlV5U0JBWUFrZ1FHQUFZQUJnQUdBQVFnUWdLaXdickNBQXNBckpaZ3NDS0VFQ1FRSkJBeVFESVVTVE1GOGI4MWFvS3M4dzN4NWZRWDZKeTduUDdtT2pEbVRPSUxXSk1NS0laWUpZRkY3VXNnbXRoRzFTSzlxMklKaHFaREhPU3oxSjA4ODAzenAyZTg5MmdpbmQ4cjZIWEpzZzY4OEJnQ1NCQVlBa2dTU0lBc0dDRUlBc0FyQ0FBdFVZQkRBREFvWVdvWkFoaENHRUNRUU1rQXlRS1pYQ2EzQjZYRm5jOHJvOHF0Y2FWRzY2bllRNnZMb3h2VFdNekRCQWdqbGdVRWdvc1FVRTFzdzJwWVY3VnNSYTJkM0Y0RFVrU0N5NVhaVWpiaDlCSXpzdDErZHRTOUVhWDM0cEpHQ0VBUklpQWhra2dTU0lBc0FFa0FDUUFEQXFERzZnZ0ttbHFWb0NGald5Q1FRaGhDU1FEbmVvV1dZNTZyaTVaYXgwcjhaL202MWpLNzZ6NkhvWU5jV211MUxrV05iSWtnQ3hCQWtXUVlZaUdFSVlSRzliT1RhcEp0YXBxQ1FXcTVhWnhmSlE2M0VPam9yTW9TL1VzYzdvZEhHWkpVU1NBSVlnUWhnaEFTU0lBc0dBR0FCWUlBSUdBUXdDMVF3dFcxeVNDRmpVb3RhbGgybGJDSnFVNUFRbkY2M25aMTVEcVdxNkVFR0ZkekhyOGIwYVhZWnhZNUx2YVdjU0VoSklCSUtDWkVXTlNGald5UklMTEVXSWhoSmxxMnBHUUNybnBuRnA4WHE4MDJkNDNhNGF2MFBaODM2RFhsMWxhNlk2VERjSkpBa2tBU1FCSkFra0FBd0FEQXFMQUFDQmdFTVhNdGN3d29oSkdMUWdDU2tKS2psODdwcmVWOUo1RTNvd2d5dHVUbm92MFRYMHZtZlY1dnFzWk04d1RDVEpDRWtLWXZRZ1RVb0pxUXRhc0M5cVdGYTlMRTN0blp3VExWSUZnaW1XdWNhYzNoZHZrMXM3emVvcW5wMk9UMHF6MVZPMm1GdW5JNGtrRkpJQWtnQ1NCSklBaEFDUU1nZ1JKQXdBQk9oQnRHd0tDUVFNaEF3RUNDRVVtVVZKK1A4QVUrUmUrMmJLUzFUWHZqMDUyOWg0L3dCcmpYVDE0cXVTOUpQT2JqN2g1VFVEa3lzbmVDSXRBVUdDQmFDak43TExoMGp3bDZQU0R6Z0Y2Uy9tMlV2UVg0ajVEZExoVHlWZXB4amJiRXEwYmRyemZvUmREYXR0ZVdRRnFTbGtHQ01JRUF3QVJFZ1NDQklJRUVneFU1aGFTZ0Fnc3RBUXNha1pQS3dWZHBZVEM5TDUzdFo1N0k1Mm41N29KYmFNY3pwY1YwblNIcXkwOUo1MzBlTnBZK2t0bS9LSDBxdFBpc05adE51OHEyYjlBenhlbGkyalN5a3d3ZEVlZ2tVaXIwTFUrS2U0R3VjOFlqWnRadFRyTmRUUFBldGpPbmxmV2VjZW1DcHRwV2ZhNHZZaDkrMVpyeFd5R2N1KzJkMmpKS1VrZ1FFQkFRRWtnQUdBSzVwenAwRnhsQnZYSzBtdGs5dGphbzQ3T25uekhZMG90MjJZRWRXY01YTFh6MW1uTWI1MDZjM0luWFRIaGQvek9xcUNlakozMS9sUFY4bTJxTnVWRjN5dWx2RE9uTHZTN1R2RVp3dnJzSXQ1TjdUTFl6dWROVkt1YnFzdGJEVG5QYkpSam03cGhuaDIxajBRNVhvc1E5VkNZdnIzdzNmT2VIM2VlMzV0bWp0YUs2V1ZtL1c1WTVhOGJvV3hsT3NKQ2g4SW1oMkpSRGdSd1oxcHphQzZjNDRMN0E0K3FORGhqbFRtU21VeTF2eW40ZHR1YmJmVHFxMDBVeStPTkp0bmp0NFhycmlaTk5GNnRhYzU3bk8wMU5jOWRNUE85dmo5V2RSWWF6Mi9ROGZ0OFczTlE2SEswbExyWTlpcDgzcnJsWlRvNDlHS0hTNXZWd3R6ZkhlTTJkc3QzalJWcFdiNXZNN1hIZlJNV1pvdlBNT2I2SzFlcnJsUEc2ejE0VnRxNkxFcU40TTRiWXJQUnk4ZGNYcjZQVlRjNURVeUp0S2JhTFFsR3h1eTJpY0ZTQUY4azExMmxwbzNPU0p6MkVhenBrNHZaVnJtOWVSdmFtanM2eFBubm8wc2FNOHJoME02MGh1MGxvbFpQcTh2WFRtN2FLYTY4SlhRZHVOU1l6MDNiNDNkNHRNOEhhSTU5WDgyMGRkd25XNXMwTHpjblhiTFpKbmJIVXdtV29RaXAxRlZ1aFZ1aHBodE5VYWJaN0dlbW1kbmpjZzFNeTF4VmMxZlVSMHFLT3BPdXQwZVYwYjViMFlVVVpNcmhsOVZvMjh0V3NPVTVJbDlqUFBGVm92YmxWSGFYNHoxcXErclZKREYwTnF1YzdaVjBtZks5QmFlb3h4bk5uME5MS1pBdG0xWnpiM2c5ZFZyeU1jeGxYU2x1RjZQeUhYcGhCZnFnMXVRNzNwZkkrdjVLSTBrTE91b0hpTlNQQzIxbXM3V0FyYTU2Tk1iWU1MSUM5U1JUU3FlV2U4V2kxOUluVzBzNWxwWnhDWTVxcTFoT2luTjdYRG5lbUdtRmFkanBjeHF1WjVmRk8yL2hqZkZZWXY0RTU1WitXMjZYSHZONzc2OS9OYkRIRDBGT2U1bmdsczFqVVpXYW9IUHg2bURhR2pWWXB6SHFJYzFkVFZObWF2ZkZxRWxZcjZUcGZLd2pxcm9MVEEzdlhrZVQ3bkY3cm8wdHZyRnFzWXB1ZTM4QjdyQnNtdHM1Z3RBRU1BQTBDMHJabDdWSU1NcXNHVnhJNE9kNlM4eXRhTjJCUzlRU0xPWmV0M0FGcW9yVTFtMWVOMGVWSFZuaXl0VnZLMzUydE41MzFNVitwenhPWFZRUnhjODdHMlhiM0N3aGQ2dUpUSFQ2SEs3ZlB3NkZZeG5uTU5HU2wwVzJZdXJOZTFQT3ZnbjZxcnA5ZkhuMlk4b001clNaR2krbWJpVkxSUjY4UGo5M2dkeGE0bXN1NGxpS3g5UDVwdUQydHNyODZ1YXhoZ0FERFZaVnJ1dTA1aGdhMzNXMlU3MnBhc1JERWN3YllaZGUybUZ4TVd4czg5YlpXY2FWRUVNYWMyTnJvdkx6c3N1MnZWWDViYU8rZmI3eUN0OHZSNWIzTXFXZWMvem5YRDBZeHZvdTI5aUxuSXZjbDBQVDhmMEdPQ1NYVDVVeXl4bFVNczY2anZ4ZXZ5a2Vrb3g1N08rdGxzNHpnTkxkTFVhM1V2eXJibmFLNjExdDAySUhlUjFlVEdxdm52UmVlN1ZZamZXTmQ2bk9sVm0xYlgwQm56WG91T3RMWjJrdkt4b1liVWRXMlRxSjU3bWRTOEYyQVJhQ29TdFpEb3k2ODF5anBlZFJGT3Q1U0wxdGxZbTVyWW5MbTlybktzMTJjOHRsY1hoYjRLSHFFK3JMbFVZUTF5NktPWmFwUnJGeDErY3ZlVE5hK09sRFBYWTF3OVRoaGptOGczbkVyWHJadm5aNjUzVkxZc3BlbTVQU1FPbEhyWTBGdHluRGQzYlE2R2VTcmFPNkZmVCtWM1M3M01iVzV0MC9QZWg4OTJaM2JVYTFuVFMxczZLam1pRlBWK1Q5VG5UTmxqaTJTdGRyWmhWNjh0dVgyVHJqeGV6anVJV3JZa1RRUzhkNkdYbnZXOXlCYm5EclRIVGs3TmRNdG5OdEszdkhIbmRKZkhYT3V0VldJMXRaaWRzK25uTmNwU3hYZTBad2wvVGhyeXlmcjhXZVRROWd0YjgycDZ0SjF6T2pUS0hlMkFTMnNNMGpnS1UyY2FacHQ2VGF2UTN3NTJsNU5LVnBkYk1wYU90THhxZDltbEhlRGsxeTFWeUZlSDJPUDJablN0ZHMraXdycmpjMEYwTGR2elhWVmVncHRNSGh1TlJkdk9hZFBEQmFDRUJDUWhPeEJSTTlLcDZTQ3BDMTY0NjVCaTZwYTh0TE5iWUUxMHlaenRVYVZLenNJM2N5ZFhNQllYTmM5aWhFUGdhRjJza3hNS3N1dHRjT2NyM1EzNVpQMStGUHlhZnNGbS9NcittVFp4cnVZTjloamlkdm05cUp2NTF3STkzcjg1dFRpK2w1T3VvNk43SjdpV3h6UVcxeDU1NTNPZVg3TTg4ZGN0Y21tRUhJdDZpM1F6T1BvY3JmczJPRjMrVmpYWm04RitsVWFZV2xvMEsyS0FERUMyQnl2UzJZcGFLSzlJMEY5SmVVa2xUWEJqSExTY3Qvd0ExbDBkdDNudTVyTVh5YW1lbWJyWVE3WkNTYlpTRElUQUlBR1FLaTBIbFJpSVJ5Nk1WY3k3dVk4U01RdGhwVmlpL1VOSGdIRjN6dlRaN2kyY3RYV1QwMjlFcmc5Vjh4N2h2VWRFcDZjMmF1bWRzSTRXOU51dUUxMjE5YzZhNDNjc3RwTTVWZkhwNFozVDBYQnpsK3FrT2ExNkhMMHJQdG5qYmFZOVNxRDlaeFRYbGNXakd1T3ZpYmEwTitpR1RXM3ZZR0NVakJqTDBya25ucHdoeCswdXpxZERtOURETytHMk5RRFRUUkN3aUNKT2pHVXNha1hFRVlJd3lBQ0pBa0VSQVFGUmNEenB0VUZsdWpWVjRYcHRxODcyWDZIRDE2T3F2em5kZDJzbXVZOU5scVpWUFVleHR6R2E3bk95bkcraDFubjROcmJ5cHBucmNYNm5QZnhwekJyUEo1OGZyOGpWZHZ2OEFrZm9LeTUrdlZ2T2FETzJOd3hNdEhPSE42dlA4N2JQYkhieWR0YlZhM3lsalBld01HWTlLNURPdFBOcThhdWpEMHZtL1J4dDB0Y3RPV1hNTjg5TWNUV1U5aGF0U0pVNlFaSnJsWUFza2tBeVFKSkFFZ0FpUUlJQWdOUUFJSDQvWGs1eDE5dG56UVRZM1JmMXFsMWFzUFc4NzJnNldtdVhKcG12R0pGN2I1VlBNd2VUM0ZiRGJTRDFPZDBNYWJ4dWMxaHlldHc5cGQraWZPUGI2YzNadXN4RVh0SVRKSUFwcEVLeG1ZM25wQnBKSWxveVFLZWY5R3BPbnpYcXF1cnQ1L2E1WFd5ZlRhd1BOTCtjTjRyV1d2Vk5DMUdxRVRmSWtUVE8wa0VZSXd3UURJQWtnQWlRQklBZ2dIQkFIaE5MVW4wZERuVkRTdlY2MEx3Mi91TVV2SWRoM01xUnRITkRYUUl5eTJvem00TjVhdEhGbGJlV2VoeStuazdNcDdackxsZEZMZk5LdHI3UTE5VjRYb01zU1FWbkFDQnJhZ1dwVFJWWVdEa0dCQk1qSUp5aXNmTURHTzdmcTgvVEcrM3Z6K3B6eGs3ek9rNDRaWlIxZlhPRzhMSzNQVzZjKzFPY3hjTm1wY0dDT1RCR0VTQkFRQkVDSUlHeUlBRWdEeGRNd3VpMm8zUU5LUFJxc091eG5weE4rakNjUnBKbVUzd21zNjJ5S3dYZTUralV5ZVgyV0xpVENHZHNOWW5uMFcxNmNzbTBXR2U4djR6clpIc3RxRTVMYVphdFoxNTNVblJKL2tkQlZ2SUx4a0JIQ0NpZUtweEgwNXZKOWVPaWczVnpPMzErRjNPZWVmMXVlOU0wNDNiVDBBMXl1a0xtY2Z2OEFtK2dkWTVuUUcxdGp5aWZRWDhucHBIcTlmS2JrK2xuRXNMc0RsOUJ6b0lITWtBU0NBQkFIaWpOa1RvVWF6MXZmaE5MWHJUamM4T3dnZzFvZERyYzdwODFWVVlXVldNazNnbzNSMHBtNmpxdWV6bE5CdkpqalBJVkZPakxaaFIrTk9uMU9XMWhYdFQ1M252bjdQYThPN091M3AvSzlsTG05VGx0eFhiQnAwY1ZkT1JNdDdiK000T3VucXZPTHYxZXorR09OdXptZEZEdmQ4OTZMbmpTVk14QnBtamw5Rkp5NlE0WHB2S2JtUGY1TzFHWjVEVzBhTE5yVXJNODNkUFdaNkJ2b2dtbDlBMDhyNmVjN0Exck9DQUlKVWZtNmEyeG5vZWU5QnlqcXFpT1pzMlNycHBHL1FVN0dWZFUxejVORlcwWGFZbFRscGdkQ1BESnJXanpkV3NkMWJrUDh2bzU3eXAwejA2Q0hVeTNjZjV2UXdzamVzR0dzcU5saGJXRFcyWlI2QlRseThkT1l4eWx2ekU5OHV5TDlWQm1WbmFLSnQxWjVxUFIrbDQvUzRsZlJlMEp1Mk90Wks0Nzgrclk0M2E1OXRiazlienU0bE04K3ZMck1jWjJIdmx1RTg3TFdhMXd1dURuclBFK2h6UFRWekJocFdCa29haDRoam43VGZlNS9TODNPeVZaZnFqVFdqc05qczhYdDgxM3lzam5XanVPaVpyYzU2WG10SWVWZGNLZkhPODNuaEs2VTd1U0dtalZ1eHlPcmxzL3FHT2ZXMml0NU42blJGTnMySkpDRUNrbzNoekhrZEh6S3NVNklZd1lXUzJ5bTZSV3Awa2V0cXdqd1BmVmJkUFpoZXp5b20zalpkSjNoMDY4ZXg2MXc4ZWlqMFpobFdCMmRPZDBNMnJreXRScXJvczB4MWVhOW5YcjVscEdNTlExb0tCcndqZFdaMnVzZzQ3NWRyYWJSdXRlOHZydVkyNU5HZWVkd1lPV21kN3dXaTJjR2tjM29rNHJieTVuYzhwMDVLa0hzNWdhYU0zZTUrMmVucEdWSHVYZWxHWkl0dnJvaWgwQ21DOERERjFPbXNnNmxWS0xPWTZyUk91bHhHMDNKT2Q2YnpYc3NuMFVtdWZ5VTFzbytsbXducTVOd3ZjenpucGZQYkNDK21YVkZ1WXpoYzRDQzB3OXpIWmI2YkZJYVNqU21rdTlUbDlESy9SamJQUFBXeWdhZHJtR3ZOMXByT3ZGdFRib1Rka3BMMDFIU2l1cXRvbHozVjNtZFZtbXkydVY2YTQ2NTA4aStsbTlsbVYyWWVSNjZIb2MvUHNMOU9kTktYRnJBVTJQUitKdkZmUWIrVzdIUHIxTlV0b0hGNzBsWU5yR2p1ZVdiNTlTVjhFNjAyd1ZZMEUyRjlxalRhMTg3Ujl6NDMyZk9acU1ZWWFXNktEcmpIZkZaenBmejNvZFpWNHpuSDJXcWZSWDFsTkhvYzNWYUw3NE9iTnB0RGJ2aHBEVFVjVXVXK2doMGM2N0VpdWE2YzVMWXRhYjFGNVZ6ZEI2SUVWMm5QYkhjVEhvdUwyK2JWR3RMakhXNXplYnMyczNsYTNRNS9XenJmazlmaVMrbHpPcDVxMXpLYlllaGd0cGxmWFBQVEhTbGUxTFNLbUdnU1FMV3BzaStWYkRrdFVLbVFRMHkxSE9qejJNOUpYYk1mV3JhM1BlSHEvTSttNTZvaS95WnA5eGJWUmh6aXAweXoyK1hhWlM0L1F4NlpOc1NOSkRvYy9iT2drcFJsVmhEUTF5aXNGdDhibHJvYy9lSzc0bFluUEZtZzF1Z3JnSFc4cDYzd3FkelcyOGk0Q08vclcvSnZpdmFXdWlhMHh2bzdLTTVWVHFJZFRNbkw2M0lsdGNIdmMvVmNERzFlL0hHVUdrWldrcFcwcFpMT21vSG5WMUpxRUJscjVrTlJBZ0MxV0RmQzZldDg5bzBacHRUTzNwYkROdWVrNFBlNDZVd3R1cXdndzBsVlYvRG96NjNudW55V3N0a3I3d3pWL2pTd2k2dHBDc2d0SFhHNk9pRFdLUm1ldHpwdXR0TDlDZWRwQTVTa0VhU29lcStiL1d2bUpLT2RocFZ0MXV6TDZhemFuTHRqcGhORThCYkxUZC9tOWZHbWRxakdXK0oyK1NQWG52OGZRNHRUajZPR05XVnJsblJKMUN1dStiRkcxc1hPdVhVNVFTU1VRaUJvYVdBMUlSV1FzMFlWNkdlZzZTSFZ4MHJsRzgzZjBIblBSYzdGSDA4MHB6KzN4dFhtemhmYU9Oa2FkTUdtbVRUNld1VXZOWFZmU0Y2M3BjMnRTNkhNeXNxcG9BMXB0anNtek10NWVtMkZFUDRwdmsrMytiL0FFZjVsQ1ZOSnVIMFBCNytPbW1CbVdtT0kwMG5veWx1ZmJmdDhicTR2b0t1cVpSckVYVlhNNFBiNG5TK2Fyc3Y2SEs2dmZWSlIxSmxtMmgwenRGTHJjelNIY2xldUhJa0ZvaVFWclVzTzFaQWhBUnIxdWF4bnJuMmVhN2xwZm9vTjVHajNOWXlyMHllbGNNN2NMdThyU3NVZWh4T2lWOWIzMmxWaGFNcnJaTVNlTzYrMFoxSXFaZWxrTnE3WUp6VFBkbVcyV2lORzBtWnJhdGFCWVVnZTkrYWU3OEdwQU0wVnZSK2I5SGhvcmpaWXJYZkxSUGZaQi9MWGZyOEx0NFB0cHRjL0xOUjVKdWRsL0srNDhGMTVMcnRLOTNQWnhPQmNhWk02dUdUR2RqbGRCQzVtbWNxZWx6T21sSmpCTExHcEFtQkUweGVUdVYyODlXVHNwanEvdXQwYzFnUmlxNmZVODM2WEdkdVgwRTVGdUwwZVYxeFZmZkxlV0xxNG8ydzN4cEtyTnJhUmlDS21YcFpHdUcrQTc2WldDMWdVeXltd2htbW9UeE53SGY4WjZ6eVJNTmIycDZmeS9yT2ZYa0tOSzBiWHpvVmZxSU00NnNlZzRmZTV4MURkSE0yMnkybHRlRjl0NC9weTRoclgwTWJOS01JcUtiaFJoY0RaNTczUGF1YWxvZFRsM1JRZFhraFkxTkZxWG9qUjIzUGx0ZEJkM0RvR05jUWU2eUhTd2ZNWjVqMXZiczhudFlKem1kTG5acExoZGpqOXM0R21lOEN4WGFmeDBwSlpCc3M1ZGRNOU16YWx4M3gyeENYenVMV1ZpZEdWR2dlcmZHS3NhWEgvOFFBTUJBQUFnSUJBd01EQXdVQkFRRUJBQU1BQVFJQUF4RUVFaUVRSWpFVE1rRWdJek1GRkRCQVFsQWtRelFsUkdELzJnQUlBUUVBQVFVQy92NVVRdW9uN2hCQllHblAvd0RpY2dEMWxqNnRGbG12Sm43amtXR0kvRlRrRkh5ZCtJSnVFei96TWYxU1FzTjVNWjJRVzZ0RmxsejJ0eG5BbUJGR0lSSy9IckJWT3JBbjdwelAzVVMrSmZrSy93RDNTUW8zbHBnQVhhZ0xMN0hlYlFJWjJ3ZTRjRlh3VXd5aXNyTHR3Sk1KSm55aGlrckVzNVN5QWcvOW9tQll4QUYycVZaWnF3VDZyRnNsaUo0QUhIZ3FzVEFPN2gzM1IwMnRqY25vWWk3MUF0S01sZ2VEaHE3SXI1LzdCTUM0anVFWFY2M2JIZHJDT0lqNGJFOHFlNkFUR1ZTQWNEc0JBZVBXQWM3WnR3eUZzZWw2c09uT1JZMVVVN2dyWWl0Qi93QlV3REVkdG8xdXRqTk13ZE13akhSVHl1UWNaaUhua1FjRzFBWll2Y3A0Rm5LMmlKa3pjTWVncWtNY2pLeEcvd0NvVGdDTzRBMStwMlJtNWdnNkRwekZJaUhnWXlGZ1dFYzJydzlaaStSNXJkZ0J0TUc1WUZtSU1yMFI4LzhBVHh1YWFpN0F0ZmN4NlltSnhNWmdnRUVVQ0RrZ1lDNTZNa2RER1NZeEs3SW1JckVRY3djZE9KdXdVZlAvQUVUUEF2czdkUmRsaWZweE52SVdCSUZncmlvWUlvRXhOczJ4NlJHMCtJYThSZUlqUVJlaEVKaVdjcTI0Zjg4Y20xc0xZK1JhZW9nRVZNeGE0SzRFZ1NDdUtrQ3dDWW1PbUlWbUk5UERVekwxeXJVUUdEam82eHVKUys1UnlQOEFtbnd4Mmk5eVd0YmkxdTgrWWk1aVZSS2NRVmllbkFrQ1FMQUlCTWZWdG1KdGoxQmdhUFNLV0VTcThPRmJreTFlS2JUWGRXM1AvTU16TG4yTEFjdXh5MFVTcXVLa0N6Yk5zQW1PZy9oeE5zeENtWlpwdVdCcmRHeUZNYmlhbE1UVDJiNjFPUi95MjhabW9mTHZ3aUhzTUF6S2E0aXhWbU9nSDgrSmlZajF3cTFacnNEVDNDMU55YVN3clpTL1AvTHNPUzUycXgzTnFEaGYvbTY5dGE4MXJFRUEvcVloV01uRmlGV3JzSlE5dzFGWnJ2cWZNQnlQK1N6YllvNDFEa3djdHFHeUc0SCthbGlDS1A2NUVZWW5zc1Z0cHVRTlhVWlEyNVArUXpCUjhXKzIxOXgzZHR4N21QU2xZZ2lpRCt1UkxrNERFRlRtdGxLMmFkditUamNXOFgyNE9JL3RzT2JYNlVpS0lQN05nekg0YWs0ZThFQ280WlRrZjhadVRMVGlhbHU3SERubi9UUlpVT0JCL1pNdVhsZUdzN3E2NVVlUCtNT2x6WU5wKzZaWVo4dEtWM09vZy90R1c4anc2ODFVTk5PZitNZXRoemIrVzl6elpQZ3pSRExyQkIvWk1hUDcwNEdkdW9vWS93RElieGMzYnBQeVArQnp6L241MFErMklzSDlreXc0aithanhaeGRwM2l0bGR3bTlaNnE1LzRkaDQxVFlxMDBzUGE4ZnBveDlwWVA0UGoraVpiSE9EU1J0YnZXaWZFdHRGWTB0SkgvQUFoRE5SK1BWOXdwOXR4NWg2YVVmYldEK21Qck10aUo2c1dwVVJoc0ZhaFd6aGQwcTArVy9xSCtjeTQ5MnBiN2VuSGJhMjRNWjVQK3RMK01UUFRQOCtabWJoUFZXZXNKNnNEZFRMcFJVd2xqY25tQXNyVklHQVJRZitHM2t0THlSUnEvWXZZdDNFYm92dTAzRk5tcG43c3dhdURWd2FwVEZ0VXpkTS93Wm04QVBxQUkyc3hQM1RtZXUwRnBNem1MbUt4RVJvT2VseVpYMS9UYmQ2a3MyaUFrdHBEeDlCT1A2UHovQUJNMjFUcUFzVzRNQy9HWTdjNng4VjM4bHVIMUI3aWNtSjVaK3c4d2pIVEU1RUZoQlMrQzZKWm42akdNTHpjRE1GanRNU2gySTAwWFRLSUtGRTlFVDA0aDZHYWdtdTMxQnNXNUMrTVRRL1F6aFlGei9Qa2RHT0dEUVB6OVQzT0xmWFl4VG1zZ1RZb25FYmJoL3dBV29iZGNPNjdPYmJqejByR1RYWDZrR21RVFlpeGdoaHFxTS9iclBRTTlNaUxrU3N4RDlUTERWbWVnTUN0Rm1RSjZrRm9pM1JiQkEwek1kRE5Xc0tBeGFrVnZqU2U2WmhJeUZHNXp3UEg4bGxpMWhsSklNSjQzZHEvUVhVVDFadmNsNldZL3Q3SWdJckhqcGJqYmUyVUxicmErQ25zdGJtZVpRTXZWd3JOR3NqWFRmWkMxb2dzc2kzQ0RCbkVXQ0NZbUp0aEVNWnBaZHlWc2FDcEorMnIzRFNFZ2krbVUzaGdyUWRkVXZLSXdnRzQySjNhVTRNZWJjdzRVRCtRRUdFeTVFdVhqYVRnYnNwdWgzYmEzeU1ja1lsdVRhTTdxZmR5Q0kzaGVTWVllV2ZsbDhlSGJDNmR6bHVta0hjT0E1aDNPNTlLc0hVZHB1WXdYa0VPcndNYTRyWml3UVFURXhIaGxoSm1GcUZyV1R2TUNXUkxyVm1uMXl0TE5OVzhyM29SQjB2WGNGOFZMenF1TEtEaWJ6TnhZK293aFlzeWdoZlZhYjJtV201eEdMemUyTzZkMDNOR1k1SmJGSjdOMDNRdlBXV0c4U3UzdTM5MytlTTdzQU5sMy9JR0NUOXdETi9EWE1ZdVFQVWVFOUxlR1ZjQXQyYWs3YU91aVdmRm9ZRTZvSlhocm5PazJVb293cDVmRHZ0YXVWK0Zpd1FUSFN5UEhjSktxOXphdXVXQXowVE5GcFNKcXFNTlU5OUFTMDNBUWRMWmp1VGc2ajgxZnVWdTBETUk1K0U3b0J6eE1pQTl6OGpnVGpNUGdzWTdNeUtXM0ZvMlNjOTdObU9RWldWaFpsaWxsTzZ6Sld6SHA3UnVNdEJjRFM3WlVXQUF4WTFuZG5JWHRUZExPWGQvdHNtVTFiYm02Q2FJZGhYY0xLN1lkS2Mxb2EyRi9GaTI3cTB2VnFxSERsaVJTaFFnUllJT2pRaU9JYVh5dGJMSHJMTCt5NEdqRVRzVUljK25tQ29aeGpyWjRISjhHM214UGRXZXF4U0dLOFI4YmQzY3I4NzFtNVp1RTNDRmh1c2FiOGxiQ1F6TVk5b0VKR1NWU0cwYmErYmJMTzJCWU14WE13cG0wWVh4UGpHNmNReHVJMGJrT1FMYkd5dzVFWHpvZnhZbTJGSjZjOU9iTURHSm1Eb29nZ2k5Y1J4REQwMnhWNFVRUWZTL2hPSDFBNHM4L05YSTJRcEd4Rjg0bGpiRlRtQXN6QTVqZUJZTUF5eFFKZXBLVnVCWHZBWGNjSEpCVnRwT2EwKzQzc1pSdU8wd2tyRU9WSVBxZzhmQTRPSmxzbHp1Qm0yRVMzZ0JjMzNtQTVJNE1Yem9QeGpwaVltSmliWnQ2QVFDQ0NENkNJVWhXYkpzTUNOQXA2RDZiUGF2Y2JtQXNiODNQcVZ0aXRDU0MwWVpnSVFlb3JSaUFjNWdZaUU0VDFEdklOYjVFZXlOWkxkeGlYYlp2RG9NQjNQSjdTcTdtZW96VDd0MTFxTll0dk5iaGkvZFlKdXdHT1dBeUxBUUZRTUFuYVBia1IvZFh4WHEzNFh6L0FLOE5qQi9UbXlCMHg5UVdZNmlENnNUYk1RZndYSEZkYXkvblU0LzliYzJWS0NpUXdqbGtHTUtSYlVoQUNwUFR5MTF3cFg5MFRGdnJkV3VJVTNteUkwWmhHUU4wWlNGMmh4WXB4VXpMTEN5UmJEdUxicFIzbGFYV096K3F1Q3JuRURjYmpodTFrNUI2QXhoTHUxTG16Y1BjL3ZubWZwcmZkSDFZbVBvRUVFSDlCaGx2bHp1dnA1c1A1YVQyZXBzWDExYVhYRlNMZHgrV09SNmt1MW5veTI0MlBGYmw3UkJZQWR4U1pEeGRreDNObWJETEJVVTNxUldXRE01eit6OVNhTVYrcnRGTEpmVlpPN2FVTTRESysxay9MdUJJSXo4akdjWm1xczVobmtPSWZGQjJhc2Z5aUQ2RE0veVd0dFJ6ZzFkdGZQcUkreWFsN0NLVVJrdkFSZE05aFhPVUFEcnFBMVVzc05oRVBrakV3U3Vkc3BPK2VtMFdzSzc4UjNNOVRMaFhMRlVKN3MyR3RBcW1hYXBhTE5oTmRGbFQxTlBXeXZ1SlhEYm9QYzIxV0JERHhQQzZwdXpFK0ZNWWZiWDJjK25VMit2Njh6UDBMQjlCaFBJTXovRDhYK2J2R05zSHVFcWMrdlFnUTNWNzJxMGVwd1M5ZHI2Z3kyNWhXWDNRSGxwamo5dlo2UnlKcHIvU2diS2J0cFpqR3l6VnI5dHJUNlN1N09aWWRsaXZINFZUaFZaWm5KYmFCV3lXTGF6WjM4QnVOMllnSXFhWG5iVGZ4U09nOG8yNWNZRS9Uck4ybUgxa3hmb0VIMDJjT0RNd0grQm0yTFo3ck9TZksrVGdxVzc5T1AzQndsYzV1cnQvVG0ycittMUdvL3AxbTkrR0NvZEpwdEViVjA5UkRXYnRLUzJRQ1ZldmNVYjM2akN0UmR2bGpZajl3cXJKYTNiWFd6a3NibXdkU3VLYVdlTzJMUVhFOVhkQWh5Q2NzMkE5aWxxaVp5YTNWZ2RZMDFneFdQSmg5eW5hMWcyRnVHL1RMZHR3K294cFdQb0hRZlExTE5aNC9odWMxcHZabzM1Q00yTkt4enFXMktvRFhWZzAxL3ZscWY4QWQwRU5yaXNmVzdLRS9VV1pzYjJWdlR0MWV2WDB0TnFLSzlJL3AzMWpBT25BYTBZWlNxeHdjMURsMTczSElkb0NITDl0bDIvSTJiRk5qSWVLVHFTSlU4cXMzOUJZbTV0aHRiQWljQWR4dU82N1crMGVSRDRwL0d6RnF2S0l4U3lxd09uMUdKN1lPVHNYQjdZT2ExaDh3UmpoVEFyRWZYYlY2cWxDcC8yZkxDTHhOUU4xTEgwMDAxamxOKzE5US9yMmRyMHN6dEZ5c3FkRTBvVVZ4KytPcTRFK1ZiYVJxazlKN056RjVTM0xaWmNzRGttSjdqamVOY0dwRnV4cnQxTm5GbGVvcUNHaGxhczA3Sm1XQUVodzZxeTdVc0JVZHFlYjlYN0IweG1MdEVxOTdEYVhHMC9wMW4yYy9YbkVONmlhZXhiTElSdVdyMkx3MW5sdCtZOFZOM1ExbjFHVGFQcEI1dk9iQjdtOE9JRWpVNXJ0MHU4dHBYV0hUMkFKdUMrbXdibmU2d0tKYnVNTERIS3pFcjlNRDdMZnA5U0tRQnZMclh1WEJMR2JjeDBBaWc1RS9ZclhMS1JCdjlUNXNBYUl2cHZYZFhiclJXMVlycjM2bjFSVWYvN08xTGpkN1VtcC9FUEdKUTJYOXB4NmJNbTZ5eXZuUXRzdkJtWm1abWVsSzVMSXJTL1RZR2lyMlAwRVlSNEY1bU0vUTltODU2am8zTVZkb0VJaEhPY0UyWVgxQk1nd3JtTlJtTnBWTWJSbWZzMkI5RmxqRVQwZ0Z6Mzg3UGlwKzFDRlJibUVkc3phRUxNRE55ck9ERnh0M2JaU2Q5UWI3dTBFa1dWRE9YYjAzdHRXajl4KzcwOVliVTFyZGJxNjNSV0RGTDIyV25BSEExSDRmaVZEbXZ1bTM3ZnRWaGhtWGJZcDNMNG02WmdNektPb3IyUDlEZUZqUWRkUmxnQnhBSVBvZGVSUGsrN0hPTXcxS1o2T0ppd1RlUkZzQkhCaFFHR21HaU5wRkkvWklJMmxoMFlFV3BheXlremJzQ3Zsbkc0c09kdk83RTRNd01vNzV3V0xyZ0ZSTEgzUTh3b00xa2JsQ3JOdnF5blNxc0ducEQyKy93Q2J6OWtjajRyZmF4NWpLTDY5KzVMY2VvVGthUnMwekV4S2g5ekVDZ045UWg4ZkhrOUNjUTh6Yk1mUXh3cStDT0JEMCtmb3hQVEU5R1ljVDFHRTlSWmtHRmN3MVJxaUlhekdwajBaaHFJWnQ4OFRkeDNDQTh0N2R3bk9IeUo2bkc0Tk40QUtQNlZXbzJLdTVrcm8zcXVsck1yMDFTMnQ3M09HMVhGS1F4ZUNDWldkdGpEdXNIM0FjelJXWXM2NGxiYmwrc2VZWUJ4MFk1Nll6TWJSMXRQRlh0K1A5R2ZIKy80TVExQXowWnRjVGV3bnFpYmxNSVV3MGlIVHc2ZUhTaUhTaVBwU1lkTVJHcWFkalI2bE1mUVd1VG9kWFVkTm85OWE2Y0thcWUyaWdHNnZUcWF0Tms2ZGtBbmlIM2VXMVh0WHcwK1ViajQ4MXNUNmpEREtkclZ2NmlRS1lFZUlIVnZQMS82aDZGZ3MzK29kczI5VGpxNzV1cE0rSWVuK3ZweUQ5ZUlheERUQ2pDYm5FOVdDd0dkcGhyV0dtTlFZYUloMkRSNmsxbTc5U3NkZExyN0tUcldLYVd0L1hvc2RsdDF1YWIwR0h4Nlp0N3EyNFZ2STl1b09iRUVNUEVUbHF6dWEyekUyaXdGVDZvODZGOFJXMno5eEZ0cmFiWjQrdmNBKzhRSE1kOWdWYkxpdGFyOUpubVd0NmRkUkpzVTkvd0FROUR4OVB3djhlSVZFTlFucEVUdm04aWVvSnVXRnlyVUkyY0hPbjNMYnE5NzBWUDZjYnZWdS9TMXZpRjhsMzdYYnNKZzRqbkpBeEg4bUo3dDJ3YWp4cGptcXhTWUJ6eXNwc0Z0ZlJYWkl1b0U0UDBabGxtd2p5T25wQnJQcXlKdW42aHF0MTlIRXo5MGVKOHd3ZlVEbitiRTJpR3NRMFQwOXpWVmxMWFhNV2l2WlR2UlNTTlRWY2NjWnVVMU1mQk9TL3U4dloyMGhlVDdtRUk2ZjQ5MU5lVlMwQWl2QlZ4OXZTMytsYjFFQktuOXl5eXZWcGFaWWNJREFZT2VnK290bnBxYi9BRWEzNGxjYjJBd1ErZm4renV2TEl5alNqWXRSdDNTcjA1YkxLODFlbzB0YmNtZWViQjgxeTg1Z1dORzhPTzJEa3FNeERrZWEwSFkvY0g4ZnArbzNMTVFWdVl1bk1XcEIxc3hpRDJxYzlNWityQW1CTmRwOXhQdFRoQjdLeWNEdzN1L3RmdWFhcGJmUmRLVVVKZXBWdzI0Yjk5ZWtjRk0ralp1ek9mVHAyK216WXJUdFJlNllCc2FOR0hFV01OcTFmZ0I3RDVlV2pBMEdvcDArb3B2cXVYTXpNd3E1aW9GNkVSaGhzZEJBUG9PZXVyMVl0dmFzWVFiZ2h5MEh2RWJ5WW5qK3czNmNFRmRhYkZTdFdzV2hnLzIyRFpaYlJXMXpicFRic3UxU2dDcXNycDNIZmVmdEtPMERneXozWnlQbEkvTHFkdGZHNy83Vyt5N2lhRFRMcXJxcUs2VSt2YlBTbnB6Ymo2c1Q5UzFKMDlOZkRZRFcxalkrbTh0d3FSSmI0UE1Yb2Y2NXZ1ZUI3UWNXbWJIaTF0dTFOYTAyV1lhTmJrZk9tTE9TQ0VHUzFuZWR2YnRobGk4RVlMRHVYR1dIYzAzRGRqQnM5cjVLYVBVdnBkVlYrcmFTeUxxS1hnTzcraHFOUFhxYXRUcDMwOTMvQU5NWnNxOHQ0MC9zQjJtMGJxMWJoYk9ZMzlkRjdBSmpwV3MxZGJtTFhjSit6dU1YUVd5aXA2b1N4ajhMVXZPM01idy9pejIrSllNQUhCUDVXSDNBM2RudXZQRmg3UDhBVTB5RjdrVUluMC9NUTVUK0Q5VFJEUXg3Z2Z2MUVMQVpVTnFXSEZ2bGMrbkRuY3JaakhDN3gvV1FkdnRNMzVPbkFhS1JPSXpxQjZvZ2NaOXFrNUtEc3p1QkVQaHBqc1BzK005MW5nZVQrSjMyemJ1b01xUTJOb1AwOWRQOVlseHhVb3d2MTY3VU5wNnRScVh1Zk81amhEY2RtbnJPK2tlMXptNWZiYXJHRGEwVE8wak1aZ0t4WkZ1YWVxc0J5UDZKWUdjR1lFRHRONW1iSnVmR0dlR294YXNrNEk5TmMrVm5sejRQQUFoNUI5cTh4MjRIYW5JcnRJeUNLcTJURTBPby9iYWhmMVBUeHYxU2dMV3pOWDFkZ3Exbkthazl2OEg2bSsvWFp6WlFOMm9mTDIzdDZvWEFDKzNQM1BDc0pZdTFxWDNxZkY2N1I4cjdoN1EvYis2eEJmbWVzc0ZpR1ovbXhCRVFtYkJLOXVFeE8wejA4ellzTEtJdnQrRE13a2xmbE9XY1lEakNKd3plTTVleDlsZnl6YmtnNUtqalNWZXBxUG8xVm5jbzJwZTJiYVRtcjZ2MVgxYU5WOHB6WnArMWR1MEwvd0RwclA4QTZoeFhVbVhZOUxLKytzQkxHWE5kbUcwN2NXNzh4UHdzM1l3bTZlb3dWYmpCcUorN3hQV2F5RFVzaFZ3LzhZWEVGQllZcUVCd3FuTU5vV1dhdWV1elJEbGdPRzl2K3lPbnlvN20vSFp5M1BxWmlUVVdkeThrOGtkMHJsUXl1Z3dOVERnQzNXN3BXNHNyZHQ3WjdOeFp0SWVvYkpsbXNGTnk2elROUDFqVVUySjRORmZhWGoyYlUweThVbjdkaHd0YTdWaDhlWWNnNWx1ZjJiTHZzcVU2alVMaXhEY0h1M2Jvd2dZckZhVmtGOG5vTFNSUnEzRHE0WWZ3ZXlhWk1tMXRzYlVjcFNGRjJzNHNzTmhKeEsyek5PdmI0am5oQjIvNitQaysvSEtjdGo3c3E4V1B6NFg0WHlQTlp4TWJYL2YyNHNkN1lJcnNGbTcvQU1FcGJiYkNjQXRQM2UyYXU0dTNrNTNCS2phKy91V0ZpWmUzcDZYUTk5ckRKSnpGaDhmRnE5ODI1bElKcFk3R3NjVjZkWHl6TmhzNVZsNkJ1TXovQUR1T2RUTkplMkZZT3YxTFdSQ3ZOWFpSWXhJcnJXc1c2amZCZ1RlSjhya3hRRUdaWSs2WXdubm92dXhrdjdWU1dma1VaTmpZUTlWOXdQSytGRzVjZERGUFJXT3p4MHFzOVN1NnpNTFMxOFJ6ay9DZzQvQnB1UkxNU2diMzFMNzlSK2xMeTV3WXBueUphY0xVZUxEc1YreXlxb2JOY1F6WjREOG8wem1NczhBUXR1TzdFdS9GcEdLaWh3SCtyMU1BTnVod2F0dmZmZG1GODlNWWlkMDB0T3h2OVdOdFNzWmRqeW50aSs5ZUJqSTJZcnRYdlhsci9CUFZQY296RjdZaGhFeE1kQjlPWXhscHpHUEt4RkxtOS9VMWRmbGp1TloySnNKUDZldmFlV0VROGt4WllPeWttWDROVnk1dk9TYmwzT3g1ekEwVitqQUFra25NK0xUOXJUTmdvU3N5Uk4zMDdzd1B0bWxPL1RhdTNhcFBRQ2ZOU2JFcTRRWmxyN0UwL2JRZmQ4dEZIZVIyRGszSGkzTXhMejM5UnhFZ2dHSXJBaVk2TDlKTWRwWVkzTXhLdTBBYktoeFdneWJ6MkR1YlNyc3E4dG5oUGY1R2VXNXRDNEo1cnViRFA5dXU2TU9ZUEt4WGhHVk1CbVpiN0FtVXFjbWdIZ2dHY2laNjErNzNPaEZkT295dCtJQVpqQXEyb3RlYnJIYllFOXQ3Ym5IZytSQ01sT1Jad0JITzhXRE42NFZYOTNqb09sUEtxSmpwdWdQUVFmUVl3bG5rcng0TlkrMFR1ZzdyNmZkYys1OUhYdXRyOWl3bnRIbFlrSkN4ZTFuenMxTm9xZG0zUmNNTHE5aDZDVm1CdUdFUEhTd3pUeGVDbnMrYzlkMCthUmg3M3k5NEZpY0Nic3hWVUt6dFpacFU3bUlheG4ybXJtMGQxcDlpanMrYS9aWVJ1Qnd3NG9ZZHVzYlpXT1lIeENzRUF6Tk5GSFRFMlFRVGJBTWRNZERIOE1KWmdURWM3RithL3dBdzdFUlN4MGdBb1BiVDRzK1ZNc08yRGdZM1VmNTFCUG9hcFMyb0lBY2t0R1lQVXc2cVlwbmtNRDBQSnE0aWMyemVSQXdQWE1WSlNRZFRhKzVxclBWUjFLdFhYQ3hkMDdtMHd4UXN2Ym5TTGhrYjdZR1lURjVnNFN6bTRqTmFqY21NaTEvVmZ4TzNZT3RKdzlaZ0hYYk5zOFF6TXdXbm8yVEl3OE1kY0tCMzJOa3FlOGVMWUR4VFhzcHYvQXB5WldJK1RjMmRqbmFxL2p0UExqN3plUWVXNG5ucUlrRWJ3OCthNHB3NysrWWdZaUJ3ZWxSd3Vqd0paNzBsYmdxeUZ4RVRMK1ZEY3VkclY5bEdOc3JpL2pwT1lZZVdBeldveGRZd1VKd3NiekJCREtkWXlTblVWMjlSQjBaSjNUUmx4TE4rM0hCRWFPZUR3cmVhL3dBcSs2M3hRTTJqeHEySVd2aUZvQnRyODJmRFhCN1VZdlhxRys0bGhhT09QbHhpZk5xRldnaXdUNHQ2VnhmTEVxRnZCbWVoV1paWjRvMDNHbFBKVVF2eHZKVkxYbW5ZMk5ZMjJ1cHlSYXAzNDdNeGUxTE8ydlQrZmpIM2w0VC9BTzJ1Yk4rcDQxTXgxSFVIQm8xN0NMcktURnVyTUZpemNJWEUzQ0xhYWlkYzBiVTFDUHJLb2RVcGpYbHA1VE80MWNYRWVtYnh0VFNmbTh6VUg3M2hhUm14SDlSUG5VTnRSR2RTaTdFMUQ0cXJiWVlsZSsyNGxqSGJjdlJlZ1BGM2dTdVk0K0NBWU55UmJsTUhTMW9wMjZNK1NleURtS01qVG9GWFZFdkt2WUNYc2ZpZTYzL2R2NXRPTzMvTG5Gdml5eGdzMUdmVnU1c2g0RUhVK2VtZWdHNDJFR3pqNmg1SEpWNG9qZSt3Ym51T2FkSCtVR1c5Mm9zUGN2YnB4MjBXUDNXT0hOQTlXV3NNYWo3cStKbmJNajBtOWgraElSTXkzd0lrWnMxdzg5R1hNOVMydUplckRVYVZLdFBjMjJnOHc5QWNEVHFiSGRoTEJrMjhMcFZMUnpteXRjTjVkcFQ3WmQ1SEs2ODk5M2NHUGJqRXM0ZUNmSjhIejhkVU8zK0JmS3ovQUg1WnhsODUwMk4rbDBmNUs1YjJYbjhyS0EzdXIzNE52Wk5DbUJyTE8zZmxIVVE1M25paytEOUN6eVBtMkNlRkhqNldVTkxGOVNyVXNIdXpENXhtTDdkTU5sSEpZZDkzNUdwOFozU3M3d25LcjRwR0laWjRUbFAxQlB1anVwOTJtcWZhWHI1ZzZsY2hmSkJCNlovZ3JCTVVjcjVZZGg4NmNlcHBOTllaUW0yNnJ6ZjdrVDc5cGhiQXM0SnlHOXVtdHQzVE1VNGdVbHJHSHF4dlBWWUR3MGM1WllUeVBjclpXWjZIbzM0ejVITVBuL1B3UnNvSkNveDI2Ykd5aGZhZTQrSWhPMnRJc2ZpWCsxUFpyVUxoOHFHT0sxOGZIMFoydllteDlRTWorSlRoYS9LOFdWY2cvaTBmZFNoMjZ1a1l0cmx3NFJlMjRmY09UcDlSeTFkYlBacXJ2dStua1ptWlVlNndZZzhXakRkUkY1RCtQa1JmSytWOWdzbkV6MHpGMHN1VFpiWHc4UE1wVDFMczduZm1XRGRhZStGZ3FyQWR4WHlnNFB2UEszZWZHbnNKTk5veXk5OEhBOXNVYjRVeDBHRExKVGk2clAyLzR2aXYzV2ZtSGFXQXorbmtHMWtnWUc5QmlYSkVHRXRYTGw4bTVlM1RZU3YxTzlXd3pEdTdkdS8vQU0xbk1zN2RPNXlPb2llTFR3SVo0Q3lzeG54QWNRT0QwSjZhOWR1dDhIcG9rKzVudHlOOVkzSGZ1cUs3d0R6WHdVSGVQRzdqaWFsZVgvSHU1N0JNbXV5MzNONVU4czNMUms0czhLeFZ0UVBWVCtMNFgzMjhoZnk2ZmxkQjJhbDFoVGRvNlczcVZ5bWViQk5TdlpiTlI5dlNrUW5qZzE3Q0diaER5bHgrNDU0NmlKNWM3bUhFSG41SGhEeVZHNllpN2xpa0VabXRPN1d0NWIzZk9pOXBQMjhaMHhPYTE0cUhiV294QU9hZTRZN0NNQld6TEZ6R2ZrTWZSdU9XK0U3MGJrQ1ZkNFRzWTdxVGF2Wk5OYUVlK28wMi93QUpsUWxXSFhPVXp0aEhwNnE3ODJtNHMwNzR2OFN4Y0FqdktZbTNkZnFIRDJiY3dWc0I2VEVzREh4dUNiYUdFYngxRUhDam9QRS95czQ2NTZBelVuT29oZ0pta0gvbnRiaCsxZDI2cXZsbGk4eGU0NldIaXUzZzE4S01zdG5GZ0lWZktRTVFsNEdaVG4xTE1ZOFM1UUsvUFJmL0FGYWIrSDRUMjFuSjJqMWs4M25kcHRVUU5TK1ZzWTdDamVwVWVWUHN5Q3g3Wm5EbHhQVDNUWTJjOXJkeVdibGR5VEQ5QWgvSEJQaUh3UENjcmpybUJ0c1k1UFQ0b08zUktlOVR2dlk0cXBHSnZ3QjRCd2FQYTM0M2xSNHFNMVNkdHAyekgydm40cElLTXVBcHhLeDZqSzJhejFSMnJiVnFoUDhBQld1OTdlMnBPMmdEN2laeW85U20vRFI1cFc5U2o5UHR4RzRubXUzdE9vL0U2b1hLc0o3VDY2bWJRUTc1UEtoL3BFYjJkTThDTkQ0cDhUSFc1c2FlRHo4aUlQOEF3WXhUVTJHeG1WOHFIM1FjVmpsNmVMQ2UzUDIwRzE2L05veXQzdXA3cDhMNy9nZTBETXJzOU5yOEpxMy9BQm4zZE5KWm1XMW1xejY5T3NzTzl5TWxNR3h1YXN4bExTMC8reXBPVGxOVnUzMXIrTzdCYlU3ZlRObTVnZUN5empZaEFMOXkrUTJZZm9FYjI5UlBMTktmT09wbXRPTkoxRXI0MFYvYlQ0SGs3b2c1WTRGZml2em5oRDJyNHI4dk5XdUhCd3puN2pjRmg5eW85eWZidFliV2RpVVBLSHoxR05UUjlTSWJIdWNZcjVLallxL2JxVEVYdW1jNmU1di9BT1JyR0kwMFhPbWw0NTFKbW9YMDNtN2RDZHRnOXgvR1BkajFWRVBVUi9iMUVFTXA5MHpNOHo5UlAvbTZEenlyRVkwbXAvS3Z0TVR3bm5PNlZETVdNMksxYkFTVStiVGc2eGZ2ejQ4cjdxODdYMUtnWHY1K0I3UG9TeHEzMUtMYXZYL00vd0R6VWlWTDJPWll4eXAyM1dMdDB0ZVcwU25Pb3FibFR1bWp4NmN0NGJWelVOdWxZM3dHV0wyZ3hXaitWbTMxMklJUFUrM3I4ZEt2Y1I5SC84UUFLQkVBQWdJQkJBTUFBd0FDQXdFQUFBQUFBQUVDRVJBRElDRXhFakJCRXlKQU1sRUVVR0Z4LzlvQUNBRURBUUUvQWZkUW9uZ09CWC9SVUtKV3lzZUk0ZjNxTkYrbHdzYXIreEt2Uld4cXhxdjZvUitqeWtKRmJLMk9Ob2EvblJGWGxSRkVyRjVzdkRpVUkxSS96b2lpUkZZc3ZkWjVDbWQ0N1JKVS93Q2FLeWtQMFBNWkYzalZqL0tpQzJQME1lWVBFbGEvbGlMQzc5VDJSSW53bXFmOG1taERJajlMMlJFSTFWei9BQ2Fhd3lBMzZXVm1PRXpVNU92NHFJZFlaSHIwMGVKNG84VU9BanRDTlQvSCtEd0ZBcENSRkQ2d2lqeEsyeHhSNGpURzJoa09zYWkvWDFLSCt5aEhpS1AreEpZVHhIRXNSNnc1bm1Ma2VHeUxzUTJlUjVzNGtTUnA0Zk1TaWlqeEtQRW8vR09OTXZqS2dTRWlrTENRaVhlRjBNYUtGWmVKRUNMR3VSb1hENUhKRW1RN0VqNFBORkZDSXVtUHZZOWllSXNYcWtKa1dKall4NGoyZE1YUlB2Ynl4REx5aWVtNFlyRlVYWkFmVzZ5OHp3bVdlUXg0aDJMa1JLTGs2STZFMjZKYVVsMklob2ZaRGdtZURvYXJZbUxuZ2FvZFZsRVNZdlFpZUluZ1ZoaUVRUWlGTDloNjhsT3llcDVTczBtL0l1K0JLanorRTR0UEt5MExaQkUrOTZKQ0pMTVpKb2FHaWlpTU9MSVluMFBrU1lySE5Wd2ViOFR2a2s4ckRXSkx4RWlpalRYQnFaZTN4czFIVG9jclJYN0UxUkYrQ3NqcTMyZDhqV05OdTZFV09lYndoU0hzWkhTYkZDcFV6VWhaVFJ5UGtTNEppeWlpalVmNmtkUnhKeXQzaFBrZkxHN0lSOG1KVXFHTWcvZ3h2Z2V6Z1FpaXMxYUo2V3JkeE5LY1l5dVpxNnNKZEloclJyeGFKYVVIRzArQndTeFBaZUpkRHRiNHFqOGcyUjVZK3h2RXNXZVJhS0tMUElzc1RQeVRVTFh3Zi9HMUduTm1rMDRrWXdmK1JLdmcrc1M3R0o0UXlVcHI0U2Q3UEZsUG8vV0gvd0JISjRpelNYMG11Y1JKTGRaNUZuQlJ5TFZYazdKNjhrenl0S3VpUERzYlRmQkxESGhDSGlVRXg2VEdxTk9QM0R5bzJLRjhDVktpV0lqR3ZUWjVGbW5MeVZNaCt2QmRIa1N3eGxDeExvZW8wUFZaNU45NDBtTWs2d2hSSVFhNXNYUThKREpldVdueHdRaFIwT1pDZnhsNzVFMHpuWjVzYnpDVlBranpoOUgwb2FKdjEzanhzL0doYWF5c05aZUp5dlo4MlJWdWpUajRxc1NKcmhZWTREZ1Y2ZnpINVdhYzJ4ekhNdkMyTXNTc2VsQks4dU5SUk9OUVd6U2hYSXNTSmN1dHJIRkhnZmpIRnJkRkN4ZUVMWk40Z1NWcWlPZy9wTFJWY0dySG8xRmNSRDBYOEphU0lLbFFzUHMvOUUrTTlicFJyWWlLRy84QVdGaEMyVGVOUHJaVjRqb3BPeEVzUERYSTF3UG9YUWlXNzVzaWpwWldFSVhlR1B2R2xpdHp4OUYySWZReFllOTVnWGVWbENHYWo0ekI4NXZGa1duaDRRaUs0SkZDMnJLeFdJWXNXRmo0UnhQWXBpa3NJbnlxTk5lSjVJVXJ3c1I2SkR3OFBDeXNWaGNZUXNJUXlKWkwxSWhsOUVlaGoyUEMzeTJyRFpBa01yMVJ5K2o0UHJEeDgyckZaVHZFZVdQTHhwakhtdlJIb1FoaWQrMnNMRU94aTdFU0lzcWlSTEN3OThSTERFaEQ5OE1KRVNSQWtOOGJMSmJrUjcyb2VXUEw5R21mUkVCaVErajRQWTk4UjQrRC93QWNTOUN3cy8vRUFDWVJBQUlDQVFRQ0FRVUJBUUFBQUFBQUFBQUJBaEVRQXhJaE1TQkJNZ1FpTUVCUkUySC8yZ0FJQVFJQkFUOEIvUFJ0L2F2OGFFc01iSXhzMmpSZjc4WVdiVXNOall5RWpvYkdpNkU3L2NoQytmQ1F4aVo2SlpYQW5mN1M1RXF6WTJTWlpZcEc1TWtzcDBkL3M2YXhLZEQxRGNOajhWSTc2R0lpNi9aMHlVcUpQOE5aNlBRbmEvWGoyUk5TWDVHaGtYUkQ5WmtEMFNmNVdNVC9BRldNZ04waC9sZUlrZXYxR1BzaWFyNC9NeEVQWkQ5VDJQNUNOYnI4eklpWEpGOGwvcFdSN0k4c1JyQ2d6WXh4Zm50WnRlTEdSd2x6K2hZOVQ3cU54ZjNDTlB2R296L1Uvd0JUZW1PaCtDa2J6Y3k4eDdPRDNoc1htM1E1V2hUTExzWXA4MGFpKzdGM2pSL3VOVjhrVVJnT0JLUGd4SWhFL3dBeVVXTVdHOFdTa2lQUlpaZWR5Tnh5Tk5Ec2pJWksrNGsvdVZvbC93QUl1OGFYQ3hQNUVLOWpseWJpVEpZV0kwS1ZIK2c1amRpR044WmwyUjZ4WnVGSWM4UlFpWFpOdFlVbVIrMlRSSmtXUmtqdDBMakUreXpjWGg0US9GWVlzSVpwb2Noc29VZUJJMjVsMFRqL0FFWXAyK0MxN0hLMEpja096UlZ5dk9wOHZOZmdZc1JOdGpWSFpEUXZzbHBvL3dBK0NpeXl4eXZnaGNvdFdhbW5TWHNlNi90RWg4aUltZ3VCNDFmTllaZVVQd2dLWDNFMDdOT0xGMWl5YWFlS0s0RXVTTU5vcFc2Tm5ObTJuYU50akVhUHh6TlhIRjVYaTFSWlpaWnVHK1JNZ3VCTE5uTkZFMlJQWkxvMCtEVDNTdmNpcUo4SWFJb2FFYVB4eXVTU3AxNHhYQlEvaWFmSTF1WktGZEQ0ek5LclBZaUdFWDZ3a1hSSVdaZGtZc3EzUTRzY0RhT09ORDRqTExhTlhsM21KUXNOY0M0UkZVaVVxUTIyeENKRWV4ZGl4WlltYmpjUGtyTzBtK1NGZHNiUW11aWRKY0VwQ05INDRlSng0d3Z3U2RpaGg5WWdqMlI2eFJXTExMTEVKNGxFVzVDazJRLzZTSnhWWGpUK0lpU09oalhJbEVTcndlckZkaWtueWN5RkZZbWlXSUUxeVFmalJSV0xOeHVHME9ZbFl1Qi8wMVdJUXNTNk4zQnR0WWpJM1krcTFkcXBFMjJmUmEwbHFiR0lzY3FOelpxWWlhaEhnVC9EUlE5ejdScHRQZ2l0dWRWOGtSTWl4azhhUlBUNUZCRkxIMXNHK1VNK2kwWFBVM2xENE40alZHSWs3UkhvaCtOeGJGQ3VTeWlYSEpOMnhDWkZqNkpZMGlTZmhRL3A5TnU2SXdVZUZuYXJKbXBpTDRQUkdScHJqOHIxTnJQOTVEbko5K0NZdWg0aGgrSHZ4WStjTHNYSXV5TE54ZjQ1RmxqeW1SWSt5clpReThwOGtYejR6ZUd1Y1FZK3pUNkdSVm0wNUxMOG0vU0hHdXhhYk5pUlB2S1pGak5KVzhTUFp1TjlFWmRrSDl3M1JIVS9wQldQZ2ZJMTZKL0xIc1pwdmdsOXpOdENHc2JiRi9QRGN5TG9oRDJ5aWNxV0dQRzRUNE5OY1ltUHhjMjFSRmNrZUVQbGlRdTdKdmtYZVlNMGx6ZUhIRkNKcmtXYUlLNVliTlFpdVI5akxFSVdOUWI4b2llSHdpWDJ4d2hIb2dySXFoUERWWVJJV1crQlJya3ZFbnlkTERGMlI2TkJXN3pOY0Q4YUlpS3BETmQ4WVI3R2FJaFlZaEVoWjlIbzIreVRhUWw3SkRIMElpYUtwZUV0Tk1lbTBiV1VKRzFzVUpGVVBvdmsrb2ZPWVJzbkdqVGo5b253TG9ROElrTFBkWjFYZkF1cUpka2lYUkUwbzI2SStUOFpZOW1yOGhZaEVmM1RvanhoWWVFUHcwbG50NVpJaWFMcVF2RmVURVAyalUrUWlLRTZqWnBLdVhpUExGNHNyTU1UZElqajBTenBmMFFoOWxsV1Jmayt5ZkEva2FnalRPNlJXRndSOFg0YWVOYjRrVDBNbGhta1I2RjJTNkxJc2ZEdnltVEh5U1dJczArZVN6c1hJc3JMenA0MWZRaDlFdUNaN0dmVGlIaXVTT0kvendmUStqc2JQUnFybXlKcGRDS0VMeWVZZFkxdlJINDRuMlR6OVA4QUxQdkVjTkNkNTc1SnZrUzRKZjBrYWhBMHNkNFhHVmw1LzhRQVBoQUFBUU1CQmdNR0JBVURBd1FEQVFBQUFRQUNFU0VRRWpGQlVXRURJSEVpTURLQmthRkFRbEt4RTFCaWN2REIwZUVqTTRJRVE1THhGR0Jqc3YvYUFBZ0JBUUFHUHdMNDNPekZZckgvQU9tVGVIcXFueVVOTUx3QSthRU9NS2QwSWVZVUZiLy9BRVNwaGY2VEozZFFML1VmNU1DL2hLblZWdDFHaUdZVkVCNkttSjFVa3FqWjNYaS9QNUs3SWpjcVhHVmpIM1VBM1I3ckpWS3lXVUZkTFB2Wk9Tb3ZLVlFHekJWa2ZubE1WSnhXZ1J3amRHSFQwUnlXNjJXQ3FxMlZ6c040SXdWOTBJY3BOQW9JWFpObGFGUWZ6bXRsMXBrcVNiQm91bGdzQkNoUVZWWVloVndOTUVLVlZEMlhZYldTQkMyR2l1OFNUdXBDZ3JmODJpeVZjWWVTaW4xVXFQUlFWUlNGWEZWOEt6aGRMUEVxQUtvSVdNcnRlNnZNSjRmVEJROFI5aW8vTnBXS0lIaVB0M2tMb3BXeXFvV1NoZG8xV01oVUtnaFJpMVUvTkpPQXNuMDNVNTl6Z3FLb1dDa1cwdHpVaW5SWkVLV21GWGtqOHhpd3RDOHVYRHVJbm5xRlJVb1ZKRWRMYVdSK1pVUk9RRUJkVHoxN3lEWk1WVXpic3RyS2VTRGgrWVJxcmdyR0t1MlU1Y1BnSUtsZGlUSHlxUmdxMkgzVjEyQlVmbDgvTWNFVEtQN2g4UlZTRmYxeC91b0toMWw0WklIOHVNNEJYZlZlNkozUStKd1U1YUtGQnhSYVVXRlhmeXlFSlVuTkZGRDR2YlhSVG1NVktIRmJuOTBIVCtXRjdzVkdSTmczS0kyUitNMk5oYWNFUm1oK1V5VmVPT1d5RFFpN3lSVFJ0OGRHcXIrMHJXRVlYWDhwbjBzY2RxSnJmV3h4K1A2MEs2b08ra3dlaUcvNVJkOWJZVytISVBqZGlxWW43b25aVTZqOHFjN0lJQTYxc1BSZVZqZmppM3pGZ2FjUVNFT241VEdRTjRxRThycW5XVG9QanlOcFhFNnlwL0tOMDgveUU0cmR5S0g1QklUZlJIV1lYVkN6RlJOZnlTZEJLTmZFVnhEdC9WTjJDaTBmSERyWmVudEFleUUyN3I4VGllSSszNUlSckFUZEVmMUVCTzlGZXRIeHNJU1lqRkhFb1hNc2w1MlVxaHhINDZma28ycWdkbHd1dDVkU1R5TitPa3dzRkdDRmFLcW1LL2tsTENaK1dFd0JONks3cEhJRjJjTGNlOWxiMllyT3lpeWpsS2d6MFhqOG9VZ04vd0RKREJIOGhsQ1JpcHRQb3JuUUxwVmRBajE1QXpJZkF4S2daVzRRRmlGaVZuNjJ3YlpHYStWUkJNL1BraUswb1FWSExMdmdac2pudXJ4SUhscjlTOTFHNlBYbDJzb0FzRmdxRlU3M0MzSHVQTlFieUFBUFZFR2hDSEpKVk8rN1JVakJRaVo1c1ZSVUtuTllJRGxDNkJlY0p4NUk1Y0ZrdkRLZzA3eUcxS3E1UzkzcVUxZ1BiT2hVOFBqSGFjMTIyeTM2Z3NlWFlxTDBlYWdZYTZwLzdhSnZXd1d5ZStoM0pxdDdJdldVVlVlZUUzUk9kMVg3Vys2Ty9QZEhxc1pPWXpSYmlNa0s0TEgyVlloWXkzWHVxTGRWQnJrdkNqQWp6VlpJaVBKZHVtUWFyL0NOMSt5aDdZNWFDSzFVeEEzUTNiQ25sdloyNDI0MlZLeFdaV0t4UEpLakJicVFxTGV5OG0weFZiTUZUMFZWVlN1cTZTak9DNHAxZ0pnMm5tb3JyUjZpd3hVd3F0S01jTUVCQ09IY0t3bHFsdUhjeDh5dk9xbWtHRlVraFVlUU4wNGtyc0EzdGxWa0RWVWJRNW5tQzRmbW90eHNqbHJaaFpqWlFLTXJUV2xtQm9wVFlPS05KQ21BZ3FXVUtEcFVPcXJ3WFZRb3NPaENMdFhGTWJtNTBvOHhET0xUY0twOUZlQ2d0UnV5UXBEQ3J6eGdqUXJDTzVNZlpZcUNWL3V1aGY3cmlycmFhTEJWVWllWENpazVMaEk0OHZadGxWQldhd1V3c0Znb2dCYkJlRkhBS0VKelVZSTBXSUdpbkdMYUN6RGxxc0xlZ1hCYnQ5MFRrd0k4ZzV4OEJoM01hcVBxY3VIUWJXRG9wczBWTEpxVUNpS1VUcHlzcFlIRlNFV3V6VkVVZFZnYUlhcWZaWG14aWljZVNoVlZoYlJRb20xOElhTlIzTlVUK1N4S1lOdFZYUGszUkpRclJZcWltVVZGZXFrUGtJU2hJTkZvakFWY2tIUXBLNnFhSXV5VXl1elNFQ0tJUzZpT2lpZ0tnMjlxaWhBelZHd3BvMUtQRXpLdTY4bXlQNUJLb3VnUjZLZVc3b3Fyc2dxUThxUzZ1aXFhTGNLVFZDVEN3bFlVVkRDdUJZTEhCUmZnSWlVREVsVEVLaXVUVXFqcVpyc3RKVlpzd1VSUzJxTmgybjdKckJvanR5UWkzYjQ4Ylc4UnlIcFpKWGlDRjFzMllxcFhqYWdJRGxKaXljbENvRkl3S25OR2dLTVVWWVJ2Ukt3d1FEWUFDSnlXQVhZZ0VKdzRocU1FVCtKSVVqRXFKNklYdmF5cG9pNTAxS0pDcmFkM1hVODZXaEJTdUc0WU8vSUNVVnVpVUZlNFo2bzNoajdLR3VkNm95UWhtcTRLOXdtaEZ6cUhscWd6TlFDaEJvakFzb3VxdXhXeTZCSlZjVnhpNEVtVVhNanRETmRsbXlCMHNxb2RZS0tFQ0ZDblNxTnRWdUVWdTF5YTdVVDhlRTYydVJUbU93ZFJYU09oVjNGNXdXblZIaG5FYUtKV051Tmw1cHM4RWtxUzI2NVJtVmlqZVJOMVZvb3ZLaUJRMFJkWkZMSjlWVjBJeDJyTlZEbFcyY3piQ3FpM2VFN3pRSDAwK09ybHlZSnhyTTYyRDNSZEhtZzdoOFNKd1JjemlsenpxZ0h6ZjFsRVNMaUlJRkVUSS9FbWlMbkFoY1Q4SUJ6TUpLdWgyZUZnSXhRYzhWV05DZ1c0cW9XeWxtQVZhRW8zS2xkckZYcnBvbmV5L0V2VUt1Qkd0RWFXRUZTb3BzalFVTUZZb29OVGJUdWdkU3B5aFQ5U1BEK3I0T2FSM1VqVk92V2xIcWhCb1NxK2FnbHBsRy9KQldJaGRneUNnNk1WMmhBVDNNWk0vVW1YZ095bzRkYndSeWRudXI1ZEIwV0tCSUMxVXpHaWtxUlFLN0ZkVVFEUkNCaG1wbkZGWndqbTVVa0oxNXZhbkZFS1Q3SjFjTEtsVWlGSWJqVk5FMkRrQjhsZWNQQ1VaOFlUZFFnNFpJT0dCN3FPNG15UUtkeENnNG9KeFI2Mk5HcWMvd0NaeGdkRlY0Z0NCS2x3RDhEQ0Vka0ZxZ3VJSXlRRGc2bVNxcU9CYzlFeFBWVE5GMmNWRnJRQjFVREphN0k3SWtuRkdmQ3FHaW9zSlJZR1ZEVmhSTWFDYWhRaEE2cUtlU0RtWTZXVVdCUWZNZ1loWGpUTUp4c05sRjFUbVpBUjdycUVXREpGWGZwUGNiS3BWRE1Ea0lRaFVOc25Dd3hnc2VlblJDM3FtalN5akpRSmFhSTM1cWlNd3J0M3pVU3ZDYUlVZ0s2RnZZUzd4SVRGRnNFYXdwT1NKYWFLcXFvQzdObDlyc3ZWRXhJVFk4cXJjb3RjRUpjV2lhd2hmSnVSVFpWY0h6aDBUcm5aMHJnbWlET0RxTDhNeUNkVVk4SUNqVlNqWjVJVXdRY2NDbk5WN1d5N3J6a25KVkNrVkNlZGh5QTl4VERuQXlISjVJRThsUUVERlJSVWVWTjZlcTFWUVFWL1ZITkhXeTZXcHpqNUtpNnJ4VVdheFJxcnBNSWhmZ3RONk1FUVNvK1pRVExWaWhlbzJhcnN1RFFnSnZMOFRoNDVoU1dub2k4bDJ4VHhmUGtnTkFvNkkyQXFRcmp2VkRodW83Qk52NUtEaGtyd3hDQkhNYlNSZ2U3TGN1NG5td1ZEWlVJOG1DaUtLaXhDdzlGdnZaTm5hVVpXUmJMREIxWGFWWGlSZ2dTVU5sZEE4MXFxcVhDOFZoZENJYytpRUdmTkhraERSWHRFRG1GK3RtSU9hT2JZcXJwOGlvekhJMjloWmg4SVNtbmw4dVlxaFdLcU9YQllLb3NrTEJZS0lxcTJicnN0Um9KUWROVlVRaWFoVEdLL0d3Wk1LN2RWKzcyZFZma2lGTDVKUWZkcllWRnRWMFdOQ3Iya3VUYnVNRlhmUlFmbTVkL2daNUlRK0FvVlFxdmQ0SnNGQnZBQmM1Q1dGSC9UTG1CUGRWcHlLaU93YVF1Si93Qk85dEprTHRNOHBoY1RobnhTb2NiQ003SEZOQ2xFV1Q2b25RTGQ2WS9SUGpKTjlRZzRaMllGZUVxYnZlVlVEdUkwVWNvNzdDeWxsZWNnRTdJaldzcTR3Z2JydDN1STA1Snp3MEVBU211elRDQjJUaVYrSkVoMmlhLzZsZDlMTDIxaFJHZ1F0dW9oTUl3aVZJK1pwUW5RSWVpUERLd0hvcXQ5Q3NZTy9jZ0lxVktEcG9xWTg1Y3ArS3hzcUxhSy9rTVZoVFZVY0FnV3VOM05xdXhRS25VSndpb3hsTkdtNmE0T3d4V1ZVMGJJYm9KeFhsYU5pakNiR1NMZGNQUk4xbU9xZEErWlNnNzF0N0o4bDJoQ3B5eHFxbTIrNGs3ZHlPQ01HMUpUZWlhZGFmSENoaE5OWTBVdGIxUklJbEZyblhrNlNTRFVMdEVUS00rRnlQMHloSnZEUkF6UzEyOUxKNkkyUlkzV3E0Y1kxL25vZzdlZk5TNEhHWlFHcXFlekZlWHNtRlZsN29vRFgrazJHa3I3ZDUrbzRKL0VHa0hZcHBUVG9mam9na0haT2NHOXNZcHR4MlN1dUNBQmNpRXppY09LQ3F2eWJxY0tFT1FNbERPcU9nc3VMcUYwUVVldG5WQnYxRlRGQUtKell3QWQ1cUZIb2lkNFg0TC9BQk53NldZTHdsZG94MFdFOWZnSGNiOFpsRytFMFQ5QzF2M1RGQlVISDQwTmU4S0E2N3VwYVpDMFVqRmRxcEN1cHpUNFpWMmY4cnNxYVhrVmVLblUySHF0Q2pZM3FqcWFCR01VNHhrbXNDODA0RFdWZTQ3SmtlS1BDVmU0WEVEaHR5ZU9Cc0ZtZXA3NGNCbmhhZTF1b2dVcWdPa29DenJZUGk1Y1pWMGdVWFlvdkhWU01rNkQ1S2hoWXlUdGdtenFwWUt1VFRGYnlFWUs3cXBYVkZCRzJjcFZGZDIvcUVUNUtSb1VPa2VpREhtZ3IxVjNoTURSdDhGZGIvdVB3VFVOd3VOK21pWU5aS08zSlB4V050WnNGMDVCQndpRldoMnpXNmdEMVFtaW5KVVFoYUxMRmROTFlYUW9ObXNTaWRsMVFHcFRkWi91cnphakFqVlZmK0dkSDBYWTRySGRIS253QjRmRUZQc2p3M2Y4VHFtblJQYkhqVW5KcWQwVlVFNGJLTmNDVkVmRWpra3BzTkpWR09yaUl4VXQ0VG8wVldrSTZScXRGQ2tycXV0cDJRVFR1anVubm9QWk4vbEYwUjJhcHoveVViR2huaUpvZzBkd0QzTFh1Rld1RVdOYmtwOHZPd2hNc2gyc0thVlB1aHV1bnc0V1NsVVJuQzNGWTJWUk9RVmM2bFg5Y0UyenlSMVFDODBEc28xS2taQkRvak9kUnNpY2E0bzZvTWFKY2NBRUh2N1hGOWgzRHVpQTdocFpFbDBWRXJoL2lPenZiQk45RUhpcHlRUVAxSTdtMFJVakVKekROVFRZcm9pTlVWUndXU3JLcDhGUUx3cWpWaDdLSmpxdjhLa3FwTXJPRURKRUtBZ3YzY3NMeVRUcVUwYnB4c29LbzRVN0tJSHpHczZMczFRNGwyOE1GaThmOFZMUTkzL0dFSFBiZEp5MDVKS0IxVWR5MWs5bGpmVCtVVStTR2pCS1p3eFhWQnJhVDJtOVAvU1l3YUpxR3dsQlRtdnh2cHhBenNuUmNUMjlFSjAwVVNwYzVxRG5TRkZGVUQxV2k4WHdOQkpSbDJIMHJBK1pYZzg1V1pYK1ZVMmJubGpRMkg5cVlPcHNBM1d3VjQ0aXZtbXRWelR3L3dCbENyanFnVXdaQ3A1UTNSQWFMb20rblBlNGZFZTBjVVlCMmY4QUlUQVhTVDJuR1Y3b3V6S21lMFI3bEM3a0FQSlAwWTFlU0orbzJ0Y0RHWFZNZ3dJRUp3MktEemdpMTJQemRGSnduRGROZEZCMm9ReUNMb0VmVVZFa2VhbkVCWUJZR1ZpdXp4WThsZDRqYXFuZDFub2hmZGRiOUxWRUUrYTdMUXhhOVZVcnNsb1ZlSWZKWFI2MlhRbkhJVVVXSGRIcWh2Q0kwcGJ1ZzNKdmFVb3JkUi9Bbk5pdjlWL3hOa25CWGVDZitTRHRVOTJzcVVUcW5OTnNXT2EvdzZoVTQvRC9BUEpjTDhONGU0VFZ0WW92S1BaVitiN0xxdDBlSnRSVXFTMC80VHVYdE9CTTQ3V2NWb3hhcHl4SlZLTkE5QWlNaStGZStYSlJwa3QxUllCZEsyM1o2Yks1eG1kb1p0N3I5WDJSZWZKQVRqN29qZ3cwWnVWN2lseDJKVUJDY0NNRU1NRkliUVpvdU9Kc0s2MitxS2I2cHgxbEdjaFpKUmQ4eEtqa0JIaUM3UFZxb3hvM1hiY1hXRm9kUTRpenl1MkQwc0pzN1Fub25IVlZ5VWJvaHVTSWFJdWhYamdFMGZNNzJWd2VKOUFuWVJFRHlRR1dKVVdOc09NUks4MDhmVlJRNmtneW5YV3cxZ25xNHBuRExqZWZKSjJVeEFCOUUzOVRRZVE3MHNrNExSTjRtWW9obXJ3d1BQTmsrYUxuK045T2dVdUFCSHQvbFFKVWxRSktoMldaVFdoRFJ0aytTQXRDUFZIZWxqbmFxRlRUbHFwVzQrM05jeW1iWnp6VndlZklWZ2g5YjZsUm1hb2NQNVcrTGRIaUVUV0FuZm9vRTUzSUxMMml4VTZFTGkwa3R3OWFKdDd0RW1lcFY4dnh3b3RoWmt0YkI2cVRoOTdTdGxIeXZFOXpHVVF2eFBUWlhWR1ZocXBBcUFwZFY1VjFFb005ZVR6VW9PT21DSnpoWFJUUlV3SGNYaDZMN0h1NnFVZlJNNGYxRlhma1luTzB3VURORS9RUGRZd2ljc2xlTmhzbFBHeU00aVQ3cDlZUnhnd1U4REZvallFLzJUbmswbGJXaXpVd3BKNUkxUU9oNTRsWXJPSnpWMXZpVVc0U1NwZG5scW5jUS9OOWx1aTdSWHo0bks3YWVpalZSbVVWdlJkVVk3aUZIZUFlYVBFemJncDFWM082U1VCbVVHNm04VmRhZ05sMHFnaW1oUW8xQlIvYWhQbW1qT0UwQTluVTVsWWY0SEpVeHpoemNVUVVPWUpyQm1vd3lSZDlWcExpdnhIQXhscTVYbmYra0VOVTRmS0F1RzN6S0owVXJ6cW5MMlhXaW5WeTJNaE9jY2xpbzVCeVFlOG5aQWF1WG1qNkxvbkxwVTJGdmtpajFST2xqdUlmbEJLZGdvR0s3SWszUUpKZ0xoZG9lUWpORnJ2STVCR2FiZDJVM3B6RFpPNG1sR2dMOElkUE5CeXdyWmZmaGsxRXVUZWtyQ3diMVRuYVlXTkd5ODExS2J1YUtkaVZ3bGV6RGo3cHZER2VLbklLQ0pHNmtZV2tjdW5kQk02TGh0elEwVE9vVHVwWG1uUEdCTnNXTlpxWk5qZ01YR0VTcVkwWEVPQW9KVEdORW5Vck1yOWJLZFcvNFczZE4zTm12S2J2aVYwZklFN3FqdzNZNU9WMCtKWG5ZYWFySS9aVjhLbk55THZST2pLaUhzcndPT0NEZlZHd0xoYlNmWlAvQUd3bWl1VGsrVTUyVGNFQjZyTy9OZVRyelVXRnZaQksvd0JzOHJOZ3BSR1JDQ0l5cC9kWFc0ZmRjSnVtS3FoWEJ0aEpVWkJRTVZkeFRwejBUQXVJOXh4OEkxUUtJc0k5TzZhN1FvMjF0Y1F1TS9Sc0kyUnhxdEF4ekNuaDFIMlIxUWFvMFVhSWs2eXIyY0pyQW5IT3liR25TaWNFTjJ3ZzAvTTZGeEFSbFoxNWUwSlhaTmRPNEl1ekw2N1VYWWlaejBVY2hPeWl5N29WL3dBNFFzYUFvMHNhRGptaXFacUFMMFZYVXArdy9uOVU0T010OFhSR1JCVW9uMHNxUEVMdzdrSmhhY29oUTZoNU5VNFlTS0xpTytvb3B4bkpSQzgwTStxb0FHNXdGVkdjVUI2OUZ3Mm45eFU3cmNsUjVJb29qSlBHOWxIZUgrNjRvR0ZUWU9hVkhFcnV2OXh2cXZHMzFXSXN4c0piRmRWL3U4RWZ6cXE4UnZxdkZQUllGWVFtL3FLdmFwczVtRXc2MFQvM3o3THpYbW8ra0EyQ2VxRDlhcmZOTURUTG5mYk5FNTBuK3lic0pWY1Qyai9SU0tqQ0U2VDJWMnZDTVU1eHpzWitrUjNMT3F1K1k2cXE3SmxSYTRhVVFHcEtLRmtJazRaTFFEM0tpVk9UcEtiVDlWZ0dXQ0d5ajZVYkE3OWFPNmZPRXJlZjU5azU0d0lzYjA3cUJtbmRlNENqSUo0UU03cDI4T0NZZFRDQjNYL0lKdzJXSzNkUlJtcmdxU3VJY3B1K1dmc29yQk5WR0UvWlhoaWErV1ZnNlFyM3FPODRQUS9mbHAyZ3RDdUk0R3E0TGM0bmxZbXNiNFVHL1Y5bEF3ajJRSnpXd0VwenpuZ3IycXZkTGZPZlpOUUdwSUt2YWdIMlRYUlF0ajNWTUZkMHAzVi8wNjkwNU1lZm14VVpTdUh4TTRoWFlxTzBPdjhBNlhtajVKMjdsR1dTWU1taFJxREtQRjJFSnB5ei9xais1QWEvWlhqbVpRZU5hby91SlEvVlh5N3hnMDUzTjFSakFDQXB0NnEvNUJPbm9uT3lhSVRqOVJ3MFVqSkhTSlcrUzg3SVhSUDBRL21hcDlTRzFENi81UmFhRnVIci9sVkU2alZkbVMxMkhMSUdHS2hRYks5eTZNbWsyRWJXRS9wa2ZaT1o1S3RUUnlNYSsxazVnU3NvQlExSzRmNm5RbUJCdU9LR1Y3SFlLOWlaVWxRNUZnOFdTSUhnSFlGaDdtTzRQVGs2b0xoc1JLM2NtMDhTdTVwemZVb0RTcWM3WlhkbE5qbDVwbE00b3VKSDFsTlB5dng2b3lvNVp5elVWdTVkRXppL1cydlhBOTIvcFoxVnpWZEhmZGNmMVZmRE0rcWcrSVlqK2IyQWFLaVBvbS9WVSthYTRicnpYNFRNR29sb3A5TzlnS0hGK2xxQ2FkZWJma20ydkwyaW5OMEtGblJjTnVxcjFWZGZWU1V3bjVaZ0l2enJCMVFFQ1Z4SGJJanFFRTNvYk9zTHlUb1BhSGFhdXo4M2FBNnAzRGI0WFZiMUNqSTJVZ085aXNJZGR3TmtFeHZaK0NTYndxeit5alE5NEpVK2FMaGl5cWM1dWJTNGVWVTV0MFZDWWRpMHJoditzVC9kQlNzTTE1eVZ0ZHZlcUFrWW84VFJFMHF0MWpBM1VTVEI2STlJOTFLNE81Y2ZkQ2U0aTJGSEpBczR3L1VoYTQ3VVY0WW5WVGt4cWs1MVBSSDkxRTF1aWM3K1NveUpSWFJUbUZHaUNqWlBrYWpyVlhYWVZhQ01sQkkyS0RoRjF3a0QrbHY2Y294Q3ZPaHdQa3J6YXMreUNEbW1DRi84amh4RGoyMjZIdkFtUDhpZ1BxRjFjTUhYQkNjYjBLUC9BTlV5NzR1SFNpM2IyU2lFME9HSVR1aUovVkhrRkdkNUJtZGxGMms1dVlVYUx6VURCb3VqdkFoYmlZVkxPS2QrVGl1eW9FSnpFcWZxSVJZTnBzdmVTRE0wQXAxczkwSElLTkFqMFU1S0VXWitKdlZBMlhOYWVhdXVxMTJha1ZiZ2Y3S1cxR05seDllRytqZ2l6MFBkUWlka1duTUEreW5NRk1jMzVUZVRuWkRqTi9xbmo2ZUovUmNWdXI1UkFQaU5ldGhIb2dWZE9mYTkxRzVSZythZ1NmSlM1dmtVWnJPaVk2RGV1MTNoRUhSWG1tVE15c1J6VHp6emNUOXg1SGJ1WFhzcjhMU0ZHQkxsRGNnaTNFUlBwL0NtbEFLY3NySnlBS2NNZ2ZaUWNRbmVSUUU0TmxFYUd4cmhrVU9JUEMreUI4MzNSUHlFK2k2Q3FOdzA4UTIxV0VXZmgvOEFjNFE3TzQwN3VOY1VJNklqSzhVUDVtanhjN3pYZXlMOWJoWEZpZXlXMFRlTTN3eEt2TnpxRjBLS09VTmxjUjV3cUVTdm1PODRLV0dYZmRZWjZML2NORGtWZmRRWVNxMDBoVitDUExQVk5KMWxjVGNGRFYxVTUzNlNta1VoYlF2WmZjSTJrS1IwVHhxcDhyQ0VlRTdBNGJGQSs2QkdJTXB6Qjg3YUtQbWJWdjhBWlFNSFlXM21tcUhHNGZoZjdIdVEzVkNQbSt5bnF1R2RYS015UDZMaWNNMG5odGpxRnc3dy93Q3pQMlR4OVlFLytLL0NlWitXZjV1bmNLWnU0SXhtaXIzMWRuM1VlS2NrYnJxNk9WMCtrcnhMdHR5OGJUQlY0bDd0amlWdEVRcnZ5bXFwM3A1ZUlmMG5saitZb3UvVEhxVlBSQitReVhhelZjeWg2SnFJM3NuUUliVVFzakNzSi9EK29VNjJEMHNOZkY5d3FKcng4dGZkT3UrRW1SME5odFAvQUU3b3VjVFBRb3NkaU80ZHhqNFdEM1Y0L05VQkJtVFlURGtDVTRwcnBvV2lVeVRqd2cwb2lhdXc5RjJYWXpGTmt6L3FHaWo4UnZvZzRkUWdtc09ab2d4My9wQm5GSG1UZ29Ba2FTdTB6M1J1bnJEY0ZuNW9UaXJwd3lzbmxIZVA5TFpzYis1Y01hMVZOVVFFWXdRQ0NuWlRyWVIrbmtjTjZJT0dJVjRaMUMreUlHRHhJUWxkckkxVjNSTUp4RGZzbjlKNWJvSCtxd2VvNXcwWWxEZ3N3R0oxS2xQY2Nja05TQ1ZkanhOSUhYK0JNT28vcXVFLzlQOEFWRjBqR1BaY05yZnE3VzFFOERFY1J6ZmVWZE9TNkpqc3dhOUY1VFBtRjBrZnp5VWdxdU90cDJSQnlWUEdQZEVIUGxIZUQ5MXRiUFZOL2FxcDJsRVVMUjBSMlhTbnVvc0Vhcmlqb2JJWFJjTTRSMlZNSjBlRjNhSG1wczhpT1c4d3dWLzhqZ2pzejJoOVBOUC9BSFgwNkN3b0hMUmRHcmg3RUZjV3VEaGhwSzRmWCtxY2RIWGxmNG1TNGo1aTh3R1VZRm10SXU2aE9qb3Y1VkZvOFdJM1ZjRURpTmJidzJSNkZhY1gvd0RyL0tnOTdoYi9BUC9FQUNvUUFRQUNBZ0VDQlFVQkFRRUJBUUFBQUFFQUVTRXhRVkZoRUhHQmtiRWdvY0hSOE9IeE1FQlEvOW9BQ0FFQkFBRS9JZnBQQ3BYMVZLbGZYWDAzRjdyeThMRmJkSnQ2UlZtMHd3bHdhQ1YzZzU4RnFaZi9BTml2Q3ZvcjZsTkxGWjEzaVprd2VsVHhiTUlhRG9ZbG5RSlYvd0F4S05DK1RIbU1BQXpvM3VQQUtWWEVWYUxpQlY1Y1JGVzVad1dlOG91R0QxLytDdjhBNXc4QWxlSS84Z2xmVlhnZFlDRis3SVdWemxvLzdLTENWcTM3K2lQR1VZRzJEUUtzOVlqeTd6bm1IUi9FUmlkQjZvcFlSZFBQL1kybktXeHZsTmJ2azRTeStucXFtSUhuRE5kTE9UcE5naWQ0RHB4RFAvNG9TdnFyd3FWLzYzaG9uU3pvVGRGM2xhQjVtTFVIV2NvN1F6ejdMbGF2TDNZSkd4ZThaVFRFMTNoVTBPMWtiSUh0R0tnMVFYY1pFYU5qT1lOdlUveUxlVnMwQVo1dWRRRGd1T3NVUVJyano5WVJoTDdTdi9nUVhuUFNlZWRQL3dBU3BYMDE0bi9yWGdENW9xMjNHYk1NTXJ3dFZ6SkV2TCt6S1IwS1YyaXhlbjNqU204dDhrMENCZUpmWERvbkU0QTV5d25OMGNUZ1ZiVnpMYjI0b3FZb09LeFU2RW5mYVl0YnlqcWRaYkFMMmZ0RGxBYzFjZTR4MGhnWk9qekw0Q3F6VXR3SGZUTytKdjhBL1FyNjdjRENON1M5ZTJKZGZnTWVaWG5GZlI2d2w3dlNkTHhNUmVjYitJT25DT295NWVNUnNkalU1MG9yMGdFNktqZHk5YWw2TkhtUDIzdEw3d1dWT2Q3SVpsYWZhQURIek9YU0ZHTE9SbGR5N05rQmpmQnNRVDFOaXZXWlVVNUF5ZVorcFlGcm8zaU00eEdYL3dDQ2ZYWC9BS3YwVGU1WUxxWjNKNXpydExGWE9kektMaVlNK3lCVDJqbXBiTFBSZ0hMbTdUWGFlOE5oMzJsS0pucHFXMEZEckM0QjBWMC95VWFoWmljMU1GNWhJUzg3OTRSbmN2RVl1M3RxWWozZ2lPeno5TVVwV3V5eU4rajNZZ0dUcDNEWWE0dmlXYi8vQUUzd0kza3l4SkRxekpQYnZTSXBXMWkyNWxJd1RjeDBpT1lGVTNpVmJWbDZoT1h5alliTi93QjBteHJzN2wyd2RNN25LNTdPSnBITlo3eE1qc0RVSG1tWUtNVnlES1hwUUV2NEJadi9BR0d5L01adUFsMUgybVpYcmprZ0czWTVTYXl1NStwVXAvOEEwcjVuS09BL012aUN1dFp0OTNsSGROcmJGNEFnTVJNTXozQ0ZNVHphN3dnNWhDSVNDNFgwWmdMbHcvN0xnVzNWWHhCZUNvUFQxOEpXaDd4VEdIbnhBaXoxcUl6djJEK29CWkxrNFluQVkrMHFqTXl5Zjltd05QZm1WYmIvQVB5ejZXWjdvUFNVYXAzUXdwOFN4S3g5aExNeGdZaDB4QUpPM21IUVpaMm1yOVRQcVhhbm1TRk1xK2s2S1Y5WnBpSjZSSzJaZVkra0hBRHpodmIvQURGUWU0eFl3dUxTOThvcURWZFlXR0ZuTlNQVHpDTG03eU04eDUvL0FCcS84V1pNVkxaY1gwbEI0L2FwMTkzVkdwdDFBK2t2ME1XRWoxcDZ6ekgwbm5zS2RtVmNlQ0hvZTBCMGlkUEFTWkpsTGdOeWhRVHM1bDJ5OXBjR2QrMEs3TitBckdHNFlicWMyRlo3R2N1dVQ4UkZoNDEvK1ZpZmVsWU53d2ZrYjhUSlBCN3N1WTZNSGFaOGtCdUsrWjFUM0lJeVNocFBKOUNOSGdBZ1ZBbFRpVkcweGplVWd1WUhkY2xYY1RUSmRqWGJ2Q2FXdXU1VFRsTmVwRHNEQ1VPMHVkM09zclhyUC96Y0Q3UkhNWkQwTGNUM1hQZG0rOFI2Q3k4ZXVZNWpyaVk3WnFyd0RDRnZCSXFDRVBvNDhLOFRPQ01JWEJUM2dqclZVeGY3Zk1NMHo3UmF1dDZ2TU52UFVxbUxZSmI3a2xDLy9ZZi9BQU9wcGxsQ200VmNMbTRZb0x4YjdRVWVTV05URGJjN1BqQThBaDRFUHBQQWxTdkJ5R044TUJIcTNGQXRwd2hOc0pyeTZ6RkJoT3BFcS96T3N0TWxQYy8rK3ZwUEUrbkMvYnJEdWM3ZjFGSkc4ais5NVJUYVZEQkhJdnhFdTcxTHhNWjRPS1ZjQ29lRmVCNEgwSGdhOENWSzhISkFVT3B0ejBIZmZBeVRWU1Y2N21hbk4vNTFsZzh0TW9IL0FQS01HMWNBYlpRaGtacHdkaUlLcnVNMUNXUFVQSzgvRVJuTnNYWloySHJLMHVGNFFTcFVyeFBwNDhDY3doNEhnU3ZBMGt1SVhqaW9oVUxpNlplTHl4czd4aStxZHR3ZGpWbHcvd0R5TEcxS2JGclVGWEpaZzMyTlBMK3VDR2NZZnZQS3RwdnQzRFp4cVpKaG1HRFBoWDBIL2dRaENIMDNFeUViWmZ6QU5jZmM0ZmFKc05GOVNYTTcrai9zQXJFSC93Q0NmWFFIby9qT255MUVMNHAzUEg1WWl2TWZSLzJXVU9GVDVuc0lSNThvWkw3N21XVmVFLzhBSThCblAwWENIME1wZmFiZFVDanBMeTByRklDNmZmRVRMeDhwUXZYUC93Q0tlRmdEdlBraktaMkp3Mm5KMWFQeExEWGNQMitXWVBtcDZZbDJQTzQ3Vi90ek44eEt5enBnekNIMG5pZUo0RUdIaVE4V1prc2ZRdUkzSFF3d1V1NzExam81QlhlSllnY0d2L3F1RDQzTCt1Nkp6WGJOeTFNMDBkVXorbzkyV1plcnQvVVdRZk4rZnpFRFBYKzRZWGFhWTg1VXBXQWNRNWhEd1BxSnhLaEtsZUIvNE0wZzgwajBLM0hDUlFNWVQ1LzdFcTV1bi8xSDFIMFg0ZEU0eEhGRU1sdldkRE1Ia2MvZG1SUExGZG5tbDV1cUVlUW1VOWlEUGpIZ2VKOUJDYy9RZlFRaDRQZ2RzeEZZdjdKS2ljMGRKZ1hHbjFDZTRYNWRZYS8ra2gvNWNTNFJ1dXpCM0RIM0F6SlBHZjczanBMc21WWTZucmMzYVUyNWMrRWZVcUgwRUp6RHA0MzRWNG5pK0hJN1JDQXZOd1cvbytTV0U2ZTFWeXhPZ3FFaTUzUENZKzV4L3dETWZSWC9BSWJXYWxMdHR5OHBhRFF6ZTVxdlI5MStvQlpqSStjYlVJdUhCUFlZSUlmV1p0NGN5L0MvcEllQnY2aXc4a3hSMEgwcXBuYmNLeWxSVmNPMi93Q0pjQjFQTU1tQk9zT0JBdDJyczZmL0FDTUd5NVVxVks4SytsMU16ZlBXYTRpb08zN3FSVWpxcXVsLzdQZk44eXhYcVUrNytKZVduT0pzM092ZWUxd1FmK0F5L3BIVTNEd0dLRDlMRE5jc3VtQm1rcXdsQlBEZFJMRGdZY1htWVJkWlo0bFFySlVVM0NyZW1GLzh1bFF3ZlNmK0dMU0xVdEdyRS9ZL3FBQXovd0F6T2RXdmlOMGNoMm1nMEdwZmt3eUExRDdVcWJsSlo0TGx5L0Ura2d3WmNJb1N2bUljL2VBK1VCemlDeTdqQmlGRDFpQzNZdkVzR1dPYXE0ZzB2MVM1OUp2ZmdKampCOWQvK3ovN1pXV2JqWWVhWm5VREozVUwrWmxzbC9FRFE0eFBTV3djQithanJ6WmRUN0VObDZRVnBWMWRaUTBQM2czbDk0YVJ6bnBCY01wRHVnL1ZlSWs1N1RJSEV0d3o4SndmekxEZE9rVTZ2ZUMxbHowZzhENkpFZjhBUUl0ZVFlRktqdTRxZUZnTjFGT1NEZ1gvQUxFTENPckFRRWNKU3ZmbEtwQjF6RmJxMzFuTi9RS3kvd0R3OC9BeTIvOEFpVFBpRUxCRkpWVEUwTXpGdXVJWWxZeDZuL3M3dTYzTnF6QkQraVdBNG8vRXFJNWh2QitTVWdhTFBlRFhLZEpRY1o4b2o2ZWNQZEN6ZVNiNUdPczZXNWc5NE55L0c0Nkk2ZVVZSzJUN1JEUjFXNmpTSHAwaDBzOStZR3VyMW5XczhwdkVsUm4zS2h3TXc0cnlqakJoeEJlZ1ZuTlZNZEdwdHBqV3VGV3IrSGVCeHJLdzB4SmZDY2VITTVUUFNXemR2LzNhdCtDZEZVc0lDL1o5Yk1vRzVXVXdsc04zdUxDeXlWYkNheGc5dHhVSG9MN3hxalVEV3Nmai93QWpmY2JlUkczNFBBSlUxR1ZaTkpuWExOWVhsTUkySnZmWXgvZVN0MFR6bGJGd05uSE1zN01SSU9ZZUtUWFJHRlZERGF6dWFIMVIxZ2llc0ZBMW1kVkxJV21VTlFZaFZhYXk4bi9ZRjZNTW52T25LUDRlY1NzdVFFNDNqeWpSRktiMXJ3b1FWb3YyUkVLTExCVlAvVTYwVzBRQ2xicEsxdHh6TW9vNnFVSzNLcnFEZWZDNXRZYndKRmtRMWJTbHkwam1LbzFNalBXV1N4bXJnaDZ0MUw2K2g4dFRBZVduOHg3dWN1K3NSdjhBZVhNcXZDeE5Vb056SEtjY3haTkR2RXkwY1FHeHl3eDZaSFJpSElRRzY5cGluaUZ2RGFVUlZBTXg4TDhNczF3N1lsU3pWMUVTdzVhMG5XVkxMeHdlU1pHWTJTaVN3M0ZDVk13NDY4bUJQdGRPc0lBWGs0UXYyaC9hZGtrR05haWFnb3pEZTJ4aThuSDFxSGpaMWluV1pRYmdCQUFXbVNPQTVxcGdlVWpnZk1yMXR5U3loaGFsRjAxS2RaRkY3aFJWWHBEaUZTMnFYWU9ZN0lPaWRSQlhFdVhVYlpFeEc5Z2N6RFlmMkNCWVZ2ZlZ2NWwyS1hIdHVJa0lZemN0aFE1WndRWDZPM25OZm5WWmhGUUJ6SUhZR3gxaFN3a0w1MEhYN3lwMjlkSG5LQlRIVDRUQmpVSVlOUjFNSkZ6ZVY5NVU1Q3dNclIzWFBlRFNMajVpd0IzMkVUY0J3dGY3SGZJV2o1eFhNdXZESFo0am81aGJDYThLbGdDNEFaajZXNkw1YTg2aFNOWWp5bGVBM1NJeFNPc094THVhZzhDT3JCWnREeW1SQlRTKzg3aVZGQ2dSVm5NRHM4NGczWXhUbFdKSE8yWXM0cUlWbDVUSXJiWm1FYkhWVW9pN3RjUXpkSnVVem5JdVBwNFdKdVVhT1NNMklZMUErY0dCSVVvdDlHV083dDBZSm9WTUoxU3J2MU1wbTRRQ2taSE8rWWxySDNML0FKT0J0bjk2eHU0NGhMcmU4cmxMdFJOTjRydVJjRjY3UFhoaHllZXJjS2lnRnQ3czZNc3JWdE9ZcU9zcHJtYWxtMlRRMXp4bXZnMWhEQVFycVB1M1JISDdxTmF0Yk1TcURoemlMcUNkRnBxR2U5d3diRjF6Zzd2aUZ2N3c2ME5sT1B6OGQ0SzhSeGNNMVZsM0FBKzB1MkxiRnpKcHFNa25XOTRvdWlITGxteE5CQ3hMV0lkK0JxU2tCMG8yZzUzQUFxQldwMmhvYTExQllxQk9EVW9EQUhNV05lbjNsamx6TEpCZG9QU3JQVmhkaE5MbTdxZFlwVVRWUm1ZYkN5YitrTWQ0N3puUkFBdXppTGtweENLczZ6TnM3SmU5VXZjYkpoUjZ5em04Q0lBMzlzUnRDcGZFcVJvYVBJajh4NmRKczladjlXQ0ZxZVRNRk96VDZ3dGlmSnVhNjlrbG0rMWlDM1JpdUlndWs1Z2ZyMVhtQ0RSckJPSlR1VlVmUlR3V1RCck1NaU10NTBtb1pMVjBaWEQxQVFiVDIwS0xOT0hNdTdHZTBBTWJyVERxbGZSaGREd0Z5YllDdG92QzJPa3hReTNLaHgzaW94MDN1VXBzaW4zTXlZWlJkbXdqQXUreGl4U1IzbUptaFVjNVdZdzBwWTVna1FpaVdsNjd4RzFCQUxaNGlDQW5CbHdQeW16cWVlc3VkMFlFeDhYbDRLbHBGVzBxWEthcVZMY21OeXR4WmpNYkkzWk55eUZWMmwwSWRHZk9XejdSRnU2NmtPRTJWODFmNGlJeCtEYitJZ0UxaCtmQ3VhNnd0aUNCaEhDWE1SMHpNTUdhbWxaY1BRUWZBVHpMNlJSMlN6dzd6U0dveG8zT1dDQzVpLzNDMnlHQzhpVWNRZHBoRHdQREtYa1F1RXVtODhibUxmd3FPSzREcEhwWndtWGRNZ3NHWENkeFV3bUFIWkkrZ2U4VVdIS0NoUXRXQ1V6WW84cGFicVdtVnZGTTZDSTlpZFV5Q3M0aXdYbWJrZEJ6TVNJN1hOb3czaVZvT3NLaGo2STNHSVFYNnc3RUcxWkNOY1RDWkI5NG1RaTdFTFp6SG9ZcldsRUptSUcza20xdVNwWUE3bVM2S0R2QUdIQStRVis0Tk5hUGFiZnNTME5xc3JsNlVTc1JGSHB1Y0hSWUpYV012OXVPSCt6c1B0TFA5Y0s3M0s0bHNvZ3hOL0NlTjhielBBWU9LZFJPb2dQZ0llT0RoOVZoaEt6eWlMNGMyOHQ5UHpFRDRmdEtseGR6TXBSaVg2M3Q1UktBckxGSEttTkgzamNLSDFsMXlUQkx0alZXSFZLVzJnQlpFTmNzZDR6U0NIcXhXY2ZXSVRPQzRYNWhKcXZsbkR3ZDBDT2JyTlI4SlVjK2RYQzZWN2p1QW8wNXZjTlN6a1NzbkhpWXBVUzFOa29XWU9PYlEwNlNnT0c5emdLYmhVWFhlS3NtNmdua0ljamhmeS9FdXVZYVBXMzh6QnR0bUhuN1I5KzVtS1JweWxUNlZCSzhGU3BXZGVGTXNoU0JDYmVBK2lvbnh4Q0hoVVBHOHJjcnBSdllibG12VC9NdmFkVzl0L01JcnJWZXNSaElpQ0p2Y1E3cEV6Y3lFTXJKY0MwY0V3b1RydUxMcU5YSE52b1M4R2M1Z3BHb2VoQjBuQUZMc0k2SmFwQnlJbllaZElGaUdJQU51c0hNNzVSRkE2N0dMRDB4aWM4NjJvODhEcEhHZmVYREVHMlBoNUlabDFTQm5yQ05BV0E2elJMTEFxRDI5eEl4YnR4akVXdzlJazJnb1ljUzRSSTkxd2hIMmZ1ZGpMVEhPMG1Gb0tESGp1RU9YblhuS25jK0hYaFVxVjRDUThEd2JlRFNKNHZqVXFWNGg5SHV4Rzhhb0lWdlpZMVJzaXZ0SDNreHI2c3FpVWVVRENmb21EeXVXOVJ1MU9lbmVDQmlHN1k4QmIwY3h5RGtqNGJPNmlsNmgxRGh4S0pqWFNZV25XRDdMeVJHQnZrVEhUc0NGbXVPOHVBMGE3emtjbFVTa3RUbzNGNmU2TXczNEY4eTR1eWN3eG1lWXVzUFZPc3lBcXZ1Uk9sQzZabGhiRjVRUXN1ckRoRFJCb281d051aXdyZ2ppZytWUlpZY2RONG1EZlNKZVNoTDN0bEFlR1BUL1dZdnpuRHZLdmM2WldXMEh4TWh5aHJwNnc4YWxmVFVJVGI2UzhGL1JVUG9aeEtDM3hMRTNRY3p1UmY4bUhXVWVzR3l0WlpwSUdsOFA0bFVGWkplMFZnUFNOeExWeHNMc2JJRWF3SUtoN3hvZXpDSEcrWmpRSUhySVdnV0VNeEd3cXViZ0lpQWN2V2VlMmp6VUZ6c0w2eXdkQnpMZFlHVnhGcDV1RktyVjk1a2grWVlGVmJyTENvSjBxVWxXS3VQZURhQUcyT1lLeWJYQU5WWE9ycnltVExOeWxWcmlZRm84M09qaGJpaFlsdGZKQXBmQjlUTEtlVUk0ZVVjd0E5Qyt6d3k1R3VEOFEyaDFMaDZPVDNobTZJZlJYME1FR2ZBaWorZ01vWGdrajRFTitMR0J1NzZSMlBGeTFIV0lSbk5mN0h4Y01ZOUdEUGFPMFBjY1o2eGt2ZDlVN3dVTjlDbGFnRHZyN1N0VURMcEtoZ2dpclNrTHZyVU5Bd1VpUUp4ekRjMW1hWjBrc29EM2tYUFIxRFhYOXFaMUJtU0tPSWdxcnhjYWRYRlJuVGRaaFZiTzV2WmF6QXl2c2FnS0NIdE4zVVNBb2JvbVRTZHlDbXFLWXFOUllZalRIQlc5SkwwdVRGMUx5WmhCcXZ6RTNudE1GeWt4T1RqdG1adGVrZE1GM2ExTWgwSStrN2diUE9GMkRHZjU5b041dDlZc3FpdGh2d0k0b1psU3ZCV0hnSGdCbHkvU1hMakhKS0g1SmRGNXd3NGVMSmp0NnZ0Q1BOVDFtTEJncW5XR1pWdXNialdtZ3oyOVBlVmFHRE1XTmQ2cXlHZGZiam1hU0RJNVFMS0ducjZTcFl0SzRuUWJnVTQ1MVo0UllLUnRXeDFQTzNNMTRIRU5VT1E4eTFLNndqdEtob1lKUkxxT0NtdVJjcnZNbWRNcU9Cd1FBV0Z6TDBNTVRWZ1ZPSVM0NHNUSlR3SFdEcUU1bDR6MmdNMjA1QUYxZXB5SjdSQUJyZEVhR3plUmlLd3FzTDVoU3FpelNqakVUZG5iS01jRTNUazhWTGdYMVJ3amVEM2c2NGhYbk12bDJmYVdjMERIbVJZbHkvcU1TdldFdnhENGI4V3BjSE1wU01HREJnd1pjdnd4bXVobVpKWGpIYkV1aE9reGpDWGhxWlYzcEsvOEJvdjVsaXBWMTJmOWdhNk1KaVZMZ1QwZE0wQ0huZ2xoUzVSVFIwaWg1NnltK1N5c0kxazVGTHhLQTdleEwwb05PWWFtQzV0eEV2WWk2SG5MaExJNXFHVzdvUTJFOVpvUXA3eHNXVGE0Sm1uVGlVS0Z5VkNpdXNXZ1ltVTVMTDBtZjBHTDRqbS9CdElGQ2NUWmtDdU1UR0syc2Fxd3FPc1Fxem5yQmtzNlZ6RDFvdE9qSzVRZFJFdUxlNDZiZFpYMWxiNnR6NTRjWm5RK1VGbDR5L0g2aEYzQ3c3c3FSWWwxeHE1UjFpdDlmNGpnNVZrWld3c2x6bjZHSEVlTXVDa2N3b0Zldk1OcVlhSGtqc21FWE5ibGxBelBYUWRZTUlNR0RMOEVwb2M1bWhWS2dYZE9BNS9NVlRBTWxURjMwNVk5RHN2NWZ0R2JFcGx3UE53SFVTYksxNFgybHNwVmY0d2UwckpnR0dqaEEzUlZrT3FGV2RrdmdXMndLOENBTGJqRlIxTXFzSTlobzRpbEpDSUpoZXBjSlZIY1lySVpFR0RpMHd3UmxSS3pnMGxFNU5RMGNqSDB1QWRZelhrY3hyaGtYaUNaVllTZzNjTGtwZ2xoamRvWGQrblNaUUdyUkhNdUZsRnFGeTltRytWSmxFSEFsSkIxUmdaT240LzdON3V5dzNFb2U2RDRkTCsvd0M3eEx3RDgwZWEwbXpoMUg3cEQ4VHpVNDlaZlk1d2VVTEVHRzVjV0xHWGRtZWljR1BsSFhPSnhNWnpPRjRVOENwd0lrRHpNUUtBanRyZ2w3L284RUdLMnVVVGxCOEJsd2dsSU4vREtaekdtTnpSWDkvWE1GZVNZTDJqMlZqaVlxcDdRT2FxVjF6Rnk1eXU2aWd1U3ZQdkxielVaaWkrUHRFQmsyczNjcFhIT1hEMVY3eXUxQU1YaGl6THhLamgzV2VZejFSaUdyRDFETXlmUnE5WXQvRXFTbVpaV21yMUZzbGVjZmhhT1plOFpmaU9uOUt2RWFPRGlFc01PTFlFT0Y1T3NYd3lWQ1B1SU0xTWhNaTdSM1N3QkwxUWZTZDhybHhYQ3ZSZ0FnVU1MRmJsbklVM294VVE1amEvTi9Neno2ZkFiTDZ2YVVGRjVZMjBYVTZpeEtjODNNM3B6N202OW9RRTFHNWNsS1RaTE5PRFVjOEo5QUF4ZkNENDJLdUIzMUlIVXZrZkEzQlY5NVlpWkdDNm1MTkN6TFVDaWp3WVhSZGQ0UU9ZUGdJY2pyaTVrbUp5UVZsd1lwK2F0S0lPWUs3Z3lybFhpY2dUTzZqUjQ0bHl3c3lkS0FiZTJiSlRSaTh5a2J3WllhMEdlbVZoRVhmZEJIY3Q2elVqd3ViVDZNWEQxTTVPTHBDd1hMVXVsWEpUcTZNVmxkeE1nNmlyZ0Yzd2txR2R4NGc2Z0xZbFVpdnJaTmlpYmoxNXdROWdlTFlXWnBwcUhOMzFJQkNieXBhckhjbENqbXI4MHpBd0hvdkFqV1hndHdHNFZWVnlZNlJVVFRPS1RyVnNaNk92MUxUQzZqN014SmZKS3JhM0EwSkxsdmliSVlUOFBnZElXR25ybytKRHdPcUxSRFJmamsxT2RjeHRvRDRBaDRHVm1XT1NZeE1qdEJHcnlsUlNUY3hleTVQT3puTXV2czU4NGVHM2tRM1lZNzJOMHcxU1N3VEE5U0VZOWFpTkJleExySlhTTmo1eXlHamtnbndJR0JpdCtuRXFhRzI0SzFlWTNHOVRKOE5CZ1VJVzdYbG1DWmlCdUNMQjNWelFsZHZNUzBKeTIxS0cybFlyVURnSERSVWZXV1gySXVyWlBhV28yN3pMNk1VK3VaV2VVVUY2VHk5a1ZpOVpWMEdSc2kwSHVoYW5MaTlmU0ovSHhTeWliREl3aFZuUnVuZVVpNXFkZnlhU0pHYlhBeFJ2U01xRkd1a3N3QlpVcWJoRWhOcGtpQlFKdGZFQmNGRzVROElRaFBLeU8rcFBDaGhwaVp1ZFA4cUVldmhVUTdpcGh1WU9RaS9GaU9CRWJFSWg1UzNud0FyY0N3TVZVK1dFeVc1eGNvc3NkQ1VsQmxVQ3ZPZ0tGbmtRTVJYck1kaWJ1cGRDblpBSk5HNDBWMXBjVjZpTzN5bHp6Y3l4c0MxNW9MWlJqR0pZV0RvdFEwTE95NWw1cDZDV0tqMHhPZksvV2FDUkF1SmNFZHNLK2YzS3cyYTk1VlM4eE9hSmJVNkxwZDU4dCs4QzNDaDdmNjUyV1Y2d2lRTXdGU3Z2VERFaGtsZUhlT3ZvRlF2UWxRUEhnYW5FSG9TaUw2S0R5WWlxc2FqUEtmN2p3aTQrVTQrbXNTcFVTOFRnb3NjbmhXL2hDdk1PazhGWHA4STV6U1VNWWlGcXpRVFBZQzlqZHRSUG1NeEFWWlhCVW9QWXNqR2NVSllZZXNCc0lXV2ZXVm1XeFV4S0RmdUFxOGJZZGVVNktPaFVxMnR0WjRoV0Y1b3F0MEttZUVDbzc2aUJDZWt4UWU1T1hjbXpmNXpMcWh0c2lYMDFjSG56NzFEQjdIeWY5bGFyYnM4cmxxTjM1RUxUaGM0ekVhYjA4RUFndTVlNElKVmVGWDV5b1pQQWptWlk2d2hGcVpxVUVFblNCOGFDMDhlM3NKa2I2VThMejVUQjhwcVBCNWZVWWcvUzdpU3J4RXdEckUyNWh0Rnc2RVMzSzJoRmF4TjlNc3h1WnNmVjVKWVVVTm5XWnFFeU55djZCbGFTNE9JWFRNQW9DNTNZRVpHQWwyV1BWQW9MQlN3dGRSeWdTOGgzcXBxT1lWUE1EZDFjU3BOUzFPeE9mVWJuMkpoRG4rL2NiaFhiMi81QWR2UzdEcjF4S0hpRythTWZFc1lxMGNkY010bnVpNXA4cHN1V0J0VHJBem93cVR5Mk10S1lHOXl2QXpFcHNqcTVtRE5RWnk1ZnRDRURhM29Pc1VJdHU5ZWtaVVpiZnBBbVpuUXhMRDRPSTVTdDF6Zjl1WkhadVhsS3pOMkVPM1RNNCtoMmxMSTcvd0RHb3lyWkVham9SaDNqdkhwRFF5N2tZZWFYRTRPczg1WGF6ZXNOVEt2SEY3STZmaEJLSjBBd3FnTHJJYzlJOHVNZzRRTERZSW9Zb1ZHNWwxVE1NVkZ4MXJNUGtEYjZFdG5sL013QjZKc2U5VGFKdEdxSDBqNkp0NjFjTkIyVHk0SjE0cWR5Vy95WjNxamIxWE51WS9PRktXa2JQZUd6ZkRvK0hhY1VucUl6RnpxWklVV3JPcE1rd3hKVFROTXZLcThyZ3UxcjExS0VHbVphV2hhSWZVOWFkaE1jdWJkT0piSmgvYUZMSlVOcEx5eGptQWZpV0NHZkZqWTNWeTFwL3dET3BVcVVpM0VYeEM0bE1qcmRWOXBpNDNpcFVxc1RtSEQvQUhwRGZSZkhKQllCT2dUZDRXZ1VNdUR6bUdlQVhpQk1TWk5GOG9pZ3BWUDRtWjYxRDBRanVjNEpZT2MvN0F1US93Q0ptNk5rWlR5ekZOZE8rODJsOHc2ekRIZmIrNjdoTnd1bjNodzVBNGRsUWdzblk2YW0xZGZuaVc1VXhseDNobVZEd1hoRjI1bGJFT3JwKy83aFFOZks5ekU5NCtBdzFxWEtydlRrbkp3K2NmNmVGN3cxK1lNdVg0WFJiRXdNRUlUcGtNWlpVRzBOYlV6Nm1ZS081VlFlcHZ2TENLYlp3WVphZ2Y1RDZhLzlYNkdaSmtWNEVvbmxnek1oRzNYMWdJb25GWWxSYkRQbEFtQmJMWDlSZ29NRTVsaHFLSzd6Q21RU0dNQTR6aWEwTUQzODQ1YmdnNTVjekVEZFVQNWhVK1JVRG1qaERXek1UQjZvZ0E3ZnREZ1l4ZHhSNVZ6RG8yZGx4Mjl2aU5aSlJlNGxMdG1xWDEzOHdpMDhuVEVWaDNueEhSTUdYWC9FRWVTV2RKOGhtdTlmRVRvOXlkVk91WGp5Wm4wN3g5R3M0Z0lyZXJuTzRKR3p1UStsVHBPOUh0dlZtVjUzK0luQ2ZLQWxNbmJmMmxIZ09HT3FZTlRBVEcvTWVrSEZrYXgwanoxbDJmOEF6WHdEN3duVVo0M0d3bUt3MlJBaHZaY3RydzdwbGp3MkpvdldPOGVWM214TFdvdmlBUVZ6bXlwZ0I2cHlUUTgzWG5CZW1RL21XZG5NaWdkRlhpQytmZGNmR082Um16N3NyRlI1ckgvQ2h6R251L3IrcFlYb3A2NGhPUnEzUEhIekZqVGRhaElYTHo3eXMwNDhyeVlnL3VvekIrY0JOTVJOOHR2UFYvVTVST3JNcVhGVlBSb0IzdnJpSFdDNFlTdkNwUjR1UmVTdkM2ZWtLZ0RYQU5NVWplWHFmOGxVWkJEeXhEUnlYbjdrTFo2RDNnMFRsYVppWHlSMm52YzRxTzV6OUIvOFZlUHJqUzBZVzhUTnRGem1iQ3doYlVlem1GeTZyZ0FVcnZCcVhBZHhlRklxbGc0UUFoVjA2bXdXTHpnbHdhTXBLNkRLQ0dkbytabUxWNXd5TUhYTUVCckkxRXlENWc5amZsRmYxSDZxWEFLeUI3WEJGRjBuVUZ3VFhIdHI1Zyt5TzlZbFZYbys4Ukg0YTYzcGovWVc3WE4rZldFQ0gwTXIwaUZ4Q3U0QmZVbDFpWjVsZ3VoeXdYK2pBQWREMGg0bmE4a2libUtReS9HV1BSaEZIbHpGYXpDNGxqeTFLWk1RVXZIV09IMG0zYi81enM0eDhpNTNPclpidDdvQU84OHN1ckhidnJCWkxPVHJCcTBNd2J1R2VpVThZNDJ2KzRnQytwRHJ6QzkraUo2NWNTNkFybjhFeEYwTy9hR3FiejZ1STFFelJMWGVXVmVjYXFadHVIQnBYMlpacjJPMHlNcjVKS3JMUmw1R0oxR1Zmblg3bEJyV0wwNnhwUGtlc0NLVnpuQWxVTjBUNWErODVzdWd3dGcxMC84QURpY2ZYWTNXUk5ycVRaZzZkQjUvdjFDZ3hTL2ZWZm1KckNCTDUxY05zYWRIVHRNd3hGOGxlZDlaNXduZEJFd0xXWWZZUWt1aSszZ01ZbWovQU9hanlZZTBoenZVQy9YRUd0a2NXd2NGeDV4c0V4aHBoTGxWbjduTFhyaElFTXRuZHNpR2Z5aXhNWHVYOHJkZElwNTE5Z1NqYllxTzBPblNEMmx5M0prRXVwNTYxL3M0bHFId1l3KzBUM1gwS2Z1QWlHLzUrWUdpNnNFb09sRlMrcS83RjBGaTNHdGtYSmQ0V0hYMFlONVZGV25yTktCOS9xZENMUmM3MUEvK05qeStlYlNmM05Ta2J1bHdabEFNYzNyMmhqYXdiOTdWKzRUYlk0QzRZbUFPZUx6T3lhcWJSNlJzcVU0aUlpMmcxckQvQUlreVBIMlN3WGxNT1htb0lsaUoyOExoL3dERWxWWFViMis2Vm5COU14eFBuQkxhRlR5Skw2eWE1aURXOHpnYnc0akI2cUN5L2c5Z2Y4bXFLenAybENMd0UxRitjT3ZOTUVlZEIwbWJQS0pWTlNXMjRxWUxiSHJlaVY2WXdPOHdzeTdQZnJBb1Y1Z2JJYisybzVwUXFqbzU5N21LdlZYeEdwdHJrTWZRZFQ0ZjNMaDRYRHd5Vmx1anNRVjRNSnI2SCtydW1VdlU2UU5GVEZWZENIVmxVU2hsdERkZjI1aXpXU252ZVdGcnJIcEhsL2pVdGVocjAvNitHcW1OeTdUckxEaGtUMUx4NVptWmRDc2wzcy9jb1g1REVCcThyYnlSbW4wRGJORExyZTRYVUI2UUxGY3Yvd0NINFp1T2hpa3VpdXpPRENtc2plVUF5dGU2Vys2V3JtNGpzU0tkMmRaZVBPVmk0TndEQnhCcm02NDRJalRXMmZLcGpHS0RBUnZMb015emQydnBOa0xwejdROFc4ejcvbUIwVjBldHdnTXZQOXBmQURBbmxYKy9Nc0JlWDhGZnVLN1l3ZWNBMTBXSEwxMTF6TGFITDFPSDdsYjdSbUpVcUZITk5hNzRqNlZIUmI4VHk4TDlrUFFhMjkrU1hOK0NOSjYycFdlNi9hR1FZL1hqQzNrT1RhL1kvakZMeWNPMy9KVFhqL1QvQUdGQVVub1hIeEJaVzlveCswZXRPK1g4NVg3d3NYVTg5dUlOS1dVR2hMS3lXeXNLOXkyY1gwT08wUUMwWXVtbnlSaDg4cnUrSVZvUlJ4ZU0vTVNZL25aM2hZQ0crTGMwVDJTNnU1eGtkY0ljd2p2WDdtbEVBNlI5Zi9XdTBBUUJOakJxcDl3Z1hYcnFVdTJQSW5PSS9ubVlzSGtjUnV4WWQ3VEJzODJZRWMvZWNpWjRiUEY0aXZ5c0pTNzR5c29QU29ucEh0SGtTbk91N1BKUHVaL0pHcGtQZkV5NTdlQTZvNjZ4K0lLQnBXQ0p1NE4vbURZb3ZsWEJ5OS9uckIwck0zalpOSWRnTnkyaGZFQmVyUGF6ODFMOER3eFhoYjU4VHNBcVlEZGEvdnRQTHg5a2ZEbjZLKzM2MkNNT0lWR3dMZHJWKzhPYzBGdnhCejRXVjBNZk10VHRWSHpzL2VLOWdFOHZIckdTNDU5LzhsQkYxbkg1bjJDYk9oT1FuVndVY0Y0Z2N5b05XVW41bmVFSTIzUXZqaEg1bGs0aXZLRFA5NVRCcFdYTEM2KzgzRkJzRFZtQ0ZUWEpWNWUvdmlaQVMyQ3RmMHhBY2xlR3I1ellzQXVwaEkzclRLc29XcnJLTkd1YWpTVGZUUmdSUGNhZldIV3ZUL3daUmRURXRZcDZjUHIwZzVRbXJmcEV4aE9JeTNtaG1ZS3IzNlJ6N0JGcDZGbHVOdFFlaVZ0OUc3WjhyL1VxSE5GU25VTUc3UEE2U2dCelVvNTZ3OVlIek1kb3k5bVovd0FSQWRtcnRpWHM2UXRTOVUrSWM4TnJpUGREOFM3ZmxGeXFKa3lkQjM3UVlzNDZzSTFhbDEyWis1Y1ljN0ErMzZobUpTQU5yQ3Nmby9yKzRJK0d1anpHRVJ1aCtQdFVDaStFdVlSYzdpMTJEK1B4SFhnQzhqNytCQTRKZ3RNZE9mU0QyLzBYTFlCV29GRy94MmwzdWRCbVBQM1hUdWZ4NXNlcnFyMEI4VFRHQlIwdlh4OXZPVUk2TFBZL21YWFFuZTUvaTVmRFJpRmE4L0VjMzd6QWVjb0gzSU9ER0k1Y2VkL3FhRGU0RFE1L0x6OW1VdHFSL1AwZ1NsWmZjZGViOHcyTENwZlJjZmIyaGV6ZHJEWjFqc3BlSEFQS2I5MG0ySml2TW1HL1JxR21xTS9rRnl2bUR5WVpkZEUyNVhVWmNxY0ZWOTY1OUlUUnUvcWZBdnBDeFovSDVpQXRZL0ptUVY1VnZzbEwyanRaMUkzOHI5UURSTlluWGdIU251L2lEVHBsMGxYWm9Zc25DWHVhVkt1c2xFSXgwQ1AyL3FWbEM5WE9VSjZVUWtoUVdndE1CVDVzVlRRZlltVDJ0Z0E2cXZ6aUszYThpV2p5Y3ZhR0ZLNFFJM2VYV1k3dThCMTdSQk9CaHE0MmYzYU9PbHpaZnRqNW1UNXdPRDBqaklEMWlDZVVOR20yWG5VTXl3OE9Yci90UjFCYzBaamIwd1Z4KzlFUUczbVdXNUF2SmN0azcwNDFsanJZQVc4WC9rcFRCNW5rZm1MYlkyc2RaNXdZY0dCbkgvVWxXbVhDNE1EOHpqZ01FNkg0bWE5SVBhbE92OXhGeGxDSHJ4N24zaHBQNWlHZDBQaEwvcUJoa3lIN2c3VVV2b2kvS0djTGQ2Ymw4NkVKbmVBQWV3aHFLRER1THFuNGdhRXYxbDJwZE9MaUdkci9BRVpybW9jaXJZNnNMSHcvY3Mxdklna3ZMZmVHVnZ3SHhZeXdyclVwZUhFb0swYVIvTWxhMzBKVWdHRGY5ZmFYbXNITzdsMFNuTkNabUdpdzZmZUEzRHVUUjBqZlFiYnJQa1F5MEgzblV5c25HSzlsU0ZhNkRMby8yWngzZy92c3d5N214NlFjdEtwS2FIellQTkphclJGUXBaN09QN3lpTVB0Y0hEMW5FMVJTL0p0VmxVQ2FrNS9QL0Q4K0NxWmhzbG5NSUpjL3BZL2VZWlZMbFNuSEhtaHUzQmxmandqNWVjMjNNSEViakNDWFBIOXpFTERsMmNhKytmdkNqbFkvT1VQZU81MGk1ZVVPdmIrNG1GTmc5VTU5NzlwWHFGdGZjOEVlZzlmV2JDSzBkUDFNNFQ3YjF6L1hCeHlicTR3RTIvdm1BWng0NjNZZjNFQ3hBc3NVUC9XQnpnZTRuVU9uVHRDdGpEWDVzUnM1NGp1MGVjUnlPNDhCTS9uS2VUL3JFVzF4aWc2RXQzSGVLL1BJWnQvU2Izd0IwZVNPSDRmb1pjOXhtQitmYVhZcUF3S3JyRjEzUUZSdk9mOEFZbUJyc2l1SzlvYkZEU3hyek5EZDlMK1p4R0xYcEZzQ3NibEdabHZWcGZOejgvYWU0ZnRQY1dMMzZUKzNrdzVMMVk4SUZ2TXlpMjljOTRTc0p1ekNiWHlSaDVtMldReE5zMStBU2djNUF0amxVS2JYUFVnM2h4VnB5ZCsvRXNLSlRIQ0dPUENRenpMZzlPY2JqTk05QWlLZlJydEJXWGFMd0tVSVBGd0RIUW83UjN3aDd2NjJMenF2KyswNkQ0MDZ1ZmEzMUprVVdxODVNWDhUQWlxaDhvdWdEUkZ0dnJVNFRWOFRQZjhBYmxnVk81TC9BR2h3WndBMFJWcjB4S0M5NG9yV2p5MitaRlFHd01ZYWpzTGx2MTkzTDBxRTBDdUI0TzlxUGR2ZUxaUjExQ0M2RkhHcG1DWVlYekZ5elV5UE9aN3FETHVuRWxPU0FYY3Z4WmVtMk9WLzZsTmNES0dsWTRtT211WUdjZWtEemZtRDZ3cnZINm5zdFYvMTh3TEcxMlBaTXd1Mnk0UzNDeVdwRjVIZjlpTFJ1R0ZFbCtjNERYN1RGL2dnUzVOdllqaFdVQStyL2xUTm5Cc2UzK2tNUkRiTlFPa01FQzN4VnJKeHppQzhNWmxYNUFmZVdnbGJ2b3k2TGNmYVAvVVRIZ0NWUFh4dUFKZ3p6RHk2eFBZcFVlQXd2cWNFdEc1MWVhaTc5OXFaZURTMHZRMi9hV1BzdUd1WFIrUFNZdURHWHUvcVVob2hUQnJIM251c3o0Skgxak1NRWVpUDRsRExib3ZlcWdLellOdkxtSUhkci83MkRmbktwaGs1WEw1K2JBdXFQQngrU1VTNzhCbzRQbE1kSCt5cHoyaE5HdkFBM2pjV25lV1p3M09FYW1YUDFMbVEwdzZsd3ZMakJzeGJIZGJXdVdjUkREdS85ZzZrV2VzNnoxN1JyWUt5aGh1c1pnR0lzaC9pb2pKK3Y1cUVOM2dyKzlaYXp6UG16RnQwSzZ2L0FHQXk3djFvNjZkZnJDdVhMY29iMWxIblRjd0RzQ0V1dVZUeS9ybEJoK2hZeTF1cU9oajRKb29Dc1IyeWpFMkQzOFZSV3Uwd1pJNHlrYnpuN1F3OUFtcjh5cmdwaEpYYndlWXNhbUpWaHdyck1BMWJMQXBkMHA2VXg4ckZqNUIrNWJycVQwamNqaXZtakRkalJyUGZMRU42TCtKZlhveFZOWnMzTVhweTRQaU51T1RFZVpxTHE1bkRhOCtmaUJ0NEREeXRvb3B6TGh2MVlUV2tTbkhaRmhFY3JzNzl2amZXT0RJTlBJZWthbHBGbndibk4ySUxiZzlaY2hjVFNjU2xMa2pFcnpTNVlSaE1SczFPNlpVNUYwVHJSMVF2L1VpYmlpbGRFUnlGcFQzNWhibTNRc1E2eUhLUVVWa3ZxTVpDMTRPSmFHakwrdkloVHFjVEpjR1BYY0xxdEMzcVhIUmF3OURVM1BuY1E1RlI4NHQ1Rm42UVozMUl3dWZWVnhMR21CckhhTjRQZC8yWi9KdlBMOVRrTm5TRzYrcSs4dW9MOG55N01JTDdmdWRudzArOFZDOE11Z1M3eGlXdkRBNEtQaEN1eXByTkNwVnNwTnp6d0hvbFhPS1FsR21lTGlqUzFFOGpWLzNuTk5YSlB2Qlg5R2o5eFhldHA1WW5BcmNsMEhLd3FIQUx3dGN4K2JxTllIRnFleC9zc1dYVGYzbGpYQkFvNHN4LzNhSzFtSnZnYnorWmhOV2RPNy9jb3MrVGpDaExFQTVIWU5kZHd3RjFVYzN3VE9MMExoU3orRjYvRHlsS2RXUjZ4aDRWdE55cllSaTRqaXVVSURvRVNuQ25FTjhwRGNTNFBKRU81NkFvbTB3ejJzMisvd0FSN2JZNFhMSTBzcHl4UVZEWkFNTmh4YmJwT1puZlQvSmxXNytMbWFZKzJjSHRNbnUxMm5XWWZaVjgwbHR6Z3J5UUw0R0h2anBjNi94N1RlTlhDY2MzY0ZIM2hwYS9JZnVlb1gyU2c4clk2V1A1SURyR1MremY3bFA1YjJWWDZtdlZ6Nm9uT0JRT2s2eDA2c2NKMWdJMW1EanRGdmNVeEx3N3dObmdFMzZ3eGRMM0hETlBMTVVCWFdaMk4zVVZOQjNUOXhRSTRkU21UV2ExQTJBWklHRU9wQmMySjQxdzRnODJpMTgvZUJ2ZGxsK2wzRGFHRTc4WCswcEFKOXkvN3hOQmdQVmlQVGxYdmNhMWtoODVsMWI2dnRLVGg1cVZhdWkvTnU1Y1hiSVdaNWduUnd6Y1ZvVEswSDJuM2E5TmN5dTVaZEVjTjlQS0ZHNDFyaWFqelpGYkZqREJidmZtOGQ0cUtpem4zZ0h5VEh3YTN6SDZDUHRtQXNOT1R3ZWVvbnltUHZQU1htY01Bdy9FdWRJdC9lVVYrWk5uSEQ4U2xIK2RPL2xLNGxkQWI5SFdVbWVEMXhGVjB0djkyK1lZcVZUK0lDOGIyN2RwL1BUYkhZZUMvZTVTbTFGUzdkblhCMGdzWHkyeXhoc2ZtSEZkb2E5emFPb2xJTXVWQi9MN3pNYlV6czJmbUY3NFBSTVJ5d1lKd0g3U3BvTjFVczlRNlJvWGVaUUZMcWJnbUhxNVM0ZUlrTGVtYjN4OTVTK0l2ZXZQdmsrODhuMThjc3dyaG9GTjNyemdJNHE1cFpNVk5mR1phejVmTU9TNHpPeHgrUDhBSmtqek9laGR4WGlPTVBsL2pLUjN2eWxRTHhjUVF0Rnp6L01JS2NLODhmdVppaXlzZWY4QUVkZmxsZDVsRHRQaVpUWXlyenhBdU41M3JqMWdGRzhkYW9OL0VRWXJHZVM0UHltOWJiSmUrL0xWKzhVQ2dkU2tBNnpMRHJTVzVHN3hBV0FEeUV2d1dZNHJJUnAzaHViRUdEeSs3T3RHdTR4K292QXljUnFwYTJUVDBpKzlSL2NmTU53VTBleEJzUTZYQXBaREFNZUJ6NjkyY3BWWWRzU3VMVDJDZmVVd0kzaVhNZ3FYUC9adVFTMityTGcxZVhXYy9KRGdPUDFHcDFVTWM1bGhMTzc0dUtzWmRvY2owSjhXL1dDSGM4VHlBejNtREhSWHZLekU3ai9PMHJzR2oxcDhIQmR2ekRiQXZ5NmVCemlHR0lBVVRTY1RpZC9jeWd3ZWRJTFluWENPTVZlY2JOd0d4N3g1RWpHNHkvTExXZlFRd3ZVdUdaWXhaMk14aDYySmdBaWwzM21lNkQycVVYcVUvd0I2eGZ3Qm5XVnI5SFB2ajd5c2RvOVpPTm02d0tQUnA5b2lGcjNTL3dCVEdpciswc2xLRlhhcFlaaFU4cHA5ZkowUldLN2ptemE5c1JkV0pUNlZtTlN4cjZiekhGTy9xSEhtNW1sS0ZhV09FaVlHQVdXMC93Qm02aDdKbnJ0N2VzcFF0WFJxTEt6L0FDWDkrQkdRZVpaR2xnZ3pCV2NyZmIvV0dWMVFZMGVzUzJBNkxNeWFla2RseHl5d3NzVk84S3pyQWZLSFByUHRPMmRDZWNDOXFOQkV4STRwRVRSaC9KN2FqZ2NOdmFPaHlWTzJnbEJjTDlQS095MWE0WHQwZzZXcHk5WWxHOUIvZmVQM0RmeDh6T2RVK0pXWE9KNk1ueWdVZUtQNG5sc0wyLzVjZGpyRjlxK1l3Qmk2NFVNUUNQWEZiZVdXWG5NUkJ6TDVneWdZV1gxbTB4MCswWU4yQjY0akdPTUJPbXBWTmZhTkxuUG5NVEhid3ZNVlJpTzBwcSt2M2MzN3l1OHlaQjYzRWlLVms5RzVrb1krejFPOEUzeU1mWklLNUVZbTNpK3hEVDlGdlNxVDh4NjBFWFhsZjVuSWN1M1RtV3E1MCs4SDdsOVhIM1preGFqc1AwQjZ3V1dvTk9QZUVMZVZlZ2pyRGdodktoN1pteFhNdlFPU3krWlVoUnZKem85TnorSDZUNFNkQ0NNUjYrUDVFYjNiK0lrSm56ejNpSnM4Q0lDSEozekk0RndjK2NBeGFZZk80clg2Vk1uTGd4T2JZeW81RGp2TTRZRmZXRW9ZYTlKMTJlZWEvd0NvdkxiMGZ6RE1JV2NSZE9SOTFFbzBhZVRoK0pRWFJSOHpFRmxydGcwL09kb0hJNFhtSVZyblVxRmc4NDZtTXQ0RHYrd3h6V05IV2wrb3JLemI3OUprVzFQWVRtNW5EeEdiVGp4OCtNZm05SVlobWNkUEcvRE1jNFpjcWpPcFJRTmpYSEVhUTZCNTlNcFZ5MTNJc1RSTHIxL2N6Q2RXZEd6MWtGTTZ1ZTArVmZhV1FHU2ZzUk5PbGgybk8yLzdGZUVrcHVOZU0rODFYOTBtbXRDaTczZnkrMHNhbVZuc1RDUGI2NjlXbzhJY0QwcjI0bXBFeXk3d3JnSElRM2JCVWFWZmkrWlJmMER3aEJoNUR3ak4yeUY5cFowbkdHTEhHYW0waDVVQlRNSmFua0VGN01URVZEWXlsNzVlMEJlWU9iM2hiYkZlVzl3bXRxbis3UytBd2RnbERnZWpuL3MwVnl0OThMNlhMWTZyOG5TYmhqaG5xTXUzZERNaDlvRURydE1PK1NuTjJTcTNHVDNwS0J3VTI5WFA3Z3NWeko2YVBwV2Z2SllWa1orcnF5cWVmd3hndXlOMjl2TWVQM0twOEJ1VnhIZnlsMDYrWEV5UFZpSVFwTVBnSG9qWk8yaURCbWVzeFBpUGhnRFplMFp0V21iejJ5NGFveWV1UG41bG1qdCtkdERRMWFIbzFaQzV3UGMxWHRpR2ZJTWFPV1QrN1FjdGY3RVc3VTY0bTZxL0F1SzhxTFQ3L21POGRSOHNyOFE0OHczNXV2dEh5QTJ2bTJZcEtjRmVlWDllczJWSm5uUndRZHJyZUh5bDVMc3dZT2p1NlFLMkN4NERuM3VGM1hNTkY5RGI4SnRmaEcwc0hHUER0QkxPWXRNMHhNWG1ka1dqVXRUZHNXMm1XdWRSRnY2b1lhOHVkNGwxVWN2ckxWMkFwMVYvMmM0RXVXMmZrTGlpdEYzbmcvMzRtR2QxWEcvN1V3bkZ2bmY4MU1NOFZ0N1FDTU9ldHQ3bU9tc3ZXMmNhYjNNWG5lUFNjVnZYem1mN3VtQ0sxczI5enFaZ3dINk9JbGhZcG5vdS9oOVpndkFxek9HSmR4amQ5SlR0OG9RNitGVFJiS0hhRTRMTTJxMWVXSmdwK0JmMFByOUZ3WmV2cDBDN3Juekk4S2NyR0JaZGtydFROdjVQWFRDcVRZbDlETDVKUUJpcStmNmdwb3RuUlUrMS9hQzFBcUIwNitsdmVKR2x6dWN3RUIxMHpwRFpSNTZaZytkZnZEWTRKYjVjL21FNVQxYzNVY2NDaS9XVkdncFBKL3NNQm1nWFJ5RE5mTXl2cE1IcUVJWUZvdjRsRWRzK2NzTjZ3ZktjRFVZZURwblg0YW1PbW81dERSYkhka2UvZUpUblR4RU1GcnJCUlkzR2t1VUdBNXV2Z3hFYjV6N3hDWHI0S25zeE9ncXo1Y3h0dlJoL2VrQXdiVlFPdzE5N21UQXlWMkRuNWh1YXloT1hGWDZNdGM3T1JWdjBoNnhBcmdhL0JPVXpMN240bVNub2ZabFdySjhSWjZhZnhmcUhBWlRyQVh6dy9NTlhKSkdtT3p6UHlSR2N6eUFvL05rcXM3WWYxa3M5b25PMkhwQlYrZWtCQXRPSEc5UW0rVHZBck5ua1M5NUJ0WG5BaVRrbzl6ZlduM2kwNTVYM1A4K2ptWEJ1YitqbEVIR0cyWEZ5c2kzUUk5NXdEb25XZytXTS9SdGFxK25yTHVlckRsckgzbHgxOU8zZ2ZhL1NZUGRUU2Mzanl1cFJYUjdkUlF2RmVkRzgrOGF6eVR3dHg3TVVKc1ZiQlk4REdKWnFoV1dzdDk1WEpqNS8zV0ZldzNSYVRKN0UxeXhCSVlCMFlxTVFuQ1FBK2ZRNkg0WjlyR1AwRmNVVWd6TUFnOTN3M0QyUTBKektwV0pzTVJ1dXM0aHY0bDFQT0MrK2Z6Tng4NDdxQ0RuWE1yNUdLcnJpR1lLMGZEOXp6ck45VjVsMWlDMmRIOVV0Uk1JY3NkWDB3VE9tbVg3c2ZnOEJYTGYyaE9WUWU1Q1dTOHZ4bjRoNmJCVUFFRnJnM2ZhRFRML0hFUllOMVdlZjVtTlBGQ1VvdUJCNk1qN01WYldqNmdYOTlTdDRKMjA3RVpxSW9RMW5Qb2JsTDAyYkxqVURmRUtqYmxTNE1SWVdBVTVlZkhYTU1WdDFYejJQOVRNMjd4TUNyRTRZRmNNQUsvZmQ3K25tRTQraXI5VXp3WXVGTk9QWXI4Vk1ybUdWOWEvWVNsYXQrMVkvWm1Bc1pWOTcvVEJvcHExWDBiK014clhiVDNmSjk1Zzd0cmU1ekxzNU14ZmxGN201YlF5L25LQjVxaXVocjVockM4cGZwcU9pY3VuekFONGUwdUZhNjFBQmVnNmRPc0d6a0VjWEhpdUtFQ05aU252bUdoc2J1VnQ5N2xobXo2RHFMMU5jVEJjeXRGdUh2S29EMFdabkVieTNodWxtV3ZPRjdyVTlOdnRpZkdmRUZwdnZLY09aVjRCRHlwbWlaVlExTjlWVjBZUGVCbXZJYzdmeDk1a083c3IybUk4NVZUNi8zbEJ0YUhQSzcrMUU1aHNIenVJb2NxL2Y1Zzl0eTdyaytCQXE2cXZTQXcrWkx1emUrWmhkcWozMUNJRkxYcGlYZG5Hb1dseSt5eWV0ZTVFQmRLWmcvYVVWRnZyQTArdVNjQ3hPaFA3Mjk0TGIxNzdyKys4eDdsYWRUemhLbEZOVDkvU0s3VytvY1Awa0puZmlzSFIwNnl4NlVCUzBlUEl3VFdxeG52VVNpNEVlU2wvTWZwMmVncDNORks5ZjNGOW9MK3FVODR3c0lvUktmWSt1WU9EeE54MWhrS0hTQmJVT09rMjlSekxXdFhQb3hFV2c0WTk1WklVZFBsTWl2VEVQbjIrWUxBOG1IN2xOOGNYSEpVdDlhcGl5bXVSdmM2RnFBMkZWZGJPWVYzN1U2SDAxZjJRY3Njc0dURGMxQ3hMd1R1TmNNOVkwbG8yTUZJYlA2dGpyeWl0OUpReGRWbVB2NFY5SmJyb0QxbUFVTWFkTEthbW1iSnQ0d0VxcTRRT09KazQ2RnIvbVl3SzhacnJIWFZqWGNJeE9JYUhsZjdtQTlNeXdmOEJIVk44RGRvMDBYY2MvOUpaZHZVN1UvdVlDR3g2UlZUZUo4LzhBazVtTlJZczl5VWhObEdoNVB6NnpjU0d3ZlprKzVCWUhOOHhZeklwVENqZG5VNm5QY2UwMFNIQzMwRDRpbEhKeldtYmxiRjNIelJ0SDZTdCtOMW4ybFpNTzdCa3UweEp5SDMvVE9CWCs0MUc3YXI4MlBpTmVWRFlrY1RybXZ5Ulorc1U1eTMveUdaMjA2NGJQT3lHQ1dDRERPZ2owek5xc2hVcHlxYS9aQ1pySUF1dVkwUURPMkZvVWVQd29NMWVoVmZyZnpGYktFeVduNGhjWjIwdXhmZUE3NU5xL2NBSGd1L0ZjVjJpcGcvTWVJL1FMN3BmRUdacURjMUU2a3BsNG1PNXBpdlNXaGhQQmNSMTJxK0R1RzU2ejN3OWJxV2dYK0sySm4zYlBheUJpN0JYQmYrUWpWUzBkcnhMYkFXbmFZMnpSQktlbW11V3VaYk9xZnVmN0RZUjJVR0VQbWU5T2ZLNTZMazhwUWpxeitlOXcwQ2JCNVkvMmNIcXIweWZiNGh5ZzFtOVlyZWZLK0hEK0h6ajd3MS9Pc1hSQ0VEQ3JESHBhZkZSdDRPM3R6K25yMWlCYUx4RjZ2SDVtZGVBbWxUM2l0MjdmdUoyM3I2YjhPSjZ4RDJyMW1JQmd1NjZEUlBQV2g1cFg3bDJwU3QrY3lhVlE5Y2o3c2RSaExjZnhVdFdERis2L0VzckwwZXJ1RnN3cWkyWDNpeFhDN0s3VkNxME5qejNLMEs3U25UVjhsUWNUZ3NjdU5kZm1ZRTdacVBaL0RURkdnNXNSODl5dGc2WVpnMlhqWXA2ZC9XWVREa01QNjZ5b1dqVTZDWFl0NFhSN3dlemQ4UitrdHVyQ0U0SU16WUlxbklMaUl4eVdWaVZqVWIrS3FNekpmTWN4Yk5jUWtETnBmc2hRbklmVitpTlRhckw0aUxSZWoxT0lGRVdtNjlnUG1YbTk1TDZ3MGQxSFNkcXJMYkRJOU5UUTd6c2Y4MlVEcC9uM21ITlJVTmoxSHBPaTVBOFltUk9YME1uNVBXYXAxbVlWdjVZaHZma3l5NldpcGY4QUdMajloeE9RV0RQTm1CQmZsWitaZ3F4VGozbThhdUhoa01QVmppb2UvRS9xNHo5SVp6Rk55K3hLNk8xblR3STNJWURnNlNpRFF4eXgyamJQa01SbDdYWWNhL0VjdFVEWFZwK1pjc3l6cTJqS1NVcVJXZ2tqc0NsS3V4dUF2RkdUb3o2cFJWWW9uWmlUUmx1dW5hYWZOM0xJUDRqcGxnamZZQjhYS2hYRlhMNFplbnZBRjFLOHorN1RoRmRTM3pMQk5uS0VSMDNNRnM5ZjhSMkQ3SVZZVnlkR0VVNlJwSWZSOFIraDc3d0pjMm15TE5UZDVRb1QwanZCRnd6anVhKzZPMmFsWWpkN3ltWjNmM3BGVTlIc0svY0FFdG4vQUlqYnJBVTlLY3ptd3JSS01pL2llVXJoMmVaNlZtQUhYK1ppS3ZyQTVHWWQ2ZjhBWmxUaGI5WXIrK1lXUzdtekZYcHJtSmdueUVvcllWSEhsK0lhVTBsd2Vlbyt2bjVzaEhFcy9Yd3NWSnBSN29sM3p4SExDSGF5ZkNTeUYyUFA0QkVyd3E4VFVyV1N0OWNoVDZicUlpamhQb05MR0ZmYTBRRHVJOXdmWllmSWZFTDBIZGM2aUFhbzNRMUxyZHZrVStFTm13R0hhLzJpNnAwMGE2ZnRHU1VXOHZPSmxNR3pyby9lYi81Umo4enpFb08wM2ZaRnBCdmVuVjZNQXc4RmR4ZzltUFE4L3UyWjh4RzhBY1JIQmIrWCs0cTMxakhnT3JqRlBNazdHdmN6YTN3ZEg3aU9uR0hvemJ4cGVad3VJZUJGVTZvc3hNS3ozektLM0tpNmo4K05XaW9oNWdZQUJuWWZPLzNMNWpCZjh3YldNMzlwWlViSHE2eW9WN3EyVXJEYmJDeW5VQUpoSDVtaWk2R3hSQUY0eWZQN0VPVHAvZjZpcW5rZmFhazFHRm1WZm80cTQ5SEdaZDNiTlM2VG40UndtVGJkT1Q1WmcxT2JwMHhtMUJld3VYUXR2OGZaZzRIWm5kM0E1aE9QQXMwZVNKTTBxK1c5Y1hudDlEZ2Qzd09vTEI1WCsvYWRWUTNKUTQ5c3NPNlhsNW9UTjFuckx6LzJJYURFcFRra2x3S0RiT2RWZm1HK1dxdks2bDcwQzY3b2Y3R1NaSjZXZ2ZpSE5ESVo4aU9QVnFGd2w2K29EL2Rwa2JGcGxienVYdDJnQ3ZiVi93QjJsTUdQN1I3Wko1cnNsaFhwQiszK1RJSXpWU2htdWF4OTVSUWhZa0hXUGlQS1BlN1FwQWlhNEgrUGw1N2RFaWNQSGlTejYvRW5SSEI0YTQzbEZSZ0ZMYmxjVC8vYUFBd0RBUUFDQUFNQUFBQVFLb21FeUV0RlpIVDM1anJVMjFEUzJhS0NFb2swSVVkd2NRb2sxWXRrYXhzMjVsYStRcDhtV0RwaENzVGtWMk44MEFjVW9wajVnazBjOFVZODRkMXY5V2VLUG1xTmd0Y2QvUHZmNzZsVjhjZ0lrNGJUUjlvNDBJMVlRUXA0VnFHaUxSWGg2WHFuRmNCWUhJZ0RCQWlvNFkwRm4zRVFJMHMweGZpMXhIT2xDQWtjcGhqU05UY3Fsc2xCQ2JnSWdFa1lzN1BuUUkwa1YzM0ZObE5XaW9FSXV2bkQ2SDBEZTNPM0h2c3RrSU9jWVVEdkE4ME1BMHd5d0ltdUFaYzI0N1hIWndiQlpBbVJ6aSs4c1lJUVlZSVB2NGtRYXR2S1BVNmJ4MlI3UWxQNTBNNTFEMDlzU0RRb1I4UU1HVm16bkdNWWpHeStNY2N2OTZBRWpWTXFYYlk5eUxVUDJFekRBMGVVSXV6TEw3SWNJYzdDZ1U5TnROWDdoS2VzNlcveG9DOTRQQVJFQUE2a2tXMFpYS01raVVPb1p1aFFFb0xDY2NNT1djZnNWYjRHampGckRiK0NxK3I3VHplSVpYd3M3TlNNTWdVWWFacUJ2WXh4aXU0Q0lROHdXQ0NENytxamgvaE9VbmRaY0R4SkRCekx1M3djelRWYkFvbjlzU2phSzQ2d2NsN3A3SytOV2VFdENHc05YcTlmQXROR1hvMHB5R1FNWDRvL3ZXVzlvWFhEN2p1ckdvMWp4NU5RbnpMR0pBZk5KTHZ3SmtucWF5MmZFOGVZcTBQekFjRDdTRnI1TEtvK3hzUkwvRzFRZlBFWHVnQUF6OUNVb002clNMZ0tjMWNwcUg0MS9Fakk5dURjeGpGOUFYUDBBRTRuaFE5UHYrTkpoUDhBdjQyM2cyRjQrRTdMNFpFWmQwT0JKck50bFNMdFpldVAwQWxhd2lYYVZLWURrYXBlb0FaN3VydGd5WHkwM1JqWWd3a0NLOHZkdkZJeTVkTmt1aHY3N3o0MzFQZ2RaRURJNFlKTGV0LzVpUWR4dnczbTc2Ym9iQ3dBSU0rSDlvdG56WmFkMEFlZ3FRaVVGYjkyRXZhUmpNSDE0dXJpQUxNVFAxLzN6VFBYYStwVm55Rk9lY3JhOVAxV2V1TlM3T1k1L3YwRWkrN2Mwa25tMFlwUlJML3g5aFV3RzVHakFMVHBFQU5WWG44ZzhnMURjUWxmN3FFTzZUQzdyVHFadHNXc2JVdFoxRWpTT1drUWxpbEsxc01POXA2TXlpcnRoQ3FpQkNWUDdXQVQ3dXZBZ25oM21HakFtMHhLZUJtSEl5TkhMejhwUkZWbnE1NVNBMEVsYXFNdjNSRDdpTnhPMCsvbmNVKzhYZklJQkdEUmVKbXloT2lDbTh0WUQvdWJBUWcyWjlBdHBTNmpMNUxybHpQUk5FZGJETk5sd2dFV0hiNEhHM2JvNG1SUW9KNFhGRm52WHRqemdqelhjVS9CYVZLbVRHZFZEZ0VPNFFrdU95MDVmME9Nczg3QjhNd1hyOUp6c0hLYWZiejlFNmU0QzhtSS93QzU1M1B5em91eVQ0TXdPNDk1ZzNHVnFnZnpYMlN5Nkw4TkFUbjh3cWFlNHp2MklJK0pkR3NucE1QbW5yRTdUaUxjVnh6djBLcTFNbldwbEt0dWNMNmo4NzRyazNhdGtSWTgraHVZdENHTHBhR2hPVmt1ZTR3WFh5dk84d0xEa0pnazBnazdadllUUjhzanduSHI5TW9NU0g0bFp3NFh1TmhkQ0ViUzg3a3JHdVJkSldVRUxFVHJCQXZVOTlkQ2o5a1RmS3N5bXA1Rk9uTU55S1BQUGtlVkcxcmU1YUdoMjdTeXdZelUzUFFwNjAzNWltMWllbzNhRVhXNTRGRDlKNjVDa3pQUTcwYjY1dS9mSkZFQlRMcGNPaUkxQlUrNEFFdm5yOHVsQmJ4RVdMRlVOQmJDNDV2czNLTGtZNmNmdFB1ZnFLanhrRmtlamV2NWZ3NytYUFoxY3ZuOTVtcEJtT3hQUjVkclJNYUFBQXNzem1OelRaT25Iai9qVGpVa2ZBWENPR1hhazErVHR2VFYxSHhTNFFkUThSN25XdThDRjFtald2QXR5QUZ0M3RyL3hBQWlFUUVCQVFBREFRQUNBd0VCQVFBQUFBQUJBQkVRSVRGQklGRXdRR0Z4Z2FILzJnQUlBUU1CQVQ4UTIzOHNzc25qcUNGS3dNN3NEcVZzalovQm44WTJXV1dYZjU1SDd6NUJJTExKTmhJYjljaVBmOXJlQTJCWENJZDM2UkJCWkp4cEJGRldQNWJiL0cvd212UkdkbDJJZGd5TEM5dlZra0tSSEdkWThiWi9XOEw2SmJCc0Vra1I0TW1Ka3h4U0RqenY5UVdxNkM5ZUlJQktFNnRsaUUwZmJUc2xFNzduOWNkV1JhdDJ3T0NuOEVseTNkTE9VSFZtTm5SZFovUTY1ZUF0SElKTEFsYmJ3Y3ZCdFpUcGdRNmI3SDh6K2ZxeU80STl5OEpOdjRQRHdFeHc1cHZFcGp6djlFYXg2eWVpN3g4bnY4dGw0TTMzaDR5VDhRNS9RMGozdzl5bC9KNUxNSGZEckxiUFZqWW44QnpsbG5JY2RHd2RUNnYydTY5am5MTE9wSVN0bGh2Y09GMDlRbUhxWFhmejNqYjUrR2NFUDI2ejVMdkwwWk5nTExQd083Vi9yZ2F5OGxqTDRTNnRkcGVkdHR0NUlQeEV4WjNaUnBZRjBuZnNlcnYxZWJaQWtuMmJySkU0M2UxQ2tPNWk3UFVSZGttRDl6K0djN0d3ekFCMmRlWGRCUzVkRjdIT29uaHdJWVdIa2RwRThUWThJRm1TL2pBKzl6bDFZTXNiN0JyWjdDM3VWdHEzeUM2LzJQQXRkRjhpOWkrc0E2SGVCd2hybVhXemJzUDNQeGZicUlyMUtlV1dJZXZKN1pMM1B1L2FMTzdYV3dmSTluQkF5eWJzVTlvV1p3Tkxkc2hzQU1SVFBjTWV5akdCakNaTUozWWt5eExyckIzTGdRd0RBVGw1d083Q0dHQ1JIdmp6bmNDZmkyTElYMXNZN0xjZ2pSQkhTZGUyc3ZVWncxMkR2cVVld052dGRrTVo1LzNIblVsdlVOdkJteGRHSHE3SVpkcFN0N3NHbVM5aDJ5RVhYR2Y5dXBpK1RkZVYzcDhsdXhiSjRHVU1JNk9GVEg3aDZ0VzlkY2ZndW5zbmQ4bTI3ZzFrYjFGc3ZYYzlObERPeWVBd2k2dnB1eVBTMEo2dHlBODd2N3RnVURkWk9wZlpNTUY1d0RyYk03Sk0zWUgyVWtQa09lMmlYaHhtbHZ5eXlDSmVzaHhJN0RFZ2plRnBpWi9SZENQSlk4dDlyVkVPN1ptSVRYMk5IN1NyM0Ywc042dFRwaFBJMDZKK2pJazV1aGpZSmgyUWFSMWZ2WjFza0VkV2xwSkxKZnNheFl6dUxWYkdpSEhBbVhmZkpaZFNEeWU5dFF0TUw1c2tueko3M0RIdDlqbmM3M3dFMkV2MXAra2c5cksvUEZqRXhoaG5Gd1dDeG10RzZ0TDFOaVQyVExMb0ljRXdscllSWndHYmRmR3h5MnhXUHJBUHM2WmdtejUxSzdKTEhRK2s4MzBseHJZd2J4ZFBOczZ2UVI3WnBlUm9obHFMUWtNUjNmZGh3Mnl3N09PclNHTTh2WmVsNnRoRnI3Q1dIeHRGb2laZ1NqcGRPNDlNM3IvdDdrZnF6R1NtZU0vK3dEbm0vZE1mVXU3b3RIaG84NEFyMTRJOTRObkVnWjdFVzNSYWpmUlBrOUx1WklJNDIzQ3N0aXRmTEpzRjB3OGZMc0JGbCtuY3BaK2svcU9zZTQ2TFc3ZXRrWk42SkE4bGVNTDJraWhwUHRrMEpZaXhSM0kvVjkzZnF5Ny9BSUJpQ0xTYXg0UGxubzh1aHZYVXRiN3NPNFIyaGhCM3hkRGw4WlBxVGtIa0xOa3V3Ry8waE9BQkQzWU8zdU9md0Izd1drWS85bjZMb1JicnJIcExsNjJiWjNmSXU1YWVwQjZXOENubDEreVB2T005cEEwKzJnWkgzWm4rV1Z0cDdiT0hHZm1jSFMyUHBhTUUyRStXNjh1eVR2cXkzZjhBYmVCNGNuN2t6Zk9Ta0p0Vm11TjV3c0lQM0FpWmZrczlzNURnNS80dHZDY3hzL2tLZFJxSFdFRW04TERaMTNGN25DK1ROM2IxdHorR3ppOWIyRXdQMGp5U1lJRWo1SmJXOFlmZ1AyTk5Zc3B2ZC9pUE9BL0RxbGh0cFJERkE2V3lmL0xkRDVEVUwyWEdmdURCQ0g3TXhzQ2RvR042M2lYYk9vaWN2Y2VjNUplcGN5eTZoYllMMUNlN09wOHRuT0J1cGhqdVI2azRDQVhkam9saGI0V2w3a01uZVlsMWhiM2JIRDVQY1R2azlsWU8yQ1BKOVhhTXNObnFlRjZXVFBMYllMcUYxZHNRNmhxc1lkbG5VZnVVOVBHOWNMMUVPOHNzaDNzaEpZamV4NjRMcmU5NFpZNXdGdHM5SWRuSHQ0amZPRzk1ZnRFSnUwOEp3R3crejBTenRzckRKNFBiM3d5RWUzNk1Sdk9BWDdXTDNaNjk4blVoN0lMZG5qQnlTRjF2OW9QRVBlMnJPcnhMdXo4SXlmeXgyOXljQ2Zib1RqZjR2OHZSZVI2Mis3ZHJVK3NtZDdPTldPL2x0dHJiZG02VDViNHdDZlQvQUM3RzhEbzdudGo5L2dOOWp6TGVPbVdkWHlNMnpBNEdXZGNYYUhzLzNQVGJQNEJ1aEoxc2VYZUxrZWpKZFovcUorcDhsajJmTDFIczQ0WnZYQjRBa2UzU1NXTjJHenVTeGlUK2x2YzJ4eDg1RnZWNHlWaXlVU2JXK3o1azhFdlVSRjJ2SGtkNE8wTjRrV2ROdW5jdGRzNnZkbnlHTjcxeDlqakxxU0JlTmhNSmhqcGRMQmpxVUo5NFBaOWpnbHRtZkw5eVh2THV1M2Q0ZzJNYmFyc1I3UDFldUg5L2g2anVwNjdnQnNFczd1c2M5c0plNGZZY0Y2amc5NVhqeXpWM2REajBUeFRyVjhqM2w4RjVid2RkUndsc1B4aUxJZjV5WEhKbnlZbjNsNmw0LzhRQUloRUJBUUVBQXdFQUFnTUJBUUVBQUFBQUFRQVJFQ0V4UVNCUk1FQmhjY0hSLzlvQUNBRUNBUUUvRU1zL0RlZC9NYTJwTXRMZU4vcHJidzIzaC9MYnN4SGs5Y2ZqQU5rekhrTTloSCtscndYZjhHejkyQzlTL3E2TG80RVNzMmU0dmtOUURUKzIyM1VBRXlaRHE5U051NkVmVUNmWlI5a3ZxSWFmMmVvYXlJWndzbU9HWVlzNEozd0piTXRoeHAvUG5PZmszZHNQVVUzOGx5c25qdTd0U3g5bklLVDNxMFkvMTF0MWdHeENWYmJlSDhNNEFsdSt6MmgzZjYvcFJrazJjTjNpenZnWDhIak9DT1AwdzB5ZFl5eHorYmVmbjRQQW03Wk5uOE8rTy93R0xMb3gremRNZWZ5NXhuSGY0b2N0R1d2QmJ3L2hrUmJ3T3lYVFBmNWp6bG5Mekk0V1g0MmVUa2w2NWZZbDgvbDIzaGJaYjVHSWh0UFUra0hEdy9oa1JCUEQ5N0pKWVExL0ZuOEdkeXdtOU1lcnZoSUprSHN5MjJ4QXNlM0ZpY0JwYjdJTzdDQndkMldXV2ZodjROMGxCTk1vTXM3aHQ4SUJGc0hoRy9TVGR4ZlpBSGdoaExiNFN0cjdHTWVYUzlDSG8yeWVGNnc1MjNuTjF4TEtHM1gyeU9yWWJzMElHT28wdmtkWGh0bTE5dFRvdW55eDhuVDNuVXpFdUUvV3d2OEFZWTZTMmZSdWpZVWtzSTY5bjZzV0lERGJsb09NNzZ0WFhBUFhVQTkya2t2OHBZZWhhWFY1Zlo3Ym5jWkdlcVdZcU04dkhzTDBSTmp5RW5kK3lKYkp6Tm4zUzlHUXZGNW9lbzY3YnRnbXVOdHZYQVhzWk02ZzdzZllkeFRwR2RTNzNNYzJ4b2UzZG9XSzc5a09Sb0M2TWxjdldGYXRzTXR2bklXMnNMTGp4ZHJNaUpqRVBJQTNmWmh3SWNsSjFaUmt4akRia0prVHRPR3F3ZmJWUGk2OVhjdURJNmh3Qjl0aGlQeENUcUVrbGxsa0ZuVjVzRjlrUTNsc3dqUk5sOHp6U0Y4Umw3aU1OR1phTUZwSGI1TzU3RWlNZGZZUHNQcUNOMDdnTjNpSHFIWXhaWVd3eWRjVzhSMnVvQ0JLOWx4aGg5UGswVnFNN0Jua0JjNFFEdThOT3JmcEpDWStrWWpDcENFTWNZbDI0TGpsdU1NVFpoTERhWklaT3RqcEVIT3BBNXpCTzBZK1NiQmhZenExYWpScDdiT1dON3Vwcm9YeVlsME1uWVVpYUJFdWxpYlBtMkNkWE81OTJ3TXRPRnNkenBhZG95NUwxTFNzMlJMaUJXTnNPdGhEMjNaNm5nYmRMQTNKck5jTEl5VjRudDZzN2pGc0UxYmUxRU1sZkNYMDIwY1Q2dldNTXNBT0NQZmNoaGhuQmFzZGQzRUcxcUcwd3k3ZHgzaEZDRzYrWGVBZGd3TENuNklSYlAxR2wyRXlOazZ5bnlRTTcxZFE2OThCa1FTS2VRaThoNHhpYVRiTjh5elhMYmRrcjM4Z3lXUTdMMnR5TFprNjRkbHI3RklWQndkTEtkakxvajNaN1ZyaDVGbzh1dkY5SlBUOWtKQVIvd0JnNkhLNWVxak1XZjhBQ0ZCZG5VVU1ZYnE0MkdycWh0L0JuamlRb2hNK1NIVGFPdkpyR3k5TG95N09Ud0NVbjdzZGVEdEplU0VGOXRFbit4TkxzY1RSbVpITFFBRjVkTVllTTN0YmRmbmxsamlsT2dtVi9PRU82Um1Xazk3THZBdXBhYmIxbDZnN1FQV0I4dTRZS1lXdkdCR0NTSjE4aGlhY3g2bUFqSHY4WUdMR3UzZGpjSTA2UzRPNkhGb1M5UzNqOXBEWjN4OGtKM2JwMmc4Y0lzbHRUN01rSnZIZ2h4RFplV0hhUDRudHNaT2kwZWlGaTdLdzNuUGNYWHFUdU9IY3VFdGQ0OVovVVBJbU85eHlCSmprOFVzVHlKbC9xQTIvd1lTL3V6bmtUVm9JM2pxNVlXTVp3bmhQYTlpMGRzejhFNnNqSVFOL1ZsUE83RnNIU2VxZVhzWVI5c0ZyN0Jmd2JabGdCMm1kc0EyVzRMNXN0MVhSWVlVWUovSmNpVHlFdTc3TEViWUZpWW8xc251Q3RaVEI5aGlKVGNJVWozR0xjRVFqd0w5SGt4MFpJNi9BanRMSS91NEZIcmRjTDFia1lNdEpudUo1eDJlN1U1dzI0RC8yV3ozOHU3ZHEyVU8zWk9yQXRkbUMra0w1d1BaWTZsMWp5SFkzVzZDeTh0N24zZ1BkWHVlMlQ3Mlc0RWNBbVBROGpQR1JONEIzZUo2WjdkdlVza2p2QzY3RW15YmFPb2RJZDNtOGM5akpTQ3hteDEyMmpiSmZiOTdEMjR2K1N2OEF2R2loamJMYkFyYUR2ZzhJV2s5UXZOTUo3RjR1a1B0MTRCTEc4WGZieERiUHYvVytMVzRuRElpck9IRDdTbjdacCsrNzd6MzUxTmVUK2kzK3BoOG53Rit0TDkyK2xoTGFabjlTWVNxSUFYdXNlMXQ3V3M3dkUzaTlaRE9wTHVNSUlKbFdJZEpuckw5U283NHQ1TDFrSjl2VGp4WmhsODRZYkRya09EWjdCcmVzUmtlbDh1ckpEcTg4ZUlieEhYYk9FMjIxajJaN0g5eDVQYXZGZFpldUZQakh1MjljYStTMDNoT1h5MzNMSEdHc2ZhOFJmWU5GaS9aSmRuWjk4UGtlOGVJbWNaSENQZHQ5dHIxSS9KeUlMZFk2WWR3cVhZZ2tOK3poQW40SER5TFF6eC83SFFiekkzRzcvd0JNRHlFenVQcUdCd3dkemVJNmU3cXlQYXdTZzhreGNSKzRJUk1nR1AxTEo5SVh0b1gvQUJJN3M1YnQzSXk3Qit5ci93QnR6cHNtN0l1ZCtyNGNuZ3o3d0lqMHQ5dmsvdVBTazRmRU9wbnE3dU43U0F4aVkzd2pJSmpKSFhKUEk4QkQ0c3U1L3dEcXh3bTdrSHNXdnNIT3VyekxyaDhqemtkUmJIZy9GNFNHWGJVKzRQdG1zZ3hCOW41UHcyYmp3YlkwOXNtOERIYWE1czlXWFA4QVVjTW1NdTdlRmtZSTl5WGg4aDZuOEhpTVp5Ly94QUFvRUFFQUFnSUJBd01GQVFFQkFRQUFBQUFCQUJFaE1VRlJZWEdCa2FFUXNjSFI4T0h4SURELzJnQUlBUUVBQVQ4UXZ2QmhxREd2b0psQ0E2eW9FQ1ZDMEIwaEZVd0xnUUpVQ0dXWUVhRExLdVVHajFpekZnOFc3Z08wY0JZV2dOaDBUUHpHOEM1alo5cGNwcnBlZmFWSmtOTlVvN3ljZFlGU0txYnVyaW1uMFA0Zjd6RVZmdkVzN3c2Mjg5UDdNSFlVZVlGSWRvWTh3NzJTcFVxVjlhaVNwVXFWOVdWS2xSUHBVcUpLbFJKWDBTVkUrcU1UNk1HLzlnVHNRaENvVkNCQWxRSnFWWkFoQWZRRGNDVjlHZnBlNVZ1YnVhTUVRdEY1YjZ4MDRCbEZmTEhvRVlLTGQ4WXZQemNBVHdpdDVyWHE1bFlHNDh0cnZOK3NFN3Nva3J6aXY5WEZBVjNnV2VCejk5NmlhMFZvMks1UEo1akZEWlVVdWI4ZGVTRk9BMVk3Ny8yNFdWZ3h0Y3VrczNuejhRQnRCekYzTlp6T1BCKzhxYStsU3BYMG9sU3BVcVZLbGZSVXFWS2lST24wcVZLK2lTdm9uMGZvL1haQldiK2huTUlEeEEzcUhWZ3dZWmdRSUVJSEgxRlZLK2hneks2K3BMUGpudkE2WUNONnd0Vi9yais0aGQzUGpkS3Zhcis4ZDNRc3FMOTdaOHJLRllHaW04S1VQS3ZhVllwUmxvenRxL0x1ZFFNTS9PZ3FvaW9sVURwbG11a29DMEhhOTBwQll0T2x2VG5OanNaVlNYUVNydnBwNmtDeXQyZ0dlSDMzNnhRWUJDMXZsdnIrMzNnb1pmbDBiQjZ2aVVkSm9BdDhkZXZlWGMyTGVDZTBWYUVkaXJsZUcrWW9OaU03Ri8zV0R1VFRmUG1JQlVxcHVWS2xTcFVxVktsU3BVcVZLbFNwVVNKS2ZwVVQ2SkVtb3hJbjBxSktnTURBZ1FJQktnTHhBNkgwa0JBZm9ZaENFOHdsZElEek44NGowSWJYdjkzN3NCVXlkQjkvKytJcllNcTZ2cC9lWnBGTUdSWFJvSTBBZ3BWUzl1M3gvd0JnYmE2STE4NEpiNUZiajJsd1k0Rk5yM21EdEFxUUdNTE9yZWQ3SllJelFvdHV0elpaZTlJRXJ2Q0I2dUhvOVlESk10YUhvL1psNHdvUVZGYjMvUHpMZW5ZMGlsMzZ3M0p5bXlLYmZhTkZRYktXT3RjTHV0OTQ2VGF3dFpkRGw5NVpHVGRHemI1SzUzbUtPVnBzeCtuMmpUUmFaUnVDNGU2MnB4ajZWQXhLK2xTdnBVcVZLbFN2cFVxVkVpVkUraVJQcFVTYWlTb24wU0pDY0lEQW5lR1daU21BelQ2QkF1VkFoNGhjSlJBaE5HWS9HTnBvR2VYK1ZodkdxV3Fyd1hnK1hsNGlzTURMZFZ0cjIrSUJYUXp5SFhPZlZ1K0RtSk56dHNxYzVFOFMrT1hKZEw1K1pXUEhiYStyektkZUFzMkQ1aVdjeW9YclYxMCtZZXFYYU9YUFVPVXZNUnRwSTk2VS9ubTNtQ293U3h5ZGlFZEsxVVVCdlBaL01USUdVanllbkx6MVlkekE0UXEzVnZHL1VocFJ3QTZ0UG44d0IzZzRBb1ZwM3phUnZXd3J3THk2SnozaXBLemNMejBVcjU3UWU2bDBLMlhlZXlRNEEyaGVpNkwvQUs1bUtDc2o3Y0h4bUl5aHNtei9BSjRocHdIZWQzQkJaVXJOU3BVcjZWOWFsU3BYMHFKOUUrbFJKWDBxSk9mb2taVVNKSytoTndNdytoQmc1aGtnU3ZvU3NUdWdTdWtER1lZeDlNNnFXSEpyWVhmOTV6OHhnRlh0cHUxK1ZqbXRPZ1dWOGZlSGhBcHRzWnZ5dnJFUWlmVjU3d1hXeXRaYm1ST3lNaXlQRkw1Z3psb3VEQ20zWmhJZ3NFT1M3eC9jeCs1MngwdVd1OTU3eHd1eGxZNDkvd0RZTzdaeTl0dnVhbDNDV1l2Tzd4TG1zS3JkaG5QZjd3a0FhVWZONjlmNjVlMEFLYTJ6M3g2c3JBRDFHVlQwZDh4OFlWYXFyWDFQSFdVeXAyVTBXS3ZidUl5bURkZ1lSOGJuS2poY2hyektkVTFVMlBrTjMxQjd3cXlyYUJtNEU1ZWJ5WGkrWVNXMFdCOEFuTndxeGJxbGZmckRSSUd6ci9kWWdXNyt0U3BVcVY5YWxTcFgwU01yNk1TVjlLbFJJeFBva1NWR1lUaUJjcUJBN1FMbUc0RUlRZ1FJU29FcUJPdlhtS3ROakxlWHQ0K2Z2QlRRRXRldkZ2ZVB3WU92WEh2Ni91TUtWWVFIVFQ5OWV1NWxHbXlubUthMm8vM3JFVFpMd09vTkNyaWxvMmZucjFsdUpTWEw2RDZqbStiaEJCVG8rLzNpQ3UyUXc5dlA1aHR1bUJOODlmNjVnU0RrT2FmN2NGMTNaeXE4ZWZ6Rm9ycWFVdmZ4OGp6ek1paVZXc0QxT1YxSGVlc09vamF0bmZZNmEzWnZOd0hIb0RlbldiL2JLTllMSzRGNTFPd0szT2QvMlppS2xYSnErSGZ1eXl0MlVvb3RsMVhyY01hcklYMURjcnBhNXlIWjdRMHN0NUR5YTRKaW5JUG9iNGZPNEVMRUd6Tk9QNy9aU3BaNXgxL3FoLzVxSktmcFVxVktsU3BVcUpFK2lSSW4wcUpHSjlFaVJJUTFDRU5RaEF1VkFsUVBvSEVDQkNFdzF2aUVpdnhMcUM3NTQvMzh4V1RjbXJhdlBQeXNESWdveWJkdlYzWEVzRGJydm1XOXJlMFJ6WHU3bEhHeGVJTlVEWjBPR0J1OVBDdngvTVk1T3JUZzVQU0pERGFTbnN3QXczdW45bjc3dWFBcTh0ZDlXdmo3ekV0azV2NVg1Z20xQXRmQVh6NjVqT1pGTWJjc2R1cEJEWEdic2IvTlF4WEk4Rjk0MDBITEd3eHY4OHdUZ0FwYWU5dmVDMi95cGZ4ek11SXdDQmpQazgzTUFxVWFtOVZ6ZlVZWWNUWW5CNS9QV1V4WDVveThuOHpVSGd1eW40ZTN6TTRTTkwvWlBtQ3NRbVVlZTdyNTNDTUU0TDQ1cDd6VzhmOEFxcFZ4UHJYMFNNU0o5RStpUktsZlJJa1luMFNKQ0UzQ2NRdUV6Y1BvUUp0SUgxSmljcVc4ZUlKbFNaTktaOW5IZlBlTkFCa00zby8yQXBRNktXZ2I3T2psampkMDljZG9sNzV5d0N4VjNLbzQ5b1VTL0VBc1kxMGhTcDZIVHJIcUNqc1grekhRVFpyaFVCSEZkdlA5MWpDckZDMzk4MUZ5UU1aVyt0UFByS0FqR2hESGU3SHJCcGtCc3NKN1h1VnlwendLSHQvMktGV01KMC95SklDRHByejQrN0hHeHk0Y0pkZWRROUxpN0xGbmprOTR1V084NFY1WFpNTWJsK0l5ZWllc09pSVlRcFhMZFpIcjZ3V3JUUmc2Zm1GclJOSjkzOHg1OW96ZWJpTHRLdEhQL1hlTnJrR0hsN3d3V2ljOC93Q3dLMTZrMmY4QXVwWDFxSksrbFNvbjBTSkUrak9ZeFBva0RXUG9FcWlCQXhEZjBJRUNFRUQ2aGlMRkczckM0Z0RhcWYzY0RReTZFRXNrRjV0NUQxb2I3Y3dTd1hEMHFhRHYvYzNGdThLNHgxZ01xeG0xODNyK3VBVEJWeU1VaGEzVnNKNFc4RFkvMXhrQTlhelZhWU5VQlhsdXlGZUNQVGwvZTh1d3RjSEpZNHgrSVJCQXNXRi9uRE1xVldUQmQ5Zit4RnRuejFZYWNXN0dZVXdCVDBqYkc5NWU4RkJFd24xOW9ZaGEybU0rSWs4MDJCUFRubWFuMWhvQW5Uci9BRnlyblpSV1BrZStZQVRiREdXOFlUcU8rMHBDcXZDdkdlSDd5cnFGNjNYN2x3Z0x6VjEvTUtsWVpRMm43UG1aQTIyeS93Q3dyRm9tRU0vL0FBcVY5YWxTb3hJeEk1aVJJa3FKR1ZFK2htVkFxRmN3aEFnUWdJVGlCOUFnZlJadTlIdEhaTGFDdTEvbjl3enFhbHFRODN3L01OdGxEVkdWQnhkSHhGRkJYcEJkZTBvUXByaTh4R2l6VFdJYWh6Ymxqby9JL2lKWkZYZGNROUZnOUF0WURJUGRpQzFUZzJZUjdMdzVhN3hPSzN3bW8vQ3A1V0tEc3JjVXFsN0Y3blNHYzlYN2hEQWdJQXpCdVlpTEhqdEd0SGlzYWUvWmlOa3d4ZkhPNG1nQW94YjgvbU90UjJyL0FMQWF1K1krV2UvUGlOekJHay9mNTk0Z0t0cHBLYXZPT293MzNYV3N2VHovQUhlSVRrNmVyWDNyMVk4V3Q1SFk3UHpLYjFvemFkVi9aM0RHUXI2VjlGU3YvRlNwVXFWS2xmUkpVcjZWaUpVZm9uMFQ2RVBvZG9RaEREQmwzaUdvVG1FUG9uSUpaWW1OaStOLzNhRG5pWUthWGR2UTY5Y0hNdVhNc3UxME8xeHJVdWhSMklWQXlSY3puUzYvVXFnZ0RnY01NbHN6emlEUmFPcVplMGxQRUFGbnZLU3NYei9zQXRCcnh1VWdYZU1kSU9MTEw2UThZeFhTNFkxS055aEtYbWY2VkFISEhlVVBaT01QSkptcTdIaksvd0RQbUJZQytJa3JsYWFxci92N2NhMUN4aEtaNDUrWVZHMmFvcjNiMHlIT2VqS21WR2tZOTY2ZjhoRVdEdzJJNmU1MzNjTkJDL3FXZUg4UzZCWWt0Ri9lYjk0K3pFcTFpT2ZQNDhTeExxcmV6bWQ0ZlYrbWZwY3VQMDRsVG42djBkZlIxRStxZlJoREVJZlErZ1FoQ0JtRXI2c1ZySzBvNjFDTjZEdzd2TmZiNWxPMkRpWDU3UlVTdHNyTjJaOXMxM2pFc0dBNmZnSWpOdHR1YlZsSHBhM0N3bFBMVUFDSzF0Sm9XejFZSUJsOUp5bkY2T1lkc1lPa294WEc0SEJ2ZHd3cVlDQ0d1TXdMM0RHSVZVUWRvSGFjVGJFWGdQTVJWWGorOVpWVWc5TGxDQnNwdC92M0tFYkY0czZzUFVjbmZQZUt3RXVjUnVod2JQUzNXSlVxNFd0bnIxdm5uNW5iSUd6L0FGS1FXd1pPcGxnMWdhVFhweGZTSGx3Qkwvc3dTUDhBMG4vcFBwWDBUNkpHSkdKRStqR09vSUdZRUNCQWdRS2dRR0VPWWZXd2wrdStNN2VJdUx0RG5Hcy82OWc2eFdWVmI1M2c3WmFycjRtTVZoRGVyMGV4OHhOM1VxYXRGK3pOWXdoNjFqNWppbG85Q1J3UWl1SGkrOHdaMzhRcUJSbmMyb1h4NWxiYVpnNW8vYzIxNGdNT1BXWVplc0d0NWhWRnpQRG1IUm0xUWxuKzNLajk0VTJTcmZFTVFXZEpTZG5YckNWRkJBbGlkZjNENUhhbnZDSks4aTVWcmgyNjhpUUVpdDU1N3k2UnhCcGNHVVFMTnJMeFk1UHo3d3FPdEZybEhuKzZRZUgvQU52L0FJU1Y5R1ZFakg2TVlrZm94bkVCZ1FnSUVJUWZRSUlTcDVsUmhzWFJUay9iSHBNMk9ueW1hOFB2S3hiRVc4WmI5cmUwNHpoNDFlSzgvbU1WYkxIUkVObjcrMWdXTktla0ZDa0R2dWF3TDgvMjVzMWo3eHFEanIwbG9CLzJER1lBdXN3NVFMTndkSWRPSjJRZE1OdW9iN21vcmMzQnh4TUIxNncwREJ6RDJYY2NoREpFT1RNSktHYnVHRzh4T0puanZVejd5NU8zT1loSWRmVnV6dHo0ZHl0NE1FZXY5ZjhBTXhGUFRIUXZQZ1B2NW1WZ3VmbzVQV1ZmWlpmOTMrbFNuLzQxRS84QUNSUG94akdNWXc5NGVrTVFsd3pDRUlFSWFoQ2N3b1JIa2pvZCsvQmE5WTRXQzZ3L0JSMWZpTVBsc1pLWnZvVnJyak1zQlExZUJSSGdBZG9FS1ZiN0JXSUgwY1oyMi9hVnVhR21OYVpwREQwYm1NVnJwS0MrUDNOWVlJQzhmOWwrZldGSldOUUlNWmdkNFVFR3V2ZkUyZEdvSTkzUGFYZnY5QThOVFRjNnZlRHptUEhlWHpGaXVrYkxMYnhDVFJQRk9UK3oyWU1xSHFkMXc5emg3cDBZNC9ZTEYvYnZDOFRLdXdOZzZwdXVaYWE5V0VDNDMzcm04eXNxV0NXUWMxNUpzN2xmU3Y4QXpVckU1K3RSK3FSakVpUmlmUmhtRUxoOUFoaGhENkVQcDVqOGdzQytWd0hkK1ZsdGNiQjRQNTFmaVdoQlJsMEVUdm5GeDEzdmVtdEY4WVVCTGJ0NjhQQmZ2SERCZUJXcnorcGFoc04xMllyZlpSVmRxOTVRV2pKVUlCZStOL3pHcGZIclBSZUlFYVkrWVBFQ0Y1WjNYQ3pwN3c2c0Eybkh0QjZRZVM1dnRDNXNUYnA2ekRHb3ZQN25SZnZEcDMvMlpzZDNLdkVTSFc2Njg0bHhCRUtMcFJUOEU1dVp3cjRUUUx5WjJUdkxFb1ZnN1B6MU9wNnpLNkZBZGxsUGNCdi9BTExiUkZWM25PZjM3UzJPZVA4QTNYMGYvS1JuTWRSSTZqSDZNWXdJSFdIbUVMaHVWOUJEdENHcHhLL21VMkZiNTcrNzVxSm9iRVBWaERWV2k1UlN2VStDcGNUd0xzUHZmd2hvcXdBNkdETUdoOURVeURkSFBmQkdnRGhrNU16QVd2M09KRUJWelF2Y1A1bm1WL01JWDBoaTZodXZlR0M0QjZ6a1JjdGNRTXR3c3RlSUpURHJmdEI2OVBlWXVEeDNpSEo2ZDRyMjc1dWJLdlBFTThaNW5tYS9lVzVYR25lQVEzQkR3MTdONTd6Y0ZCbkMwMC9iM2w2b2g5V292bms5NGFHd0owRnZ4bnpjS3YwUGRQUDA0LzhBZGZWai93Q0dQMFl4ajlDWERFSWFsUTNETUNHSVRvK2lSUnNISFI1ZGUvbVlHT21DSTYwdWJIV0gzWVk5THQxNFQ0RlFHOWhhME5yL0FBMlN3SG4weFQ1dUliZDV0T2htSzNndlI1UDkyaHJWaDlTMmRmRTFXNEVvSHhjdXM0cnptTEo0aTU1aGQ1blBXSDltRE82Y1N2TXMxbUNEakVHMWNSZmVPdk1TYzY3UU9jRVYxblBtRHJPSWVkSFhwRmk3OHhWbmZURUZ1OWRvdFlmbVBFRmo3M3pESFdSNHB2NHo2TXcvc1J4UzAvSjZ3QzV6UnNHVDJxVWpra20wUDFZOXlGYW5zQnpEL3dBVi93RExuNnYwZm9uMFNNSjZrSE1FNnc3b0RyQmhETUlRM1VRaXRCdUJ3c2wvby91WmxWMzkrWVZWSWVWRGgzV25tNFJEdFgzL0FNT0hwYXJocStyekJudFFkbHY4b2h0WmJaMWE5NHFBS3RyNkVhajNTL0wrWjRpSXdDdlhtSFJwdUM4ajZ5NHJKdTZodUYwWnpBdUdjVkVVdFgwZ0NFdzFOS3hxRHJYdEtDdGwzRFMvU0Jsd1E1cys4T25FTTB1cjk0QThRclBYMmc1Z3pqckZUTm5UbUNnRnBlT2R4cjVnS05Kcy91V1VJNTY5N0dGK29YbWw0OUh5RXYxQmN4V1NEcnZPUC9oVWZxN2xTdnFuYVAxVEVZNytnOHdoQjZ3WXRTNE9JUGVIVkx5UlduZG41bHBYWjZtb2tBMG1QRjNtZUVFbFNENXA5STlxZ1pVWGtMZk5DUk0wQ2czMS9meEdGQXB2bmpCK0ZpMnhpd3JWQy9tTmhVaHZ1NWo3Zzkwcjg0Z21FQVpyRVY1MUJSYmNCb01wQTlKWEh6Y3JuMzd6U0ZYVHZtQjZZaG5CaDVsdEV0NmZhSlFaUTB6cGYreXRINTFMR05Remp0QXhmeERFMmUyNXBQdTd4MUV6RVIweTRWQmNYMWdzamtCei9JVHZpQndVUjZNSy92VWxUMUtxYjVCM3krMDJDcFZIQzFUenYxanU5L1RuNjh6MC93REQvd0NXUDBkUmpHSjlFZ3hCRGNLNGhDRzRRekNGY3pCYmNSWUxsRlloRk5yQk5la05Zei9oN3hhMWFOTi9JQlhGUFNVVEN2dTBYOS9kRVlxbW5rVnIxMnpNU0dnZUNzZkJHZ0c3TWNyZnJpQ3FzNTYra0lFOTBjWmk3WHpmU0tZbzN1Y0IzeDNnVTVXVm04UU1aSlE4SDdoVHBVL0tBc0xHcFJ2dHVMMW5Wak80Wjhvc0M0ZzZNWHpCTHpXb0F0elVEalpVTUpWd0tjZEoyMlROWml4Vm4zbkRVUko4R3Q4eTVZNHV6bDlzd0dCVkp6U0d2Wi9USGdFVEYyNlArOTR5UlJPMkJQNmw1aTR5UzJKN01RZE5URHJMUURMOWVQOEF3LzhBbGpHTVkvUmp1UDBCQzRFSUN5QkFybUF3c2pnZHdiS2pZaGVBOVhNeFI2ZkVRVUJtbUxVRjlzc0FBdHlMVVZyMEE4MVVZT1ZkdHY4QXdVSVFsRmRkM1IzM3R1TnpEYmwwcXhsUnlabzZ3QXBzTFlnbFhqOHltaXZXRnpCOW9YNlFPc0RtcG5yRTRyRXZMR0R5MC9NTit2dkZyTGlJRzd3d3hrZUk1Y2FndXlXcjNnM2wzQjh4TzlSWXhBczFYcE1xMXhudkVyUk1way8yTWU4YlNNcmVqb2ZOUlFvZ0JlMS9Ia2x1S0dQYi91NEFYaWF4T256WkwwanZFR3pEQUxGbjk2eXo3YU9lc0xUMDVJelF0S1BtYXN2Qk5tZTYrWjJtdnEvV3ZxeC84UDBkeFlxRm5RRUlGREtDZ1F5Z1FDRUNiR1ZZcHhGc3FkdmRpVkhKclBlWXdJOHJpeDhYTFQwQjBZNFA1L3NOaTNhaTdVYjlnTVhIZ0o1ZmdZUmJWQ3JmTCtEY2VSMjhYei9ibDJLc3I5NW5TY0gxeDlwcE9lSU5aOHlqbHZHWWIvMkVITzUzcTQ2d3U1elRLTERFeWR5eE9zMGVHTjBwQnFsNlN0QVdjeHlFVEc1Y1A1ZzJEZm1CV1lIckZ0NzlTR2QxRE85eERyNHpIaytocXYxbWJ3YUE1MmYzTVJzWm9MU0tWNSsvekMyd3lDQzlOVmIvQUc0K1ZQTTdzS08xVHJ6TW5VMFpiZWRFeEc2ZEYxVG4xNWxjclI0L3Yrd25OQXVhNXQ3d28rbm4vd0F2L2hqRnhHWEZpeGpxSzFhbGhwTHY4d2hDRXBDRU53bkVOUU1qM2cyelI1MXpDVys3K1VZNnJRRWJxa1BTcWQ3aVdVVUdLcTdmbjRncWQ5VVBEN1ByTUFjcFhRcDdVSG1KUXFMQjc5ZS9NUlJ3S3YxdFlocHNCaUdzNHhzM3NtTGFtQTRXbm9zV3plUFdBdmNPdkJOc2RKVGNzd1ZMOUxpcWJ6Mzk0T001WmZ6TGFSaTVkVjFtQno1emM2ellFY053RXE1VWJjZVlsdlh4RktEZmhuL1pra3JxVXFXUXRZd3BqMy9OekEzZGxnOC8zbUJnWWpQZERDRm0zTlh6OHdVcTFvV0JYdmErMWQ0Uk1PajJQbjNabEdkV3dtK3U0aEExQmREcjNwOTZpeWdQRk5tZnYvWmprRFdscmY4QWtzSGJpWFgwWmRrdVhIdWx5NWN1TDlMK3E0akdLVmlMQmkyTFJpRUliaFgvQUdEOURjTXpuNlhORExuV3BmUklMTmhocTdkRU1MMWdGb1BMWTlaVUFsQnJnb25yOTRDVngwWXZKOThrTk9DeDV0MjhPZXJGRHpsZXgwZ0JSdDUrMzdub0FlbU53c1VBN3h4R1ZVOVhDenQ5L21LV1ZkRFpyOXZyKzVwQmJ1MXIyemZNc21WY1dGWjd5aXhldHIzOXlYTTZlUHpESG5EcE5NSjFBSnU4UWNpUWQ5UE1HczNpTHJNMmRNeWd4eDZRSElMYWVzS3dsTnZNRHdqS09jdXRjL01EaXQ3WmZFYlZpOERDK3dzc2JFb2RJZDgvM21CTEFqRHJmZW9rMEJRdGkvYS92TDBycUpuZE04K3NBa3dGbGJPbm4zOVpSWUNkTk15bk1TUG9MU3Q5b29oaXJhcUVxc3Y4amxIME9iNzlldDVpWUJZRTBMb29HZTk1YklxMm5IU2x1bnA2M0xMSnMwV0RUS3NiY1MrSmN1RERJd2JONGx5L3BkeTVmMFpjekxpczFHRGNMQTRlODUxeExwb3ZVSWJoT0lhaHFFSEVFOVEyaEdPMFliOVlFWkppbVhkVnRUQjJBNTZMTkZTK21sc3g4UGVYRFJUVzVaUlhTZ3ozbEhOSUtWdlNwVjFJZ2QycmU2K1VnSjdzUno0OThSdzhHc2I5K0lXclJRZk55clhscG4zamw0SmhSM2Y1ekdzYUcwN3ZPWmZHbkphZW5lQjJsaTYvU1dWckR0dmY5MWlPNXBqUFgrdU1HOTZyVjMvZXNUQVNjVzczMTM5eVhVdTdhdXUwUEFpZTQvdmVEYXN3cG1EZTlSdkpmTXl1NEN2VE9PWThiYWVDOXAvZThCMk0wcmhjdjkvc05YTnlZT2RjcjMzM2oyeDVRZVdPdmVBdEgzWWk4OVlpRmV1K1crZ1pybThSa0xuVmsvTnlpV1BOZGVoSGxTMVJzSGpUOTRteWk5MEdZMGdvWGpUK1paUzB4ZGI3d1p1RXZwRHNIR0RJazlNU2drM0RCZkc5OTRzN0dhRHJodDdtUjdaZzFSazBhcnZxV0Jsd21iUnVYMElocmhOLzNlQ21XSmZUbVdZWG1GVlI0amJIeUMxQzNFS3JELzVlL3dENDE5SDZLQm1Fc2lYajBoa0w5aG1aWGJ1Q1VxajFYREZRaCtZUWhCVzB5UzNNcFVBMFkzTUVrR1hOeWl2UURBNFlkQU9aU0lxRjhSbXZHenM1aHRBYkpjWG5meGZwQXkzYmJvWDg0SmVxd1ZoNlQ3cUFLRG5YVkYrL3VzdzdGRXZ1Mnh0dTN4MWxCZDQ0N1F0b2pmbFlFdTNKcisvdVlwZXBzYS9NckhaZzE3eEJyRDBBL3dCWmVJSGtQdHpNOWVuak92WGN5UXFacW0remhJQ29UdzFyMDBrSk9mWVQxdjhBNUZEWlM1c29iL3Q4eS9ybXNsUkVYaUxKYkF2dEF5djRqSlhhTzlFam5ubUtNRnVYbisvdThlS1hRTi8zOTFnYlIzSEg1bVdHM2pyaUd3bHJyRFFCbm94RlZieHFLMEs3djdoYVZieU81UnB5YzNIWlZRWWVJaXlNdVhwcjRQWFI2dzZlUmJWcnlZbFY2dFMzQ0FzTkY0QjE2T2hkczBvRkFwS0hDK3krY2RJNDZvRlpXWDV1RmFpQVZxOWVzVU84NHh6Q3JGc0FOUnFKVld1dm42djBYNituMFl4Z0ppVjNLL21ORXR5TjNGc0Jkam9nT1NOa1lhaGVyWndocVVpQVhtRUFOanoxZ25XQUhjeHBYMHVIb0R1c0VCVG9RZUp1Ym1DdGZER0lzQlJDWWxuTXV3TWdZWUxPWTgxQXBUMWhVcXFDTU5DbC9EQ3N3QXg0cjFEMTZzQ3JUYU9YSy9kTTVEZ2NnU3hWd1cyMk5wQVc1dE5uQkdoWXJwQkMxRmgvZDRiQ21OQzExOHhXQVVtNVZRY2RRM0hkVmRLTGQvMjRzWFpvdlZ1K0psTmxBamhwZk10OElXM2ZNTnBkMDB1K3V5QlZnTmluOW1DR2g1UmJGT3VkYWpzOVBmaUFUZk80blJ1RHF1ZXNhS05zb1VtSjJWM2lDcXIwbTAxeGVPVnY5YkJ0ODYxZm4xbUNCVktXOFlMdTRJTW1lMzVWT3VMNVlLTXBvNlZMdHN3NTVNOTQ4WjExZzc3djlzTUR6R3UzbWFTeDJqN3VPem1PRVZkYXQxc09lKzc5SlZTNmJ1Vm13YVBYbVhwVGRoZjBMOTUxMkpPcXlqM21OV0tFVzhwWDk0bVRsUXhFVU9MeWRaV2FuRk9vcXIwYjNCYjlqci9zTmY4QWxnaXI4eXlydWVveHVxbCtZSVZGUUdtUE1kcW1zWExBQU1tbU1NMnNCZ3NxY0NuVXVLWnVDeWloa2VHRzB5Rk10QjVhcHFBWUNzaGNSMnQwSU9MTW9oQzNETjhkdXNJNDFHdldVQTQyN1N2WGZNQysxZEprWGd3Q1ZjdWFCNlMxSUx2UzI2OWVZZVdXb1hQREdKRjExdjVQaDdzVVRZU3QyV2gyWUdQTFQxUHZIUzFib3JqY0RTOFhONHl2Q0hXWmxEQ2VuNWlnSEd1MGNIS05LRlFVWVQ4bDAydzF6Q2pzbWw2M3pUdjRoeFE4dDFtck9YMWhKZHJhd2ZQTEt1ODVIWWMxL1poNmc0RXl0L3d4OU50bDNiRlFMUGFkeFJjYnJVZDhjZThTeHpOTG82UzdqN3c2KzBvSlVZNU9Pc0RjaXRENWhjbTA1eWwzM1B2S21rTW1MT3J6VXpEZ2JGYWZMbTRKdVhLQ05zYjV2ektxa0FZSnV3d0RWWHZVQ2hTb3RSejVXcTRyZVdaeU51aTJid1A3MWhHNGFBMzNoL21WR1pwSEpMMkFDSSsrUHZFa281bFlyYTV4emptSmFjTVJUaGUvbk15SkVEVHJEZjIrOEFDamkvdkVQa2VMQUk0WENQT1dVS3AzaTJCaHlySkVNOXdTM2tmV08rUEFtWE1LeEdGcWpxcFhudkVMaFpVNlJLQzdlYlJRQldyVjZqWEtkV0xsNXNjZC93QzNHbU1US2JxWk1sbm4vSW1vaHJtQWkzQTlZQ3RpNGN3K3JJcFdXY3ZSWTdRRlRMSS9uekxjRVREcklvRVFOT1lKVTRBbHc2QVcrWlhJeXJFSkl0UTQ1TlJVSEprdWFudlNINUltY3pOT3RHUWlja09YWWU4eUJHNE9zSlZrSEhFVG90eXIxZEFSZ01yNDN3SW5wQnNNVXl0bXZYTHhMS2FqT1hKdmx3WlJ4YkVybEY5VzRPVG8xbUZ5VzdoVncrZTB5RUs1M01RMnJ2eExycnNYM1JQaEhtUG1OQ3BMZHUwSDdtcktyRHBuUHpMUWJTWXl2OTZ6S3RvQkxPM01yZUtKSFlQWDd4NXFBMTcwTUQ5L21WOW5pWng0M2NJWmg1cHV2OW5JTy9tNXhBTFVJSXc0V3pGaVk0MUFVODlJeWdVSDNsNExuUXVyL3ZXTVNLN0RRNTk0dTZwVWRXNmhOdGdWWWI0YWZ2Y1VHUUpCNzZ2NW1kZ1FORDZ4Q0xDSFBsL3U0V1dtYUZiZkwxaHhkdzE4aXVYRkhjckltQ3JUcTh6VGM0bkJYalA5K1lpdEIxRjEyNzhkYmdpd1hiYlQrV2I0ajBpUHhHdFV1cDUvMGxTTEx3ZXN0VWdvUWU4c29OTGJtUHFHZFFpZ0FLekxSQ0tGSjJnWWcwK0ltREpmTXg5Z0hoaG9MTjZ2bUlwdDRnUyt5RWxpOFZxQTZWMDVsTTlMYlZodjBtTWRFOXUvZUk2TnVrcXpZVzNBTWFaSFMvVVpsWE9CdUZuZDFWQzBMQUlNSmRWUE8vTU1xNUE2b0xJS0FlTXppTHk0ZnlTb091eWJwWlZ3STZNc051N3lSNGJhdE4vbUFVc3l2TkxIUXlkMXlwS251Vkdvc2pDY1N5ZVY3Ym1SS1VMTnlvZ0RhOWlsQjN4ZHc2TUVEcWxBUFVKUTJvWFlvYjdBVFBnS0Y4SDlmZURJcnFkOHdjdFpRNWVpNnVhd3V4WDFxR1ZGMUN2YUxFUUtvcnlxci9zcDBWd0tmTFByekFTcjAyaEdyOVlCcUNXZFdEdDJtek1JNnVIRG5ONy9BSmliZ1ZIWlBYKzVoMXpNR1gxNkVIWml3dkgvQUdIVXp4aUNpeVlKNWdzTVloeGZhREZ4OWMrWTRnc3NlSnlvY3NjcjMwL3U4YXBmbEl4YXVhMmY3TDdndFZ1NmUvbVZ2MVdpaXc4WmxQeTREQWJjdS9YZHk4R3RkMHRIbnUrdjdoTVl0eU41TmlaSGZmN3hka1plQzZtY3EzVnU0YSttYzVOUlFvcHFubjk5NDY5aFMyclhpb25tbTdqbFFKY1VGV3V5MnpwY1FWR21pdXgxTFFYZGFIcm56TTJlUmJGaEtieXlpdEJqcmVQM0ZpcUZ6QzVML013dU1LL3U4WU1OYnRVV0lENXpGM2NER1lEbXJWYmlJQVQxWmJha01GN2kxSmxBc2dNb1FCUlZKNGRaUi9CMmJaa1E2b2RlN0VCTHMxQnhqZW0wZllsR21WTXZWM1l5L3dDd1NBRlJESzYxRER1L0VTcHhvNng5eHAxNlNvSWR6bU9DSEpNVUIxUUtxeTh3QjFMeVNqTlZ3VkhYTTQ1eEVIeG80NWxZRGhwNG1GVnpuejNZQmhzdlV0KytvQ2FhRXRiRDRjL0k0YWc5dmN4VVZpanVpdlMySm9XcXpyekhSRzIzczhmbnpLVE9QWHJMVWRpL2VwYlNydUEyVFhUMWdvdTIrTlF5b21sRGVYOVJWQUtOVmo1eisyWGNXY0NoanErUDY0cHk4NnR0Titmekg0b0dqWVo1aU1XamlxR2ZsZ2lEZko3ekFyVXhQTUYwZ3crWXRJYkVtZ01vdnE0alUxMXVYQlFjYzhlME1GdXRCdmZjZ21xRGVIOHdkYlFOOFovRVBCYWQ3ei9zQWF1bGFaa01SbFZFeEtFdnhDTGZYL3N0OU9WOXovTXd4VmtRaWlpYk9NZXNQVHlrZzJaTzhyUjU3d05Nb1VnNmkvZkg5Y2ZVNUFkb0VnYXBkTjQ0Z0pMUVpEbUJBNlBWaE5samtDSUcwSHZGdHJZV1p6TENGM0hIL1pUTnhBTHVYSVNua3I4eFpZR3RTNkFyZUxxZGFyeGNGVEpFbVBUOHk0Tjh2N3JHN3J5SEpEb1ByYlpVeVh5WG1JQnNHQnloYWdyWENBUXhjSEovMkhBNGRCOGRZa01ic1pwK1lXS1ZRY3JscWxIYTVpeTVHTm0zc0E0Z21XZ3ZadVhtVGV0NmdLZ3VOVGgxZ0Z0bVpkbzVyWGNSQmFjM3pjck5vY29oZTdwZStZUUViV1l3bTVUa2JCakttdmtsclJkbXYwSHVnajloWnhsN09EdkdNMHhLNjNqNXIwaEVCQllYNWI5L2RtYVJlL2ZtWGpZMk80cmZtVnVGb1h5c3VMV0pUNFN5cnFWbHR3bUN0ZGxCM2JoV3l2eXgwRGUxTXY3MWo1UERRUDdoVXJqT0E0am92WE1xWXBQdEtBUTRWTkNMSHBHSUkzQkxaYS9FTXFIZ05RWFpyaEpiVktONGdyYWVVcUdDaWV0d0p0RDF6RWxqOW9vdXYxVmpPejd4aHhvM3hzOTZoUExuUllqeXhLaGtTS1VaNFZqdTZRMmJXZ3JuYjVNZmVYQWdBV3NsL2ZNcVhWdSs4UnRMNEs1bDNmcXJnOVRrWHFhU1lodXJ1QkJUZFU2dzNrRFJhRVdCV1RyQnBreXFGdHVadDJPUXdXd2FqNm9jbDVnK291YTRZRmFJY3NjSVdBV0RaQTBGT09Bc3U5MkIxRlJSZUtZc1RhbE1qMjhTd0ZBODZTdEFMUytaVWdkVlliZ3N1dmU0djd3c3dqUEllSWhHWmdqMlFURjNvWEVRTEVLWmVibUxaNFhnMzd3TzdQTGNBbWpxK1l3YUY0NWdxbzZPUXZtVXhjbHVVelFES21yNGpYV0JpMzRsR0tEbTI4U3dYWmd0OHY2Z05BaUNkQW8vS0RCckJ0dFdlM25xT0F0Z3c0RzMwMTVsTkRhaFZ1dlh0OTVmSlUwTjgvcUlqTmwxK3ZTSTF3S0x6alhudk9wWVNlYlBmRXFGMnNzZ1RUVlN4bXZqOXh2dXRZN1JPVzNlSTdiYTdSWXRkK3NUYko0aGd4eEN2R1BTQnZFMVV4R0s2eldPNDdsVzVJMHZFZmFsUlJadnlRUXQ5ZXNCMkkxakc0TUhFRlFOMlE1RUVxUGFOdGxnT3F5K2h1cmNSS1ZEQmMzUUgzWXQ3ZXoycnhxVUFGcG9md1Y3bzROcTBPb3BVQVpLUTd5ellEV3hndEY1ME1HOE9EVC9BSkhMY1dEQjBtUTJaUkx1Q1pTd2xRUG1ZSnBvc0xtQ2hwVnorcGhHc1c2YnErV00yZnRLNndnSnpWNGZuL1lpY3hTRUlBT3Q5K1dCcUdQY1pWc05GeXhDVHE3bzJ3dUlaVnUyWnA2T3l2OEFKYTRPVzdaWVUzU3RidkViWldBdFJRcE5nd00zOHpwbTI3ZEpTYkNiYXowTzhJbGwxRTZUQmxDQUtoei9BR1lUY3M1cmY1Z3NDYXU3TTNsc3ZTRDdyYUJibjh4aEZkZzVaaDZ5M0l3bHd0b2J3RjcvQU5tOFFDZzVpcU8zSzN2KytJaTdZWnlXaXoyTXU4VmNYSUhid1gzY1hBdXJBdDQ1NzI1dWR4MWNNM0JmTDF6K1ppcHhRTjdkU3RBYlRaTmNJMk1OMitSZ3htb2JPNVdkUnl5RWNhK2FqZTdJWERYcEF4QkltY1FBR0tnUXpOVTNJUGhPVG1WZlNVaEF2OXVKZldWTjdyTXFMTklHQVROYjZ3T3N5UUsvMlBNV0pVeWZJM0ZZZVFlc0lFUXAyYnloN3dMM0RYUGIyL2MxRkN4MGJQajdzb1BBY3o1LzdNRENuSlQ4eGlBZDAvTHZLUnRaNkhXV0NyR0FlUDc1aW1DbHkwMWZtQktLUnF1RGFKNEZmNmlZWkpUcHg2emNuT1gybUdFQWROclVOMUkxbUVNQWcxTERSYmRJQXhZQWRRM0RCMEdFRVpXUnlSMWVFdTE1ak1ySVJlVitvdGhzTGVHSlFwdW1TZXZmOHd1aVVNRU01YUJmbkdVT203R2hqUlMvTEVQVC9aMVUzR3JVNTgrOFZDK01Rd1YwNC9NQ1d5cWFER1pZV2FGdG5yQ3hyV0ZvamM2eXdUT1lOU0RhSEt4ZFpRSzZEbURWMFRZZDQxV1ZvemVaalVhS1BxeEdvdG9VNHB2OXd6YmdEd1A4QSt2aVhXUVlSMkFmeHhFRnVWWDVscjN5dnhjU3R3cXJreVB0bjBqWnpCOVVEQTFLWUxYVzM1ektVbU56cGNKbnZVR0ZUQW50RTd6TGlGSlVBemoxaSt2U1VydmMydWZ4amJMeFgwdGJpL1RIbUZWNmxHOGwvd0F3SExtYTlvbTEzempjcXNRQ1Fjd016V0l2ZUx2THBWeXgxRkl5ZnZIV1daWXpZcmYyaHdLaTJMMC9aOVdJa01FS3poWDkxek9qWTI5UDFydkxaQ3BzM2hhTkY1UjFEckVhaDBGZm0yaTY5cFZmV0VxOFIxeXZRWXRvUlpTamc4VXVwL1dwbGRZbHl5a0ZRbXdoZWx4THRldHUzbTRSaG95RzRncEM3REpNUlV2V0ZtRXdzT3NwbFl2ejRkdThKTEs0M3RuQlhVdWJoTlprUzJTWkpPOHl2V1dROXlOajI4eThQY29ncEtrdWkrQis0SXJPbTJTNVJhcldiZG9xaDVQYmt4MXU4N2lVaVRkeXl0dW5hV2phMU1NUC9aYXNIa1gvQUpHNm9HeHNJcFFTTkkyUzZ0ZUZmdnJBRFJBWkxsN2Q1YWlwYTRIbUFOOHBPSG1JM3BhWHpzaldyUlV0YWdJTGZjRDlzWU4wRXhzdFgzZDlaUUYxWEg1aGZjdys4NFdBMlBjL1o2dzJDeHB4WitXUGFBa3h5TkYzY0RkWVc3OVhuaUxMd0J1eTVyMWdQTUFUbUFEdk5jU292V1ZOMmZ1WXJ6KzRyUXdFUktIZVpnQS83RmV2cDlGS1IyNmloU21VcS9NdzFjemI3UUhGOFo3UzdyKzNGN3hBTHh4Y3ZpNCtrVVZXOW93bHBlZ21EYkdSNlA4QWVaa2pUaUxxbEMrMEFRWUt0eGJhOUpsdGRJMXc0ejM2UnlxWG5USEwzKzhIYThjS0pzdzV1anFLZElpSnpPVWJvR096M2xVTVlkRUZlZDJHZWkvOWlvQmxGcS9uOHpkbmVFY01VTFZaVE5ScURtM3lYTE9hT1FoMWsrNlN6dGRab3VvNnNPRC9BRm41Z0F0TDFlc1ZaVERYc2k3UXBaY3dCc2Z1c2QwNFBkM3ozaGNla0RWV3lyRTdMZk4zQU1BUHJmdU1YcWsxQm1rVXM1aDNqTUNYZmY4QWNRMmw0NUYvTXFYWFNkYVlvV3h1WEYvaUdtcHdOcmNhUTN3SDdpZ2ExdGlpRU5Rb0Z0ZmVabXBRWXFXMFFyWUxaZVFCUUxyY2JLRU5HNitWajhBRUdNMDJ4QUowQWxPOWZNcEwwQXZwaUYwU0xkQjkyTi85anhocTdlRXVDdXVaK0lhMFpXdmpVUkF0YUV6U3o4WjhoTHB0MmtNR1ZWOFBlKzBBeWZROHQzdm9SdVdhdVdqWjhNV04zQkU3TUhVdVhmV0xSY2I5ZDVlaHM3OU0vd0RZYjBvbDFqbUxOeXhPdFNnb3k0M0taQnhGQk5yNnhNT1laSG5IZVpNZlNzb3ppS2RkWWdGelcvYUdINWNmM3pEMmRwcEZNbzY0OThRQmFCcFhucEVlS2JLNjE4OStaWTY0QmFheTg5V0VUQmFVNEIyL3ZlS2FLMENNVy9xV1pxZ3RyZzVDbE0rWmd3dk91aFpsNjlZNU11bXNxN1gzUGRZbW9saUhUckt3a1lKaDdmTUJZVzBEcnlHUDd6SDVac3ZWdWhwUFNJNTVtYmZMcStJWHhZUTRwKzB0UTJPMTVhL3RSSE83bE9TcjVna0FkRzc1OHhvYXM5VnMzRmRUTm9hNWk5cGFYZVdWSXZtSDhTa3NCZ3pLb0hkRC9ZbVhzSzEzdWFTSEx3Zm1BVHVPTVlFbHlRUTJxcUhuckRMYU1iMS9zQUtDYUJUK1lQVUNMSFdXQXBMYmVYNGlaaWtLMTZTc09jN205eHdOMmlWbVYxT2NGcG1ZaEFVeTJ5a3l2a1ZjVzFvRWIxTDdtSUJxbDJHL1dOMGNIUEY0bDVvVWFjVVY3eWdZUWVSVVBhR2RhSUxmVDh4WHdZYThtWWhLTFZ2Zi9zYjlXUXZrS2VzUWc5Z0ZYdnRQV0xMNEdaVVl3YktvdHl2SFdKY0c0Y25HRy9JejUrWUpWYWgxK3lvZkxuM2hKWTQzQnByOHkvUml0Y2ZxVURGRi9NYXRsdnpHUXQ0ZWtGTjF4SHFodXpVZFVwTHZ2R3RsTEc1VUVOeFJ3UXhsRXlic3ZqMTNjcUFDTkpPOUtjc2ZHWmsvRW82d2doWVpKSUZzWmFpVUYyQldMRFgzaEZheUU3T3Z0TFVLRFpWMWJiOXBnQW9BblQwNjRoNnJvcnRMYzM2ekkwaFc3eVMzMlIzeEdTZ09odzEveFhXNXFZSk9YNmdqaDZFS0JvODlUaDhrVDBadEJBc28wbzh6bGhpYktTNDFlWTR0UE9Tc1VGeXFpMGJXK3hDVWJRMWhtMzFnQ21RZEJmbTRQRkZiY2owNnhCZzMyQ0F5MUdrbWFRK0IzOHdvdGFYWitJRWR0UTF6RFpEdGZpQTRFVmJWSENzb3Z4Wjk0ZGpGVmNBa0FXSzA5LzhBSUlwUnJsVVpxOXFPOTVpdVhBQU56N2VzYUZnS0szbFVybkYwL2dTeUQzVldzWThTbzdzbmk5L0VlOXdpREZQNWpsQWpZMHFnN2lXdHZhTzRyWklnMVhSN3dGZENwc3ljM0FWcWlWMzFpVVNVVWJzV0NKV2dMV0ZGUWMyTThIK3I1Z3ZIQUxIczEvc0ladEZxNzYzanpPa0tMZDg0amx0K3JyTDlyOUVUQThSeVdKWFF3cjM3eEJGb09paFYxemJYUmxTVWNnV0J4OW1PY1NsNlZEc3dDQVNYdTgrOE1yWUlwNTVZSis1Y1duUHBHMWx1V0swT25hRVpzMjM3d3RFWVpWZm1YU2ZWeTd4YlMrUnJmK3lyczJWN3VJU3BIWjN6RTlaN3ZVRmpLR0RxeEZYYS9lNDFlZzJhOUhXZEhUSDJsR1BvYk0zY0tQOEFrdStaaDFVd1dQUFc0eUlPNDR6Ylk4bmZ0RTJGb1YxTndJSkRjRjV1bjdsSTgxcDhMK0NIVjBEcDNlcFY5NDVpSmJWSWxybmh3OHBGeFU1QWRlYTR2ZU1aek9lQWxGdnZGNURtNFl0Y09IUEpoeHB6T2VIR2k2T3I5dk1BUExHY1ZQM0JWeGw2ZC9lWXdBcEROTi9NVVN4Q010NzdkNVFoNFoxWEsya0RGTzRxaUdSVnIzaXYyamxxQm9WVzY2UXNtVElkeFI2QmdoZVB2RWd6RU1xYys4TkVNcE1NQVluMEpydEVSK1VWQlZVb0Rhc3lIWXNEcjNocUxoNWlueTBJczFVS2RuRFA5bVp3YmF6dDh6RVZPTjBsa0g3cVVUa3pHbTg1N1FNNmRDM1B6RWZTWmFEMWZQV0dpQXhhblIzQ1ZVc29LL01TMUZ4a0svYUJ1cmhwV1k1V0lRSXdJS0g1aWtZVkJkN1psK2hXdkw3MmpHOE9BNy8xVEZBcThqQnNsNW5aalNGc1FEVGl2NXhCT0dnaTd0SHpwNnZpTlFyaEswdW5aMWZPWWxqa0VvV243TWVmV2FXQmNEZ3l2eHNqcm5DbmMzN1FpWlNqaUsvOWJobGwrWlprekd6Zi9aVkc5ZjNXV1luSUhWY3k3dmJoWDk4eXE2MGlrUzJ2M0hoeENzYWFlakgwU29ldHhqWGtoY2dvMnJRWlAzQlBGdVhkY3EzZ3FNUS8waDB1THIrYSsvM3FnQ3FsMlFjdzBYOTI3bklvMDJCY0c3ZzUvVXczOFFzVGhkN2pKT1VnWmhxVWN0dVBTNGVFR3Z2Q0xOc0w1Mnl0SjIxUzdzWXphMkREWGVLemF4OTBmK3hrblRCTkFHRHhsOVlIV3lpR2wvbVl0OFMza1BUTGYrd2hJUTh3Ykw1Ti9FeTRzQXlEQ0RxVWo2eXMyTnd0M21jenRMTUxYaVUxVWlTa3VQRW9sSHRjdGU4UzU0QjEzOHg0dG5CdWJiZTJXWGNDWnpEWUhmekVTTzRBRkZmZVVDQTFydk80VWJ3RGxLaWF2RWcwaEFTNzlJaHhRTmk0T25yQXJNRFRtLzdjc1dMN0lZb2N5ekJLckpBMy9NeDhiWU1Dem4wZ01nTEZnaVFHc3JndjRJVUJDakpnblh4QW9LOHkwZGlkNWlRNW5IUlhXTkJ3cTRPbC9iWVlVb1kxUTl1V0tTS3U3UzFTT3laVkZWaTVwSHpuMWx3RmlnRG9kbVorMDEydTlkb0Y4MFczNnk5MEhKcnJES3kwUHpqejFtVmtxc3NKeHZndTNaK0lpV1ZCamFEeXNzNitzclVRM21HQVB2NURwQkZCZVJodFh5N3VPSmd0R0swdFVlM1Mvd0NZckVlOW1GejVPWmdRd0ZZWE9lNU1ZbURWd0RybnRPcjl0eTFtZU91N2dOOU92bmNjam1Ya0F3ZEszL2VXVXJveVlUd21wZW5uVzZ1KzUzMzhzSVRkQTkySmp4TUYzSVNZVXEzdnhGdHNvMTBXdnpHcEd0OFFSZDAzOTR1RTBReWZPMys1Z0FGQVVIU0V3YzRLeTNDRnIydU83KzZ2bVhkKzhjd2wwSDBDY3dDd2FTS1JaQXQzV2NlbVBNdVpNOVRuRndrVnEvbUZRWFdhNjFLdUZVSzVjdnZCTlpRMXE4K1lHeEYzZnJLQUt3YUxYazZ5eTBuR0wrOHZVcTFvckorQ2w5b3JHYXNOMy9zS0FsdmxkeDFJazhnZ3M5cFN6NSs4b0VDYkdJN3N3MjRseFZVdFdVZEI2M3JGOUd5K1V5NFYyc3JNeGtzSFVYTTNBV2ZlbWV2Z29LdVo1RGs4QitaY0VESGZtTy9ZVldSZ3J3dWtHbzF3OVlJWjlNaDQ2KzhxZUdST1Z5Vjk1aDFsUnF4MG45VnhUamRhSG9MNmZtTkd3MEwydTZ6QjhhdGJ0YzcvQURBeExMTjI3czZ3WUxGYWZwQ0VzcW8wL2NmeHFZRDc5WWVRMkZ0NDhRSVhwWXkzU2oreEFHU3RGWE9KZjJiYm4wWDM2d2NmTGJ2cXcwbkRmTytrRlZOY2dkbk8vd0NZSFJTcHdpc2Z0eVJHdUxDbWt6YmUzN2l5NjZIU0J1eWc5Vzd0dTA1bGlpUkJ4U1dtTjFudVMvQVdMZFpNTjhmbVg4b2dOS1J5ckVFNUUrWllzc3pyckM5Yy93QXd3M0ZvUUN5bFh0MUdZYzVlZGtTcmVHTnh5NDd3eEFGb2FGdjB6OTRVbmtpVTNGcEk4dzdteGd3K244eWdIblB0TTQyeGNmYUdBZ3hDQ21GdVJlbXNjODNrakJsWnViV2JqVmF5c0gva080WXRZdUJrc3h1VUNVbGZYRi92MWx5WGJsb25vQVdQVE1LeHdOVmZYNWlGd0c2K3UvdE1hMndwcVVGRjFVc29DVVpoUXBDZk1XNi9ZbDZxUVE4SDdpTWJHTEtNSzhGT3NQWHoyWXcyYVZITVBmV203Z0NvRkpzOXVJNEJDODhIMWxpTlVPanhBY1BwUzYybXl1RGZ6R3Y1Zms3U2dvVU5qMTRsRVEyRWJsdDcxZDB5Tk1odTZscVhkMzJoN2xCMWxVTktvRXZ6Q2tSV3pKMTdRV3A2MWFITW9UalFXYy8zbUlLTHRUaHR6QnNEVmpmN1RBa01tSTg5NW42bDFZV3VZOEc2TWVoQW1WSjBYZnF3U29SZ0ovczVWSTNNNWRWdVVicGxlRE1OcTFsengvZVpRM1JPZXRzUVFYamc3UzY5VXJkNy9jVXN5bWdaQzNGbTkrc05WZHR2Q2xSVzdjZWxROUNvOWJ5Syt6ZTQycWdBUmh0T2JwdE9SdnJMSWJUN0lENUdDK2NqM2xzNGJzM1FpMTQ0NjZsMDRWY3RQOGw0NXowalh1dlRjME1ldmRsTlZWU3hzUXZqYVNnSUFVVXhHR095aFY4eEduVExEV205d2FadzZZZGlhbVM1MGZTUGRDWnB0ck1PMFhSRFUyK0loV2o1aFlCVzE5WUV4MGdER3BYUlVQV0NHdGVFNGo2MEJvYncvd0RaZW1zMVdjeTRYcy9jTVUybnYyL01SQ0x5TDd3MFduNUpoRXF2OW1XV1hudjMvdVpSWkVRUkJjTkVVQWNkN2puZExwbHNLN1NSMjEzcVZLdldtYXhvZFpsTjlqRkRRZkpDckV0YkpyaStJb3B2UkhYZnpNOWFHek5kNFh5dkFKMHFiUjNGM3hXOGtHQUtVekZBNE1sOFhCQkZ0eGRaekVXMjlndVVocTBtZHlGMzVaYWhqYWovQUg5M2hHQzBQRlpsNEljQ3lVOUIwTmVrTlZUWFVTVjZYVXVUSmZodlBYM2czUlMyVXQvUkNZc0NxcnM3eXg0eE52ZTRqWUJVZ1ZRTEtMUzV1RnBHaGI4cXloRjVzZURFVG50OCtKUUYzbzhGWllTcFNqZmZIaU40a1VCemxwOGZlRXlnUlpHaW5EMnJ5aDVmbUZ4eTlyUGxoMmUxdkFRWHlOSGQ4eXdBMm0vQlRMcW9teDZJWTRob0RPa0FMVVdydlhYckxOZjNlRFltNTZLTVJ4MjUvd0JsdVh6cjE5WmRtYUV5eHlhN3hGN0o4d2JBZXNGcXVJYkhyRmw0anM4ZlE0NjFobVhSTkhIZVc2MGM5WWNJaHM3OFFyd29iZ1ZSZHZtR3FZUXhVRm92M2pRVUJRNU8wcTJUTG56SzJhcUhHdktvVzlDNmN2eEtBTHlxOVVqVkVydkx4OTU2U3BXWmJLcDNST2tsMVlaY1k5OFZIYUE0TGlZeWVSNndBRnh5TzRpZ2I3a0l3b2d2SHBNNkh0cUM0cS9Fck5qWGk0bS8rOEVyWjdpRlR2R05sT3BMUUp4ajdTb3BxcHJiMWxLd3FWNHJyd1E1NkFvKzR1T29Kb2lrZEYydmlCN3FZcTRKT1RIZGozT2p0SHpzQm1SaEwyL054OFZsVlVDS2VkeGpZaHFQYmx2OHdEemtGNXdQU1Zia0FVaGI3dzJDb0s4SmVndG9kK1AzSEFCcWpxci9BSG1VanlIZVc3WmxRU3g2eEttRllzUEQ3L3FCWUpaUTU1Mzd5MDZLV3ZLSDZWM2FsUnMxbG1zQ1YzcElOYUU4T1lYcmpDdmRnSzBNY0xwM2ZnVkVxQklWdXBzN2Evc3huUlFOMExqbldPdHpYOGdkRzhudktXM1J6QTdLNmpmV2FsUjFRUHV4Y2dxcUdHK3Uvd0M3L1FGdTR1WWZNYkwrWE1zV25xVi9abnJQdkVvVHBIOElaZDhFc1E0dG54dWFNeFdkRGJMb2xLNk55c1ZUdnpDN1ZnQVVGZlFwRzEyNnczOUNUY3ErVXRmN3ZBVlc1VGRmbUNKZWNmcVlyT3BQbVB1cSs4VnNiTm5wS0dWUVpPLzc3eXhYdm4zekVUM2w1ekY3d1FMZEJtYTR2UmlVMTdWT2ZxTnFsdkU1a1dLaTVaWFZmdE52cGxGejF6S1hLZW1vMEtMeEhOUk1uazh5MEY1MCtnSmNGUEV2bDJzN0cvZUVGbHNxQXdkYS9NWkN4c09mTlBFc0dyazcwbDc4Zk0wQmtIZCs5YzlZMUFCazFmVS91WVVCT2xxSTZkSU5LSWU0TllmTy9lYmNaeHRsWTJiZ3FTMXlmbnBBWnRMT2lrTnlvSXVJdDIvMlpuNEFLOVhuejk0eXhtdGJiVmIrMEpYVllybDE2ekFtS1NrM3YrOHd1R2JTOExBMktxM1hyQzhpalhtL2lvclZST3d2TDRBbm11c1lBSkVVV1JYaFp2ckNrWVlHbFdQQnV4OFltL0JsUUFNM2V6elo2elZrbzNseGRQbk1GQlNxam0yeit6Y1VYbmx5ZXQzR3FKNnNqNkpYektBYU5CWkx3T2w4WEhnUmw0VEVNVVBNUzZMOVlpWk0vZUwxUlBlaVZRWERMRUlzQlljQlZBenNWTDc0bFlhZXNlWlUwM0x5MFFnRmhRMHJJT1RUeDU0bWRLNWNyajRQRVA4QXhrSEJsbVhoYUFtekpkV3l4NlpVMnVTM2ZMbDdROGFpR2xXT0xtMGYzSHRIT2FhNjlpS3dOMzc3STd5Y1BTWkFDOEhoZzJPMm9Objl6RDh4anFpN3AwUWprVDNpS2ZUcERVck54SGlCMWxSSTJodkdJSzB5MFJYaUpLZ3lzcFFPdk14UU8vS0t5MDF0SVpHNW5NWmNEVFYzQzdhdXpvU3U3bUNhczJSUU9XSUR1dFZIa0M0R2JVQncyOG5NWkpWaGwxMDZRR1YwdGxOdW5lSzB0RmxFT1E3WWk2cmhSU3NYZGRaVXFhTHQ2VjM3U3NYcENjcVhwR3NMSWgxVVQybUlEUVFPNkgxZFJRSGFic2o5Mk5sRGM5eC94SDRTdHM2MCsvV0NpWnlYZi9JYVk4bnZCMWs1d0ZzdmpyRk1zM1k4emZIYjFoWitDaXRPdlVBcDdzb2ZGYzZuOGlHVW0vZENnTTZRV3V1cnVtT3JaV3V5c3FJK21weGQzN1I1eStBYjZoMWpwL01BcFZJOFZ2OEFjZUJ5NUZ2bzZQRmVZU1dya3QvSjY0N3dESW1STEdHaHlkb1BKYzVTY2lDOWVaYldFVWNrVkR5RDZ4c1hpaWdHN0x4dzJYbllRSlFVM2VTcnRWOWN4aVMrNU5hRmJGYlZnQjFMYnUvUXJRQW9nVWYrTVFkalpISVJ3MGVaZjFWa1RiWmFkc2NybnpFV1JhSmVNZmRBb0kxWjMvdjRpZGtWNjk0QmJmcnFIUHg2bTRJSk9lSy9zUUVIU0w4UFAzbUJjdW52ekZTeWJ2cjFsdlAvQUNDd3o2eWlScnpWTVJXaXQzT1lUeDlhNnpwUFdWRWpHQkVzYXRjVGNSeEMvRWZrbzlvS0FMWWlQS1pYNFdTMlhyN3lveWw2QjdzZlF4YkJzNkcra05UZnVtQ0x3OVllU2lyWVp6MWdhMGlWc0hyQVV4cldybUhoc3IxVnI3Zm1HR0dCMlBsMzd3ZFJnaFYyNHE1WCt1WUZYSmZyNTlZRytzaXVtWEg5dVZnOUtPOXZyMWczV21TUE5EYnhkVENFSnR5VytZZUZ0Vi9IV1ZJVlZrNEFHciszck1pMFBKTXI4ZU05WUFmdkJRMnhsN1lmTEc3VlVLZVNtdk5QSnVVcWtNOVVCNjArWWJEU0s2clBGMCtzWkx6TEpGU2NaKzg2aXFxNW9LbjdzS3hDV2JYUi93QmNSZ3NTazJjOHl5WWdLY1ppdjA3eDQ4T2VIa09GK2E1bWZNR2ZnMkVjb2tyaDV2SHZCc3hUeVJZRjZKeWx4SW90S1Jxd2VhYjNrOE1xUkNMWllFczZlWUtjVUxXSDk1ZzVSMmN6QnROMjFYdXYvc3hiSHhPeS9vdUlSQURyTHp5bkxCV3BVY29XbVd0K0RsaDJMOU5JbzhJanEyYmpDRFNSd3ptQUthY0svQjlNMzZUSjY1enhPVGR2N2lxeHlLUEZpM0xRbkp2ckhnZE1IekFYRGhCeWlwZDVmWm5PcTZrUlBIV0NYVTJkNFVHWEw2eTh3bWVaeExoUEgxWnBpTmFZaEVnM1pFODVLdFVsaTVCYTBkcjdaOHhERSs2V2J6YnZBeVYwalpwZC93QlVOQlZzbExQOHl3cnhnQURnZytzQVlaRy8zbURLQmJxWTA0aUtnaXptNzMrWTJkRTBlaXRuMlkySmlBdmE3c2JyeERlcFpWcnJMYXliRUhHMzlUWVFLTHExVjUzbUViSmFMWmNxdmZnNnlxa2NHRGtaYUF0ZytsdnZHZ2J6d1V0MEhwOTRLYXZPTVAzS3BOMys4eDZ3WTV5Qk5mZE0zWVJrc2FMZFZSVk5ERTBxeTc0UUw1SUMxY2djOWE5WVV0S0FzemI4dGVZRnk4Q295L2p5eFU3YWZneFM5ZmtUR0RlRzJGWVM0Rlg3RnlneG5rRlBkR1pJYXRaUGR4ZnBGN3dIL0J3UUFBQ2o2VnBlYXdEQkRZQUZYREdiejM3NzYzQzVBb3JDbWVwaDZkYWptcmVnYWE2blhqTXhaeWJ4MWxaS0djSERyUDNsZW54Q3UwczZ5enJMT3BNa25veEVNNG5kR0VEcElnYmF4MjF6UmF6ekIyaGZYL0ZuM2pwYVVEdmtIMm5GdXg2THZ6cjFqR2twSFdsQjladXVXL1NBcGJQSE9KazVaSEhlT2lpd3NmRndCVzFrczRXV3dyQnBZZVFQdkx1emM1Z3NIR1plWXNKaWJtbVAwdmppWHdzZHg1anY5eDZ4N2ZNOHhLbDBJd0JnZTBDS3hVYStuY21QVm5nSHIzbEg2WFBzbGw2QkZOdnZybUo4Y0dvY2xqbmlveXNMZEZ5TThhZ0hHeFdCVzV4b2xSS0xxTkY3R1R2Rk83bWFiMEhidHQrSVJTNjAybHFzUEorWmFYWnFsV3E4YzEzNncySVNxdXF0ZmQ5cGJqTEJlS0h0dXF1TkVXa2pBTXRmMjVna1RhcUhpK2w3SVNJejFzYzRQWlgzK1lHMlFBclFuL1BOeFMrTmM5Yi9BTE1BWldnemZES0UxbEtyeWJYcllkZHptMExlcWhhOE9uc3dBNnlzOTQ3VloyZmVCTUdzOHNTdnpQV3UwdlNKaEZxNnR2eGlIRklaZ1BDazVvZjNLYlFCMDVSY3NsaldjSGVPMG5ZSFpOajV6QzdyeWlqT1BNUnNGN3Y1bURUVlF1OXNFOUV0a1diZllvdEhwR3hsWWJnRis3RVVCclN1RE91Yi9ybVpCanhTV0pqbjl6QnV1YXltZGY4QWZWaU1vdDRMMUNKbTRJN2tvZUlxc1JiQ2p0SExsOTQxMmhHTktrT2NPYmI3KzhmSEZ0cEMrRHErc2F3czVYRFUramwxYWdCQUliNEsxK0Rvc2RWNkozV3A4MUc4UG9MQlluOXpNM0dBUHpDcjJRclBVLzc2eXFXQUxlNUFWdnBQRjc5T1lVMm1tdmU0cmQ4bVgybDE1Zk1HNXRoRmpyRDZHN2x4U3BqNjgvUmovTTd4NngzZjBkeStXZWtQbjdBdWpNaldDaUNyKzh1QUpwZUlwQnB2Z0hPWm9vR1Bvb3lkVE1kRzdHeFBTNDEzcTFoNENqbDN2Y1hBQkdoWmxQYUlDT05YSlczM25BakRBWC9QbGlOQ3pNcS9QYkZ3cnNVMnJVVzMwKzdBcWNYM2UxSWZBK2ZtT0cyRmRpMC91Yll1UFFRRjJnTWRVM2cwTjN1VkNtd2UxTmQvdk5FbTdEMWUzekxkcUdxRFF6Zjl6R3loaXFjRlVkOEViS3prdEpmYW5ySFlZdmJCVkhxUkdrM284SEQwZmNUQVBTZDFuK3BuSjNseUtGK2ZtWnFlRFRFVWVNNWRqeTJBZ095aDRXdHJ1NVlIK2JuSXZ4S1hqTDNtdWZyZ2Q1YU5oWGRrWXFwdTcvdjY0VEZYMWVaVUgwWnI5d1g2Vk9JWmVUNGw2eEtOcmlYcVdlcVROcVVnM3FrejMzQ2V3SlhSa2pqMDcvZVdLRlNUZ1NsbDlJckJWQUtGcXI5NzNsajJxb2hieWtDNFpNYnJOWFY4S1g2enFMRnhKVUJlUVg5OCtyN3hJWkE4aU9lT3R3NjdSMHI1OHhJWXk1VjFNeWhSMFg1ekd0ZEllWjVsdnJVSG1XWFBFdDczQ1g5T0pjdk9ZT1dMTGl6aGo2elVZWnVlT01NUUdyUVRERElyWE5HSlk5SjF4SEhVTURmRURMSlowVUxIWGd1VW1uMldIUi9abWVlSThoR3I0cVp4TE5LNTZkWDVoVmtwaXRWelM4MXZCbDRPZFlWZFBBWTdSd1E2aHJ2L0FHbzVFM1FQSlZjODVJVVNndm11eGZndUJ0eEZsMWNmZEZ0b3NoMWtlbi9ZUElsUVBLcU90UkVVRzZoemZIWHovTTZBUXB0eGVmM0NxbEZTNlRPZkhicm1OUWd1dTJEQnYzMzVJakxoMDFhZ1h6Vk1iWExRdktpRU43dTRWQnFNMGRZdjBaOUoxT0xjMVlmWUhYbG1RMDVEcXQ5N0lTSTFzTFYzNUZVZlBXV1NtN1ZTc2RjcXpvalBlekVsSFZLckRGKzhNZjhBamNXaTRhdUdZUy9DSFJnMWlHSWZUaUphenlyT3B1RXYxTEd4UlJzYktsV1ZBNHpoT0hxS2N0Q2dYWVFYb3dHUE1WTE9pdGp0V09ZM012bkM1VDF3NE9rU0tJYjBoN1J2T0JYYnl1Q0svd0FVci9ZYnJSY090UHh6S2FwTGFPZGg2bnpGaFdERGFwQno2K1lOMGJOL2NsbVJMemZ1ZTg3RUcra1BNWDd3MTlMN3dsOTVmMFplYnVMbjBtbTVjWmQxRnVMbU1YRUVhWkpaZGdISGVZazRvc3ZVcHQ3NmtXaUtHQlBuek1DU0c3YXNkZUQ1akU4TEFsdWtkL2ZraEt3VXFGM1Z1blIzMTZyRmR4c2ZFYnVNa3VEYnNxZVQwWWVyWEdGQlM2dDU2L3pHUnJaSWJ4V2UrbzkwdFBFZnorU1ZCVTJ2Q0R5NVlsclJGVlRtcThXeFRQdUdOWXgvc2V3bFVkKzArekFLc1lONS90Zk1vRGhBR0dWWWZMMitZSVRUTDlwUUJXNUFjSUlFeGdRNkJGL2xxeEdBYTN6cFhXOXU4UVpTcVdnQ2l2SFBaakhVY3BWREhVZktIdzV3NmdEenoyaVVGWkY1bzQ5UGlGVUxYSmJCbXEzV3gyNW95dlVHR25oeTBGdHE5MXpCNmZXN2ZvNzlRd25XZ3Rsci92SnpOTlJzTDk0YStnOWZvdldHQm95RmdWemRObXVDZFN5bG1kNEdEOHJNb05wRk5rQzNmcHpVZVl3RDFDUEEzcnA1bDVrQVd1OHRQcUI3eTRQRG1HUnA2Q1JxNE5ucWEvQXdwaGhvdm94TThOdGpTQ1BtcWI1Zk54cUlFSXRiRHJrdFhkTGVwcnRDODdmOTlibE1heHZoaGF3QXJVNy9BRkIxTmJRd2UvRWZ1aXh4K1lmaUV1bVluVEdacUxlNWViajQ4eTVjdmlNOVkzY3pGOTRObGhwZS9yLzJKbzFyakhQYmNXNVFDOE1QYk1Td3pkUFI1bUdnV0x5NGlzQ0FZdHl3ZlYxYXVaTlp3REZHWmFhL3NmbUtUSGdkV0dCSlpqaE9mMUNNVVRqRjV3WHQ3c1RJV3h0VzJoMTB2MWpta1dVVmpyKzd4aGh3M2wzK0lNckpCVi9QaG1GTGh3RFk1dUlNR2tCbFYyOTdQejJnTGNXNUxwYnAvY1VXVXNVUGI3eXFOczd2ZFZFRVdRbDBQNFM0ZzZpZ0hJKzBEWk9NUmkxRDVZV0ZyQmFRQTdGdTNERnlqeHU0dE1LMlpDdWJ2dkVydVJrN0MvOEFFQ3JBek93OGFiNDVhQzRDaENnWElWWFcwb3JLTFZEVXA2VEtYUm1OMmEzOVBVTVFLN3NGZFhFcUlvSEE3VGtoemNwNlRLc2NNRWRSbWR3czNMRVpEQmtNcnVGWVVLYUJvYnRlVmZOWFpyV3lBOWNlZHI1Z1FxRk5CVnI4NzNSY2NZSkV5cmVqcnA3a2NncThpNEgvQUNyNVpVazRkY1lpd1ZadHIzcFIzdjJJbXk1eHVYakJBQlNJSHFWNFl5TzZ2UVJ3emxhbHprTEdpbllLV0ZCdzhsckhrbkc1aEhPYlQ4d0VCYTBWZ0xIcGo4OTVzYWptNHovZHBiS0NadHdLL3UvM2dybGJ6bDhPWVVJSFhHL01hWTA5R0MxZjh3WmZNdjZYOUxqcjZLUy92TGpIY2Vab1ZBeGhyMC9PNHgwemhGL3lHYUpWNUpnRnhlMzhuUHpLMkFOZ0tWNHh4K1lyU0NiRlR4blBuNWplQzQ2QmQ2TmZQZURxazJxdnlWWDVpQWJqQXJyN1Urc3NpaFNvckhVYnZ6Y0YyVUx5Z2VYN3drcUhROGlEbGUrMWoxb2F3TjBsanhyMWxXcFIwTkFmUDdoTzhKM0xuKzh3dUw5aDhlWVJiZ2NqV1JqdjNnVFdDMGMzUzhmd2pnNlFEZFZrenptKzhNZ0VvcnZmNSs4V3hOa00wbzczMWxCVVhTK3JrOWR1OEZZV0JsdkFjdlYwdVVOWEIxdFkwY2ZuM2p6eVJkcUxGWFVSY1VnQXFEdnQydkk1eHVWTjBPVElUZGxiT281SHJ1V2ltN2hsRlRqUnZEblBNUFdSbE1YM0NQdlVRSWVoZFR1cDdabGRrbHZEcE5Gdlh2MTNIcTNES29GQkswaG9yYXVDSzBCUkhoY1N2c3FsNEYvZW93UnNTeWNKeDZRZmViSVlhNWd5Kzhad3JyRnNWKzQxWjVQaHFxNXZxZlpqdXNVRWpEdk8xTDNmVlhwYTlTaWFCQW11dVhlc2N4K3BBcnN1YmV4NzJFU2hRQmsyM2IzbzMzaDhnUFZTcWx5UU96VWZkOTV6M2Y2bVdnS3ZkbjVpS0w1a0FyaFk0aTNEUTFtTXJ5NXJlK1dZQWdEZllZYXJ3emRBYW5tcWU5c0FxbElCVjVMdXNPdlVKekJ0UkZ1NDI3NW0zWXZrdWwzenM1eTFLM1UzcFpRd3VYM3VLRkxjakFjT2N2eEFUaE4wc2I3TWZtdWJUMTRoYW12ckN4TTdXbVliOVBwZVlzWmM1djZMRnpVV1ZVRVBUMGluTkxxMldSU0RoeXk1dEZvTWRjdWoxNWg5MkluaGRCOTRYQTRWaVZYWU04NFlOQkc3R0xFS2JLdnVUSDVoSlMxYlpiMDBmTVJzaU5aYTlLZ0RUVFEyb2VoemNDWXFoUzVETlg5MksxNEZjdUtTT2t2Q3djM2l2R29nTGlMUzlxUFBNdkFvc3ozN2RkU3RiMFZlYklyOHc5eDBvd3FZcHp4RlhlZWxoS1A5cUtrWFZSZDFkUHpIWmlKVHZhUy9UN3h1Y2JRdmlxL0hPWlExZWFWYnA3L2FPTHNTS0FSOU1kMnlWNUhDMXczbGVjTDFsTjhOc1VaVHBhUjRhYXdVdXNMSlM4SjN4NmtibUQ0Wk84OVhyemZlVUZndXdiNSswT2xVUU5razZvS3pBby83OUFzZHpkd253dkhpR0hvZllTOEtBRWJwMnhjcnR1TDF3djRtaXkvdk1pWU1lOEdzTzRnRVZVa3NSd281bWQ1bDBGNEc4bHJzQUxiYTFFYklvc2MzVHp6N1FrUm83Y0FCM3VqM3VGNUhET0doNFY3TFlGbTJiTUdFSGxTOWtPc3VMWkwxVDY0bTZEQ3BPRzdZeHRoVmRMUVZ4Z3J5UUJyeVZYaVdGakFjZWhBYkF0YllDdm5aWm45Uk5FZHRBaXh5R0wxc2pPNUtCNXhaRkphaXJGdFBURnZUY3pDVVhCRFR2aklOWjZtR0NxVnpoYWgzS0Y2S3puRUYraXRJSWNXWlc5WTYzTXNsd0p6WTZlVGJsODNCcDh0WnA2WDVFUGVwdVNKWkFLdTE1OWYzTlR1VjYzZEM3RitZZzZvTmcyOHhLWU9FcTN0bWFkeUZ1Nnc0ZjVKUURzQUhrZWZaaTRuQTc3blI2MUxxcnExR2YrUmx4aTVpeFlzUi9Nc3daN3loV1E2d0NFS1VpaTlYMmJlMjVUWXlyWXR0TFRidHRaYXlZaFdIdWp0N3QzRFl2VjhEcTg1ajBWc3R2aHhHeFluRnIvSlRrUnlic2NIUHJEZ0xuREgxd2U3N3hNT21ib1cyWlhyOG9sSXNsdXEzTHRSZDlLSE1jaTV1WGhtL1ZjK0NXSnBGdWpqUGZNdUN0bStObjlVSzNMa3I2NWYzbUdJSzlLNE5IN2dMMXR4V01wWHpYUHBOMjZDdmR1MzAzdm1zOVp4T2swRmQ2cmpyMytaY3hLSmJUYUQxNWhkUVZiYXpidmtoQXlEVzVjSHdzZTY5b1dsT2MzZ0czMHdGd1ZDc1Z1MHZMR21BVnN2M08vVDI2TXNDallESzYrT3YrUzNTMTAzYmgzbytRNnlvOE0yMnQvc21DM1k2d1FLV2lnRE5zRHpRVTZONXZ2cnc2WEdMb3RWd2FQY2JIdVN0OElOMkZpOWltaVEyN1ZjVWxMYXV3V3c5cTlwbWNJamIyc2ZCOVk4dkU1OVlNbW1vdU81RTdwQTZ5SE8yM2RuWE1OaEV1a3g1RnNabFRraFNCVEZxRHkyN3lsQlF2TGFIdno2d0VJcGFiRUVQYjA3SFNIb28xSlFOQStEdTVoSlFwdkt0S1BnRjN3SVVLdEVyV1FmRjJ2WHBNMWFQbEU4NktONXE0SW02SHhlUDlpalpyYi9OUlc1V3E2NTEvZG9ML1hmMS93QmltcFpnRTBuUG1WSXJnUzdRdHFtQTl5MTVnTGFSYTRNVW5YL3NKbXNGcWdiMjV5ZEZKMWxnM05LSjRxL1ZZSTZ2ZG9MNmh0WE5tOFZNRjdtNjhoQjBDeHpTMldMS1BzRFFMd0JodnAzaEF0aEJOakdYSEx5dnZLeFdLTHhuekxSdnJVMXlEd25iL3NFU2FtM0FQc2ozbUE4T1ZTMWJPZURQV0NCV0llY3VibUlBc3kxdkhhWGRnejI1Q2JCOWs0aTFNR09NUEJiYTA4YmxFOE1LVmRmbnRGVFpGaTVtZXNWdUtMMmxqVHNhNndDcFhwN2M0L2xQdkNpVzZtMEZ0OGxEbmRzZkpXb1oxY08zejhzb2tTMGJIYWpvUE53NnhUTGViRzc1NWRhMUVGWW5RcXhyeDFybUNlQTJ0S0VYMHZLNEFoWUtJcDNvZEcxWllHQ1d0WHZuZzI5Nm9sMVVHYmJ6ZVE1cjh3cHRuUUJ2aFpUTFM1WHJEYWU4TUthSU5CdGUvU1ViTGdLUHFQeEhDTVBMM2J6SFM2Z1ozeWQ1U3dycnJoeisvV0RnSHMyQWQrMzNuTmRnVWlYNXdRVE5xWGkyUThhbHRoYlZhNXRYNDU3M0Uvc3BKeXE2TzFUSmlXRzZ0VGg1RURoaWp6OHpBR1ZNK3Y4QVhMaXFUaTNBN084ckVOQjBYZWRRc1JTczhFY3VuSGhZeFlMd2hPbDZhZXJEQ2FHV3ozZ2V4VnMrYlhIcmw3d1RlTTI5L3dDOTVlWitqV0ZOODZqMHQzdHZYWDBJbDFZRjB0c2ZmRDYzSzdOYzFDZmN1YThGRDdQUk4zaU0zUXFpbTdRMkk4OVlMU2hnaGZJb1gzR0cwRDBDb1lxcmVsSG1wYm5sbjduL0FCaVBaU3BiQi8wVzdoUHlwblFMN3RGL3JpVkFJM2hpL00ycXpsZzJuYUxhMWw3dEYrVWpUaGRVeWx2bm1qMEIzQ1ZvVldGaUdXZGFHdXZyRVhPaFc0QURybDZ5M2xWOEF0ZWRTc3c1T2REajdmTXRkdkN5L1d2dExVQUJWZGxsd0UzYms0NGZ1VUlDQUhWYU85TjlZczF6R0NQVzMzeDVsVXRwdlJuS3Z4QVZqWEZDejFMOFdKZUNWbTg3ektnNHpDMnAxRnloZkpocEZlWXV6QTJBNE0zaS9oZXNFdW9tSTBucTY3dFpXaGNPanpMTnJ3dVA3OHhSS0lHWHBHcm1maGFQZ25YaWpPUDc5dzFjM2lqa0tjSFE1ZUhHNE1RMzBLVy9kbnpHMUUxM3FvL2VkcU1LMTIrYTVNNGxFNVk2blo3L0FIakUzY3YzaTV1Smk2eFJuM2k4dUQ4dnBNd3I3T1B5L21BelJGamFCcnZIcmlCZUFvanBlbE1WZVkyM0V3T2Q1OVQrV0lTMERCS1crWHIzZmVYZ05hNHpNdThMVzFsUXdkTUhPZmR2RTdCREVBRFRyMWgyb0NuRGhNbVI0WHF1WVlhb0tEQ3Qrc283MXEyczF2OEFIekVGZ3VqM0I3TnpveVlyMnIrNndDZ01HZWhwVXQyejJlckJjOXRnRDNUKzhRY3NHeDNOZWNrWVhadm9HNjltS1RVMDgycWEreEM0d0tYeUFucm5FUEVjaFJkblR6K1k2SVJSVmxrSHJiZldMbEsxNlJlRjc4eEVGdE41M2IrWm9DVmY5K1lYQTVNbU44eTRCVFZDN01HdDRvL21GUnMzam4rOTVaWU1rdlk1eDFvWHFSUWFCSDN1WWpUWFhPUDhnUmdhMjZXM3JLMVc5WTYwMW5jVWd0clQwREI0QzZ0OWJuRVhYSm03NmRvcHhuSldIZC9tQ1FVMW5BNThPL0REbGhxVGhUOXY3Y0FHMi9XWHZZbm96SHpsV3JlM0YzS2pOUnRML3N5cU9sUmJGbVBYYnRNNGxIS1o2ZDhNakZZUE1RYkY0MW0zSHVoL1hFb1ZFb2EvSVYrQjZRdENBSlEyZ0haYVBWS2xRNmN0bCtwUDBSVHF3emdwK3dla0ZRdzQ0M2JpSkVCZkFMZjU5NFMycnUrMkdZaW82dlI5NVhqbGRlLy9BR1ptaXJCbFdqclZPL01aWlU4NU1mZjFqbjBWcDBZZkJqanZrRjRyUTVUbmxCMHVKMm9Eb3c1VEZYWmVNbFhHUWxTNGZBSFNwczBZTnR4UURDcnl1WVY2L2pYV0JFS2hUb1pmUE1PQ3Q0ZTVqS1dITFIyeUVCeFJuRjM4eXJJQUlJNXRvK0MzekxpSTJZUnorVHpDU3FNUml4b08zUFc1YXBVZHVWemM3cjczOW1JZDlyTVpWN2xIV3pMZ0ZxNk45NmhvTEVjaHlmdnIzaTVpeHpFUjZyWVhkMWt6Vi81QlJRVFMrN3YrNHNsRkQwckM1L2xnQXJzSGNsUGYwT3JmbUpYa2ZsdTdjdjNaWHE2V04rYS92TzRKRkZySGxyOXNheGp3WExWV0g1NndxbTdDWkRSY0dxYWVYRVEyTCtPUmUvRnZ4R1NDMTBibERHblEzc0QrNnk1OWlvemF5bnRmbFloSlIxUGNHajgrWlc2cGtJODdQOWxWNVZmbzRnT0xSMGRQZ21tU0x0OWMvYUNRUUJwVDBmdDh4NFBKYklwYisvdEFHbzBtVlcyam5YdkdEcHFVcTM5dmN5dHlBVjBzREhGcXpoWVBPV0dsMXNvbGc4bGJtQnZPSDF1QXUxMEp4MzZuM3VXMU5VUnUxSGpISHRGQU12QURZbDlTeHY4QUUyRGF4NFQ0alozWm5yRjB1a21yL0hmVE5CNWVzQ3hlWEVSUTNjV04xK1lyRkM5ZWtFQ09Tc1FTN05aS1JZOE5iT3pETG8wVmg4eWx0RG9PNVVSVVcwNjVsZ2pkUytpamZ2Q0taYTZjTi9yY0VseXNMb3UrOVhIaExhcGdDbGVMaUdnQ0E4Sks5dnNTank0WU1vN1h1bE8xeHpHcm5KTkR5Z0ZkWGNjckxOYXFtOVgzaFdZTGpiWlplN1paeHJpS3VCQVh1bWhpTndzQUhBalZyM3UvZU1pSmFBMlhBUGpNWVY2ckF2ZW40bURscXBXaThIOTFqbXdxUmQ1TmRqTzRodGhNQU5KaDhsbmIwc3JudDZ4TXdOb1FFb01VQlJkaHpTdFNkZkFWZXJrMTIzemlBY200ckFzRGxRRDE1SmNNRGtjbm52TG1uMGhVV2l6ejF4R1ZLeFQxUlRHNndCYmYzaGFsSXBoMFBWN0hxeHhabmV2SC9JRmI1SFRJSDU3eEtNblE5NVlCbHBiZS93RFpaS1ZhWDV6RWN3RnRvRXkrTndBRkMweWdQRFVMWjdSM3VMZlNXdmNvQXFHTGJHNVp3dDVMcXhueUJ2cmoxbHdLNm0xRWJiNS9mdkNxQzdGYWxudWZlK2s2QjEvblg3eG51WTdveEtNMnVnL0hYcSs4Uzk0VUkydGVsMzgrWXFveEpzc3d0Nk8rN3RFa2lxMyt6YjZ4YVlsaGF0MThWNnN5MmllYThRQ0F4YjJCVnYxQmp1U3AxQVdtN3lmaVl1eE1IbTR5aW5ITHFtLzd2TEtlVTUzakQ3ZXNJb0dLSXVCTmVkZDl5MkNZY2pSZ08rRDVnTFlWV01tdkdDVVdGKzlmUVk4S2VZU1l2QVduZm9MbXZQU1pYdGUxUVY5OHNMZFZiekcrcHJoNC9YNGd1dnp1VUhBMitOdzJMSmRkNXpLVitIbU56b0NHUVhPUzM2N3pLSnFvV3U0M2pOSlYranNoUURHZzd0bkhUN1B6RVMzSW1QNW00NFJER210eTlKcDRPc2RlM2R6QTZhSDd4Nm5EWFgvWUp5b0p6QU1LVW1UckFCeU9zcW9EQnV4ZHY5M2l0ZVZHdVlaUVV0ZGJhdjRsL3dDUjIxaVh2U3ZxUUtieDhqUFBqSHJMbFlCdXRDSHRSZlpsc0NmVzJVOFllWWxJQWJMQWVjeDZzRHFBVXVESmp0aDNVdnBLVDRSdTZ4OCtaaFRDME9OZys5KzBMSFRqYzVETDdZam9ITkZpN2JWalVGenlRcm1xVjhmcUc5WGtLOGZ0Qm94dFdRTFY2ZXI3eXBKcFdqQU1LUW9VbEFXSFlxampETmtMaWVheWd0dXluUXErN0dDbXNEQ2hwRjJkcnUxNTBqWGUrZldMSVNWb1ZlSVd3T2N2MlFuVHhTdFhyeC9QV0hSc0JlbXRYWHhYbVhyTnQvM01ZVWF1eHBMRnhMSHNMQzhGdW9BN1hadnZ1YWpQQUt1RGdXQWZGL3VJcnNWN1hCS0xWczVsUE5IV0dOWmxXTFdZdDNFV2k3ZHphTVkyczFiMXA1eXd5S3lFYm9vVTY4RHJVYUpaU28xVk1lamZ0Q3c1UWNIS3ZmWGVWcW96L2RQdktaUzFHWmQrSUJBVkM2UHQ5K3BmWVZ0YXdhYTZ2eWZES1BDZ1d3Yno0QVQxcUk1d3NWWnMvRis1QVYyNnFnUngxMDlvRFZkMTVCa2VMMGVudkhKQlZyMTJQVzR5WWpVNlZmOEFlc0picklEbXEvdjdNS3FxVFQyaEhpbEM3TnNZV2FOWExDK2FpcG1qSmJvQ2VtQmcxY29saXpUd0Q1SnlpVXJDbHQwOG03bFZxSExvVjNYYlhPYWpHZ2QyTXY4QWtNOGVZQ3pkK0k5M3I0aVVxdUQ1dEpRY0dlSCt6S05xck4zdUxLc0E1NFhyM2owVUJjcVhuTkpiWHZLVUpWNFNBbXdzNmJxS1JvNlZFQmFEKytaYThXUGE0M1d3ZWxTZzJPY3R6WXlVb0lvWXEvZi9BQ0FsbFdCZjk2eDBld0M5VjM2RndMaVFJWGFDdk9iOGtYZGZ6MzNlckt4R0NUcHA3Vjh5OGtLeHVoMkhhbGZTVjVJUzNESnZOSHpMd1c0STJGNVIyNjhyQzJJZTB0MGVlT3UyRmlXTXkxazBtNXp2UHhjWVRLVVZWWFF4MCtZaTZDaDRQK2V0elBhcWxlTHdIM1lxcmdBdmxXVWh2TkdqWStFb01ERjVjMHJmUU1RcEJ3S00yV2RlTzk5NVZlS0NFR0pXVFBiZlhNdmxwSldLVUhCbmZQVjNBRnRLTzF5NFdsRzFvMUNBMzdEem5GK0dreVlnRGRLK1p1RFM5STRNMW1EWXJTYmZNSUdWb292VDFqVmcxdTkvN0FSc1kxL1pxVmxnUU1oN3lnTEMzZHdUM0kxMWxReHNFNmlmZUdHNExMT28xRnpOaGx2WlM4a2QrOEF0Q1dCd1BqdmNPdHhYcXU1QmxCMlBJZ2JBdURpZzY5VysrcGhVbUc2MDlIUG4yZ1hiYTFoZTMrek1mSWg4SEJFdVhEYWU5MjY4ck5XUVVWUTBWOXY1aExZck44bUREZzkxWmVLMXB6ZUx4M3F2ZDh5OWJrUWRRSzlNVkQ1VkFBN3M5S3U0ZW15VmNmbUhyVU9CYmxaWGRGbTl4WTF5anFmbXBZR2xMZTdzdm44RVFiQnNQVE1RUzVJT1F2NFg2bmVFbmdvNE5IMm1pRlc1elo3NStac2JTYjRXSHo4bzJpTm5MTlYrWm5ZNUhzZ1BtV2RmM0xSTTl3OWIxQzEvWXZaME92ZlNhNUFpMGpYbUZhRkwvdnpLQVhsTTN1S25JOGVlWVlVKzBTT0IzYjMvQUhNd3Jpa2NLWFdjOXBhU2dwWnd5aFJycGV2dkNUT2REZDlKb1ZkY0c0MmhkZWFscUVydkZUV2V2aUpRUTgzQmVxZm1aeDNrQzcvdTh6SE5XSHR2M3pGVXNpbG5PYzU2eTdDcEhUQTM5dlBlT1kzYlJ2TnZ5ekthNk9rTjVGVjl2U29vN2FVYzlYazdRYXd0aHMzYkRzRmVzQU9TVnRBYjdJOTc5SmNhT2xna3QzYTF3WTZzWnJDd1dURnFHZmVBZ3pqWTIybDQ3UHVqeXFmSGNuejNoNENJYmJ2cDY1anVTYVdyRkxiNVIxV2pyTENNWGpuZ0lNVHRwUlVUczlzNGE0aTFCeVVFV04xdlQxbEVSVGQxRTdtN1FlS2pLSW5lVW9vYlhRZTVHOVU2NVdUWlcrVzhuckFnYnZZRy9RUHpLRWdSQzc5SGtzdmR6Y0lyWTJqUzM1NDh4Qzl1SXNtWXB6Ujk1UTJyMzVxTnJaMGU5NS91WUNRTzNaL2NySHlaeEwzekdRb3E4WnovQU1scjNFajFVUGZNWmxVd3B6akh2OTQrbmZUY3l4NmN4SVZmTVNsY3hBUm50ekhWRXNCTTdieGZPRXJ2Q041Z1lOcnVabVlFVlFBdTkzNXg4OTVndTRCb3piN1plZk8zM0ljbDBYWlY4ZjNXVVJLWU1qckhydkx3VEpxWnlvRFlkblh0Y1dSb1crRVROWTB2SGJFVlNwM2dvV3crMUY2Mnd0S0tvMDdENUw5b2wyaWMxVzV2Mks4ck1uaGNreTFETjhXajF6TGpLcld5c2svdThWckVWRFY0ZkxDNFNVVTF2aHdPTzFHZXNjcHdGMmRiNitrdHhHaEYxeHVVaFM1UFQ1TDlVZkxSU044SmZ2ZnJDb3l6RFFCM3dIZnZBaDRlZHE0ZXUwUzNvTnVxajVPN01HeXF1ODBRK0cvTEt4c1lLNm1qc1JLUjNoT1NNK1FPd2Z2bnpONkM4TlZZNUlZbEtCbnZOQmxWdU9qRjRoc3ZNd01sTzBpR2txWmJNOVRyZjk3eWpSQVZoNnh5d0xrTjd6TE0xVHVzWitkWHk3NmtvQmJCYXZqKys4cXFQS0QrREtSQnJWcVptRGhaVC9XZ2dLTFNiR01pQW1qbHEvOEFZeGdjRlczL0FIekt0dmJ2ZjErWlFWMksxdEZmYk1aY1JYbHF5WFlMb1laRlFkejNaT1pjSVRwM1E0QjR2M2pMUzRYckRidXVYVldWbVhMakNHbDlXTkRlWE1KS2hBM1l1K3VjckFxaVBBUEFuemhseVhPYlVNUFVWN1JLUVFRUmJ4aDc5dXJNQ1MralJkaDUxTGNDcUhrUzlnQys3TUVRQVd6YS9FcHV3V3BXY1o3c0prdHdFeVlzNzJaTVRJUzE1V3dVcjNQcVh4TW05MnNwcHphb0dyWnZKQUpFcVVWcy9hdjlZQ1haY0dlUFJqTGNISnh6Y1E2c0VEM0hxZklSU3puOHppOHhsQmFmM0J5T005Ky9tR1hycXdjTDh4UlNwbFlmdlo4eDUxeTFaek50UmUzV0JzS283dUU1dk0rWDZRKzFLcjRjeXFPcXVJMTB5SGorMU1NSjc3bU9IdWJqZXd1b3FsdldaVlIrN1BnZ0xOcEcrM2pxL0psQk5DcXRSMERhMnF0MHZ6VUQxU0F0TzZEd2VydjBoQUt5dEp2Qy9kU3F3ZXhTcEdKcktaL21JL3VkamhNK292MVEwSGI4VlpkT2I0djFoUWJBZ3dZV2RtUFdPTUx3RlhUbEh6cTkzRHlxa2pPMHE3MTZyVXprMHZqUUhsWDN1Q0Y0bDVXRHl4Y0tneGRQSCtWTHJWVUh2OTNlSUlWaFYzcXZ6Q3RRSE9tR3ZTclA2NG8xQ3VHckV2eGlKZ2xuT25ZVi9NdzlDeENDdmg4QTVsRDRvV3cyNTkwQzZ0cTU3d3MxVzFMdEY2NzNGRDBpenFBMit0eE9BMGNkWE52YVVvcUZqMzNLTnI5dEQwMHczZUJrd2ZSaFp1NmE2eG9YVlp6ZnZHMVhSNGp0eDEzMWxoU05kTDNGV1E2aHYvc2FNZGpibDQzbnZIR2pZaURCb1dvUUt4N0ZVZ1p3b3FLT08ycnJPV2RnZUZZU0I3TTV6OFRsSVlyYmQ1WVR0UVQvQUdXRlc3dFhhMlBlVkJvbGQybFgxejhTb2FsM090bGZ1TWJtQ3FQUmlDS3FCRTJXRWR5a2ZNRzhTMXkzZzArZnN6RG8xa05EOHVpRWhzMGRBL0VFd2FBeFFQbXg1aG5KVFpOQkdlYzJnaGtGSFYycno2RnZhSUVYR0tyUy93Qzd4Y2tBdmdEWjkydlNDRGpLYnZrcnh6M0NaazRGNExKbzVlY2NrZGFyMXNocCttNzlZOTl3R3JVYTNIUHNSVmdEWWxTNmRZMEdkREkzc3hFMnpwWThtbTd6MTNNM05lY25NS3BGdExuTG54OTJJbDB6SytieEYzVnNvYXl2azhrdGxRL1VxcFc1blFPbTcvMjRzd3c5MjRFTjFsbVozMW1Jb1FwYWJnWVdNS2R0QjlybC93QUtLTHlxK051Y1F0WnhEcGxRVloxdnJCUXBmNG5CQzhrSDZkRmRkNWhjV3hrNFQxd3ozZ2FhUFhDTCtWOVphZ0xlTHU4c2R4RkRWdFl2Ylh2Y01VQXk2RDFmazdkSWdnaHdRQVpldW1PV1V1cFl4b29jeGNJTG51N2RhOHJGY3R3QXBibC9EbkxHZW9UcllZdnYxWXFuRTBieUl2OEFiYkRyRUV5eXpaQUNMOFZoM2xKZ1hCdGdhNjFtQVdGdTBZc1AyOVZoWHFvNm1VRjhkWmxLM0FWcXIrTlJOd21hVTVVL3E0d0ZXVnZDQ1g3VzgzQ0lBSVlidWpXZlByQmZmR0czV0ZlblBwRnhCMkpwUlpFd3RtSFNZR0NFUDZ1ZmlIUG5wR01kTFVlb2xuZzY5SUZPalZ2N016QUtIcDFqeUZQU2FuQTFWelBUWkZNQWh1c0prL25NVG82c2dmZHpCSTdvL2ZMVXpycXhXZ2VsL00xRjhrMzU1bW1hekJjMDVjV29iVTRlOE9nVG9CZFh0aWpHVlFaU3E0UE1XaG1NV2k3NjlZamhUU2hCdjFtVklaZHJ1RkdYSzJLNFA3dkhnVmJqVkwrQStTQlVWYnYwSjk0NEY1Yk5iZm92NEl4QTFjT1ZCZnRtNFRrRVFiUUUvd0NzMUc2Wk5ZSHhaQzRIVWJSVi9XaC9Nc05oRE9OTC9XUE1WTUxYTG9ERnZPZmFYQ1g3RFRzRHkxRlNBWlh2Q3ZTYUhoRGdBQjFyVE41OVlUYWtYQURWMXJOdlVBd1dtM0JWbGtUeTUxOHhuZGdoS0d5K1QxM016S3NXQ2V4dmRuSVRibnE0RWNkOW5ZcE12b0NXQVZBODNSejBGdlRFTENGcVc0Q3VBb2pDSnMvY1JrenR2QTU4Um00czEzbFFISnlTbDdGNU9aYkMyMTAvc1NpVmJ2SThiaEtXMUVIazYyd2xtM2RHZ2hmdWQ4U3QzWVRzQXBQS1l2bENGYlhRWi83QW9TLzBZL1Q2NWdaRmtZdkQxZ0hWWnI2RVdVUVVnYzZMNzNtRHdGc04xUnV1N01BR1RkbUR2M1pkdCtqdkRiRVhjM1JSL2FsWHRjaHR1cUsyOFgvMkEyeU1HdXE4RGJyY3BEVlcwQW96QjVOb1doTWpneGxodWRXQzJnbERIdkxrcXNSRG84bmJNVFpRMkxXclUrYlh0NnloUmR6dHYrY3NaRGFvdmRydVhEekNYbVFVNW9LVjYvbVVxZG42ODFFT1dyR1BMRDYxbnZVWlBOQ21uQ3Z0TmxIaGxzK292VkFzS2dtdHRFK0xIdmNKZFNvNUdaTWJ3K2ZlTVZ6cDdWNTZuNWdtRUU4QWZjMWZpRDNYMC91c29LcHZIZVdzSE1NUGxLTHQyOHptRkh6Y3ZZcTN2T28vZUFnRWV5NEpndVZHM0I5NExMTDBSaDhFQm9qOG9yRjhLdktVeWtWWlFkZXd6QjVyMUplam1vbDQwME43NnhvUXVSUm5sbXVqY3QyTzd3OUxtQzRqMGhSK0g0ajFIV3JvMDg0L3R4c0FBcjFWSDRKNXFVMmo2Z2R2VlhwTUo5enZTL3IxbDEvVkQwUUQxMzZ4M0YyMW02QjViVXBHSUE0QWozbzMyZ0dNQXZndkoxOCtJUkRVQnhZSmsrQy85aDFhdzJzRkM3Rm50SEZYS1FzUXN5TlBVcmNYQ0FXcG9yN01lc292SFJvTTVjOFZLRkRBMmxJT0hLblY4UnpNekl2a2ZQOEFYRlNva0FQUWlPRWhkOUYzYktDbDUyNVdQdkwyT2E5WCt4UFRtTGZMMmkvM1dEREhLZVJOeFMvWVhDTFg0bUNpcmNFNnVQRVY0Vzd4ZlNHRVM5emR2bkxvUlNpL1c5Yys4Um9BODlDM2ZucjNtR1FldHdUbXhIQ2JoYU51YjJmdVdBdENZeTZ0N2FjZy9NcWVaZHhiSi90VEx3Y1k3THgwNkdQNXVDK2xHanc5b0MzQXJ2S2t4d3R5bjM1OVdFeWtyYThxSDBwZlNJNFZjTnR2eTU3eEF0Y3o2aXQzYlo5TGwzZUdpbkFGRjFtclYzcUF3Z05rVlMyZWVld0VhR0dJTjFmdVczdjNoSktvdnUxZTNTTkhOSUw1RnZzRERjUXRxMnF0SGlpK3N6NHlaSFRGUUJTd1hZWjEvc09Hb0E2RWg4L3VLdmxBKzl1WHIvc1pXM29lNFBqTVF1SElKUW8wOTg4NGVXYktWeTFVZXI3b2RYZ08rRmk3L2YzaXFOajhnSjczNnpCZ3VMbGw4UkFTdU9QV0lQVmlVdXQ5WUxvMklzTGU2TFEzNjNCelowem5jYTNIZklLUFFiODFNQ1A4UlV1OWNoYVI1RjBmdkx5OURyY3UwL0pOak9kNnVLL3VLbWxIRlhRV01jeXhsM3QvbUFnREliYkFmWitJbjdTSTI1SjdaWHN4S0FaRE5iTHp6aHp2RTBINlhTdHRucmoxVkZQd0VoenBLemtFT3hHR0ZMRHFJcjRkd1dBQzIrbTFCZmJVNXpnTHdIK0pRdUJSaTFvWGZWdFQyOHh6MWFQT1hIeTM1SWxUZ1QwUkZPcng1ekIwaURzV0k3cXc5Ymdyd1VSZE4yOTJoM2hCWWdhY2FYNy9BR2dxRFNwY0VGVWR3dC9XcWhpOU1VQ3h6K1F3OHhGQUFEZzBlZUdzOTR5MlVFSldJWmx3T0Jsb0lNOTdQcEF3dnM3bGk5V05NWExFdi9zd29ZeXJ2ekd2U3IyaHkvbUNsVGFjOHdtOEx0cUZzcTRDS1Z3UmNRVlFYc3RmeWt0TERMVFVhcUtYek4xV3E2LzF4aWhCNDFFQ3diNnpwOTJJNmV2bU01SEk4WkgzeE1heGthQW9JQk5FcFI3Yi9Nb0E4RjlMM0V0aE9WYXdmeE1Tc2dMakRPWXlTaVoyYkZmRlgwbENNQU43SVY2QjZYTXhYT3d0TWVoejNJWkRnSGhZcStyMjd4TUZUdzVHYUdONnQ2eTFaRVpFRFhrYVljZ2RiUUh4VG4ybS9XaGRkVHZNSXdaY0NDL1Rjb1J1a284MWQrYnZ2R1p3b0huRTBiZGE4VXYyaUxBTHFGTHZIVVdydThibGdCdGQybEVET2VlY3dpQ25tZ1NyNjBMN3pOUkxLQ3NtVE9WajM5WTFtVEtwbGtYaXI2UVdDQlpvSE9kaEs2Z285bHppbXVNbVY2UnR1cXdHTFEwalRkbGY3RUM3N2tzcHF3amdyRlBIZVdra0tVcVd3aXNaWlh1RzBRSGRYVjR2N01aY3RCNFJSUGNtZXZtWjd3NnF5K0kzQUJRT2pmdno1bEhMdUlsWjZmbURoWWNVWHpGV1J2dktUUHNDWVhqL0FHTDJkZWtGYW93dlJoZnlScFk1cjhDZThJNWpPbkttaHZyWFhwS2RTVVFMdjhsUFVscTdMcXN1WVh6bTN6TjNKODdCNk50WHhjVXVRMUpUUjhteGJ0R3BMNGNGZjdXZG1HMU5FTDZvbjh4eW02QXVRbzk3UDZwZ09KYU95aGZOYjhSc1dnQU9Qc0xGK0lyQkNYQlpSemFVdStTWWZDNVppMHNuQlJhLzVDam9RTExHV3RtTTh2WG1VcFFJY0E1SEtvVWQzYUdLRmlYQzdDZEN2V3I1aVRBYkYySEwvZEpZb25JWXpML0ZjSHVmUHJIYXA4QlJvcDZqNW1hOEJ5M2lZTXdPTGw1eEdHSVNndTQyUTBHRlRKR0hTU2l1WWxIQWRaUUY2ajNWRE5IQy9jbU9HckI0aDJERDMvMlVGaGg2eERvVytNUlZreldKWnB5SW5QeG5yS2wyRmpyaGY3dEVrN0cvTWFMcXhTWlVYZXVkcWxsb2xONWY0WnpPS2NsdmhqNGxjbFZIQVB0WW1ONnpQU1c1OEw2NGdrd1M2NmdVRGcxZlIzbTVuVEZ0bXp2bTF2czd5aVBNQVpXcHZ6b0hLbmlOZGFOMmxacnNLSFZ1R2dGb2NJRXoxQ3U5elBTWFgvb09mTEtOQ2dkMG42UFZnQm9pdkp3VXZmaDlKdXBZRjNWYjN5OTVrWVpQTFlYYjNBUGU0ZVlGSkZtbGc5K0lBSHhDdHN5UGRwMDRqenl3QTJGcjVwb1BQY0oxNmdSQXk3cDVCY1FPVUlkUUtYdWZ2Y3drYmlDdW02NU92UHRIUTJyWkhiKy9tSGkrTE84c0RHS09jWnM5WTNZMkJTMXZYUFBuckNPQUd1QXNiU3NQRFYrMFVJZzF0QTJqRzdTRVVwUHRHL2pxNWlvWWhTdUhyMWwzV2FZR0RGUlcwMVQvQUZ4eHkvZVhtbHN2Mzd4eWRZWUtLajBYazg0aU9xZGVkd3NFZ281QStya2lCUVFBMTJCOVN3dnZVellvd1dnUFFmZmx3N3NxTkpTdzZVSHpBNTVNQ3REOVY5d0pDUkdWdS9Rb2VEeG1jUlVKNi8zdkhibHFLYldXL0k5V0ZaRjlhNVYxSzQrMFN3OEFyWXBvNzRJMERaTGtIRjVMSGtZT2cwc3B6VGJQRlB2TDBLUVJlSEt2bDh4S2dWK2RsZ1ZzckE3czFWeE1CZldMVFptcXNjcHhZeFl3QWFwdW83QmRDM2RvMCttdjdNSVF0SVVXcXc4dm5FdEJWYjM0U3I4K3VZV05wTFlGb09ldVNXeHdaSGZTV3VLUFNwdk1FekZGR3p2KytZcXRIYng5N2l1Nm1YUllDV0M1dTN2R2JTd3RYekhBS3RoYUdGRG53UW5DREs5OFJ4cXE4eHdibmlacXZKQ2p4bmxtWnBUYVMwUnpDYkVEc3MzQXNYZzNPT01BQXdIL0FHT21XRlBTOS9DMllSNVZwYUcveWZNZGhyTEZzQTdYWStPMGR4QXVISXV2SmVIVjdFSE1rNE9kRHdCWGw5V1c5dVZBOHI5RW9kNll0MkN1MlNjZUxGanNjSGZTajMyOTQ5QUZWN0ZGZGNPWjFVQks1QU4rNHlrek8wYzdWNWhrYzB1cDM4a3FlNkMrd2ZiWGVGT2piYjVjb1BzREs0NVFxTXBXY1lKOVdPVmtzZWg5NkI1Q05tU0JaTkRncHcrUXVEQXN2UXRBRCtabk5oeGJLejhkVG41bGpVRitCYUxPdmZ4MHVPMHZ4ekJhMDFnWFc4NHlTd3BYVmx2dVkvTXBWRjBGRjJicnJXZk1NWGV0L3dCNzh5d0JlaURiU0JTM1l4aTNWeEdERGIwVUQ4bS9FTmYzOWN6L0FCTHo5NTJRVjc4U3hibHJwa1k0WGhhemZuN3hwdThUeStXNDlVdnBNRlBVUHZDcFVST3ZhQndKL3Ara3lFU0NUWS9iYUw1alhhVUJkRWJ4ZzcxQ2IybHNJSThGdDJxQ3pxcFZ1UUxPRUhpNWFNRXF2Q0g5OEJ4Zmd4UWl1d3ZLTjAzeVk4eWlrV0tzd2hsOFhYV0lCYU5WczNkZW52TGpGWnNsRDNDQUp3cjhGaThqbGhXRkxVTVdQdmlKU3pXaUxXam5LeGZWSnJVV2J0bS9FcU0zR0x4VlBVYkJOdnZEUGJTQ0NYVkZyVGhPM2VDV29SV2xCWnlyVmcxaGlTYUdCUVVOZGQ1M2NiUUtrdjFUdkNpNW5ua05reTFhRmJFUDcxaFJxWFdTZDV0S3k2dmRMdUh4VjFHYUVlUnZTOW8vTThSTFloZFcwNzM4eW9LdDBldTVZcVdBTTdncXYxUlFGYnZFQU5DdHl4VXE3ckZ2dktLdWt3WldqMm9QdW5YQ0lpNzd4bzNvZFRjYXNVNlJSYW9iS2l4YjVmWm1Eb2JlNExYZ1ZsemJ1RE01TnBSb3IzWGZwY1ZBSUpVSE4yRXc0cGd3WjBRcFNsT2g2bk1JWUJtYzBYVDVjWjZ4V0ZSV1pVS3ZJUG1FUWdCcFltejUrSVpJSWx0MWVmdXRpLzNDQTFENFo2L0VkdzBobGdMNUkrOFF3QlZIcWJUQnpTUmdsZjBlOHh1STRqRmI3U3E0TG1rbzU0Vk4zcVVJd0N0TjBKeW1MeU5VZ3dRQm9BUEN6VjArR25wTGloVlJHcDlwSFpPc05sa1ZOazcvQUF5K1JScXoxeDdjUDh3MWVKZXlrQkx6VFZvN1RoekVyUFVMWWRHYkdHVjVzeGNkY2hzS2R1aE5Md25ZNlI5bnA1eHVFSlEraUhNS1VDQUlDcnE4S01EYVhTd2FSOXR6cGJ6aUo5dk1LNmZFSEk1TzBwZVRabk1PaHo0bmx1dW1vNjV1cmpWVlpmZWNscGZ4bXZ3YUc2M0NtTGZ2TjJlNjExYWxFTHRndllmeHFYQnNnVG02UDFIMmhXcUMzT2xCNy9QTTB4UEFxZ1ZkbGU2WVZFc0x5Tnl6Tit6RnZiM0FFTDd2bUdXSzBITmFmalhpUHJDaTdBMUcvVXJyZnJMQVJxSFJ5QXg1U0kxQ3pMWlU2cktmVlNXa21RQjJVOUYxNnl1d2NzR1ZyaDB0WmZEbzJQVmQrSVZCU1ZSbE00NitZKzRwUnNxdVhUNUs2WE1MTjJOR2JPdkQxMUhUc2gzVGFlYldJandNcm9wTGR5RldndjFFdThRL0JxT1hzL2VlQ0RtQzVVT3pueExRTkdvOGh4QzJMN3pBRFlhNHYvWUFyRkJtanJMa3RGL0dveFVpeTczRVZBVjBnRkZvcmhsSGxlV3lmbVU0aTlGekxTeUJ2cHVYVmdYYSt6OEloc1ZTbVBDQUdtM2JiZVlPd1pQSnI5UzNGVkM4b1N2N0xIdDU2TUM1M3g5c1Rsd1pNZ1I4RHk3UG1FWTVrSUEyVnFxRkhHMmRNVUhBQnRhUjdYZm5QV1dSQU5lSWZLMFI2aWpOcFBsYUYyNnA1VnZTTUxRQ1BSVXVBOVNHM3lmSTdtWWc1SzYzYTEvY3k0V0dsVzlHTzlIeEVxbVRGeFpzOU1YZit3Q0xCemFVdFBXWGFISVcrVnF6NDk0QTJMWnlXUU9mSG5FWU5ZcVpLVHB3NEltNHR5WndQSDl6T1ZveEZ1RHJZUDBlc0hqSUJEa3hmcVY2M0dPcmh3OWVaY00rbGRRSldyR0RtanpHQ2RFQVdqa3Zrc2VGZWJMclZZZEMxMmI3T0VvUURKR0hSYUo0T0YxZFBNZlM0NU8xS0ZYaTJ4dGQ3cnhMaVV1eHZmc1o3akZxWDdUQlhlRHg3NW1maUp5VmV2N3hHd28zMVpmYlAvWUJhdDF6WFA4QWUwYWdnV2NNVy9xOUpZbW1xM2x4KzRKQXVEMFV6alhMdjBqU2JWeGZVUE5oRUlKM1ZOdWV0YVBlQkdrQVhsUk8zRDVYMWpSZ0NFNWRCMlFPOE1rRnBDSDNEZGQ0bW9Dc3NRT0RGVXQ2YzNLNGw3YXpUL2ZFTVRRRGhSVSsxUFlqOUlFWDFFL3ZNWHFveFdGRTA0S1BodU5QNTBUaEtEMXFyN1EyMDRVTkdzOGovZHhXWjZoYWVpdm05UlFqa2cyTWkvS3QwNExZbzdOWFozaDJDcTdlSlc4eWRDektabzZUNlpIaG13bmM1MzF5NWdJL09XRXJ1Smx5WFdZUEllcFgvZXNlbVJlNjNFb1RyOC9WRjVpVytlNkhTbnBGQlR0S0lkSnN0eW9hM0F5Y1ZEVEM3dGxobDlJTk5nN3huV1U3dVg4eXFVSnA2UlpUZmFBTlZiVjVxVkU1dCt4bEQ0ZllpRXNEbTUxK1pTeWh1SlZaZmlaVVNDYkxhdXU5T1dOeUdDNmhyYzUzeDd3YVVCRThndWdMZit3azVRRzdHWTA3dExYYkdPQXkwYnkrU0hyYkxYbTJ1THNMMTQrOHhBS3NYbTRYZktmUHBOUlpJV0pRcDYyZS92RzFkdE9HWE80aXRPQUZ5T0ozY3dYU3hGNUJkWjVMdnlUVEJXV0QxUGNycnpNRGhrSmVRRFhYbHY4QU1aU0E1VEpRK0gxbVhWS25aL2lHZTZ1SS9LSjdqSXgzRzI1Vy91U2NOOFZ0T3c2UnU2N0RBSFNPbnBHbkp5ZGp5TEU0WkxWbFZVN1dqMUs3UXpwYVdFWlNHcUVweWk4RVFVeDNNWGw3ZVZ1VTNtNVRKQXE3Sm5KMHZwMTEwamwxbFpzYzJ1bVcyRGdUZFU3SUV4eVB6L2VzWHFGOFMrZnZCLzdjTmIrWlJXUlcyOVJlblc1dDZaekFKNmRQbi9lN0RJOGZuUHZCeUhRbVN3RG4renpFZURhd1VsdlhYSXhRYmJCTHBLSGZkUVFZTFdXMmZ5ZXNhOXFnYnRZNDc3SHZMUUtsM2lYVjBTeSswRzZ0eWhtd0x3dURZdHlQRUZxWWhoeGxIVkRmTitJT2phVjJKWnZuVjk1ZmZPU0dtWFgwOFhGanF6dHlLSHVNYzdDWUZJcDRWZlo4eXpMTWpsY2FQeEFTRTRpYXF1Mm9Fbkd6cStGS1h5MXlWdURPRGtVV3lyVjhObmc3T2hVQlltVmR1UE55eUtZV2dEdFJzNlE2SXlieks3THlPSzRiNEpSNHNuTDFUTitxNzNHQnJxNis3bjd4T0hPWXVaZHNPWnRoM0E1Z0NLemRtZnpOQWFsaFV4ZVltSXlKeWJsV01hU0xtNHFmS3FsZlMxSVBTNFpmeWltRjljeFF1MTRZTnNPMElMRmhmVm41VGdOd2JRSjlvKzB6dTQxT3RXUW5JWUVIT1FGOVdac21WWFZFZklCN3l5NkhHV3RqM3FGbG1vWUNWK2ZkMWplc1JXWk1GYzliZU16RFJEekFOZ3ZodDhrZUlwQnJhdUh6bjJnbXdncFIwMjY0M3VLZ01Gd1VLTFU2Q2RkYk9rcGpGR1BQL1lZNXhOODMraDcxQ0hTNUdoVjREMTY5eUsyS3VUdTl2ek02eGNMNWJQYjFCbDBxaEtyaUIxMlV2WTdQQm9zOWJWNVRDbmd0S3gwbUlsa2Zlci9EdUwreTJwcWFxcHpac0RaVndrTFlzQ0ZtUWVsTUk1eDZ5MVFNRXhkMzl3eEQ2U0p6cFFiN0p0eWU4YllLWWJzdlVySzdWaEd3cHdKUW92allYZFY1Z2hGZGpWTXpUanpLOGtqUWdTa1J3anlNc2lqQnJEMUdTeXR3dHBUTVhjelF3TVg4d2dCd0hydWFWKzgxdHZMRjY1Y0hTRTBORjBGdk1OZ3M0N0RyZWM3dnBjcGJNbVR3QzljRi9TV1cwcmJOQVR2d3pIRU5tMFlLTDFpOTRwVkdqaWh0MlZkdkwwbGhHY2Ztd0JuTjRudkJmWFRMZGtiNzNUMUdNbnlqYTJBdGVBaGQ1cnJVWkt5V0ZnMkt0WWllS2Njd1VSdGNvVWNPdzU3NVlMVmJHbGQxODRZYVdrR1ZLc05kV3g5UUpSVER0b29MQnBhaGFIc21ZL1NySzA1S3ZmVU91NGZxSmFqTTRITDNqZVZpcXNiT2xadncvd0N3cHdoT2lHTnI2TTVlbUpjak5FOFBDVzExMjZFVUl0RG0xMGRYbFhLOHkxNWFqWllIa2RpbmNkU3UyM1EyL2J6L0FOamFSM0YraDFadllaaUZuUSs3TW1VZWNYbUN5Njh3SzIxbjNpdHcyQjg4d2lLenkyeElpSGRiNW0vS2RJelkrTnd1TFh3OHg1a1U0WVQ3RzJ4eVdpWmpScmF3YUpZTDZkNDFBNjBFdUVIQzNQRndZVUk0V1dQeEVKVFVicEMvQkppT2NqclhxalM0V25aOWdWaUFnY1E0TDdBZnQzbTNDeHRZTHJ4dXVaYTlOQTd1WDlQZXBwMWRxaTA1NytxeXFsMm5RTzNsNS9VSnliUm56ZnZMQm83VjVRUGNMK1NWR0NXeXVnL1B1Z2FkSXRhdkYrMHRlM3BPd1dPZjVsQVgzUTdZQ0Y4M1R6RURMNWtvTjI5YWdzVGxTdkg5OXBtOXNhZUdYekM4U3F1T2MwemxzVmFwYXZkU0h1NWlDS3hjdUVMcnkxdm4zaURXb0t4WUFlRXg2d0JUY1RnQXY4NGhFTjBtY0lIOTk2cU1SS1RRdThYTHB4dUxWblR0QnpJSElWOE1BcXA1QkVjd0hBVXVoTEVBMDVNSTAwbWt1YzIxdURVTlk2d3V6SE1CRmdPbDVscHEzV0xmbVZ5Rmp6MWlMSll0akREVG0yL1RNRTJDS0YyTkZ1QUNnenFieUZEa21kODZQZUFEUVFWVk9QZjFnNFQyNFRUSG81MjdsMWtXN0d4dWMzYnJadVZrVndISTBkcmI5YmkwY2dsYUJ0NXMrTGpkZHl5REpyVjRvZXZOd1FCVUVBd1BkOXgzdVVMOElxRm53NWhNZ1Z5M2tYUjZaOW9HakkxVTBEemtPczJRR21BblBTZEd4TjRmTXNFc21FRndTM0RiaGQ1Slh6c0xXRjhWbzZyUGJjV0loYmRjNHEydldJUUdoZ25aYnVvd1czTGF4bEw0eVh5eHdCQ3BRelZ2di9YTVZFYjQyL0RpKytZclEyME9uWHY5NEZBS1RTQnQwZ3pkem1ibUxNZEtKWmVLSmdRRkh6TXdML01kQzk0cm1PbmdITXlIbDZ2V1dBM25nNWdEaXVOWDNsQ3ZrNndLVmFkZXNYSzZwellpdzhMQitFVlFhY2VzenhLQkVPcnI1cURPaFVZNkFiUEdzNU1lMG9mTEFKQlJWNXdQcnBXVXRCa3RvaXJlbjN4S0tSeVYzVmhuKy9jYWdXQjFzcm54VWNRMnRyMXdNcXM1R3FZQ3krVjd0UnpJc0lPeTEvMUhQR25qMkZnZ05rRGprK1lhMkNFMGR3dmZIdlV6bE5YWHJWRC9BRC8yWUtMRElwNS9mM2dWSW9Oa0sxMVdIb2o2cEZjc1F5YUh6cjFoVU1Jd3dMOXdOK2lVdGFmZ2RlMnZTT1F5NG9MQVQrRndheVJJRzdiSHI3QWxFTkhTeWhEait6QWpVcWx3cGVlNSs1WTVoYW9JWTdpKzB4S1VBdllQM25YNkgySThoK1l5MVJlN2ppRU9JaEhETDdzWk1WbEFrMUZJbEk5R1hpRGNzS3JMZTZtSjZheDZzV2M3akhoU0xkOHZZMzZTcDBZVlhtdFJTc0FNWTVsZXJyVTZIUHpTZDFnRUpmWlRkdDVCejE5b0loQUFEV0llcXJSMzY4Ukk5czRVU1Y5aEJjcmNheFlBWFpVWGpoN3ltU2dYYTBMN0tHY3ZtTG9EcU1COXl2VzRtSmlCYUtDN21hZFh0R2x0MmdGZXFVbjE5MXRNNkhTeVlmTGlEa2RNbU83L0FKM2hud1NHTExFUFJDK3lzWFRCWEN6Zk9ndHZkc3RkWmUzdXJBTlB1ajFqTFl1OTUzdDc5WHR1VTZnbS9MZlJ2NWVZM0Z1eTUzYnU1MWdObER6bmkrK25tT0ViWXhNVTAvZWJCWlpEWWNWN1Jkek4xcVdxNXBreHNybXJYUXV6Wm90SHZlVDFncEcvb0YxT29la1FqYkpGWU9ZdHNYZXBVVjBHNDZNNnJLOTVaNVFTRGRQTzJNcExvNDZ4WUxqOEpRTUoxYmxMRnRiTDV6SzlVcnZlaFIzRlhjcEh2dEM2NzFNaVl4dkpDSm9vR2pJUGlDNnl1d2NLaXZkZm1BV1VNNWk3dFhtdmE1Zk9nQTBLaTJmREFpTGxCemRyNlJLOUZzNE1mM3ZDc2NsVTV0Yi9BTTcvQURIR0tvMjdUYitva3RJcWFyc2ZPcGZqTHNOS1VZOWV0ZmVBcHE4cXRvRnZPUmlDTjJMWFZmNlNwM3JLbThsL0VVaTVKeUtudm4xOTVmR1pnNVpQQmF1QkxDeXhIaWQwTitEcy9QdkVxWHczMWY3OTJNWEtOeEYzMzErMUxpMEFTdmtydWNTME5RblNIMXkzM0k4QjJDT1ZLRmRkSHRQSHZsWUxLQnRqYVYvRVZ2USswVGk4eFRJS1krZkZ5d1E5VlBHcTBuWnU0eElFYmRvV1ZrSjB2QXlMUmNIT2RReU5vZXNKZGRqZGRNVEM3ZlFqWFJRQ3cwbGJMdDZNWHRoSVZzWVYxd1hFdHQ4K2NCUHNlWlZaVmNGMVErKy9LNXhMMVdnbFZhcjRHMlZJWGhIUmcxM3ZYckswNHhyNHFPdm9sU3QyQnZ3YjUxeS9NdE9TYjBIZ2N1YjhITTI0Y1U2OWd1a3QzaHp6R1VYWXc0TDZPZU41M0VPZVpDMmpCZkwxNzNMNFUzUzhHYi9zd0tzU3Vvb1BLb3JXM3ZJV3VWcTBvRzFvcWtiY1MyV2pXY0xCbld4TDJoQXJpVFNab0w1VVBVUk9ZVjNibVZuNTJjOVlvZFRWSm5pamtmdTFlNFlJYUthZGw2L3VaWFk3c3BaTm1oMjVKbnBrYXJEWFhESFJ3OVlsN1R1d3Jieisrc3RBWGF1QU9ENEh5UVlDMUlVcmt6LzIvb2IxTkxHMk5GMXB6bm1MaWlFYkxyckwxamFiNWpsM0cxRzMvWUl1cmVKV0xYV1lEQVo5bzNBMlgxNG4vOWs9J1xuICAgIH0sIHtcbiAgICAgICAgaWQ6IDMsXG4gICAgICAgIG5hbWU6ICdBZGFtIEJyYWRsZXlzb24nLFxuICAgICAgICB0aXRsZTogJ1JhbmRvbSBVc2VyJyxcbiAgICAgICAgZW1haWw6ICdyZW5hdWQuZHVidWlzQGRlY3J5cHRhZ2UubmV0JyxcbiAgICAgICAgcGhvbmU6ICcrOTcxICgwKTUgNTcgMDggMDggODknLFxuICAgICAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICAgIH0sIHtcbiAgICAgICAgaWQ6IDQsXG4gICAgICAgIG5hbWU6ICdCZW4gU3BhcnJvdycsXG4gICAgICAgIHRpdGxlOiAnUGlyYXRlJyxcbiAgICAgICAgZW1haWw6ICdyLmR1YnVpc0BmcmVlLmZyJyxcbiAgICAgICAgcGhvbmU6ICcrOTcxICgwKTUgNTcgMDggMDggODknLFxuICAgICAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ5MTk5NTM5ODEzNTc2NzA0MC9pZTJaX1Y2ZS5qcGVnJ1xuICAgIH0sIHtcbiAgICAgICAgaWQ6IDUsXG4gICAgICAgIG5hbWU6ICdNaWtlIEhhcnJpbmd0b24nLFxuICAgICAgICB0aXRsZTogJ0Nvb2wgRHVkZScsXG4gICAgICAgIGVtYWlsOiAnem9lLmdvdXJkb25Ab2dnci5pbycsXG4gICAgICAgIHBob25lOiAnKzk3MSAoMCk1IDU3IDA4IDA4IDg5JyxcbiAgICAgICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICAgIH1dO1xuXG4gICAgLy9UT0RPIHJlbW92ZVxuICAgIGZha2VEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgZmFrZURhdGEucHVzaChhbmd1bGFyLmNvcHkoZWxlbWVudCkpXG4gICAgfSk7XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2NyZXcuY29udHJvbGxlcnMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gWydjcmV3LnNlcnZpY2VzJywnY3Jldy5jb250cm9sbGVycycsJ2NyZXcucm91dGVzJ107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmNyZXcnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjcmV3LnJvdXRlcycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5jb25maWcoWydDT05GSUcnLCckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBjb25maWdGbl0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnRm4oQ09ORklHLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnb2dnci50YWIuY3JldycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JldycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ291dC1vZi10YWJzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9jcmV3L2NyZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2NyZXcuc2VydmljZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnZGFzaGJvYXJkLmNvbnRyb2xsZXJzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXHQuY29udHJvbGxlcignRGFzaEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG4gICAgICAgICRzY29wZS5kb1JlZnJlc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5pdGVtcy5wdXNoKE1hdGgucmFuZG9tKCkpXG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9uZXctaXRlbXMnKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKG5ld0l0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3Njcm9sbC5yZWZyZXNoQ29tcGxldGUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9KVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gWydkYXNoYm9hcmQuc2VydmljZXMnLCdkYXNoYm9hcmQuY29udHJvbGxlcnMnLCdkYXNoYm9hcmQucm91dGVzJ107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLmRhc2hib2FyZCcsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG4gICAgYW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZC5yb3V0ZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29uZmlnKFsnQ09ORklHJywnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgY29uZmlnRm5dKTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0ZuKENPTkZJRywgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ29nZ3IudGFiLmRhc2hib2FyZCcsIHtcbiAgICAgICAgICAgIHVybDogJy9kYXNoYm9hcmQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLWRhc2hib2FyZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGFzaEN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2Rhc2hib2FyZC5zZXJ2aWNlcycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdmaWxlcy5jb250cm9sbGVycycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbJ2ZpbGVzLnNlcnZpY2VzJywnZmlsZXMuY29udHJvbGxlcnMnLCdmaWxlcy5yb3V0ZXMnXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAuZmlsZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdmaWxlcy5yb3V0ZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29uZmlnKFsnQ09ORklHJywnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgY29uZmlnRm5dKTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0ZuKENPTkZJRywgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ29nZ3IudGFiLmZpbGVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9maWxlcycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ291dC1vZi10YWJzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9maWxlcy9maWxlcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2ZpbGVzLnNlcnZpY2VzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdsb2dpbi5jb250cm9sbGVycycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbJyRzY29wZScsJyRzdGF0ZScsJyR0aW1lb3V0JywnT0RCJywgTG9naW5DdHJsXSlcblxuICAgIGZ1bmN0aW9uIExvZ2luQ3RybCgkc2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIE9EQikge1xuXG4gICAgICAgIHZhciB1c2VyID17XG4gICAgICAgICAgICBlbWFpbDoncmVuYXVkLmR1YnVpc0BkZWNyeXB0YWdlLm5ldCcsXG4gICAgICAgICAgICBwYXNzd29yZDonJ1xuICAgICAgICB9O1xuICAgICAgICBzaGFrZVJlc2V0KCk7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuc2lnbkluID0gZnVuY3Rpb24oKSB7T0RCLnVzZXIuY29ubmVjdCgkc2NvcGUudXNlcikudGhlbihyZWRpcmVjdCxzaGFrZVJlc2V0KX07XG5cbiAgICAgICAgJHNjb3BlLnNpZ25VcCA9IGZ1bmN0aW9uKCkge09EQi51c2VyLnJlZ2lzdGVyKCRzY29wZS51c2VyKS50aGVuKHJlZGlyZWN0LHNoYWtlUmVzZXQpfTtcblxuICAgICAgICAvKiRzY29wZS5mYkxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBvcGVuRkIubG9naW4oXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWNlYm9vayBsb2dpbiBzdWNjZWVkZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnb2dnci50YWIuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnRmFjZWJvb2sgbG9naW4gZmFpbGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnZW1haWwscHVibGlzaF9hY3Rpb25zLHVzZXJfZnJpZW5kcydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTsqL1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlZGlyZWN0KCl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ29nZ3IudGFiLmRhc2hib2FyZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hha2VSZXNldCgpe1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hha2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IGFuZ3VsYXIuY29weSh1c2VyKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICB9LDUwMCk7XG4gICAgICAgICAgICAkc2NvcGUuc2hha2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbJ2xvZ2luLnNlcnZpY2VzJywnbG9naW4uY29udHJvbGxlcnMnLCdsb2dpbi5yb3V0ZXMnXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAubG9naW4nLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdsb2dpbi5yb3V0ZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29uZmlnKFsnQ09ORklHJywgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGNvbmZpZ0ZuXSk7XG5cbiAgICBmdW5jdGlvbiBjb25maWdGbihDT05GSUcsICRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuXG4gICAgICAgICAgICAuc3RhdGUoJ3N0YXJ0LnNpZ25pbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3NpZ25pblwiLFxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdzdGFydC5mb3Jnb3QnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9mb3Jnb3RcIixcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9sb2dpbi9mb3Jnb3QuaHRtbCdcbiAgICAgICAgICAgIH0pXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnbG9naW4uc2VydmljZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ21hcC5jb250cm9sbGVycycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5jb250cm9sbGVyKCdNYXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNMb2FkaW5nLCAkY29tcGlsZSkge1xuICAgICAgICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgICAgICAgICAgdmFyIG15TGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0My4wNzQ5MywgLTg5LjM4MTM4OCk7XG5cblxuICAgICAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgY2VudGVyOiBteUxhdGxuZyxcbiAgICAgICAgICAgICAgICB6b29tOiAxNixcbiAgICAgICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxuICAgICAgICAgICAgICAgIHN0eWxlOiBtYXBTdHlsZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSxcbiAgICAgICAgICAgICAgICBtYXBPcHRpb25zKTtcblxuICAgICAgICAgICAgbWFwLnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIHN0eWxlczogbWFwU3R5bGVzXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9NYXJrZXIgKyBpbmZvd2luZG93ICsgYW5ndWxhcmpzIGNvbXBpbGVkIG5nLWNsaWNrXG4gICAgICAgICAgICB2YXIgY29udGVudFN0cmluZyA9IFwiPGRpdj48YSBuZy1jbGljaz0nY2xpY2tUZXN0KCknPkNsaWNrIG1lITwvYT48L2Rpdj5cIjtcbiAgICAgICAgICAgIHZhciBjb21waWxlZCA9ICRjb21waWxlKGNvbnRlbnRTdHJpbmcpKCRzY29wZSk7XG5cbiAgICAgICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNvbXBpbGVkWzBdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBteUxhdGxuZyxcbiAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1VsdXJ1IChBeWVycyBSb2NrKSdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLm1hcCA9IG1hcDtcbiAgICAgICAgfTtcbiAgICAgICAgaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICRzY29wZS5jZW50ZXJPbk1lID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoISRzY29wZS5tYXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gJGlvbmljTG9hZGluZy5zaG93KHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnR2V0dGluZyBjdXJyZW50IGxvY2F0aW9uLi4uJyxcbiAgICAgICAgICAgICAgICBzaG93QmFja2Ryb3A6IGZhbHNlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3MpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubWFwLnNldENlbnRlcihuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvcy5jb29yZHMubGF0aXR1ZGUsIHBvcy5jb29yZHMubG9uZ2l0dWRlKSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnVW5hYmxlIHRvIGdldCBsb2NhdGlvbjogJyArIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNsaWNrVGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYWxlcnQoJ0V4YW1wbGUgb2YgaW5mb3dpbmRvdyB3aXRoIG5nLWNsaWNrJylcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG5cbn0pKCk7XG5cbnZhciBtYXBTdHlsZXMgPSBbe1xuICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXG4gICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgXCJzdHlsZXJzXCI6IFt7XG4gICAgICAgIFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuICAgIH1dXG59LCB7XG4gICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcbiAgICBcInN0eWxlcnNcIjogW3tcbiAgICAgICAgXCJodWVcIjogMTQ5XG4gICAgfSwge1xuICAgICAgICBcInNhdHVyYXRpb25cIjogLTc4XG4gICAgfSwge1xuICAgICAgICBcImxpZ2h0bmVzc1wiOiAwXG4gICAgfV1cbn0sIHtcbiAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG4gICAgXCJzdHlsZXJzXCI6IFt7XG4gICAgICAgIFwiaHVlXCI6IC00NVxuICAgIH0sIHtcbiAgICAgICAgXCJzYXR1cmF0aW9uXCI6IC0yMFxuICAgIH0sIHtcbiAgICAgICAgXCJsaWdodG5lc3NcIjogMi44XG4gICAgfV1cbn0sIHtcbiAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG4gICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVsXCIsXG4gICAgXCJzdHlsZXJzXCI6IFt7XG4gICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgfV1cbn0sIHtcbiAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXG4gICAgXCJzdHlsZXJzXCI6IFt7XG4gICAgICAgIFwiaHVlXCI6IDE2M1xuICAgIH0sIHtcbiAgICAgICAgXCJzYXR1cmF0aW9uXCI6IC0yNlxuICAgIH0sIHtcbiAgICAgICAgXCJsaWdodG5lc3NcIjogLTEuMVxuICAgIH1dXG59LCB7XG4gICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcbiAgICBcInN0eWxlcnNcIjogW3tcbiAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICB9XVxufSwge1xuICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgIFwic3R5bGVyc1wiOiBbe1xuICAgICAgICBcImh1ZVwiOiAzXG4gICAgfSwge1xuICAgICAgICBcInNhdHVyYXRpb25cIjogLTI0LjI0XG4gICAgfSwge1xuICAgICAgICBcImxpZ2h0bmVzc1wiOiAtMTguNTdcbiAgICB9XVxufV07XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gWydtYXAuc2VydmljZXMnLCdtYXAuY29udHJvbGxlcnMnLCdtYXAucm91dGVzJ107XG4gICAgXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5tYXAnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICBcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdtYXAucm91dGVzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmNvbmZpZyhbJ0NPTkZJRycsJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGNvbmZpZ0ZuXSk7XG5cbiAgICBmdW5jdGlvbiBjb25maWdGbihDT05GSUcsICRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnb2dnci50YWIubWFwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9tYXAnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdvdXQtb2YtdGFicyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDT05GSUcucGF0aHMuc2NyZWVucyArICcvbWFwL21hcC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXBDdHJsJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgIH1cblxuXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ21hcC5zZXJ2aWNlcycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdwbGFubmluZy5jb250cm9sbGVycycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gWydwbGFubmluZy5zZXJ2aWNlcycsJ3BsYW5uaW5nLmNvbnRyb2xsZXJzJywncGxhbm5pbmcucm91dGVzJ107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnBsYW5uaW5nJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG5cblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwbGFubmluZy5yb3V0ZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29uZmlnKFsnQ09ORklHJywnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgY29uZmlnRm5dKTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0ZuKENPTkZJRywgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdvZ2dyLnRhYi5wbGFubmluZycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGxhbm5pbmcnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdvdXQtb2YtdGFicyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDT05GSUcucGF0aHMuc2NyZWVucyArICcvcGxhbm5pbmcvcGxhbm5pbmcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgfVxuXG5cblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgncGxhbm5pbmcuc2VydmljZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3B1bHNlLmNvbnRyb2xsZXJzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1B1bHNlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICAgICAgICRzY29wZS5kb1JlZnJlc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCdzY3JvbGwucmVmcmVzaENvbXBsZXRlJyk7XG5cbiAgICAgICAgfTtcbiAgICB9KVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbJ3B1bHNlLnNlcnZpY2VzJywncHVsc2UuY29udHJvbGxlcnMnLCdwdWxzZS5yb3V0ZXMnXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAucHVsc2UnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3B1bHNlLnJvdXRlcycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5jb25maWcoWydDT05GSUcnLCckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBjb25maWdGbl0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnRm4oQ09ORklHLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnb2dnci50YWIucHVsc2UnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3B1bHNlJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAndGFiLXB1bHNlJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9wdWxzZS9wdWxzZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQdWxzZUN0cmwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ3B1bHNlLnNlcnZpY2VzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ3JlbWluZGVyLmNvbnRyb2xsZXJzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFsncmVtaW5kZXIuc2VydmljZXMnLCdyZW1pbmRlci5jb250cm9sbGVycycsJ3JlbWluZGVyLnJvdXRlcyddO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC5yZW1pbmRlcicsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG4gICAgYW5ndWxhci5tb2R1bGUoJ3JlbWluZGVyLnJvdXRlcycsIG1vZHVsZURlcGVuZGVuY2llcylcblxuICAgIC5jb25maWcoWydDT05GSUcnLCckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBjb25maWdGbl0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnRm4oQ09ORklHLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnb2dnci50YWIucmVtaW5kZXInLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlbWluZGVyJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnb3V0LW9mLXRhYnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL3JlbWluZGVyL3JlbWluZGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdyZW1pbmRlci5zZXJ2aWNlcycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2V0dGluZ3MuY29udHJvbGxlcnMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29udHJvbGxlcignTGFuZ3VhZ2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNIaXN0b3J5KSB7XG4gICAgICAgICRzY29wZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJGlvbmljSGlzdG9yeS52aWV3SGlzdG9yeSgpKTtcbiAgICAgICAgICAgIC8vVE9ETyBub3Qgd29ya2luZ1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5nb0JhY2soKTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAuY29udHJvbGxlcignUHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ29udGFjdHMpIHtcbiAgICAgICAgJHNjb3BlLnByb2ZpbGUgPSB7fVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldExpc3QodXNlcikge1xuICAgICAgICAgICAgb3BlbkZCLmFwaSh7XG4gICAgICAgICAgICAgICAgcGF0aDogJy9tZS90YWdnYWJsZV9mcmllbmRzJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0ZhY2Vib29rIGVycm9yOiAnICsgZXJyb3IuZXJyb3JfZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBvcGVuRkIuYXBpKHtcbiAgICAgICAgICAgIHBhdGg6ICcvbWUnLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAnaWQsbmFtZSxlbWFpbCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlcilcbiAgICAgICAgICAgICAgICBnZXRMaXN0KHVzZXIpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9maWxlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdGYWNlYm9vayBlcnJvcjogJyArIGVycm9yLmVycm9yX2Rlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSlcblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdzZXR0aW5ncy5yb3V0ZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMpXG5cbiAgICAuY29uZmlnKFsnQ09ORklHJywnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgY29uZmlnRm5dKTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0ZuKENPTkZJRywgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ29nZ3IudGFiLmxhbmd1YWdlJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9sYW5ndWFnZScsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ291dC1vZi10YWJzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENPTkZJRy5wYXRocy5zY3JlZW5zICsgJy9zZXR0aW5ncy9sYW5ndWFnZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMYW5ndWFnZUN0cmwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvZ2dyLnRhYi5wcm9maWxlJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9wcm9maWxlJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnb3V0LW9mLXRhYnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL3NldHRpbmdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUN0cmwnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gW107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnc2V0dGluZ3Muc2VydmljZXMnLCBtb2R1bGVEZXBlbmRlbmNpZXMgKVxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgbW9kdWxlRGVwZW5kZW5jaWVzID0gWydzZXR0aW5ncy5zZXJ2aWNlcycsJ3NldHRpbmdzLmNvbnRyb2xsZXJzJywnc2V0dGluZ3Mucm91dGVzJ107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwLnNldHRpbmdzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ3Rhc2tzLmNvbnRyb2xsZXJzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuICAgIHZhciBtb2R1bGVEZXBlbmRlbmNpZXMgPSBbXTtcbiAgICBhbmd1bGFyLm1vZHVsZSgndGFza3Mucm91dGVzJywgbW9kdWxlRGVwZW5kZW5jaWVzKVxuXG4gICAgLmNvbmZpZyhbJ0NPTkZJRycsICckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBjb25maWdGbl0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlnRm4oQ09ORklHLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnb2dnci50YWIudGFza01hbmFnZXInLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3Rhc2tNYW5hZ2VyJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnb3V0LW9mLXRhYnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ09ORklHLnBhdGhzLnNjcmVlbnMgKyAnL3Rhc2tzL3Rhc2tzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFtdO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ3Rhc2tzLnNlcnZpY2VzJywgbW9kdWxlRGVwZW5kZW5jaWVzIClcblxuXG59KSgpOyIsIihmdW5jdGlvbigpe1xuXG4gICAgdmFyIG1vZHVsZURlcGVuZGVuY2llcyA9IFsndGFza3Muc2VydmljZXMnLCd0YXNrcy5jb250cm9sbGVycycsJ3Rhc2tzLnJvdXRlcyddO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2FwcC50YXNrcycsIG1vZHVsZURlcGVuZGVuY2llcyApXG5cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=