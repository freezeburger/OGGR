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

    app.controller('CalendarCtrl', ['$scope', 'CalendarEvents', function($scope, CalendarEvents) {

        //unused
        function getDateToString(date) {
            var d = date || new Date();
            d = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
            return d;
        }

        $scope.$on('OGGR.Calendar.Events.CLICK', function(evt, date) {
            $scope.selectedEvents = date.events;
        })
        $scope.$on('OGGR.Calendar.Date.CLICK', function(evt, date) {
            console.log(date)
            $scope.selectedEvents = date.events;
        })

        $scope.events = CalendarEvents.all();
        //Keep for pagination
        $scope.selectedEvents = angular.copy($scope.events)

        $scope.doRefresh = function() {
            $scope.events.unshift(angular.copy($scope.events[Math.floor(Math.random() * $scope.events.length)]));
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


        $ionicScrollDelegate.resize();

        chatRoom.messages.then(function(x) {
                $scope.$watchCollection('messages', function(newNames, oldNames) {
                    console.log(Math.random())
                    $timeout(function() {
                        console.log('->', Math.random())
                        $ionicScrollDelegate.$getByHandle('chat').scrollBottom(true);
                    }, 500, false);
                    // $scope.$$postDigest(function() {
                    //     console.log("post Digest");
                    //     $ionicScrollDelegate.scrollBottom(true);
                    // });
                });
                $scope.messages = x; // true
            })
            .catch(function(error) {
                console.log("Error:", error);
            });

        //         The asyncEval is after the DOM construction but before the browser renders.
        // I believe that is the time you want to attach the jquery plugins. otherwise
        // you will have flicker. if you really want to do after the browser render
        // you can do $defer(fn, 0);


        //$timeout([fn], [delay], [invokeApply], [Pass]);

        //         Even though the first $timeout() call was before the $scope.$evalAsync() method, you can see that the $scope.$evalAsync() expression was evaluated first. This is because the $scope.$evalAsync() expressions are placed in an "async queue" that is flushed at the start of each $digest iteration. As a very high level, the $digest loop looks like this:

        // Do:
        // - - - If asyncQueue.length, flush asyncQueue.
        // - - - Trigger all $watch handlers.
        // - - - Check for "too many" $digest iterations.
        // While: ( Dirty data || asyncQueue.length )

        //http://www.bennadel.com/blog/2605-scope-evalasync-vs-timeout-in-angularjs.htm


        //http://blogs.microsoft.co.il/choroshin/2014/04/08/angularjs-postdigest-vs-timeout-when-dom-update-is-needed/

        //  When you need to update the DOM once after dirty checking is over or in other words, fire a callback after the current $digest cycle completes,
        // you can use $$postDigest or $timeout.
        // I’ll try to explain the cons and the pros of  $$postDigest and $timeout.

        // $$postDigest 

        // pros:

        //          1. Fires a callback after the current $digest cycle completes.

        //          2. Great for updating the DOM once after dirty checking is over.

        // cons:

        //          1. $$ means private to Angular, the interface is not stable.


        //         /runs immediately after $scope.$digest
        // $scope.$$postDigest(function(){
        //   console.log("post Digest");
        //  });
        // * it should be noted that $$postDigest wont run another digest cycle.

        // $timeout 

        // pros:

        //          1. Runs after the current $digest cycle completes.

        //          2. Great for updating the DOM once after dirty checking is over.

        // cons:

        //          1. a little more complex to use.

        // usage:
        // to prevent another digest cycle to run by default ,we need to set the third argument to false.

        // //runs immediately after $scope.$digest
        // $timeout(function(){
        //  console.log("post Digest with $timeout");
        // },0,false);

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
    });

    app.controller('LanguageCtrl', function($scope, $ionicHistory) {
        $scope.close = function() {
            console.log($ionicHistory.viewHistory());
            //TODO not working
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
}]