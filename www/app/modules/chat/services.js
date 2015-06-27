(function(){

    var moduleDependencies = ['chat-room','app.contacts'];

    angular.module('chat.services', moduleDependencies)

    .factory('Chats', ['Contacts','ChatRoom',factory]);

    function factory(Contacts, ChatRoom) {

        var chats = [];
        //TODO remove
        chats.push(ChatRoom.create(2, chats.length))
        chats.push(ChatRoom.create(3, chats.length))

        var Chats = {
            all: function() {
                return chats;
            },
            get: function(chatId) {
                return chats[chatId];
            },
            remove: function(chat) {
                return chats.splice(chats.indexOf(chat), 1);
            },
            create: function(contactId) {
                chats.push(ChatRoom.create(contactId));
                return true;
            }
        };
        return Chats;
    };


})();