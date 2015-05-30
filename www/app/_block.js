(function() {

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var ngModuleFn = angular.module;

    angular.module = buildProcess;

    function buildProcess(name, requires, configFn) {
        
        var module = ngModuleFn.call(angular, name, requires, configFn);
        var num = buildProcess.modules[name]=++buildProcess.count;
        (function() {
            var color = getRandomColor();
            console.log('%c'+ num +' creating ' + name, 'color:'+color+';');
            ['config', 'run'].forEach(function(step, index) {
                module[step](function() {
                    console.log('%c'+ num +'->' + step + ' ' + name, 'background-color:'+color+';color:white;')
                });
            });
        })();

        return module;
    };
    buildProcess.modules ={};
    buildProcess.count = 0;
})();