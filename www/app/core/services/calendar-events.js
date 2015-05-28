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
    var fakeData = [{
        id: 1,
        title: 'Go to the pool',
        date: new Date([2015, 5, 16]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: false
    }, {
        id: 2,
        title: 'Get some Sun',
        date: new Date([2015, 5, 31]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: true
    }, {
        id: 3,
        title: 'Another Event....',
        date: new Date([2015, 5, 4]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: false
    }, {
        id: 5,
        title: 'Another Event....',
        date: new Date([2015, 5, 16]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: false
    }, {
        title: 'Another Event....',
        date: new Date([2015, 5, 16]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: false
    }, {
        id: 6,
        title: 'Another Event....',
        date: new Date([2015, 5, 16]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: false
    }, {
        id: 7,
        title: 'Another Event....',
        date: new Date([2015, 6, 16]),
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam sequi, inventore voluptatem minus dolore accusamus.',
        complete: false
    }];

})();