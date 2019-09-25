var groupedScatter = (function groupedScatter(data, selector){
	return {
	    drawWindow: function(chart_params){

		height = chart_params.height;
		width = chart_params.width;
		selector = chart_params.selector;
		    
		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 30, bottom: 30, left: 60},
		width = 460 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;
		    
		// append the svg object to the body of the page
		var svg = d3.select(selector)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
		      "translate(" + margin.left + "," + margin.top + ")");
		//    console.log(chartBase);

		var x = d3.scaleLinear()
		.range([0, width]);

		var y = d3.scaleLinear()
		.range([height, 0]);
		    
		return {'margin': margin,
			'svg': svg,
			'xaxis': x,
			'yaxis': y,
			'margin': margin,
			'height': height,
			'width': width
			}
	    },   
	    fillChart: function(params){
		//Read the data
		var margin = params.margin;
		var height = params.height;
		var width = params.width;
		    var x = params['xaxis']
		    var y = params['yaxis']
		    var selector = params['selector']
		    var data_url = params['data_url']
		    var svg = params['svg']
		    
		d3.json(data_url, function(data) {
			console.log(data);
			// Add X axis
			x.domain([4, 8]);
			
			svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));
			
			// Add Y axis
			y.domain([0, 9]);
			
			svg.append("g")
			.call(d3.axisLeft(y));
			
			// Color scale: give me a specie name, I return a color
			var color = d3.scaleOrdinal()
			.domain(["husky", "dachshund", "labrador" ])
			.range([ "#440154ff", "#21908dff", "#fde725ff"])
			
			
			// Highlight the specie that is hovered
			var highlight = function(d){
			    //console.log(chartBase);
			    //chartBase = barChart("sales.csv", "#bar_chart", 100).fillChart("http://localhost:5000/bar_chart", chartBase, "#bar_chart");
			    //barChartWindowParams = barChart().fillChart(barChartWindowParams);
			        
			        selected_specie = d.group
				    
				d3.selectAll(".dot")
				.transition()
				.duration(200)
				.style("fill", "lightgrey")
				.attr("r", 3)
				    
				d3.selectAll("." + selected_specie)
				.transition()
				.duration(200)
				.style("fill", color(selected_specie))
				.attr("r", 7)
			}
			
			// Highlight the specie that is hovered
			var doNotHighlight = function(){
			    d3.selectAll(".dot")
			    .transition()
			    .duration(200)
			    .style("fill", function (d) { return color(d.group) })
			    .attr("r", 5 )
			}
			
			// Add dots
			svg.append('g')
			.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", function (d) { return "dot " + d.group } )
			.attr("cx", function (d) { return x(d.x); } )
			.attr("cy", function (d) { return y(d.y); } )
			.attr("r", 5)
			.style("fill", function (d) { return color(d.group) } )
			.on("mouseover", highlight)
			.on("mouseleave", doNotHighlight )
			
		    });
		    
		    return params
	    }
	}
    });

