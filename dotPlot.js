var dotPlot = (function dotPlot(url, selector, params){
	var margin = {top: 50, right: 200, bottom: 60, left: 110};

        if ('width' in params){
            width_dot = params.width - margin.left - margin.right;
	}
        else{
            width_dot = 500 - margin.left - margin.right;
        }

        if ('height' in params){
            height_dot = params.height - margin.top - margin.bottom;
        }
        else{
            height_dot = 240 - margin.top - margin.bottom;
        }


	
	
	var widthScale_dot = d3.scaleLinear()
	.range([ 0, width_dot]);
	
	var heightScale_dot = d3.scalePoint()
	.rangeRound([0,height_dot]);//width - margin.
	//.paddingInner(0.);
	;//.ordinal()
	//.rangeRoundBands([ margin.top, height_dot], 0.1);
	
	var xAxis_dot = d3.scaleLinear().range([0, width_dot]);//svg.axis()
	//.scale(widthScale_dot)
	//.orient("bottom");

	var yAxis_dot = d3.scalePoint().range([0,height_dot]);//svg.axis()
	//.scale(heightScale_dot)
	//.orient("left")
	//.innerTickSize([0]);
	
	
      	d3.selectAll(selector + " > *").remove();

	var svg = d3.select(selector).append("svg")
        .attr("width", width_dot + margin.left + margin.right)
        .attr("height", height_dot + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
	
	
	d3.json(url, function(error, all_data) {

		/////////////////////////DOTS
		//dot_data.sort(function(a, b) {
		//return d3.descending(+a.year2015, +b.year2015);
		//    });

		// in this case, i know it's out of 100 because it's percents.

		data = all_data['data'];
		xlabel = all_data['xlabel'];
		ylabel = all_data['ylabel'];
		title = all_data['title'];
		dot_highlight = all_data['highlight'];
		group_name = all_data['group_name'];
		other_name = all_data['other_name'];


		data = data.sort(function(x, y){
			return d3.descending(+x.group_score, +y.group_score);
		    });


		
		if( params.data_format == "percent"){
		    var factor = 100;
		}
		else{
		    var factor = 1;
		}
		
		widthScale_dot.domain([ d3.min(data, function(d) {return d3.min([d.group_score, d.non_group_score]);})*0.9*factor
					, d3.max(data, function(d) {return d3.max([d.group_score, d.non_group_score]);})*1.2*factor ] );
		
		// js map: will make a new array out of all the d.name fields
		heightScale_dot.domain(data.map(function(d) { return d.question; } ))
		    .rangeRound([0, height_dot-10]);//width - margin.right])                                                                                                   
		
		
		yAxis_dot.domain(data.map(function(d) { return d.question; } ))
		    .rangeRound([0, height_dot-10]);//width - margin.right])                                                                                                                  
		
		
		if (params.bgcolor){
		    svg.append("rect")  
			.attr("x", -margin.left)
			.attr("y", -margin.top)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", params.bgcolor);
		}
		
		// Make the faint lines from y labels to highest dot
		
		var linesGrid = svg.append("g").selectAll("g")//svg.selectAll("lines.grid")
		    .data(data)
		    .enter()
		    .append("line");
		
		linesGrid.attr("class", "grid")
		    .attr("x1", margin.left)
		    .attr("y1", function(d) {
			    console.log(d.question, heightScale_dot(d.question), console.log(heightScale_dot.bandwidth()));
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("x2", function(d) {
			    return d3.max([margin.left + widthScale_dot(+d.group_score),
					   margin.left + widthScale_dot(d.non_group_score)]);
			        
			})
		    .attr("y2", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("stroke", '#eee');
		
		// Make the dotted lines between the dots
		var linesBetween = svg.append("g").selectAll("g")//selectAll("lines.between")
		    .data(data)
		    .enter()
		    .append("line");
		
		linesBetween.attr("class", "between")
		    .attr("x1", function(d) {
			    return margin.left + widthScale_dot(+d.non_group_score);
			})
		    .attr("y1", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth();//rangeBand()/2;
			})
		    .attr("x2", function(d) {
			    return margin.left + widthScale_dot(d.group_score);
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
		
		if (params.colorscheme){
		    var color = d3.scaleOrdinal(params.colorscheme).domain(['group', 'non_group']);
		}
		else{
		    var color = d3.scaleOrdinal(d3.schemeCategory10);
		}
		
		var dotSize = 6;

		var mouseoverDotSize = 8;
		
		// Make the 
		var dots_non_customer = svg.append("g").selectAll("g")//selectAll("circle.y1990")
		    .data(data)
		    .enter()
		    .append("circle");
		
		dots_non_customer
		    .attr("class", "non_group")
		    .attr("cx", function(d) {
			    return margin.left + widthScale_dot(+d.non_group_score);
			})
		    .attr("r", dotSize)//heightScale_dot.bandwidth()/5)///rangeBand()/5)
		    .attr("fill", color('non_group'))
    
		    .on('mouseover', function(d1){
      
      
			    d3.select(this).attr("r", mouseoverDotSize)
				.append("svg:title")
				.text(function() {
					if (params.data_format == 'percent'){
					    return d1.question + " (" + other_name + "): " + d1.non_group_score*100.toFixed(1) + "%";
					}
					else{
					    return d1.question + " (" + other_name + "): $" + Math.round(d1.non_group_score, 2);
					}
				    })
      
      
				})
		    .on('mouseout', function(d1){
			    d3.select(this).attr("r", dotSize)

				})
		    .attr("cy", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth()/2;//rangeBand()/2;
			});
		
		// Make the dots for 2015
		
		var dots_customer = svg.append("g").selectAll("g")//.selectAll("circle.y2015")
		    .data(data)
		    .enter()
		    .append("circle");
		
		dots_customer
		    .attr("class", "group")
		    .attr("cx", function(d) {
			    return margin.left + widthScale_dot(+d.group_score);
			})
		    .attr("r", dotSize)//heightScale_dot.bandwidth()/5)//rangeBand()/5)
		    .attr("fill", color('group'))

		    .attr("cy", function(d) {
			    return heightScale_dot(d.question);// + heightScale_dot.bandwidth()/2;//rangeBand()/2;
			})
		    .on('mouseover', function(d1){
			    d3.select(this).attr("r", mouseoverDotSize)
				.append("svg:title")
				.text(function() {
					if (params.data_format == 'percent'){
					    return d1.question + " (" + group_name + "): " + (d1.group_score*100).toFixed(1) + "%";
					}
					else{
					    return d1.question + " (" + group_name + "): $" + Math.round(d1.group_score, 2);
					}
				    })
				})
		    .on('mouseout', function(d1){
			    d3.select(this).attr("r", dotSize)
				});
		
		// add the axes
		
		xaxis = svg.append("g")
		    .attr("class", "xaxisdot")
		    .attr("transform", "translate(" + margin.left + "," + height_dot + ")")
		    .attr("opacity", "1")
		    .call(d3.axisBottom(widthScale_dot));

		xaxis.selectAll("path")
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
      
		xaxis.selectAll("text")
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

		
		
		yaxis = svg.append("g")
		    .attr("class", "yaxisdot")
		    .attr("transform", "translate(" + margin.left + ",0)")
		    .call(d3.axisLeft(yAxis_dot));
  
		yaxis.selectAll("path")
		    .style("stroke", function(){
			    if (params.bgcolor){
				if (params.bgcolor == 'black'){
				    return 'black';
				}
			    }
			    else{
				return 'white'
				    }
			});
      
		yaxis.selectAll("text")
		    .style("opacity", "1")
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
		


		svg.append("text")
                    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - margin.top+2) + ")")
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style('fill', function(){
                            if (params.bgcolor){
                                if (params.bgcolor == 'black'){
                                    return 'white';
				}
                            }
                            else{
                                return 'black';
                            }
			})
                    .text(xlabel);


		svg.append("text")
                    .attr("transform", "translate(" + (width / 2) + " ," + (-margin.top+5) + ")")
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style('fill', function(){
                            if (params.bgcolor){
                                if (params.bgcolor == 'black'){
                                    return 'white';
                                }
                            }
                            else{
                                return 'black';
                            }
                        })
                    .text(title);

		
	    })
    });