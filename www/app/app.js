(function() {

    angular.module('app', ['app.config', 'ionic', 'app.routes', 'app.calendar', 'app.controllers', 'app.services', 'app.directives'])

    .run(function($ionicPlatform, $rootScope, UI) {
        console.log('run', 'app')
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

})();