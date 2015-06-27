(function() {

    var moduleDependencies = [];

    angular.module('map.controllers', moduleDependencies)

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
