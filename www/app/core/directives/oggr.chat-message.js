(function() {

    var moduleDependencies = [];

    angular.module('oggr.chat-message', moduleDependencies)

    .directive('oggrChatMessage', ['$ionicActionSheet', '$timeout', factory]);

    function factory($ionicActionSheet, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div><p ng-bind="message.content" ng-if="!isImage()"></p><img ng-if="isImage()" ng-src="{{message.content}}"></div>',
            link:linkFn,

        };
    }

    function linkFn(scope, iElement, iAttrs) {
        scope.isImage = function() {
            return /data:/.test(scope.message.content) || /http/.test(scope.message.content);
        }
    };

})();