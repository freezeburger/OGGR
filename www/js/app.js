(function() {

    var app = angular.module('oggr', ['ionic', 'oggr.controllers', 'oggr.services', 'oggr.directives'])

    app.run(function($ionicPlatform,$rootScope,UI) {

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
    })

    app.config(function($stateProvider, $urlRouterProvider) {

        openFB.init({appId: '855624561176943'});

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
            templateUrl: "templates/start-login.html"
        })
        .state('start.forgot', {
            url: "/forgot",
            abstract: false,
            templateUrl: "templates/start-forgot.html"
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
            templateUrl: "templates/tabs.html"
        })
        // Each tab has its own nav history stack:
        .state('oggr.tab.pulse', {
            url: '/pulse',
            views: {
                'tab-pulse': {
                    templateUrl: 'templates/tab-pulse.html',
                    controller: 'PulseCtrl'
                }
            }
        })

        .state('oggr.tab.calendar', {
            url: '/calendar',
            views: {
                'tab-calendar': {
                    templateUrl: 'templates/tab-calendar.html',
                    controller: 'CalendarCtrl'
                }
            }
        })

        .state('oggr.tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: 'templates/tab-dashboard.html',
                    controller: 'DashCtrl'
                }
            }
        })

        .state('oggr.tab.contacts', {
                url: '/contacts',
                views: {
                    'tab-contacts': {
                        templateUrl: 'templates/tab-contacts.html',
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('oggr.tab.contacts-detail', {
                url: '/contacts/:contactId',
                views: {
                    'tab-contacts': {
                        templateUrl: 'templates/tab-contacts-detail.html',
                        controller: 'ContactsDetailCtrl'
                    }
                }
            })

        .state('oggr.tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('oggr.tab.chats-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats-detail.html',
                        controller: 'ChatsDetailCtrl'
                    }
                }
            })

        ;

        $urlRouterProvider.otherwise('/start/signin');

        //Configuration States
        $stateProvider

        .state('oggr.tab.language', {
            url: '/language',
            views: {
                'out-of-tabs': {
                    templateUrl: 'templates/settings-language.html',
                    controller: 'LanguageCtrl'
                }
            }
        })
        .state('oggr.tab.profile', {
            url: '/profile',
            views: {
                'out-of-tabs': {
                    templateUrl: 'templates/settings-profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })

    });

})();