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

		button_location = {left: 10, top: 0}
		var button_selector = selector.slice(1,selector.length);

		var button_div = d3.select(selector).append("div")
		    .attr("class", "chart_transition")
		    .style("opacity", 1)
		    .style("background", "#aaa")
		    .style("position", "relative");
		
	
		base_render(all_data, Object.keys(all_data['data'])[0]);


                if (Object.keys(all_data['data']).length > 1){
                    //base_render(all_data, Object.keys(data)[0]);                                                                                                  
		    
                    button_div.html("<div id='buttons"+button_selector+"' style=';position: absolute; text-align: center;  width: 500px;  height: 50px;  padding: 0px;  font: 12px sans-serif;  border: 0px;'>" +
                                    "<button id='"+button_selector + Object.keys(all_data['data'])[0].replace(/\s+/g, '') +"'>"+ Object.keys(all_data['data'])[0]+"</button>" +
                                    "<button id='"+button_selector + Object.keys(all_data['data'])[1].replace(/\s+/g, '') +"'>"+ Object.keys(all_data['data'])[1]+"</button>" +
                                    " </div>")
                        .style("left", button_location.left)//(d3.event.pageX - 60) + "px")                                                                         
                        .style("top", button_location.top)//(d3.event.pageY - 28) + "px")                                                                           
                        .style("fill", "white");
		    
                    d3.select("#"+button_selector + Object.keys(all_data['data'])[0].replace(/\s+/g, '')).style('background-color', '#99ccee')
			
			d3.select("#"+button_selector + Object.keys(all_data['data'])[1].replace(/\s+/g, '')).style('background-color', '#ddd')
			
			
			d3.select("#"+button_selector + Object.keys(all_data['data'])[0].replace(/\s+/g, ''))
			.on("click", function(d, i) {
                                d3.select("#"+button_selector + Object.keys(all_data['data'])[1].replace(/\s+/g, '')).style('background-color', '#ddd');
				d3.select(this).style('background-color', '#99ccee');
                                base_render(all_data, Object.keys(all_data['data'])[0])
                                    });
                    d3.select("#"+button_selector + Object.keys(all_data['data'])[1].replace(/\s+/g, ''))
                        .on("click", function(d, i) {
				d3.select("#"+button_selector + Object.keys(all_data['data'])[0].replace(/\s+/g, '')).style('background-color', '#ddd');
				d3.select(this).style('background-color', '#99ccee');
                                base_render(all_data, Object.keys(all_data['data'])[1])
                                    });


                }

		function base_render(all_data, primary_key){


		    data = all_data['data'];
		    xlabel = all_data['xlabel'];
		    ylabel = all_data['ylabel'];
		    title = all_data['title'];
		    dot_highlight = all_data['highlight'];
		    group_name = all_data['group_name'];
		    other_name = all_data['other_name'];


                    if (primary_key){
                        data = data[primary_key];
                    }




		    if (params.sort == 'group_value'){
			data = data.sort(function(x, y){
				return d3.descending(+x.group_score, +y.group_score);
			    });
		    }
		    else if (params.sort == 'outgroup_value'){
			data = data.sort(function(x, y){
				return d3.descending(+x.non_group_score, +y.non_group_score);
			    });
		    }
		    else{
			data = data;
		    }
		    
		    
		    
		    
		    
		    if (params.num_type == "percent") {
			var factor = 100;
		    }
		    else {
			var factor = 1;
		    }
		    
		    widthScale_dot.domain([ d3.min(data, function(d) {return d3.min([d.group_score, d.non_group_score]);})*0.9*factor
					    , d3.max(data, function(d) {return d3.max([d.group_score, d.non_group_score]);})*1.2*factor ] );
		    
		    // js map: will make a new array out of all the d.name fields
		    heightScale_dot.domain(data.map(function(d) { return d.question.trim(); } ))
			.rangeRound([0, height_dot-10]);//width - margin.right])                                                                                                   
		    
		    
		    yAxis_dot.domain(data.map(function(d) { return d.question.trim(); } ))
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
				//console.log(d.question, heightScale_dot(d.question), console.log(heightScale_dot.bandwidth()));
				return heightScale_dot(d.question.trim());// + heightScale_dot.bandwidth();//rangeBand()/2;
			    })
			.attr("x2", function(d) {
				return d3.max([margin.left + widthScale_dot(+d.group_score*factor),
					       margin.left + widthScale_dot(d.non_group_score*factor)]);
			        
			    })
			.attr("y2", function(d) {
				return heightScale_dot(d.question.trim());// + heightScale_dot.bandwidth();//rangeBand()/2;
			    })
			.attr("stroke", '#eee');
		    
		    linesGrid.exit().remove();

		    // Make the dotted lines between the dots
		    var linesBetween = svg.append("g").selectAll("g")//selectAll("lines.between")
			.data(data)
			.enter()
			.append("line");
		    
		    linesBetween.attr("class", "between")
			.attr("x1", function(d) {
				return margin.left + widthScale_dot(+d.non_group_score*factor);
			    })
			.attr("y1", function(d) {
				return heightScale_dot(d.question.trim());// + heightScale_dot.bandwidth();//rangeBand()/2;
			    })
			.attr("x2", function(d) {
				return margin.left + widthScale_dot(d.group_score*factor);
			    })
			.attr("y2", function(d) {
				return heightScale_dot(d.question.trim());// + heightScale_dot.bandwidth();//rangeBand()/2;
			    })
			.attr("stroke", 'black')
			.attr("stroke-dasharray", "5,5")
			.attr("stroke-width", function(d, i) {
				return "0.5";
			    });
		    
		    linesBetween.exit().remove();
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
				return margin.left + widthScale_dot(+d.non_group_score*factor);
			    })
			.attr("r", dotSize)//heightScale_dot.bandwidth()/5)///rangeBand()/5)
			.attr("fill", color('non_group'))
			
			.on('mouseover', function(d1){
				
				
				d3.select(this).attr("r", mouseoverDotSize)
				    .append("svg:title")
				    .text(function() {
					    if (params.num_type == 'percent'){
						return d1.question.trim() + " (" + other_name + "): " + (d1.non_group_score*100).toFixed(1) + "%";
					    }
					    else{
						return d1.question.trim() + " (" + other_name + "): $" + Math.round(d1.non_group_score, 2);
					    }
					})
				    
				    
				    })
			.on('mouseout', function(d1){
				d3.select(this).attr("r", dotSize)
				    
				    })
			.attr("cy", function(d) {
				return heightScale_dot(d.question.trim());// + heightScale_dot.bandwidth()/2;//rangeBand()/2;
			    });
		    dots_non_customer.exit().remove();
		// Make the dots for 2015
		
		    var dots_customer = svg.append("g").selectAll("g")//.selectAll("circle.y2015")
			.data(data)
			.enter()
			.append("circle");
		    
		    dots_customer
			.attr("class", "group")
			.attr("cx", function(d) {
				return margin.left + widthScale_dot(+d.group_score*factor);
			    })
			.attr("r", dotSize)//heightScale_dot.bandwidth()/5)//rangeBand()/5)
			.attr("fill", color('group'))
			
			.attr("cy", function(d) {
				return heightScale_dot(d.question.trim());// + heightScale_dot.bandwidth()/2;//rangeBand()/2;
			    })
			.on('mouseover', function(d1){
				d3.select(this).attr("r", mouseoverDotSize)
				    .append("svg:title")
				    .text(function() {
					    if (params.num_type == 'percent'){
						return d1.question.trim() + " (" + group_name + "): " + (d1.group_score*100).toFixed(1) + "%";
					    }
					    else{
						return d1.question.trim() + " (" + group_name + "): $" + Math.round(d1.group_score, 2);
					    }
					})
				    })
		    .on('mouseout', function(d1){
			    d3.select(this).attr("r", dotSize)
				});
		    
		    dots_customer.exit().remove();
		    
		    var oid_text = svg.append("g").selectAll("g")//.selectAll("circle.y2015")
			.data(data)
			.enter()
			.append("text");
		    oid_text
			.attr("class", "oid_text")
			.attr("dy", "0.3em")
			.attr("y", function(d) {return heightScale_dot(d.question.trim());})
			.attr("x", function(d) {return margin.left + d3.max([widthScale_dot(+d.group_score*factor), widthScale_dot(+d.non_group_score*factor)]) + 20;})
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
			.text(function(d) {return (d.group_score/d.non_group_score).toFixed(2)  + "x"});
		    oid_text.exit().remove();
		    
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
		    yaxis.selectAll(".tick text")
			.call(wrap, 190);
		    
		    
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
			.attr("transform", "translate(" + (width_dot / 2) + " ," + (height_dot + margin.bottom - margin.top+2) + ")")
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
			.attr("transform", "translate(" + (width_dot / 2) + " ," + (-margin.top+5) + ")")
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
		    
		    xaxis.exit().remove();
		    yaxis.exit().remove();


		
		};
		function wrap(text, width) {

		    text.each(function() {
			    var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy")),
				dx = -0.9,
				tspan = text.text(null)
				.append("tspan")
				.attr("x", 0).attr("y", y)
				.attr("dy", dy + "em")
				.attr("dx", dx + "em")
				.style('fill', function(d){
					if (params.bgcolor){
					    if (params.bgcolor == 'black'){
						return 'white';
					    }
					}
					else{
					    return 'black'
					}
				    });

				while (word = words.pop()) {
				    line.push(word)
				    tspan.text(line.join(" "))
				    if (tspan.node().getComputedTextLength() > width) {
					line.pop()
					    tspan.text(line.join(" "))
					    line = [word]
					    tspan = text.append("tspan")
					    .attr("x", 0)
					    .attr("y", y)
					    .attr("dy",  ++lineNumber * lineHeight + "em")
					    .attr("dx", dx + "em")
					    .text(word)
					    .style('fill', function(d){
						    if (params.bgcolor){
							if (params.bgcolor == 'black'){
							    return 'white';
							}
						    }
						    else{
							return 'black'
						    }
						});
				    }
				}
			})
			}
	    })
    
	    






	
    });