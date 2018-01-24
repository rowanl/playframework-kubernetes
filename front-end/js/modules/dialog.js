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