(function  () {
	var $ = document.querySelector.bind(document),
		$$ = function (selector){
			var nodeList = document.querySelectorAll(selector);
			return Array.prototype.slice.call(nodeList)
		}

	window.getSync = function(url){
		var xhr  = new XMLHttpRequest();
		xhr.open('GET',url,false) && xhr.send();
		return xhr.responseText;
	}

	function getPattern(target){

		var pattern = Trianglify({
	        width: window.innerWidth,
	        height: window.innerHeight,
	        cell_size:100,
	        variance:2,
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
	$('header').onscroll = function (event) {
		console.log(event);
		console.log(event.target.scrollLeft)
		//event.target.scrollLeft += 375
		//event.preventDefault();
		event.preventDefault();
    	event.stopPropagation();
  		event.returnValue = false;
	}

	var targets = $$('header nav'),
		ui = {},
		//uiSets = getJSONSync('scripts/ui-sets.json')

	targets.forEach(function (element,i) {
		var layout = ui[i] = getPattern(element);
		element.querySelector('div').style.backgroundImage = 'url('+layout.png+')'
    	element.querySelector('h2').style.color = layout.color;
    	element.dataset.index = i;
    	element.onclick = function(){
    		var bg = $('.background')
    		bg.removeChild(bg.lastChild);
    		bg.appendChild(ui[this.dataset.index].svg);
    	}
	})
	console.log(JSON.stringify(ui))
	$('.background').appendChild(ui[0].svg);




	
	// var colorFunc = function(x, y) {
	//    return 'hsl('+Math.floor(Math.abs(x*y)*360)+',80%,60%)';
	// };

	//var colors = ['#000000', '#FFFFFF','hotPink','Fuchsia']

    /*var pattern = Trianglify({
        width: window.innerWidth,
        height: window.innerHeight,
        cell_size:100,
        variance:2,
        //color_space: "rgb",
        //seed:12345,
        //color_function: colorFunc,
        //x_colors:['#000000', '#4CAFE8', '#FFFFFF','red']
        //x_colors:['#000000', 'yellow', '#FFFFFF','Fuchsia','Fuchsia']
        //x_colors:['#000000','Fuchsia', '#FFFFFF'],
        //x_colors:colors,
        //x_colors:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
    });*/

    //console.log(pattern)
    //$('.background').appendChild(pattern.svg())

 /*
    colors = ['#000000','hotPink','Fuchsia', '#FFFFFF']
    colors = pattern.opts.x_colors;
    var target = $('header nav>div');
    
    var pattern = Trianglify({
        width: target.offsetWidth +1,
        height: target.offsetHeight,
        cell_size:30,
        variance:2,
        //color_space: "rgb",
        x_colors:colors.reverse(),
	});

    target.style.backgroundImage = 'url('+pattern.png()+')'

    $('header nav h2').style.color = pattern.opts.x_colors[4];
*/

})()

/*
// Ca c'est classe : Zoé !
// Green Orange Blue
0: "#053061"1: "#2166ac"2: "#4393c3"3: "#92c5de"4: "#d1e5f0"5: "#f7f7f7"6: "#fddbc7"7: "#f4a582"8: "#d6604d"9: "#b2182b"10: "#67001f"
//Nice blue
0: "#081d58"1: "#253494"2: "#225ea8"3: "#1d91c0"4: "#41b6c4"5: "#7fcdbb"6: "#c7e9b4"7: "#edf8b1"8: "#ffffd9"
*/