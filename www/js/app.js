(function() {

    var app = angular.module('oggr', ['ionic', 'oggr.controllers', 'oggr.services', 'oggr.directives'])

    app.run(function($ionicPlatform, $rootScope, UI) {

        $rootScope.UI = UI;

        var nbDigest = 0;

        $rootScope.$watch(function() {
          console.log('digest',++nbDigest);
        });

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
    })

    app.config(function($stateProvider, $urlRouterProvider) {

        openFB.init({
            appId: '855624561176943'
        });

        $stateProvider

            .state('start', {
                url: "/start",
                abstract: true,
                templateUrl: "templates/screen-start.html",
                controller: 'StartCtrl'
            })
            .state('start.signin', {
                url: "/signin",
                abstract: false,
                templateUrl: "templates/start/start-login.html"
            })
            .state('start.forgot', {
                url: "/forgot",
                abstract: false,
                templateUrl: "templates/start/start-forgot.html"
            })

        // setup abstracts states for the nested side-menu/tabs directive    
        .state('oggr', {
            url: "/o",
            abstract: true,
            templateUrl: "templates/screen-main.html"
        })


        .state('oggr.tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/screen-sub-tabs.html"
            })
            // Each tab has its own nav history stack:
            .state('oggr.tab.pulse', {
                url: '/pulse',
                views: {
                    'tab-pulse': {
                        templateUrl: 'templates/tabs/tab-pulse.html',
                        controller: 'PulseCtrl'
                    }
                }
            })

        .state('oggr.tab.calendar', {
            url: '/calendar',
            views: {
                'tab-calendar': {
                    templateUrl: 'templates/tabs/tab-calendar.html',
                    controller: 'CalendarCtrl'
                }
            }
        })

        .state('oggr.tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: 'templates/tabs/tab-dashboard.html',
                    controller: 'DashCtrl'
                }
            }
        })

        .state('oggr.tab.contacts', {
                url: '/contacts',
                views: {
                    'tab-contacts': {
                        templateUrl: 'templates/tabs/tab-contacts.html',
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('oggr.tab.contacts-detail', {
                url: '/contacts/:contactId',
                views: {
                    'tab-contacts': {
                        templateUrl: 'templates/tabs/tab-contacts-detail.html',
                        controller: 'ContactsDetailCtrl'
                    }
                }
            })

        .state('oggr.tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tabs/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('oggr.tab.chats-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tabs/tab-chats-detail.html',
                        controller: 'ChatsDetailCtrl'
                    }
                }
            })

        .state('oggr.tab.map', {
                url: '/map',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'templates/tabs-out/tab-out-map.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('oggr.tab.reminder', {
                url: '/reminder',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'templates/tabs-out/tab-out-reminder.html',
                    }
                }
            })
            .state('oggr.tab.planning', {
                url: '/planning',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'templates/tabs-out/tab-out-planning.html',
                    }
                }
            }).state('oggr.tab.crew', {
                url: '/crew',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'templates/tabs-out/tab-out-crew.html',
                    }
                }
            })


        .state('oggr.tab.files', {
            url: '/files',
            views: {
                'out-of-tabs': {
                    templateUrl: 'templates/tabs-out/tab-out-files.html',
                }
            }
        })

        .state('oggr.tab.taskManager', {
            url: '/taskManager',
            views: {
                'out-of-tabs': {
                    templateUrl: 'templates/tabs-out/tab-out-tasks.html',
                }
            }
        })

        $urlRouterProvider.otherwise('/start/signin');

        //Configuration States
        $stateProvider

            .state('oggr.tab.language', {
                url: '/language',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'templates/settings/settings-language.html',
                        controller: 'LanguageCtrl'
                    }
                }
            })
            .state('oggr.tab.profile', {
                url: '/profile',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'templates/settings/settings-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

    });

})();