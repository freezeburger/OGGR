(function() {


    var moduleDependencies = [
        'firebase', //External
        'ui', 
        'calendar-events', 
        'contacts', 
        'chats'
    ];

    angular.module('core.services', moduleDependencies);

})();