(function() {

    var app = angular.module('oggr.directives', [])

    app.directive('oggrZoomable', [function() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                //console.log(iElement[0])
            }
        };
    }]);

    app.directive('oggrChatMessage', ['$ionicActionSheet', '$timeout', function($ionicActionSheet, $timeout) {
        console.log($ionicActionSheet)
        return {
            restrict: 'E',
            replace: true,
            template: '<a ng-click="getAction()" on-hold="getAction()"><p ng-bind="message.content" ng-if="!isImage()"></p><img zoomable ng-if="isImage()" ng-src="{{message.content}}"></a>',
            link: function(scope, iElement, iAttrs) {
                //console.log(iElement);
                scope.isImage = function() {
                    return /data:/.test(scope.message.content) ||  /http/.test(scope.message.content);
                }
            }
        };
    }]);

    app.directive('oggrHideSubHeaderOnScroll', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            priority: 0,
            link: function link($scope, $element, $attrs, ctrls, transcludeFn) {
                var start = 0;
                var threshold = 150;
                $scope.$parent.slideHeader = false;

                $element.addClass('will-hide-subheader');

                $element.bind('scroll', function(e) {
                    var hidden = (e.detail.scrollTop - start > threshold) ;
                    $timeout(function () {
                        $scope.$parent.slideHeader = hidden;
                        $element[(hidden)?'addClass':'removeClass']('subheader-hidden');
                    },0)
                });
            }
        };
    }])

    app.directive('oggrOnPullDown', ['$compile', function($compile) {
        return {
            restrict: 'A',
            require: ['?^$ionicScroll'], //^ ^^ ?^ ?^^
            priority: 1000,
            compile: function(tElement, tAttrs, transcludeFn) {
                //console.log('compile', tElement)
                //console.log(tAttrs)

                //tElement.addClass('scroll-refresher').addClass('invisible');
                tElement.addClass('oggr').addClass('bar-subheader');
                tAttrs.$set('name', '{{UI.labels[UI.lang].nav.calendar}}');
                //tAttrs.$set('ng-click', 'toggle()');
                //tElement.attr('on-scroll', 'toggle()');
                tElement.attr('ng-click', 'toggle()');

                return function link($scope, $element, $attrs, ctrls, transcludeFn) {

                    console.log('link', ctrls)

                    $scope.toggle = function(argument) {
                        console.log('toggle')
                    }

                    $element.removeAttr('oggr-on-pull-down');
                    $compile($element)($scope);

                    var start = 0;
                    var threshold = 150;

                    ctrls[0].$element.bind('scroll', function(e) {
                        console.log('scroll')
                        if (e.detail.scrollTop - start > threshold) {
                            $element.addClass('bar-subheader-slide-away');
                        } else {
                            $element.removeClass('bar-subheader-slide-away');
                        }
                        if (slideHeaderPrevious >= e.detail.scrollTop - start) {
                            $element.removeClass('bar-subheader-slide-away');
                        }
                        var slideHeaderPrevious = e.detail.scrollTop - start;
                        //$rootScope.$apply();
                    });


                    // $compile($element.contents())($scope);

                    // Controllers from require
                    //console.log(ctrls[0])

                    //Bind Once
                    //$element.html($scope.$eval($attrs.name));


                    //watcher
                    // $scope.$watch(
                    //     function($scope) {
                    //         return $scope.$eval($attrs.name);
                    //     },
                    //     function(newValue,oldValue) {
                    //         $element.html(newValue);
                    //         //???
                    //         //$compile($element.contents())($scope);
                    //     }
                    // );
                };

            }
        };
    }])



})();

// IonicModule
// .directive('ionRefresher', [function() {
//   return {
//     restrict: 'E',
//     replace: true,
//     require: ['?^$ionicScroll', 'ionRefresher'],
//     controller: '$ionicRefresher',
//     template:
//     '<div class="scroll-refresher invisible" collection-repeat-ignore>' +
//       '<div class="ionic-refresher-content" ' +
//       'ng-class="{\'ionic-refresher-with-text\': pullingText || refreshingText}">' +
//         '<div class="icon-pulling" ng-class="{\'pulling-rotation-disabled\':disablePullingRotation}">' +
//           '<i class="icon {{pullingIcon}}"></i>' +
//         '</div>' +
//         '<div class="text-pulling" ng-bind-html="pullingText"></div>' +
//         '<div class="icon-refreshing">' +
//           '<ion-spinner ng-if="showSpinner" icon="{{spinner}}"></ion-spinner>' +
//           '<i ng-if="showIcon" class="icon {{refreshingIcon}}"></i>' +
//         '</div>' +
//         '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' +
//       '</div>' +
//     '</div>',
//     link: function($scope, $element, $attrs, ctrls) {

//       // JS Scrolling uses the scroll controller
//       var scrollCtrl = ctrls[0],
//           refresherCtrl = ctrls[1];
//       if (!scrollCtrl || scrollCtrl.isNative()) {
//         // Kick off native scrolling
//         refresherCtrl.init();
//       } else {
//         $element[0].classList.add('js-scrolling');
//         scrollCtrl._setRefresher(
//           $scope,
//           $element[0],
//           refresherCtrl.getRefresherDomMethods()
//         );

//         $scope.$on('scroll.refreshComplete', function() {
//           $scope.$evalAsync(function() {
//             scrollCtrl.scrollView.finishPullToRefresh();
//           });
//         });
//       }

//     }
//   };
// }]);

// IonicModule
// .controller('$ionicRefresher', [
//   '$scope',
//   '$attrs',
//   '$element',
//   '$ionicBind',
//   '$timeout',
//   function($scope, $attrs, $element, $ionicBind, $timeout) {
//     var self = this,
//         isDragging = false,
//         isOverscrolling = false,
//         dragOffset = 0,
//         lastOverscroll = 0,
//         ptrThreshold = 60,
//         activated = false,
//         scrollTime = 500,
//         startY = null,
//         deltaY = null,
//         canOverscroll = true,
//         scrollParent,
//         scrollChild;

//     if (!isDefined($attrs.pullingIcon)) {
//       $attrs.$set('pullingIcon', 'ion-android-arrow-down');
//     }

//     $scope.showSpinner = !isDefined($attrs.refreshingIcon) && $attrs.spinner != 'none';

//     $scope.showIcon = isDefined($attrs.refreshingIcon);

//     $ionicBind($scope, $attrs, {
//       pullingIcon: '@',
//       pullingText: '@',
//       refreshingIcon: '@',
//       refreshingText: '@',
//       spinner: '@',
//       disablePullingRotation: '@',
//       $onRefresh: '&onRefresh',
//       $onPulling: '&onPulling'
//     });

//     function handleTouchend() {
//       // if this wasn't an overscroll, get out immediately
//       if (!canOverscroll && !isDragging) {
//         return;
//       }
//       // reset Y
//       startY = null;
//       // the user has overscrolled but went back to native scrolling
//       if (!isDragging) {
//         dragOffset = 0;
//         isOverscrolling = false;
//         setScrollLock(false);
//       } else {
//         isDragging = false;
//         dragOffset = 0;

//         // the user has scroll far enough to trigger a refresh
//         if (lastOverscroll > ptrThreshold) {
//           start();
//           scrollTo(ptrThreshold, scrollTime);

//         // the user has overscrolled but not far enough to trigger a refresh
//         } else {
//           scrollTo(0, scrollTime, deactivate);
//           isOverscrolling = false;
//         }
//       }
//     }

//     function handleTouchmove(e) {
//       // if multitouch or regular scroll event, get out immediately
//       if (!canOverscroll || e.touches.length > 1) {
//         return;
//       }
//       //if this is a new drag, keep track of where we start
//       if (startY === null) {
//         startY = parseInt(e.touches[0].screenY, 10);
//       }

//       // kitkat fix for touchcancel events http://updates.html5rocks.com/2014/05/A-More-Compatible-Smoother-Touch
//       if (ionic.Platform.isAndroid() && ionic.Platform.version() === 4.4 && scrollParent.scrollTop === 0) {
//         isDragging = true;
//         e.preventDefault();
//       }

//       // how far have we dragged so far?
//       deltaY = parseInt(e.touches[0].screenY, 10) - startY;

//       // if we've dragged up and back down in to native scroll territory
//       if (deltaY - dragOffset <= 0 || scrollParent.scrollTop !== 0) {

//         if (isOverscrolling) {
//           isOverscrolling = false;
//           setScrollLock(false);
//         }

//         if (isDragging) {
//           nativescroll(scrollParent, parseInt(deltaY - dragOffset, 10) * -1);
//         }

//         // if we're not at overscroll 0 yet, 0 out
//         if (lastOverscroll !== 0) {
//           overscroll(0);
//         }
//         return;

//       } else if (deltaY > 0 && scrollParent.scrollTop === 0 && !isOverscrolling) {
//         // starting overscroll, but drag started below scrollTop 0, so we need to offset the position
//         dragOffset = deltaY;
//       }

//       // prevent native scroll events while overscrolling
//       e.preventDefault();

//       // if not overscrolling yet, initiate overscrolling
//       if (!isOverscrolling) {
//         isOverscrolling = true;
//         setScrollLock(true);
//       }

//       isDragging = true;
//       // overscroll according to the user's drag so far
//       overscroll(parseInt((deltaY - dragOffset) / 3, 10));

//       // update the icon accordingly
//       if (!activated && lastOverscroll > ptrThreshold) {
//         activated = true;
//         ionic.requestAnimationFrame(activate);

//       } else if (activated && lastOverscroll < ptrThreshold) {
//         activated = false;
//         ionic.requestAnimationFrame(deactivate);
//       }
//     }

//     function handleScroll(e) {
//       // canOverscrol is used to greatly simplify the drag handler during normal scrolling
//       canOverscroll = (e.target.scrollTop === 0) || isDragging;
//     }

//     function overscroll(val) {
//       scrollChild.style[ionic.CSS.TRANSFORM] = 'translateY(' + val + 'px)';
//       lastOverscroll = val;
//     }

//     function nativescroll(target, newScrollTop) {
//       // creates a scroll event that bubbles, can be cancelled, and with its view
//       // and detail property initialized to window and 1, respectively
//       target.scrollTop = newScrollTop;
//       var e = document.createEvent("UIEvents");
//       e.initUIEvent("scroll", true, true, window, 1);
//       target.dispatchEvent(e);
//     }

//     function setScrollLock(enabled) {
//       // set the scrollbar to be position:fixed in preparation to overscroll
//       // or remove it so the app can be natively scrolled
//       if (enabled) {
//         ionic.requestAnimationFrame(function() {
//           scrollChild.classList.add('overscroll');
//           show();
//         });

//       } else {
//         ionic.requestAnimationFrame(function() {
//           scrollChild.classList.remove('overscroll');
//           hide();
//           deactivate();
//         });
//       }
//     }

//     $scope.$on('scroll.refreshComplete', function() {
//       // prevent the complete from firing before the scroll has started
//       $timeout(function() {

//         ionic.requestAnimationFrame(tail);

//         // scroll back to home during tail animation
//         scrollTo(0, scrollTime, deactivate);

//         // return to native scrolling after tail animation has time to finish
//         $timeout(function() {

//           if (isOverscrolling) {
//             isOverscrolling = false;
//             setScrollLock(false);
//           }

//         }, scrollTime);

//       }, scrollTime);
//     });

//     function scrollTo(Y, duration, callback) {
//       // scroll animation loop w/ easing
//       // credit https://gist.github.com/dezinezync/5487119
//       var start = Date.now(),
//           from = lastOverscroll;

//       if (from === Y) {
//         callback();
//         return; /* Prevent scrolling to the Y point if already there */
//       }

//       // decelerating to zero velocity
//       function easeOutCubic(t) {
//         return (--t) * t * t + 1;
//       }

//       // scroll loop
//       function scroll() {
//         var currentTime = Date.now(),
//           time = Math.min(1, ((currentTime - start) / duration)),
//           // where .5 would be 50% of time on a linear scale easedT gives a
//           // fraction based on the easing method
//           easedT = easeOutCubic(time);

//         overscroll(parseInt((easedT * (Y - from)) + from, 10));

//         if (time < 1) {
//           ionic.requestAnimationFrame(scroll);

//         } else {

//           if (Y < 5 && Y > -5) {
//             isOverscrolling = false;
//             setScrollLock(false);
//           }

//           callback && callback();
//         }
//       }

//       // start scroll loop
//       ionic.requestAnimationFrame(scroll);
//     }


//     self.init = function() {
//       scrollParent = $element.parent().parent()[0];
//       scrollChild = $element.parent()[0];

//       if (!scrollParent || !scrollParent.classList.contains('ionic-scroll') ||
//         !scrollChild || !scrollChild.classList.contains('scroll')) {
//         throw new Error('Refresher must be immediate child of ion-content or ion-scroll');
//       }

//       ionic.on('touchmove', handleTouchmove, scrollChild);
//       ionic.on('touchend', handleTouchend, scrollChild);
//       ionic.on('scroll', handleScroll, scrollParent);

//       // cleanup when done
//       $scope.$on('$destroy', destroy);
//     };

//     function destroy() {
//       ionic.off('touchmove', handleTouchmove, scrollChild);
//       ionic.off('touchend', handleTouchend, scrollChild);
//       ionic.off('scroll', handleScroll, scrollParent);
//       scrollParent = null;
//       scrollChild = null;
//     }

//     // DOM manipulation and broadcast methods shared by JS and Native Scrolling
//     // getter used by JS Scrolling
//     self.getRefresherDomMethods = function() {
//       return {
//         activate: activate,
//         deactivate: deactivate,
//         start: start,
//         show: show,
//         hide: hide,
//         tail: tail
//       };
//     };

//     function activate() {
//       $element[0].classList.add('active');
//       $scope.$onPulling();
//     }

//     function deactivate() {
//       // give tail 150ms to finish
//       $timeout(function() {
//         // deactivateCallback
//         $element.removeClass('active refreshing refreshing-tail');
//         if (activated) activated = false;
//       }, 150);
//     }

//     function start() {
//       // startCallback
//       $element[0].classList.add('refreshing');
//       $scope.$onRefresh();
//     }

//     function show() {
//       // showCallback
//       $element[0].classList.remove('invisible');
//     }

//     function hide() {
//       // showCallback
//       $element[0].classList.add('invisible');
//     }

//     function tail() {
//       // tailCallback
//       $element[0].classList.add('refreshing-tail');
//     }

//     // for testing
//     self.__handleTouchmove = handleTouchmove;
//     self.__getScrollChild = function() { return scrollChild; };
//     self.__getScrollParent = function() { return scrollParent; };
//   }
// ]);