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

    //TODO of course remove;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://192.168.1.105:5000/app/core/data/ui.labels.json', false);
    //xhr.open('GET', 'app/core/data/ui.labels.json', false);
    xhr.send();

    var labels = JSON.parse(xhr.responseText);

    //var labels = {};

})();