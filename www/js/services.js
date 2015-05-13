(function() {



    var app = angular.module('oggr.services', [])

    app.service('UI', [function() {

        this.lang = 'en';

        this.languages = [
                {name: 'Français',code:'fr'}, 
                {name: 'English',code:'en'}, 
                {name: 'Spanish',code:'es'}, 
            ];

        this.labels = {
            en: {
                nav: {
                    pulse: 'Pulse',
                    dashboard: 'Dashboard',
                    calendar: 'Calendar',
                    contacts: 'Contacts',
                    chat: 'Chat',
                    language: 'Choose Language',
                    profile: 'Your Profile',
                    settings: 'Settings',
                    login: 'Welcome to OGGR',
                    forgot: 'Forgot Password',
                    venue: 'Venue',
                    crew: 'Crew',
                    signOff: 'Sign-Off',
                },
                action: {
                    delete: 'Delete',
                    share: 'Share',
                    call: 'Call',
                    create: 'Create',
                    edit: 'Edit',
                    forgot: 'Retrieve Password',
                    signIn: 'Sign-In',
                    refresh: 'Pull to refresh...',
                    facebook: 'Login with Facebook',
                },
                forms: {
                    userName: 'Username',
                    password: 'Password'
                }
            },
            fr: {
                nav: {
                    pulse: 'Pulse',
                    dashboard: 'Dashboard',
                    calendar: 'Calendrier',
                    contacts: 'Contacts',
                    chat: 'Chat',
                    language: 'Langage',
                    profile: 'Profil',
                    settings: 'Paramètres'
                },
                action: {
                    delete: 'Supprimer',
                    share: 'Partager',
                    call: 'Appeler',
                    create: 'Créer',
                    edit: 'Editer',
                }
            }
        };

    }])

    app.factory('Chats', function() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function() {
                return chats;
            },
            remove: function(chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    });

    app.factory('Contacts', function() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var contacts = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];
        //OUCH 
        contacts.forEach(function(element, index){
            contacts.push(angular.copy(element))
        });
        contacts.forEach(function(element, index){
            contacts.push(angular.copy(element))
        });

        return {
            all: function() {
                return contacts;
            },
            remove: function(contact) {
                contacts.splice(contacts.indexOf(contact), 1);
            },
            get: function(contactId) {
                for (var i = 0; i < contacts.length; i++) {
                    if (contacts[i].id === parseInt(contactId)) {
                        return contacts[i];
                    }
                }
                return null;
            }
        };
    });

})();