(function() {

    angular.module('app.routes', [])

    .config(['$stateProvider', '$urlRouterProvider', configFn]);

    function configFn($stateProvider, $urlRouterProvider) {

        // openFB.init({
        //     appId: '855624561176943'
        // });

        $stateProvider

            .state('start', {
                url: "/start",
                abstract: true,
                templateUrl: "app/layout/screen-start.html",
                controller: 'StartCtrl'
            })
            .state('start.signin', {
                url: "/signin",
                abstract: false,
                templateUrl: "app/layout/start/start-login.html"
            })
            .state('start.forgot', {
                url: "/forgot",
                abstract: false,
                templateUrl: "app/layout/start/start-forgot.html"
            })

        // setup abstracts states for the nested side-menu/tabs directive    
        .state('oggr', {
            url: "/o",
            abstract: true,
            templateUrl: "app/layout/screen-main.html"
        })


        .state('oggr.tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "app/layout/screen-sub-tabs.html"
            })
            // Each tab has its own nav history stack:
            .state('oggr.tab.pulse', {
                url: '/pulse',
                views: {
                    'tab-pulse': {
                        templateUrl: 'app/layout/tabs/tab-pulse.html',
                        controller: 'PulseCtrl'
                    }
                }
            })


        .state('oggr.tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: 'app/layout/tabs/tab-dashboard.html',
                    controller: 'DashCtrl'
                }
            }
        })

        .state('oggr.tab.contacts', {
                url: '/contacts',
                views: {
                    'tab-contacts': {
                        templateUrl: 'app/layout/tabs/tab-contacts.html',
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('oggr.tab.contacts-detail', {
                url: '/contacts/:contactId',
                views: {
                    'tab-contacts': {
                        templateUrl: 'app/layout/tabs/tab-contacts-detail.html',
                        controller: 'ContactsDetailCtrl'
                    }
                }
            })

        .state('oggr.tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'app/layout/tabs/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('oggr.tab.chats-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'app/layout/tabs/tab-chats-detail.html',
                        controller: 'ChatsDetailCtrl'
                    }
                }
            })

        .state('oggr.tab.map', {
                url: '/map',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-map.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('oggr.tab.reminder', {
                url: '/reminder',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-reminder.html',
                    }
                }
            })
            .state('oggr.tab.planning', {
                url: '/planning',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-planning.html',
                    }
                }
            }).state('oggr.tab.crew', {
                url: '/crew',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/tabs-out/tab-out-crew.html',
                    }
                }
            })


        .state('oggr.tab.files', {
            url: '/files',
            views: {
                'out-of-tabs': {
                    templateUrl: 'app/layout/tabs-out/tab-out-files.html',
                }
            }
        })

        .state('oggr.tab.taskManager', {
            url: '/taskManager',
            views: {
                'out-of-tabs': {
                    templateUrl: 'app/layout/tabs-out/tab-out-tasks.html',
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
                        templateUrl: 'app/layout/settings/settings-language.html',
                        controller: 'LanguageCtrl'
                    }
                }
            })
            .state('oggr.tab.profile', {
                url: '/profile',
                views: {
                    'out-of-tabs': {
                        templateUrl: 'app/layout/settings/settings-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            });

    }

})();