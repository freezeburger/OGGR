(function() {

    var moduleDependencies = ['firebase'];

    angular.module('odb', moduleDependencies)

    .service('ODB', ['CONFIG', '$q', constructor]);

    var baseRef = 'http://oggr.firebaseio.com/';

    function constructor(CONFIG, $q) {

        var ODB = this;

        this.user = (function() {
            var ref = new Firebase(baseRef);

            return {
                current:{},
                connect: function(user) {
                    return setConnection(user,'authWithPassword');
                },
                disconnect: function() {
                    ref.unAuth();
                },
                register: function(user) {
                    return setConnection(user,'createUser');
                }
            }

            function setConnection(user,mode) {
                console.log(mode)
                mode = mode || 'createUser';

                var defer = $q.defer()

                ref[mode](user, function(error, data) {
                    if (error) {
                        console.log(mode + " Failed!", error);
                        defer.reject(error);
                    } else {
                        console.log(mode + " successfully with payload:", data);
                        ODB.user.current = data ;
                        defer.resolve(data);
                    }
                });
                return defer.promise;
            };

        })();
    };

})();
