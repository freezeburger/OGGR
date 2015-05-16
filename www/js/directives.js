(function() {

    var app = angular.module('oggr.directives', [])

    app.directive('oggrZoomable', [function() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {}
        };
    }]);

    app.directive('oggrChatMessage', ['$ionicActionSheet', '$timeout', function($ionicActionSheet, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<a ng-click="getAction()" on-hold="getAction()"><p ng-bind="message.content" ng-if="!isImage()"></p><img zoomable ng-if="isImage()" ng-src="{{message.content}}"></a>',
            link: function(scope, iElement, iAttrs) {
                scope.isImage = function() {
                    return /data:/.test(scope.message.content) || /http/.test(scope.message.content);
                };
                scope.getActions = function() {
                    console.log(123)

                    /* Show the action sheet */
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [{
                            id: 1,
                            text: '<b>Copy</b> message'
                        }, {
                            id: 2,
                            text: 'Repeat'
                        }],
                        destructiveText: 'Delete',
                        titleText: 'Select you action',
                        cancelText: 'Cancel',
                        cancel: function() {
                            console.log(arguments)
                        },
                        buttonClicked: function(index) {
                            console.log(arguments)
                            return true;
                        },
                        destructiveButtonClicked: function(index) {
                            console.log(arguments)
                            return true;
                        }
                    });

                    $timeout(function() {
                        hideSheet();
                    }, 3000);

                };
            }
        };
    }]);

    app.directive('oggrHideSubHeaderOnScroll', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            priority: 0,
            link: function link($scope, $element, $attrs, ctrls, transcludeFn) {
                var start = 0;
                var threshold = 150;
                $scope.$parent.slideHeader = false;

                $element.addClass('will-hide-subheader');

                $element.bind('scroll', function(e) {
                    var hidden = (e.detail.scrollTop - start > threshold);
                    $timeout(function() {
                        $scope.$parent.slideHeader = hidden;
                        $element[(hidden) ? 'addClass' : 'removeClass']('subheader-hidden');
                    }, 0)
                });
            }
        };
    }])

    app.directive('oggrOnPullDown', ['$compile', function($compile) {
        return {
            restrict: 'A',
            require: ['?^$ionicScroll'], //^ ^^ ?^ ?^^
            priority: 1000,
            compile: function(tElement, tAttrs, transcludeFn) {


                tElement.addClass('oggr').addClass('bar-subheader');
                tAttrs.$set('name', '{{UI.labels[UI.lang].nav.calendar}}');
                tElement.attr('ng-click', 'toggle()');

                return function link($scope, $element, $attrs, ctrls, transcludeFn) {

                    console.log('link', ctrls)

                    $scope.toggle = function(argument) {
                        console.log('toggle')
                    }

                    $element.removeAttr('oggr-on-pull-down');
                    $compile($element)($scope);

                    var start = 0;
                    var threshold = 150;

                    ctrls[0].$element.bind('scroll', function(e) {
                        console.log('scroll')
                        if (e.detail.scrollTop - start > threshold) {
                            $element.addClass('bar-subheader-slide-away');
                        } else {
                            $element.removeClass('bar-subheader-slide-away');
                        }
                        if (slideHeaderPrevious >= e.detail.scrollTop - start) {
                            $element.removeClass('bar-subheader-slide-away');
                        }
                        var slideHeaderPrevious = e.detail.scrollTop - start;
                    });

                };

            }
        };
    }])

})();