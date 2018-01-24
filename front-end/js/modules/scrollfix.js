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