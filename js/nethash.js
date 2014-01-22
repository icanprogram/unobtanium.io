(function($){
	function getRewardAt(height){
		if(height < 102000){
			return 1;
		}else if(height < 204000){
			return 0.5;
		}else if(height < 306000){
			return 0.25;
		}else if(height < 408000){
			return 0.125;
		}else if(height < 510000){
			return 0.0625;
		}else if(height < 612000){
			return 0.03125;
		}else{
			return 0.00001;
		}
	}

	$(function(){
		$.getJSON("http://rockchain.info/chain/Unobtanium/q/nethash/480?format=json", function(data){
			var nethash_line = [], coins_line = [[],[]], total_coins = 250000, reward, maxline;
			
			coins_line[0].push([new Date(1382083639*1000), 0]);
			coins_line[1].push([new Date(1382083639*1000), total_coins]);
			
			$.each(data, function(i, day_raw){
				nethash_line.push([new Date(day_raw[1]*1000), parseInt(day_raw[7])/1000000000000]);
				
				reward = coins_line[0].slice(-1)[0][1] + 480*getRewardAt(day_raw[0]);
				coins_line[0].push([new Date(day_raw[1]*1000), reward]);
				coins_line[1].push([new Date(day_raw[1]*1000), total_coins - reward]);
			});
			
			$("#stats_hashrate_graph").removeClass("hidden");
			$("#stats_hashrate_spinner").addClass("hidden");
			
			var nethash_plot = $.jqplot('stats_hashrate_graph', [nethash_line], {
				axes: {
					xaxis: {
						renderer:$.jqplot.DateAxisRenderer,
						tickOptions: {
							formatString: '%d/%m/%Y'
						}
					},
					yaxis:{
						tickOptions:{
							formatString:'%.5f Th/s'
						},
						min: 0
					}
				},
				series: [{
					lineWidth: 4/*,
					markerOptions: { style: 'square' }*/
				}],
				highlighter: {
					show: true,
					sizeAdjust: 7.5
				},
				cursor: {
					show: true,
					zoom: true
				},
				grid: {
					drawGridLines: true,
					gridLineColor: '#32383e',
					background: '#292e33',
					borderWidth: 0,
					shadow: false,
					renderer: $.jqplot.CanvasGridRenderer,
					rendererOptions: {}
				},
				seriesColors: ["#62c462"]
			});
			
			$("#stats_coins_graph").removeClass("hidden");
			$("#stats_coins_spinner").addClass("hidden");
			
			var coins_plot = $.jqplot('stats_coins_graph', [coins_line[0], coins_line[1]], {
				axes: {
					xaxis: {
						renderer:$.jqplot.DateAxisRenderer,
						tickOptions: {
							formatString: '%d/%m/%Y'
						}
					},
					yaxis:{
						tickOptions:{
							formatString:'%d UNO'
						},
						min: 0
					},
					y2axis:{
						tickOptions:{
							formatString:'%d UNO'
						},
						min: 0
					}
				},
				series: [{
					lineWidth: 4/*,
					markerOptions: { style: 'square' }*/
				}],
				highlighter: {
					show: true,
					sizeAdjust: 7.5
				},
				cursor: {
					show: true,
					zoom: true
				},
				grid: {
					drawGridLines: true,
					gridLineColor: '#32383e',
					background: '#292e33',
					borderWidth: 0,
					shadow: false,
					renderer: $.jqplot.CanvasGridRenderer,
					rendererOptions: {}
				},
				canvasOverlay: {
					show: true,
					objects: [ maxline ]
				},
				seriesColors: ["#5bc0de", "#62c462"]
			});
			
			$(window).resize(function(){
				nethash_plot.replot({ resetAxes: true });
				coins_plot.replot({ resetAxes: true });
			});
		});
	});
})(jQuery);