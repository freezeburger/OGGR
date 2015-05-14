(function() {

    var app = angular.module('oggr.directives', [])

    app.directive('oggrZoomable', [function() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                //console.log(iElement[0])
            }
        };
    }]);

    app.directive('oggrChatMessage', ['$ionicActionSheet', '$timeout', function($ionicActionSheet, $timeout) {
        console.log($ionicActionSheet)
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div ng-click="getAction()" ng-focus="getAction()"><p ng-bind="message.content" ng-if="!isImage()"></p><img zoomable ng-if="isImage()" ng-src="{{message.content}}"></div>',
            link: function(scope, iElement, iAttrs) {
                //console.log(iElement);
                scope.isImage = function() {
                    return /data:/.test(scope.message.content);
                }
            }
        };
    }]);
    
})();
