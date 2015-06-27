(function() {

    var moduleDependencies = [];

    angular.module('login.controllers', moduleDependencies)

    .controller('LoginCtrl', ['$scope','$state', 'ODB', LoginCtrl])

    function LoginCtrl($scope, $state, ODB) {

        $scope.user = {
            email:'renaud.dubuis@decryptage.net',
            password:'zoe'
        };

        function redirect(){
            $state.go('oggr.tab.dashboard');
        }

        $scope.signIn = function() {ODB.user.connect($scope.user).then(redirect)};

        $scope.signUp = function() {ODB.user.register($scope.user).then(redirect)};

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
    }


})();
