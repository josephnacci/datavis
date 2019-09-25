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
