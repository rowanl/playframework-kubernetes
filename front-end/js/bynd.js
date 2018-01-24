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