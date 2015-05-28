(function() {

    var moduleDependencies = [];

    angular.module('core.debug', moduleDependencies)

    .factory('$exceptionHandler', function() {
        return function errorCatcherHandler(exception, cause) {
            console.error(exception.stack);
        };
    });

})();