(function() {

    angular.module('app', ['ionic', 'app.core', 'app.controllers', 'app.routes', 'app.calendar'])

    .run(function(CONFIG, $ionicPlatform, $rootScope, UI) {
        console.log('run', 'app', CONFIG)
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