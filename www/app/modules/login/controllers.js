(function() {

    var moduleDependencies = [];

    angular.module('login.controllers', moduleDependencies)

    .controller('LoginCtrl', function($scope, $state) {

        var ref = new Firebase("http://oggr.firebaseio.com");


        $scope.signIn = function(user) {
            ref.authWithPassword({
                email: "bobtony@firebase.com",
                password: "correcthorsebatterystaple"
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $state.go('oggr.tab.dashboard');
                }
            });

        };
        $scope.signUp = function(user) {

            ref.createUser({
                email: "bobtony@firebase.com",
                password: "correcthorsebatterystaple"
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    $state.go('oggr.tab.dashboard');
                }
            });

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
