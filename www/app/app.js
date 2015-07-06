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
            console.log(navigator.contacts);
            
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