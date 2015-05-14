(function() {

    var app = angular.module('oggr.controllers', []);

    app.controller('StartCtrl', function($scope, $state) {
        console.log('start')
        $scope.signIn = function(user) {
            $state.go('oggr.tab.dashboard');
        };
        $scope.fbLogin = function() {
            openFB.login(
                function(response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        console.log(response);
                        $state.go('oggr.tab.dashboard');
                    } else {
                        alert('Facebook login failed');
                    }
                }, {
                    scope: 'email,publish_actions,user_friends'
                });
        };
    });

    app.controller('PulseCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
        $scope.items = [1, 2, 3];
        $scope.doRefresh = function() {
            $scope.items.push(Math.random())
            $http.get('/new-items')
                .success(function(newItems) {
                    //$scope.items = newItems;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    });

    app.controller('DashCtrl', function($scope, $http) {
        $scope.items = [1, 2, 3];
        $scope.doRefresh = function() {
            $scope.items.push(Math.random())
            $http.get('/new-items')
                .success(function(newItems) {
                    //$scope.items = newItems;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    });

    app.controller('CalendarCtrl', function($scope, $http) {

        $scope.items = [1, 2, 3];
        $scope.doRefresh = function() {
            $scope.items.push(Math.random())
            $http.get('/new-items')
                .success(function(newItems) {
                    //$scope.items = newItems;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    });

    app.controller('ContactsCtrl', function($scope, Contacts) {
        $scope.contacts = Contacts.all();
        $scope.remove = function(contact) {
            Contacts.remove(contact);
        }
    });

    app.controller('ContactsDetailCtrl', function($scope, $stateParams, Contacts) {
        $scope.contact = Contacts.get($stateParams.contactId);
    });

    app.controller('ChatsCtrl', function($scope, Chats, Contacts) {
        $scope.chats = Chats.all();

        //Move into Room object
        $scope.getUser = function(chat) {
            return Contacts.get(chat.contacts[0])
        }

        $scope.remove = function(chat) {
            Chats.remove(chat);
        }

    });

    app.controller('ChatsDetailCtrl', function($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout,Contacts ,$state) {
        
        if(!Chats.get($stateParams.chatId)) return $state.go('oggr.tab.chats');


        var chatRoom = Chats.get($stateParams.chatId);

        $scope.messages = chatRoom.messages;
        $scope.chatRoomName = Contacts.get(chatRoom.contacts[0]).name
        
        $timeout(function(){
             $ionicScrollDelegate.scrollBottom(true);
        },0);

        $scope.getActions = function() {
            console.log(123)

            // Show the action sheet
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
                    console.log(arguments)
                },
                buttonClicked: function(index) {
                    console.log(arguments)
                    return true;
                },
                destructiveButtonClicked: function(index) {
                    console.log(arguments)
                    return true;
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function() {
                hideSheet();
            }, 3000);

        };

        console.log(chatRoom)

        $scope.add = function() {
            chatRoom.nextMessage = $scope.message;
            $ionicScrollDelegate.scrollBottom(true);
        };

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop(true);
        };

        $scope.scrollDown = function() {
            $ionicScrollDelegate.scrollBottom(true);
        };

        $scope.doRefresh = function() {
            for (var i = 0, m = Math.floor(Math.random() * 15); i < m; i++) {
                chatRoom.previousMessage = Math.random() ;
            };
            $scope.$broadcast('scroll.refreshComplete');
        };
    });

    app.controller('LanguageCtrl', function($scope, $ionicHistory) {
        $scope.close = function() {
            console.log($ionicHistory.viewHistory());
            $ionicHistory.goBack();
        }
    });

    app.controller('ProfileCtrl', function($scope, $stateParams, Contacts) {
        $scope.profile = {}

        function getList(user) {
            openFB.api({
                path: '/me/taggable_friends',
                success: function(data) {
                    console.log(data)
                },
                error: function(error) {
                    alert('Facebook error: ' + error.error_description);
                }
            });
        }


        openFB.api({
            path: '/me',
            params: {
                fields: 'id,name,email'
            },
            success: function(user) {
                console.log(user)
                getList(user);
                $scope.$apply(function() {
                    $scope.profile.user = user;
                });
            },
            error: function(error) {
                alert('Facebook error: ' + error.error_description);
            }
        });
    });


})();