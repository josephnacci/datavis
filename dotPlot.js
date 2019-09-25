var dotPlot = (function dotPlot(url, selector, params){
	var margin_dot = {top: 10, right: 200, bottom: 10, left: 110};
	
	var width_dot = 500 - margin_dot.left - margin_dot.right,
	height_dot = 240 - margin_dot.top - margin_dot.bottom;
	
	
	
	var widthScale_dot = d3.scaleLinear()
	.range([ 0, width_dot]);
	
	var heightScale_dot = d3.scalePoint()
	.rangeRound([0,height_dot]);//width - margin.
	//.paddingInner(0.);
	;//.ordinal()
	//.rangeRoundBands([ margin_dot.top, height_dot], 0.1);
	
	var xAxis_dot = d3.scaleLinear().range([0, width_dot]);//svg.axis()
	//.scale(widthScale_dot)
	//.orient("bottom");

	var yAxis_dot = d3.scalePoint().range([0,height_dot]);//svg.axis()
	//.scale(heightScale_dot)
	//.orient("left")
	//.innerTickSize([0]);
	
	
	
	
	var fullwidth = 200,
	fullheight = 1000;
	//var svg_dot = d3.select(selector)
	//.append("svg")
	//.attr("width", fullwidth)
	//.attr("height", fullheight);
	d3.selectAll(selector + " > *").remove();

	var svg_dot = d3.select(selector).append("svg")
        .attr("width", width_dot + margin_dot.left + margin_dot.right)
        .attr("height", height_dot + margin_dot.top + margin_dot.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_dot.left + "," + margin_dot.top + ")");
	
	
	
	
	d3.json(url, function(error, data) {

		/////////////////////////DOTS
		//dot_data.sort(function(a, b) {
		//return d3.descending(+a.year2015, +b.year2015);
		//    });

		// in this case, i know it's out of 100 because it's percents.

		data = data.sort(function(x, y){
			return d3.descending(+x.group_score, +y.group_score);
		    });
		console.log(data);

		widthScale_dot.domain([ d3.min(data, function(d) {return d3.min([d.group_score, d.non_group_score]);})*0.9
					, d3.max(data, function(d) {return d3.max([d.group_score, d.non_group_score]);})*1.2 ] );
		
		// js map: will make a new array out of all the d.name fields
		heightScale_dot.domain(data.map(function(d) { return d.question; } ))
		    .rangeRound([0, height_dot])//width - margin.right])                                                                                                   
		    
		    
		    yAxis_dot.domain(data.map(function(d) { return d.question; } ))
		    .rangeRound([0, height_dot])//width - margin.right])                                                                                                                  
		    

		    if (params.bgcolor){
			svg_dot.append("rect")  
			    .attr("x", -margin_dot.left)
			    .attr("y", -margin_dot.top)
			    .attr("width", "100%")
			    .attr("height", "100%")
			    .attr("fill", params.bgcolor);
		    }

		// Make the faint lines from y labels to highest dot
		
		var linesGrid = svg_dot.append("g").selectAll("g")//svg_dot.selectAll("lines.grid")
		    .data(data)
		    .enter()
		    .append("line");
		
		linesGrid.attr("class", "grid")
		    .attr("x1", margin_dot.left)
		    .attr("y1", function(d) {
			    console.log(d.question, heightScale_dot(d.question), console.log(heightScale_dot.bandwidth()));
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("x2", function(d) {
			    return d3.max([margin_dot.left + widthScale_dot(+d.group_score),
					   margin_dot.left + widthScale_dot(d.non_group_score)]);
			        
			})
		    .attr("y2", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("stroke", '#eee');
		
		// Make the dotted lines between the dots
		var linesBetween = svg_dot.append("g").selectAll("g")//selectAll("lines.between")
		    .data(data)
		    .enter()
		    .append("line");
		
		linesBetween.attr("class", "between")
		    .attr("x1", function(d) {
			    return margin_dot.left + widthScale_dot(+d.non_group_score);
			})
		    .attr("y1", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("x2", function(d) {
			    return margin_dot.left + widthScale_dot(d.group_score);
			})
		    .attr("y2", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("stroke", 'black')
		    .attr("stroke-dasharray", "5,5")
		    .attr("stroke-width", function(d, i) {
			    return "0.5";
			});
  
		//
		
		
		// Make the 
		var dots_non_customer = svg_dot.append("g").selectAll("g")//selectAll("circle.y1990")
		    .data(data)
		    .enter()
		    .append("circle");
		
		dots_non_customer
		    .attr("class", "non_group")
		    .attr("cx", function(d) {
			    return margin_dot.left + widthScale_dot(+d.non_group_score);
			})
		    .attr("r", 4)//heightScale_dot.bandwidth()/5)///rangeBand()/5)
		    .attr("fill", "#ddd")
    
		    .on('mouseover', function(d1){
      
      
			    d3.select(this).attr("r", 6)
				.append("svg:title")
				.text(function() {
					if (params.data_format == 'percent'){
					    return d1.question + " (all respondents): " + Math.round(d1.non_group_score*100, 2) + "%";
					}
					else{
					    return d1.question + " (all respondents): $" + Math.round(d1.non_group_score, 2);
					}
				    })
      
      
				})
		    .on('mouseout', function(d1){
			    d3.select(this).attr("r", 4)

				})
		    .attr("cy", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth()/2;//rangeBand()/2;
			});
		
		// Make the dots for 2015
		
		var dots_customer = svg_dot.append("g").selectAll("g")//.selectAll("circle.y2015")
		    .data(data)
		    .enter()
		    .append("circle");
		
		dots_customer
		    .attr("class", "group")
		    .attr("cx", function(d) {
			    return margin_dot.left + widthScale_dot(+d.group_score);
			})
		    .attr("r", 4)//heightScale_dot.bandwidth()/5)//rangeBand()/5)
		    .attr("fill", "coral")

		    .attr("cy", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth()/2;//rangeBand()/2;
			})
		    .on('mouseover', function(d1){
			    d3.select(this).attr("r", 6)
				.append("svg:title")
				.text(function() {
					if (params.data_format == 'percent'){
					    return d1.question + " (chosen group): " + Math.round(d1.non_group_score*100, 2) + "%";
					}
					else{
					    return d1.question + " (chosen group): $" + Math.round(d1.non_group_score, 2);
					}
				    })
				})
		    .on('mouseout', function(d1){
			    d3.select(this).attr("r", 4)
				});
		
		// add the axes
		
		xaxis = svg_dot.append("g")
		    .attr("class", "x axis dot")
		    .attr("transform", "translate(" + margin_dot.left + "," + height_dot + ")")
		    .attr("opacity", "0")
		    .call(xAxis_dot);
		
		yaxis = svg_dot.append("g")
		    .attr("class", "yaxisdot")
		    .attr("transform", "translate(" + margin_dot.left + ",0)")
		    .call(d3.axisLeft(yAxis_dot));
  
		yaxis.selectAll("path")
		    .style("stroke", function(){
			    if (params.bgcolor){
				if (params.bgcolor == 'black'){
				    return 'white';
				}
			    }
			    else{
				return 'black'
				    }
			});
      
		yaxis.selectAll("text")
		    .style('fill', function(){
			    if (params.bgcolor){
				if (params.bgcolor == 'black'){
				    return 'white';
				}
			    }
			    else{
				return 'black'
				    }
			});
		
		
	    })
    });