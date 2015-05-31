(function() {

    var moduleDependencies = [];

    angular.module('ui', moduleDependencies)

    .service('UI', ['CONFIG', constructor]);

    function constructor(CONFIG) {

        //TODO of course remove;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', CONFIG.server + 'app/core/data/ui.labels.json', false);
        //xhr.open('GET', 'app/core/data/ui.labels.json', false);
        xhr.send();

        var labels = JSON.parse(xhr.responseText);

        //var labels = {};

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

})();
