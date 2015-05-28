(function() {

    var moduleDependencies = [];

    angular.module('ui', moduleDependencies)

    .service('UI', [constructor]);

    function constructor() {
        this.lang = 'en';
        this.languages = languages;
        this.labels = labels;
    };

    var languages = [{
            name: 'Français',
            code: 'fr'
        }, {
            name: 'English',
            code: 'en'
        }, {
            name: 'Spanish',
            code: 'es'
        }];

    var labels = {
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
                taskManager: 'Task Manager',
                planning: 'Personnal Planning',
                files: 'Files',
                reminder: 'Reminder',
                map: 'Map'
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
                fileUpload: 'Add a new file.',
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

})();