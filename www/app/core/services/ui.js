(function() {

    var moduleDependencies = [];

    angular.module('ui', moduleDependencies)

    .service('UI', ['CONFIG', constructor]);

    function constructor(CONFIG) {

        //TODO of course remove;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'app/core/data/ui.labels.json', false);//CONFIG.server + 
        //xhr.open('GET', 'app/core/data/ui.labels.json', false);
        xhr.send();

        var labels = JSON.parse(xhr.responseText);

        //var labels = {};

        this.lang = DEFAULT_LANGUAGE;
        this.languages = languages;
        this.labels = labels;
    };

    var DEFAULT_LANGUAGE = 'en' ;

    var languages = [{
        name: 'Français',
        code: 'fr'
    }, {
        name: 'English',
        code: 'en'
    }, {
        name: 'Spanish',
        code: 'es'
    }, {
        name: 'Chinese',
        code: 'cn'
    }, {
        name: 'Russian',
        code: 'ru'
    }];

})();
