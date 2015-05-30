(function() {

    var moduleDependencies = [];

    angular.module('calendar-events', moduleDependencies)

    .factory('CalendarEvents', [factory]);

    function factory() {

        var events = fakeData;

        var CalendarEvents = {
            all: all,
            remove: remove,
            get: get
        };
        
        return CalendarEvents;

        function all() {
            return events;
        };

        function remove(event) {
            events.splice(events.indexOf(event), 1);
        };

        function get(eventId) {
            for (var i = 0; i < events.length; i++) {
                if (events[i].id === parseInt(eventId)) {
                    return events[i];
                }
            }
            return null;
        };
    }

    // Some fake testing data
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://192.168.1.105:5000/app/core/data/calendar-events.json', false);
    xhr.send();

    var fakeData = JSON.parse(xhr.responseText);

})();