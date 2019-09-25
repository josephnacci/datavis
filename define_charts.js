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
		    .attr("height", function(d) { return height - y(d.data); })	    ;


		
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


var hGroupedBar = (function hGroupedBar(data, selector){
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 500 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
    
    var x = d3.scaleLinear()
        .range([0, width]);
    
    var y0 = d3.scaleBand();
        

    var y1 = d3.scaleBand();


    var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.json(data, function(data) {

	//console.log('ii', data)

	//x0.domain(['group 1', '0']);
	//console.log(x0);
	
	y0.domain(d3.map(data, function(d) { return d.category;}).keys())
	    .rangeRound([height, 0])//width - margin.right])
	    .paddingInner(0.1);
	    //.range([0, width], 0.5);
	//console.log(x0('group 0'), d3.map(data, function(d) { console.log(d.groups); return d.groups;}).keys());
	
	y1.domain(d3.map(data, function(d) { return d.groups;}).keys())
            .rangeRound([0, y0.bandwidth()])
	    .padding(0.05);
            //.range([0, x0.bandwidth()]);
	//console.log(x1, d3.map(data, function(d) { console.log(d.category); return d.category;}).keys());
	
	x.domain([0, 1])
	
	
	var z = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	

	
	svg.append("g").selectAll("g")
            .data(data)
	    .enter().append("g")
            .style("fill", function(d, i) { return z(d.groups); })
            .attr("transform", function(d, i) { return "translate(0," + y1(d.groups) + ")"; })
	    //.selectAll("rect")
            //.data(function(d) { return d; }).enter()
	    .append("rect")
            .attr("height", y1.bandwidth())
            .attr("width", function(d) { return x(d.data);})//function() {console.log( y); return y;})
            .attr("y", function(d, i) { return y0(d.category); })
            .attr("x", 0)//function(d, i) { console.log(x(d.data)); return x(d.data); });



	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .attr("class", "x axis")
	    .call(d3.axisBottom(x));

	// add the y Axis
	svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.axisLeft(y0));
	
    });



});
    



var groupedBar = (function groupedBar(data, selector){

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 500 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var y = d3.scaleLinear()
        .range([height, 0]);
    
    var x0 = d3.scaleBand();
        

    var x1 = d3.scaleBand();


    var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    d3.json(data, function(data) {

	//console.log('ii', data)

	//x0.domain(['group 1', '0']);
	//console.log(x0);
	
	x0.domain(d3.map(data, function(d) { return d.category;}).keys())
	    .rangeRound([0, width])//width - margin.right])
	    .paddingInner(0.1);
	    //.range([0, width], 0.5);
	//console.log(x0('group 0'), d3.map(data, function(d) { console.log(d.groups); return d.groups;}).keys());
	
	x1.domain(d3.map(data, function(d) { return d.groups;}).keys())
            .rangeRound([0, x0.bandwidth()])
	    .padding(0.05);
            //.range([0, x0.bandwidth()]);
	//console.log(x1, d3.map(data, function(d) { console.log(d.category); return d.category;}).keys());
	
	y.domain([0, 10])
	
	
	var z = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	

	
	svg.append("g").selectAll("g")
            .data(data)
	    .enter().append("g")
            .style("fill", function(d, i) { return z(d.groups); })
            .attr("transform", function(d, i) { return "translate(" + x0(d.category) + ",0)"; })
	    //.selectAll("rect")
            //.data(function(d) { return d; }).enter()
	    .append("rect")
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return y(0) - y(d.data);})//function() {console.log( y); return y;})
            .attr("x", function(d, i) { return x1(d.groups); })
            .attr("y", function(d, i) { console.log(y(d.data)); return y(d.data); });



	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .attr("class", "x axis")
	    .call(d3.axisBottom(x0));

	// add the y Axis
	svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.axisLeft(y));
	
    });



});



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


var multiHistogram = (function multiHistogram(data, selector){

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
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

    // get the data
    d3.csv(data, function(data) {

	// X axis: scale and draw:
	var x = d3.scaleLinear()
	    .domain([-4,9])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
	    .range([0, width]);
	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	// set the parameters for the histogram
	var histogram = d3.histogram()
	    .value(function(d) { return +d.value; })   // I need to give the vector of value
	    .domain(x.domain())  // then the domain of the graphic
	    .thresholds(x.ticks(40)); // then the numbers of bins

	// And apply twice this function to data to get the bins.
	var bins1 = histogram(data.filter( function(d){return d.type === "variable 1"} ));
	var bins2 = histogram(data.filter( function(d){return d.type === "variable 2"} ));

	// Y axis: scale and draw:
	var y = d3.scaleLinear()
	    .range([height, 0]);
	y.domain([0, d3.max(bins1, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
	svg.append("g")
	    .call(d3.axisLeft(y));

	// append the bars for series 1
	svg.selectAll("rect")
	    .data(bins1)
	    .enter()
	    .append("rect")
	    .attr("x", 1)
	    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
	    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
	    .attr("height", function(d) { return height - y(d.length); })
	    .style("fill", "#69b3a2")
	    .style("opacity", 0.6)

	// append the bars for series 2
	svg.selectAll("rect2")
	    .data(bins2)
	    .enter()
	    .append("rect")
	    .attr("x", 1)
	    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
	    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
	    .attr("height", function(d) { return height - y(d.length); })
	    .style("fill", "#404080")
	    .style("opacity", 0.6)

	// Handmade legend
	svg.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
	svg.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "#404080")
	svg.append("text").attr("x", 320).attr("y", 30).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
	svg.append("text").attr("x", 320).attr("y", 60).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")

    });

    
});


var hBarPlot = (function hBarPlot(data, selector){

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 90},
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

    // Parse the Data
    d3.json(data, function(data){

	// Add X axis
	var x = d3.scaleLinear()
	    .range([ 0, width]);

	var y = d3.scaleBand()
	    .range([ 0, height ])
	    .padding(.1);
	
	y.domain(data.map(function(d) { return d.category; }));
	x.domain([0, d3.max(data, function(d) { return d.data; })]);
	

	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x))
	    .selectAll("text")
	    .attr("transform", "translate(-10,0)rotate(-45)")
	    .style("text-anchor", "end");

	// Y axis

	svg.append("g")
	    .call(d3.axisLeft(y))

	//Bars
	svg.selectAll("myRect")
	    .data(data)
	    .enter()
	    .append("rect")
	    .attr("x", x(0) )
	    .attr("y", function(d) { return y(d.category); })
	    .attr("width", function(d) { return x(d.data); })
	    .attr("height", y.bandwidth() )
	    .attr("fill", "#69b3a2")


	// .attr("x", function(d) { return x(d.Country); })
	// .attr("y", function(d) { return y(d.Value); })
	// .attr("width", x.bandwidth())
	// .attr("height", function(d) { return height - y(d.Value); })
	// .attr("fill", "#69b3a2")

    })

});



var pieChart = (function pieChart(data_url, selector){

    // set the dimensions and margins of the graph
    var margin = {top: 100, right: 30, bottom: 40, left: 200},
	width = 460 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;
    var radius = Math.min(width, height) / 2;
    
    var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
	      "translate(" + margin.left + "," + margin.top + ")");
    
    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { console.log(d.data); return d.data; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    d3.json(data_url, function(data) {
	//if (error) throw error;
	console.log(data);
	var chart = svg.selectAll(".arc")
	    .data(pie(data))
	    .enter().append("g")
	    .attr("class", "arc");

	chart.append("path")
	    .attr("d", path)
	    .attr("fill", function(d) { console.log(d, d.data.category, color(d.data.category)); return color(d.data.category); });

	chart.append("text")
	    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
	    .attr("dy", "0.35em")
	    .text(function(d) { return d.data.category; });
    });
});







var multiLine = (function multLine(data_url, selector){

    var width = 500;
    var height = 300;
    var margin = 50;
    var duration = 250;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;
    
    var svg = d3.select(selector).append("svg")
	.attr("width", (width+margin)+"px")
	.attr("height", (height+margin)+"px")
	.append('g')
	.attr("transform", `translate(${margin}, ${margin})`);

    
    d3.json(data_url, function(data){
	/* Format Data */
	var parseDate = d3.timeParse("%Y");
	data.forEach(function(d) {
	    d.values.forEach(function(d) {
		d.date = parseDate(d.date);
		d.value = +d.value;
	    });
	});
	
	
	/* Scale */
	var xScale = d3.scaleTime()
	    .domain(d3.extent(data[0].values, d => d.date))
	    .range([0, width-margin]);
	
	var yScale = d3.scaleLinear()
	    .domain([0, d3.max(data[0].values, d => d.value)])
	    .range([height-margin, 0]);
	
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	
	
	
	/* Add line into SVG */
	var line = d3.line()
	    .x(d => xScale(d.date))
	    .y(d => yScale(d.value));
	
	let lines = svg.append('g')
	    .attr('class', 'lines');
	
	lines.selectAll('.line-group')
	    .data(data).enter()
	    .append('g')
	    .attr('class', 'line-group')
	    .on("mouseover", function(d, i) {
		svg.append("text")
	            .attr("class", "title-text")
	            .style("fill", color(i))
	            .text(d.name)
	            .attr("text-anchor", "middle")
	            .attr("x", (width-margin)/2)
	            .attr("y", 5);
	    })
	    .on("mouseout", function(d) {
		svg.select(".title-text").remove();
	    })
	    .append('path')
	    .attr('class', 'line')
	    .attr('d', d => line(d.values))
	    .style('stroke', (d, i) => color(i))
	    .style('opacity', lineOpacity)
	    .on("mouseover", function(d) {
		d3.selectAll('.line')
		    .style('opacity', otherLinesOpacityHover);
		d3.selectAll('.circle')
		    .style('opacity', circleOpacityOnLineHover);
		d3.select(this)
	            .style('opacity', lineOpacityHover)
	            .style("stroke-width", lineStrokeHover)
	            .style("cursor", "pointer");
	    })
	    .on("mouseout", function(d) {
		d3.selectAll(".line")
		    .style('opacity', lineOpacity);
		d3.selectAll('.circle')
		    .style('opacity', circleOpacity);
		d3.select(this)
	            .style("stroke-width", lineStroke)
	            .style("cursor", "none");
	    });
	
	
	/* Add circles in the line */
	lines.selectAll("circle-group")
	    .data(data).enter()
	    .append("g")
	    .style("fill", (d, i) => color(i))
	    .selectAll("circle")
	    .data(d => d.values).enter()
	    .append("g")
	    .attr("class", "circle")
	    .on("mouseover", function(d) {
		d3.select(this)
	            .style("cursor", "pointer")
	            .append("text")
	            .attr("class", "text")
	            .text(`${d.value}`)
	            .attr("x", d => xScale(d.date) + 5)
	            .attr("y", d => yScale(d.value) - 10);
	    })
	    .on("mouseout", function(d) {
		d3.select(this)
	            .style("cursor", "none")
	            .transition()
	            .duration(duration)
	            .selectAll(".text").remove();
	    })
	    .append("circle")
	    .attr("cx", d => xScale(d.date))
	    .attr("cy", d => yScale(d.value))
	    .attr("r", circleRadius)
	    .style('opacity', circleOpacity)
	    .on("mouseover", function(d) {
		d3.select(this)
	            .transition()
	            .duration(duration)
	            .attr("r", circleRadiusHover);
	    })
            .on("mouseout", function(d) {
		d3.select(this)
	            .transition()
	            .duration(duration)
	            .attr("r", circleRadius);
	    });
	
	
	/* Add Axis into SVG */
	var xAxis = d3.axisBottom(xScale).ticks(5);
	var yAxis = d3.axisLeft(yScale).ticks(5);
	
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", `translate(0, ${height-margin})`)
	    .call(xAxis);
	
	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append('text')
	    .attr("y", 15)
	    .attr("transform", "rotate(-90)")
	    .attr("fill", "#000")
	    .text("Total values");
    });
});
