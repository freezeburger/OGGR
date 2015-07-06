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
