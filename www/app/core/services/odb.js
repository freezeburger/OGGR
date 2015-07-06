(function() {

    var moduleDependencies = ['firebase'];

    angular.module('odb', moduleDependencies)

    .service('ODB', ['CONFIG', '$q', Constructor]);

    var baseRef = 'http://oggr.firebaseio.com/';
    var $injector = angular.injector();

    
    /**
     * [Constructor ODB handle DTO from Firebase]
     * @param {[service]} CONFIG [Global configuration]
     * @param {[service]} $q     [Native Angular Promise API]
     */
    function Constructor(CONFIG, $q) {
        Constructor.ODB = this;
        this.$q = $q;
    };

    /**
     * User Mangement 
     * @return {user}               
     * [ A user Object wrapper for user management function ]
     */
    Constructor.prototype.user = (function() {
        var ref = new Firebase(baseRef);

        return {
            current: {},
            connect: function(user) {
                return setConnection(user, 'authWithPassword');
            },
            disconnect: function() {
                ref.unAuth();
            },
            register: function(user) {
                return setConnection(user, 'createUser');
            }
        }

        function setConnection(user, mode) {
            mode = mode || 'createUser';

            var defer = Constructor.ODB.$q.defer()
            ref[mode](user, function(error, data) {
                if (error) {
                    defer.reject(error);
                    console.log(mode + " Failed!", error);
                } else {
                    Constructor.ODB.user.current = data;
                    defer.resolve(data);
                    console.log(mode + " successfully with payload:", data);
                }
            });
            return defer.promise;
        };

    })();

})();
