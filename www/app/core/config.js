(function() {

    angular.module('core.config', [])

    .constant('CONFIG', configFactory())

    function configFactory() {
        return {
            version: '0.1.0',
            paths: {
                screens: 'app/modules'
            }
        };
    }


})();