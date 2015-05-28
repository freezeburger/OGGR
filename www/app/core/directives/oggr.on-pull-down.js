(function() {

    var moduleDependencies = [];

    angular.module('oggr.on-pull-down', moduleDependencies)

    .directive('oggrOnPullDown', ['$compile', factory])

    function factory($compile) {
        return {
            restrict: 'A',
            require: ['?^$ionicScroll'], //^ ^^ ?^ ?^^
            priority: 1000,
            compile: compileFn
        };
    };

    function compileFn(tElement, tAttrs, transcludeFn) {

        tElement.addClass('oggr').addClass('bar-subheader');
        tAttrs.$set('name', '{{UI.labels[UI.lang].nav.calendar}}');
        tElement.attr('ng-click', 'toggle()');

        return linkFn;
    };

    function linkFn($scope, $element, $attrs, ctrls, transcludeFn) {

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

})();