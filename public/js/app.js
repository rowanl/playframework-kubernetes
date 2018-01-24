/*global*/

if(!window.console){
	var console = {
		log: function(){}
	};
}

var bynd = (function(){
	
	var hiddenClass = 'hdn'; //class to hide elements
	var maskEl;
	
	function get(id){
		if(typeof id === "string"){
			return document.getElementById(id);	
		} 
		return id;
	} 

	function show(id){
		removeClass(id, hiddenClass);
	}

	function hide(id){
		addClass(id, hiddenClass);
	}

	function addClass(id, className){
		var el;
		if(typeof(el) === "string"){
			el = get(id);
		} else {
			el = id;
		}
		
		if(!el) {
			return;
		}
		el.classList.add(className);
	}

	function removeClass(id, className){
		var el = get(id);
		if(!el) {
			return;
		}
		el.classList.remove(className);
	}

	function hasClass(el, className){
		return el.classList.contains(className);
	}

	/** 
	 * @return [Boolean] true to say class has been added false removed
	 */
	function switchClass(el, className){
		if(hasClass(el, className)){
			removeClass(el, className);
			return false;
		} else {
			addClass(el, className);
			return true;
		}
	}

	/**
	 * Removes class from all siblings and adds class to given element
	 */
	function radioClass(el, className){
		var nodes = el.parentNode.children,
			l = nodes.length,
			i = 0;

		while(i < l){
			removeClass(nodes[i], className);
			++i;
		}
		addClass(el, className);
	}

	function nodeListToArray(list){
		return Array.prototype.slice.call(list, 0); 
	}

	//remove no-js class on load
	(function(){
		document.getElementsByTagName("body")[0].classList.remove("no-js");
	})();

	//add polyfill for Edge
	if (!NodeList.prototype.forEach && Array.prototype.forEach) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}

	return {
		get : get,
		show: show,
		hide: hide, 
		addClass: addClass,
		removeClass: removeClass,
		hasClass: hasClass,
		switchClass: switchClass,
		nodeListToArray: nodeListToArray,
		radioClass: radioClass
	};
})();
/*global
	bynd, console
*/
bynd.dialog = (function(){
	var isShowing = false;
	var el = bynd.get('js-modal');

	var body = document.getElementsByTagName("body")[0];
	var maskEl = bynd.get('js-mask');

	if(!maskEl){
		return;
	}

	var contentEl = body.querySelector(".js-content");
	var buttonEl = el.querySelector('.js-close');

	addListeners();	
	resizeListener();

	function show(){
		isShowing = true;

		_animEl();
		mask();
	}

	function _animEl(){
		bynd.addClass(el, 'opacity-0');
		bynd.show(el);
		setTimeout(function(){
			bynd.removeClass(el, 'opacity-0');
		},100);
	}

	function mask(){
		maskEl.removeAttribute("inert");
		body.setAttribute("inert", '');
		lockHeight();
		contentEl.scrollTop = 0;
		bynd.show(maskEl);
	}

	function unmask(){
		body.removeAttribute("inert");
		maskEl.setAttribute("inert", '');
		bynd.hide(maskEl);
		unlockHeight();
	}

	function hide(){
		isShowing = false;
		bynd.hide(el);
		unmask();
	}

	function addListeners(){
		buttonListener();
		escapeListener();
		maskListener();
		
		//on resize to calculate new scroll heights 
		resizeListener();
	}

	function resizeListener(){
		window.addEventListener('resize', function(){
			if(isShowing){
				lockHeight();	
			}
		});
	}

	function buttonListener(){
		buttonEl.addEventListener("click", hide);
	}

	function escapeListener(){
		document.onkeyup = function(evt) {
			evt = evt || window.event;
			var isEscape = false;
			if ("key" in evt) {
				isEscape = (evt.key === "Escape" || evt.key === "Esc");
			} else {
				isEscape = (evt.keyCode === 27);
			}
			if (isEscape) {
				hide();
			}
		};
	}

	/*
	 * Shim mask listener to emulate clicking on background to close dialog box
	 */
	function maskListener(){
		el.addEventListener('click', function(e){
			e.stopPropagation(); //cancel bubble
		});
		maskEl.addEventListener('click', function(e){
			e.stopPropagation(); //cancel bubble
			hide();
		});
	}

	function lockHeight(){
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		body.style.overflowY = "hidden";
		body.style.height = h + 'px';
	}

	function unlockHeight(){
		body.style.overflowY = "scroll";
		body.style.height = "100%";
	}

	return {
		show: show,
		mask: mask,
		unmask: unmask,
		hide: hide,
		lockHeight: lockHeight,
		unlockHeight: unlockHeight
	};
})();
/*
 * Method fixes scroll errors by adding a class ot the body on scroll, we can then attach CSS for pointer events to it.
 */
(function(){
	var body = document.getElementsByTagName("body")[0];
	var className = "scrolling";
	var scrolling = false;
	var timer;

	function onScroll(e){
		clearTimeout(timer);

		if(!scrolling){
		 	window.requestAnimationFrame(function() {
				body.classList.add(className);
				scrolling = true;
			});	
		}
		timer = setTimeout(removeScrollClass, 50);
	}

	function removeScrollClass(){
		scrolling = false;
		body.classList.remove(className);
	}
	
	window.addEventListener("scroll", onScroll, false);
})();
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
function Swipe(elem, callback) {
	var self = this;
	this.callback = callback;

	function handleEvent(e) {
		self.touchHandler(e);
	}

	elem.addEventListener('touchstart', handleEvent, false);
	elem.addEventListener('touchmove', handleEvent, false);
	elem.addEventListener('touchend', handleEvent, false);
}

Swipe.prototype.touches = {
	"touchstart": {"x":-1, "y":-1},
	"touchmove" : {"x":-1, "y":-1},
	"touchend"  : false,
	"direction" : "undetermined"
};

Swipe.prototype.touchHandler = function (event) {
	var touch;
	if (typeof event !== 'undefined'){
		if (typeof event.touches !== 'undefined') {
			touch = event.touches[0];
			switch (event.type) {
				case 'touchstart':
				case 'touchmove':
					this.touches[event.type].x = touch.pageX;
					this.touches[event.type].y = touch.pageY;
					break;
				case 'touchend':
					this.touches[event.type] = true;
					var x = (this.touches.touchstart.x - this.touches.touchmove.x),
						y = (this.touches.touchstart.y - this.touches.touchmove.y);
					if (x < 0) {
						x /= -1;
					}
					if (y < 0) {
						y /= -1;
					if (x > y){
						this.touches.direction = this.touches.touchstart.x < this.touches.touchmove.x ? "right" : "left";
					} else {
						this.touches.direction = this.touches.touchstart.y < this.touches.touchmove.y ? "down" : "up";
					}

					this.callback(event, this.touches.direction);
					break;
				}
			}
		}
	}
};
/*global
	bynd
*/

(function(){
	var jsClass = 'has-js';
	var body = document.getElementsByTagName("body")[0];
	bynd.addClass(body, jsClass);

	if (!("ontouchstart" in document.documentElement)) {
		bynd.addClass(body, "no-touch");
	}
})();
/*global
	bynd, console
*/
bynd.voteButton = (function(){
	var selectedClass = "selected";

	(function init(){
		var links = document.querySelectorAll(".js-show-modal");
		var l = links.length;
		var i = 0;

		while(i < l){
			addListener(links[i]);
			++i;
		}	
	})();
	
	function addListener(el){
		el.addEventListener("click", function(e){
			e.preventDefault();
			showModal(e.target);
		});
	}

	function showModal(el){
		var showString = el.getAttribute("data-show");
		
		if(showString != null){
			var showEl = document.querySelector("." + showString);
			
			if(!showEl){
				return;
			}
			bynd.radioClass(showEl, selectedClass);
			bynd.dialog.show();
		}

		return;
	}
})();