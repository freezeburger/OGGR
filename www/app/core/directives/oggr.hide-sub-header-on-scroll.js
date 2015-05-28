(function() {

    var moduleDependencies = [];

    angular.module('oggr.hide-sub-header-on-scroll', moduleDependencies)

    .directive('oggrHideSubHeaderOnScroll', ['$timeout', factory]);

    function factory($timeout) {
        return {
            restrict: 'A',
            priority: 0,
            link: linkFn
        };
    };

    function linkFn($scope, $element, $attrs, ctrls, transcludeFn) {
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
    };

})();