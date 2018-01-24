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