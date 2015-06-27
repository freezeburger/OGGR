(function() {

    var moduleDependencies = ['firebase'];

    angular.module('chat-room', moduleDependencies)

    .factory('ChatRoom', ['$firebaseArray', factory]);

    function factory($firebaseArray) {
        var messagesRef = new Firebase('https://oggr.firebaseio.com/messages'),
            messagesFBA = $firebaseArray(messagesRef.limitToLast(15)),
            messageIter = 0;

        return {
            create: createRoom
        };

        function createRoom(contactId, id) {
            var id = id;

            var room = Object.create({}, {
                id: {
                    writable: true,
                    configurable: true,
                    value: id
                },
                data: {
                    writable: true,
                    configurable: true,
                    value: [createMessage()]
                },
                contacts: {
                    writable: true,
                    configurable: true,
                    value: [contactId]
                },
                messages: {
                    configurable: false,
                    get: function() {
                        return messagesFBA.$loaded()
                    },
                    set: function(msg) {
                        //Keep for initializing
                    }
                },
                nextMessage: {
                    configurable: false,
                    set: function(msg) {
                        messagesFBA.$add(createMessage(msg));
                    }
                },
                previousMessage: {
                    configurable: false,
                    set: function(msg) {
                        this.data.unshift(createMessage(msg));
                    }
                },
                lastMessage: {
                    configurable: false,
                    get: function() {
                        return this.data[this.data.length - 1].content;
                    }
                },

            });

            room.deleteMessage = function(msg) {
                this.data.splice(this.data.indexOf(msg), 1);

            }
            return room;
        };

    };

    function createMessage(msg) {
        if (msg) return {
            content: msg
        };
        return false;
    }

})();