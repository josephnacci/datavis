var barChart = (function barChart(){
	var t = d3.transition()
	.duration(0);
	return {
	    drawWindow: function(chart_params){
		//console.log(chart_params);
		// set the dimensions and margins of the graph
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = chart_params['width'] - margin.left - margin.right,
			height = chart_params['height'] - margin.top - margin.bottom;
		        
		    // set the ranges
		    var x = d3.scaleBand()
			.range([0, width])
			.padding(0.1);
		    var y = d3.scaleLinear()
			.range([height, 0]);
		        
		    // append the svg object to the body of the page
		    // append a 'group' element to 'svg'
		    // moves the 'group' element to the top left margin
		    var svg = d3.select(chart_params['selector']).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
			      "translate(" + margin.left + "," + margin.top + ")");
		    return {'margin': margin,
			    'height': height,
			    'width': width,
			    'xaxis': x,
			    'yaxis': y,
			    'svg': svg,
			    'selector': chart_params.selector}
	    },
		
		fillChart: function (params){
		var margin = params.margin;
		var height = params.height;
		var width = params.width;
		var x = params.xaxis;
		var y = params.yaxis;
		var svg = params.svg;
		var selector = params.selector;
		var data_json = params.data_url;
		//console.log('jj', data_json);
		// get the data
		d3.json(data_json, function(error, data) {
			if (error) throw error;
			
			// format the data
			//data.forEach(function(d) {
			//    d.sales = +d.sales;
			//});
			//console.log(data);

			
			// Scale the range of the data in the domains
			x.domain(data.map(function(d) { return d.category; }));
			y.domain([0, d3.max(data, function(d) { return d.data; })]);
			
			// append the rectangles for the bar chart
			var chart = svg.selectAll(".bar")
			    .data(data)
			    .enter().append("rect")
			    .attr("class", "bar")
			    .attr("x", function(d) { return x(d.category); })
			    .attr("width", x.bandwidth())
			    .attr("y", function(d) { return y(d.data); })
			    .attr("height", function(d) { return height - y(d.data); })    ;


			
			// add the x Axis
			svg.append("g")
			    .attr("transform", "translate(0," + height + ")")
			    .attr("class", "x axis")
			    .call(d3.axisBottom(x));
			
			// add the y Axis
			svg.append("g")
			    .attr("class", "y axis")
			    .call(d3.axisLeft(y));


			
			chart.exit().remove()

			    params.svg = chart;
			
		    });
		    return params
			}
	};
	//this reefers to the bars' SVG
    });
