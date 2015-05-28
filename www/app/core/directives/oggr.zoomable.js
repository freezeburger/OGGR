(function() {

    var moduleDependencies = [];

    angular.module('oggr.zoomable', moduleDependencies)

    .directive('oggrZoomable', [factory]);

    function factory() {
        return {
            restrict: 'A',
            link: linkFn
        };
    };

    function linkFn(scope, iElement, iAttrs) {};

})();