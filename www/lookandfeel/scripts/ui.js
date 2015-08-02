var sheet = (function() {
	var style = document.createElement("style");
	// style.setAttribute("media", "only screen and (max-width : 1024px)")
	// WebKit hack :(
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	return style.sheet;
})();

function addCSSRule(selector, rules, index) {
	// if("insertRule" in sheet) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	// }
	// else if("addRule" in sheet) {
	// 	sheet.addRule(selector, rules, index);
	// }
}

// Use it!
//addCSSRule(document.styleSheets[0], "header", "float: left");

(function  () {

	/*
	Dashboard 			z(grey blanc noir) 
	Calendar 			z(bleus vert blanc) 
	Pulse 				z(vert jaune doré)
	Map 				z(jaune rouge) 
	Task Manager 		z(blue)
	Reminder 			z(rouge violet)
	Files 				z(bleus)
	Personnal Plannig 	z(clair mutlti blanc)
	Contact				z(blanc)
	Chat				z()
	Crew				z(red)

	 */

	//Sounds
	var sounds = {
		load:new Howl({urls: ['sounds/leaf.mp3'], volume: 0.5}),//OK
		alert:new Howl({urls: ['sounds/groar.mp3'], volume: 1}),
		open:new Howl({urls: ['sounds/page.mp3'], volume: 0.25}),
		meow:new Howl({urls: ['sounds/meow.mp3'], volume: 0.5})
	}
	//$ = document.querySelector.bind(document),
	var $$ = function (selector){
			var nodeList = document.querySelectorAll(selector);
			return Array.prototype.slice.call(nodeList)
		}

	var config = {
		width : window.innerWidth,
		height: window.innerHeight,
		current:0,
		dashboard:{
			shrink:false,
			size:$('.deck > nav').width(),
			shrinkSize:$('.deck > nav > div:first-of-type').width(),
		}
	}

	var targets = $$('header nav'),
		ui = window.ui = {},
		main = $('main>section.content'),
		bg = $('.background'),
		dashboard = $('header .deck');

	targets.forEach(function (element,i) {
		var layout = ui[i] = getPattern(element);
		
		element.querySelector('div').style.backgroundImage = 'url('+layout.png+')'
    	element.querySelector('h2').style.color = layout.color;
    	element.style.color = layout.color;
    	element.dataset.index = i;

    	addCSSRule(".pane-"+i, "color: "+ layout.color);
    	addCSSRule(".pane-"+i+" form", "color: "+ layout.color);
    	element.classList.add("pane-"+i);
    	if(i==1)addCSSRule(".calendar .event", "background-color: "+ layout.color);

    	var mc = new Hammer.Manager(element, {});

		var singleTap = new Hammer.Tap({event: 'singletap' });
		var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
		var tripleTap = new Hammer.Tap({event: 'tripletap', taps: 3 });

		mc.add([tripleTap, doubleTap, singleTap]);

		tripleTap.recognizeWith([doubleTap, singleTap]);
		doubleTap.recognizeWith(singleTap);

		doubleTap.requireFailure(tripleTap);
		singleTap.requireFailure([tripleTap, doubleTap]);

    	mc.on('singletap', tapHandler);
    	mc.on('doubletap', doubletapHandler);

    	function doubletapHandler (evt) {
    		var size = (config.dashboard.shrink)?config.dashboard.size:config.dashboard.shrinkSize;
    		$(targets).velocity({width:size})
    		//dashboard.velocity({'left':size * element.dataset.index * -1});
    		config.dashboard.shrink=!config.dashboard.shrink;
    	}

    	function tapHandler(){

    		//$(targets).velocity({width:config.dashboard.size})

    		if(element.dataset.index == config.current){
    			$(element).velocity("callout.pulse",600);
    			return false;
    		} 
    		config.current = element.dataset.index;

    		
    		var svg = $(ui[element.dataset.index].svg),
    			content = $(getSync( 'views/' + element.dataset.index + '.html'))
    			//content = $(getSync( 'views/' + 10 + '.html'))

    		
    		$(element).velocity("callout.pulse",500);
    		
    		bg.prepend(svg.velocity("callout.pulse",800));

    		sounds.load.play()
    		
    		main.children().velocity("transition.slideDownBigOut",{
    			duration:300,
    			delay: 200,
    			complete:function() {
			        main.html('');
			        main.append(content);
			        main.children().velocity("transition.slideLeftIn",{ drag: true },500);
			        //bg.children().gt(1).remove();
		   	 	}
		    });
 		
    	}
	})
	//console.log(JSON.stringify(ui))
	$('.background').append(ui[0].svg);

	
	
	//Notifications

	function setRandomBackgroundSection(element,png){
		//Random Notification Link Icon Background
		var rnd = Math.floor(Math.random() * targets.length);
		element.style.background = ui[rnd].color;
		if(png)element.style.backgroundImage = 'url('+ui[rnd].png+')';
	}

	$('.notification').hide()

	$('footer i').eq(1).click(function(){		
		setRandomBackgroundSection($('.notification .link')[0],true);
		$('.notification').velocity("transition.bounceUpIn",500);
		sounds.alert.play()
	})
	
	$('.notification').click(function(evt){
		sounds.meow.play()
		$(this).velocity("transition.bounceDownOut");
	})


	//Notifications List
	$('.notification-item .link').each(function(i,e){
		setRandomBackgroundSection(e);
	})
	$('.notification-list').hide();

	var options = {
  		preventDefault: true
	};
	var nl = new Hammer($('.content')[0]);
	var isListOpen = true;
	nl.on("doubletap", function(ev){
		var animation = (isListOpen=!isListOpen)?'slideUp':'slideDown';
		$('.notification-list').velocity(animation);
		sounds.open.play()
	});	
	var nlo = new Hammer($('.notification-list')[0], options);
	nlo.on("doubletap", function(ev){
		var animation = (isListOpen=!isListOpen)?'slideUp':'slideDown';
		$('.notification-list').velocity(animation);
		sounds.open.play()
	});	


	//Dashboard
	var hammertime = new Hammer(dashboard[0]);
	hammertime.on('pan', function(ev) {
	    dashboard.scrollLeft(ev.deltaX)
	});
	hammertime.on('panend', function(ev) {
		var w = (ev.offsetDirection == Hammer.DIRECTION_RIGHT)?-1:1;
		if(w==1 && dashboard[0].offsetLeft == 0)return;
		w = dashboard[0].offsetLeft + config.width * w
	    dashboard.velocity({'left':w},{ duration: "fast" ,easing:"easeOutCubic"});	 
	});


	//Utilities 

	window.getSync = function getSync(url){
		var xhr  = new XMLHttpRequest();
		xhr.open('GET',url,false)
		xhr.send();
		return xhr.responseText;
	}

	function getPattern(target){

		var pattern = Trianglify({
	        width: config.width,
	        height: config.height,
	        cell_size:100,
	        variance:2,
	        //x_colors:['black','lightGray','darkGray','white']
	        //RAINBOF x_colors:['#fea3aa','#f8b88b','#faf884','#baed91','#b2cefe','#f2a2e8']
		});

		var png = Trianglify({
	        width: target.offsetWidth +1,
	        height: target.offsetHeight,
	        cell_size:30,
	        variance:2,
	        x_colors:pattern.opts.x_colors.reverse(),
		});

		var color = png.opts.x_colors[4]

		return {
			svg:pattern.svg(),
			png:png.png(),
			color:color,
			settings:[pattern,png]
		};
	}

})();