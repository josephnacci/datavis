var multiLine = (function multLine(data_url, selector){

	var margin = {top: 20, right: 30, bottom: 80, left: 40},
	width = 400 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

	var duration = 250;

	var lineOpacity = "0.6";
	var lineOpacityHover = "1";
	var otherLinesOpacityHover = "0.5";
	var lineStroke = "4px";
	var lineStrokeHover = "10px";

	var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
	var circleRadius = 3;
	var circleRadiusHover = 6;
    


	d3.selectAll(selector + " > *").remove();
    
	var svg = d3.select(selector).append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	      "translate(" + margin.left + "," + margin.top + ")");
    
	//.attr("width", (width+margin)+"px")
	//.attr("height", (height+margin)+"px")
	//.append('g')
	//.attr("transform", `translate(${margin}, ${margin})`);

    
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
		    .range([0, width]);
		
		var yScale = d3.scaleLinear()
		    .domain([0, d3.max(data, d => d3.max(d.values, e => e.value)) + 10])
		    .range([height-margin.top, 0]);
		
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
				.attr("x", (width-margin.left)/2)
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
		    .on("mouseover", function(d, i, all) {
			    d3.selectAll('.line')
				.style('style', function(d2, i) { 
					console.log(d.name, d2.name);
					if (d.name == d2.name){
					    return lineOpacityHover;
					}
					else {
					    return lineOpacity;
					}
				    })//otherLinesOpacityHover);
				.style('stroke-width', function(d2, i) { 
					console.log(d.name, d2.name);
					if (d.name == d2.name){
					    return lineStrokeHover;
					}
					else {
					    return lineStroke;
					}
				    })
				.style("cursor", "pointer");//otherLinesOpacityHover);
			    //d3.selectAll('.circle')
			    //.style('opacity', circleOpacityOnLineHover);
			    //ole.log(d.name, all);
			    //d.name == this.name){
			    //    d3.select(this)
			    //    .style('opacity', lineOpacityHover)
			    //    .style("stroke-width", lineStrokeHover)
			    //    .style("cursor", "pointer");
			    //}
			})
		    .on("mouseout", function(d) {
			    //d3.selectAll(".line")
			    //.style('opacity', lineOpacity);
			    //d3.selectAll('.circle')
			    //.style('opacity', circleOpacity);
			    d3.selectAll(".line")
				.style("stroke-width", lineOpacity)
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
		var xAxis = d3.axisBottom(xScale).ticks(5).tickSize(-height+margin.top);
		var yAxis = d3.axisLeft(yScale).ticks(5);
		
		svg.append("g")
		    .attr("class", "xaxisml")
		    .attr("transform", `translate(0, ${height-margin.top+7})`)
		    .call(xAxis)
		    .call(g => g.select(".domain").remove());
		
		svg.append("g")
		    .attr("class", "xaxisml")
		    .call(yAxis)
		    .append('text')
		    .attr("y", 15)
		    .attr("transform", "rotate(-90)")
		    .attr("fill", "#000");

		


		svg.selectAll("mylabels")
		    .data(data)
		    .enter()
		    .append("text")
		    .attr("x", function(d, i) {return i < 3 ? 10 : 150;})
		    .attr("y", function(d,i){ return height +20+ i%3*18}) // 100 is where the first dot appears. 25 is the distance between dots
		    .style("fill", function(d, i){ return color(i)})
		    .text(function(d, i){ return i+1 + ':  ' + d.name})
		    .attr("text-anchor", "left")
		    .style("alignment-baseline", "middle")


		    
		    });


    });
