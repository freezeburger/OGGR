(function() {

    var moduleDependencies = [];

    angular.module('pulse.controllers', moduleDependencies)

    .controller('PulseCtrl', function($scope) {

        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');

        };
    })


})();
