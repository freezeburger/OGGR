(function() {

    var app = angular.module('oggr.controllers', ['oggr.calendar']);

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

        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');

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

    app.controller('CalendarCtrl', ['$scope', function($scope) {
        // ... code omitted ...
        // Dates can be passed as strings or Date objects 
        function getDateToString(date){
            var d = date || new Date();
            d = [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-');
            return d;

        }
        getDateToString()
        $scope.calendarOptions = {
            defaultDate: getDateToString(),//"2016-05-16",
            minDate: new Date([2015, 03, 31]),
            maxDate: new Date([2020, 12, 31]),
            dayNamesLength: 1, // How to display weekdays (1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names; default is 1)
            // eventClick: function(e){
            //     console.log('event',e);
            //     console.log($scope);
            //     $scope.selectedEvents = e.events;
            // },
            // dateClick: function(e){console.log('date',e)}
        };

        $scope.$on('OGGR.Calendar.Events.CLICK', function (evt,date) {
           $scope.selectedEvents = date.events;
        })
        $scope.$on('OGGR.Calendar.Date.CLICK', function (evt,date) {
           console.log(date)
           $scope.selectedEvents = date.events;
        })

        $scope.events = [{
            id:1,
            title: 'Go to the pool',
            date: new Date([2015, 5, 16]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:false
        },{
            id:2,
            title: 'Get some Sun',
            date: new Date([2015, 5, 31]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:true
        }, {
            id:3,
            title: 'Another Event....',
            date: new Date([2015, 5, 4]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:false
        },{
            id:5,
            title: 'Another Event....',
            date: new Date([2015, 5, 16]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:false
        },{
            title: 'Another Event....',
            date: new Date([2015, 5, 16]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:false
        },{
            id:6,
            title: 'Another Event....',
            date: new Date([2015, 5, 16]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:false
        },{
            id:7,
            title: 'Another Event....',
            date: new Date([2015, 5, 16]),
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
            complete:false
        }]
        $scope.selectedEvents = angular.copy($scope.events)

        $scope.doRefresh = function() {
            $scope.events.unshift(angular.copy($scope.events[Math.floor(Math.random()*$scope.events.length)]));
            $scope.selectedEvents = angular.copy($scope.events);
            $scope.$broadcast('scroll.refreshComplete');

        };
    }]);

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

    app.controller('ChatsDetailCtrl', function($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout, Contacts, $state) {

        if (!Chats.get($stateParams.chatId)) return $state.go('oggr.tab.chats');


        var chatRoom = Chats.get($stateParams.chatId);

        $scope.messages = chatRoom.messages;
        $scope.chatRoomName = Contacts.get(chatRoom.contacts[0]).name

        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 0);

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
                chatRoom.previousMessage = Math.random();
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

    app.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
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
            }
            //google.maps.event.addDomListener(window, 'load', initialize);
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
}]