(function() {

    var moduleDependencies = [];

    angular.module('contacts.controllers', moduleDependencies)

    .controller('ContactsCtrl', function($scope, Contacts) {
        $scope.contacts = Contacts.all();
        $scope.remove = function(contact) {
            Contacts.remove(contact);
        }
    })

    .controller('ContactsDetailCtrl', function($scope, $stateParams, Contacts) {
        $scope.contact = Contacts.get($stateParams.contactId);
    })


})();
