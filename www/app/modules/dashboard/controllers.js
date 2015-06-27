(function(){

    var moduleDependencies = [];
	
	angular.module('dashboard.controllers', moduleDependencies )

	.controller('DashCtrl', function($scope, $http) {
        $scope.doRefresh = function() {
            $scope.items.push(Math.random())
            $http.get('/new-items')
                .success(function(newItems) {
                    //
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    })


})();