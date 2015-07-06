//Add globaly
beforeEach(function() {
    var matchers = {
        toBeOfType: function(typeString) {
            return typeof this.actual == typeString;
        }
    };

    jasmine.addMatchers(matchers);
});

//console.log(111,window.__json__['ui.labels.json']);


var customMatchers = {
    toBeDivisibleByTwo: function() {
        return {
            compare: function(actual, expected) {
                return {
                    pass: (actual % 2) === 0
                };
            }
        };
    },
    toBeRegularName: function() {
        return {
            compare: function(actual, expected) {
                if (expected === undefined) {
                    expected = '';
                }
                var result = {};

                result.pass = !actual.match(/[A-Z]/) && !actual.match(/[0-9]/)

                if (result.pass) {
                    result.message = actual + ' correct';
                } else {
                    result.message = 'Respect Naming Rule';
                }
                return result;
            }
        };
    }
};

beforeEach(function() {
    jasmine.addMatchers(customMatchers);
});




describe('Test Integration :', function() {

    it('should pass', function() {
        expect(1).toEqual(1);
    });

    xit('should fail', function() {
        expect(1).toEqual(2);
    });

});

function getStructure(array) {

    array.forEach(function(moduleName, array, index) {
        if (getStructure.cache[moduleName]) return;

        getStructure.cache[moduleName] = true;

        describe(moduleName + ' ->', function() {

            //var mod = angular.module(moduleName);


            it('Application contains module : ' + moduleName, function() {
                expect(angular.module(moduleName)).toBeDefined();
            });
            it('Naming rule is repected : ' + moduleName, function() {
                expect(moduleName).toBeRegularName();
            });
            it('Reguires : ' + angular.module(moduleName).requires, function() {});

            if (angular.module(moduleName).requires.length) {
                getStructure(angular.module(moduleName).requires);
            };
        });
    });
};
getStructure.cache = {};
getStructure(['app']);

describe('Applications Modules Order', function() {
    var count = 1;
    for (var mod in getStructure.cache) {
        it(' ' + (count++) + ' -> ' + mod, function() {});
    }
});


describe('Application Structure :', function() {

    var app;
    var $rootScope, $scope, $controller;

    //beforeEach(module('app'))
    /*
        beforeEach(inject(function(_$rootScope_, _$controller_){
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;

            //registerController = $controller('RegisterController', {'$rootScope' : $rootScope, '$scope': $scope});
        }));

        */



    // var modules = [
    //     ['app', ['ionic', 'app.core', 'app.controllers', 'app.routes', 'app.calendar']],
    //     //['ionic', []],
    //     ['app.core', ['core.config', 'core.directives', 'core.services', 'core.debug']],
    //     ['core.config', []],
    //     ['core.directives', ['oggr']],
    //     ['oggr', ['oggr.chat-message', 'oggr.hide-sub-header-on-scroll', 'oggr.on-pull-down', 'oggr.zoomable']],
    //     ['core.services', ['firebase', 'ui', 'calendar-events', 'contacts', 'chats']],
    //     ['core.debug', []],
    //     ['app.controllers', []],
    //     ['app.routes', []],
    //     ['app.calendar', ['calendar.services', 'calendar.controllers', 'event-calendar']],
    //     ['event-calendar', ['event-calendar.controller']],
    //     ['event-calendar.controller', []]
    // ];


    // modules.forEach(function(e, a, i) {
    //     var moduleName = e[0],
    //         moduleDependencies = e[1],
    //         mod = angular.module(moduleName)

    //     describe('Module loading :', function() {
    //         it('Application contains module : ' + moduleName, function() {
    //             //debugger; //open console and reload
    //             expect(mod).toBeDefined();
    //         });
    //     });
    //     describe('Module Names :', function() {
    //         it('Naming rule is repected : ' + moduleName, function() {
    //             expect(mod.name).toBeRegularName();
    //         });
    //     });

    //     describe('Module Dependencies :', function() {
    //         it(mod.requires.length + ' dependencies are expected, got : (' + moduleName + ') ' + moduleDependencies.length,
    //             function() {
    //                 expect(mod.requires.length).toEqual(moduleDependencies.length);
    //             });
    //         moduleDependencies.forEach(function(e, a, i) {
    //             it(' -> Dependency is loaded : ' + e, function() {
    //                 expect(angular.module(e)).toBeDefined();
    //             });

    //         });
    //     });
    // });

});
