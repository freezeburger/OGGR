(function() {


    angular.module('app.config', [])

    	.constant('config', configFacotry())


	    .config([function() {console.log('config', 'appConfig');}])

	    .run([function() {console.log('run', 'coreConfig');}]);

    function configFacotry() {
        return {
            version: '0.1.0'
        };
    }


})();