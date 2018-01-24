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