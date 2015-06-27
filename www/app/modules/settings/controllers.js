(function() {

    var moduleDependencies = [];

    angular.module('settings.controllers', moduleDependencies)

    .controller('LanguageCtrl', function($scope, $ionicHistory) {
        $scope.close = function() {
            console.log($ionicHistory.viewHistory());
            //TODO not working
            $ionicHistory.goBack();
        }
    })

    .controller('ProfileCtrl', function($scope, $stateParams, Contacts) {
        $scope.profile = {}

        function getList(user) {
            openFB.api({
                path: '/me/taggable_friends',
                success: function(data) {
                    console.log(data)
                },
                error: function(error) {
                    alert('Facebook error: ' + error.error_description);
                }
            });
        }


        openFB.api({
            path: '/me',
            params: {
                fields: 'id,name,email'
            },
            success: function(user) {
                console.log(user)
                getList(user);
                $scope.$apply(function() {
                    $scope.profile.user = user;
                });
            },
            error: function(error) {
                alert('Facebook error: ' + error.error_description);
            }
        });
    })


})();
