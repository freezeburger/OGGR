(function() {

    var moduleDependencies = [];

    angular.module('chat.controllers', moduleDependencies)

    .controller('ChatsCtrl', function($scope, Chats, Contacts) {
        $scope.chats = Chats.all();

        //Move into Room object
        $scope.getUser = function(chat) {
            return Contacts.get(chat.contacts[0])
        }

        $scope.remove = function(chat) {
            Chats.remove(chat);
        }

    })

    .controller('ChatsDetailCtrl', function($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout, Contacts, $state) {

        if (!Chats.get($stateParams.chatId)) return $state.go('oggr.tab.chats');

        var chatRoom = Chats.get($stateParams.chatId);


        $ionicScrollDelegate.resize();

        chatRoom.messages.then(function(roomMessages) {
                $scope.$watchCollection('messages', function(newNames, oldNames) {
                    $timeout(function() {
                        $ionicScrollDelegate.$getByHandle('chat').scrollBottom(true);
                    }, 500, false);
                });
                $scope.messages = roomMessages; // true
            })
            .catch(function(error) {
                console.log("Error:", error);
            });

        $scope.chatRoomName = Contacts.get(chatRoom.contacts[0]).name

        $scope.add = function() {
            chatRoom.nextMessage = $scope.message;
            $scope.message = '';
        };

        $scope.searchMessage = function() {
            console.log('search')
        };

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop(true);
        };

        $scope.scrollDown = function() {
            $ionicScrollDelegate.scrollBottom(true);
        };

        $scope.doRefresh = function() {
            for (var i = 0, m = Math.floor(Math.random() * 15); i < m; i++) {
                chatRoom.previousMessage = Math.random();
            };
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.getActions = function() {
            var message = this.message;

            /* Show the action sheet */
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    id: 1,
                    text: '<b>Copy</b> message'
                }, {
                    id: 2,
                    text: 'Repeat'
                }],
                destructiveText: 'Delete',
                titleText: 'Select you action',
                cancelText: 'Cancel',
                cancel: function() {
                    return true;
                },
                buttonClicked: function(index, button) {
                    if (button.id === 1) $scope.message = message.content;
                    if (button.id === 2) chatRoom.nextMessage = message.content;
                    $ionicScrollDelegate.scrollBottom(true);
                    return true;
                },
                destructiveButtonClicked: function() {
                    chatRoom.deleteMessage(message);
                    return true;
                }
            });

            $timeout(function() {
                hideSheet();
            }, 3000);

        };
    })


})();
