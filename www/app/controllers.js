(function() {

    angular.module('app.controllers', [])

    .controller('StartCtrl', function($scope, $state) {
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
    })

    .controller('PulseCtrl', function($scope) {

        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');

        };
    })

    .controller('DashCtrl', function($scope, $http) {
        $scope.doRefresh = function() {
            $scope.items.push(Math.random())
            $http.get('/new-items')
                .success(function(newItems) {
                    //
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    })

    

    .controller('ContactsCtrl', function($scope, Contacts) {
        $scope.contacts = Contacts.all();
        $scope.remove = function(contact) {
            Contacts.remove(contact);
        }
    })

    .controller('ContactsDetailCtrl', function($scope, $stateParams, Contacts) {
        $scope.contact = Contacts.get($stateParams.contactId);
    })

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

        chatRoom.messages.then(function(x) {
                $scope.$watchCollection('messages', function(newNames, oldNames) {
                    console.log(Math.random())
                    $timeout(function() {
                        console.log('->', Math.random())
                        $ionicScrollDelegate.$getByHandle('chat').scrollBottom(true);
                    }, 500, false);
                });
                $scope.messages = x; // true
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

    .controller('LanguageCtrl', function($scope, $ionicHistory) {
        $scope.close = function() {
            console.log($ionicHistory.viewHistory());
            //TODO not working
            $ionicHistory.goBack();
        }
    })

    .controller('ProfileCtrl', function($scope, $stateParams, Contacts) {
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
    })

    .controller('MapCtrl', function($scope, $ionicLoading, $compile) {
        function initialize() {
            var myLatlng = new google.maps.LatLng(43.07493, -89.381388);


            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                style: mapStyles
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            map.setOptions({
                styles: mapStyles
            });

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Uluru (Ayers Rock)'
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            $scope.map = map;
        };
        initialize();

        $scope.centerOnMe = function() {
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function(pos) {
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };

        $scope.clickTest = function() {
            alert('Example of infowindow with ng-click')
        };

    });


})();

var mapStyles = [{
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "simplified"
    }]
}, {
    "featureType": "road.arterial",
    "stylers": [{
        "hue": 149
    }, {
        "saturation": -78
    }, {
        "lightness": 0
    }]
}, {
    "featureType": "road.highway",
    "stylers": [{
        "hue": -45
    }, {
        "saturation": -20
    }, {
        "lightness": 2.8
    }]
}, {
    "featureType": "poi",
    "elementType": "label",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "landscape",
    "stylers": [{
        "hue": 163
    }, {
        "saturation": -26
    }, {
        "lightness": -1.1
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "water",
    "stylers": [{
        "hue": 3
    }, {
        "saturation": -24.24
    }, {
        "lightness": -18.57
    }]
}];