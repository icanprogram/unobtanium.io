(function($){
	function Halving(height, distance){
		var blocktime = 180;

		this.height = height;
		this.distance = distance;
		
		this.getTime = function(){
			var time = new Date();
			time.setSeconds(time.getSeconds() + blocktime * this.distance);
			return time;
		}
	}

	$(function(){
		var blockhalving = 102000, maxhalving = 612000, halvings = [], i, donehalvings, distance, height, j;
		
		$.getJSON("http://rockchain.info/chain/Unobtanium/q/getblockcount", function(current){
			//Make the calculations
			i = current;
			while(i < maxhalving){
				//Calculate the number of halvings that have already occurred
				donehalvings = Math.floor(i/blockhalving);
				//Calculate the number of blocks we're away from the next
				distance = (blockhalving*donehalvings) - (current%blockhalving);
				//Calculate the height of the next halving
				height = (donehalvings + 1) * blockhalving;
				halvings.push(new Halving(height, distance));
				
				i += blockhalving;
			}
			
			//Make a pretty table
			for(j = 0; j < halvings.length; j++){
				$("table#stats_halving_table thead tr").append($("<th>").text("Block #" + halvings[j].height));
				$("table#stats_halving_table tbody tr").append($("<td>").append($("<abbr>").addClass("timeago").attr("title", halvings[j].getTime().toISOString()).text("In " + halvings[j].distance + " blocks")));
			}
			
			$.timeago.settings.allowFuture = true;
			$("abbr.timeago").timeago();
			
			$("#stats_halving_spinner").addClass("hidden");
		});
	});
})(jQuery);
