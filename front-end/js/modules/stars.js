/*global
	bynd, console
*/
bynd.stars = (function(){

	//var imgSrc = "/assets/i/desktop/bigstar-end.png";
	var imgSrc = "/assets/i/desktop/star.gif";
	//var animClass = "spin";

	var body = document.getElementsByTagName("body")[0];
	var main = document.getElementsByTagName("main")[0];

	var starPadding = 60;
	var parentEl = body;

	if(!parentEl){
		return;
	}

	var img = new Image();
		img.className = "star";

	var bgStarCount = 40;
	var bgStar = document.createElement("i");
		bgStar.className = "bg-star";

	var resizing = false;
	var timer;

	//always create bg stars
	createBackgroundStars();

	// if we are on the results page show the sparkley star, otherwise just fade in
	setTimeout(function(){
		bynd.addClass(main, "show");
		if(bynd.hasClass(body, "votepage")){
			setTimeout(function(){
				bynd.addClass(body, "on");
				//showStars();				
			}, 500);
		}
	}, 300);

	function randomCoords(){
		var coords = {};

		//viewport width, get this everytime to not worry about resize
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		//keep to top 400 px 
		coords.top = Math.floor(Math.random() * 450) + 1;

		//keep within boundary of starPadding, will center stars in element plus padding
		coords.left = Math.floor(Math.random() * (w-starPadding) + (starPadding/2)) + 1;
		return coords;
	}

	function createStar(){
		var coords = randomCoords();
		var star = img.cloneNode(true);
			star.style.top = coords.top + "px";
			star.style.left = coords.left + "px";

		parentEl.appendChild(star);

		setTimeout(function(){
			deleteStar(star);
		}, 2000);	
	}

	function deleteStar(star){
		parentEl.removeChild(star);
	}

	function createBackgroundStars(){
		var i = 0;
		var l = bgStarCount;

		while(i < l){
			createBackgroundStar();
			++i;
		}
	}

	function createBackgroundStar(){
		var coords = randomCoords();
		var star = bgStar.cloneNode(true);
			star.style.top = coords.top + "px";
			star.style.left = coords.left + "px";

		parentEl.appendChild(star);
	}

	function repaintBackgroundStars(){
		parentEl.querySelectorAll("." + bgStar.className).forEach(function(item){
			parentEl.removeChild(item);
		});
		createBackgroundStars();
	}

	function onResize(e){
		clearTimeout(timer);

		if(!resizing){
		 	window.requestAnimationFrame(function() {
		 		repaintBackgroundStars();
				resizing = true;
			});	
		}
		timer = setTimeout(removeResizeClass, 600);
	}

	function removeResizeClass(){
		resizing = false;
	}
	
	window.addEventListener("resize", onResize, false);
})();