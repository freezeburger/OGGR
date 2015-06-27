(function() {

    var moduleDependencies = [];

    angular.module('login.controllers', moduleDependencies)

    .controller('LoginCtrl', function($scope, $state) {
        $scope.signIn = function(user) {
            $state.go('oggr.tab.dashboard');
        };
        $scope.signUp = function(user) {
            $state.go('oggr.tab.dashboard');
        };
        $scope.fbLogin = function() {
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
        };
    })


})();
