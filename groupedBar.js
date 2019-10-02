var groupedBar = (function groupedBar(data, selector, params){

	var margin = {top: 10, right: 30, bottom: 60, left: 40},
	width = 400 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

	var y = d3.scaleLinear()
        .range([height, 0]);
    
	var x0 = d3.scaleBand();
        

	var x1 = d3.scaleBand();

	d3.selectAll(selector + " > *").remove();

	var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
	d3.json(data, function(data) {

		factor = 1;
		if (params.num_type == 'percent'){
		    factor = 100;
		}

		//x0.domain(['group 1', '0']);
		//console.log(x0);
		
		x0.domain(d3.map(data, function(d) { return d.category;}).keys())
		    .rangeRound([0, width])//width - margin.right])
		    .paddingInner(0.1);
		//.range([0, width], 0.5);
		//console.log(x0('group 0'), d3.map(data, function(d) { console.log(d.groups); return d.groups;}).keys());
		
		x1.domain(d3.map(data, function(d) { return d.group;}).keys())
		    .rangeRound([0, x0.bandwidth()])
		    .padding(0.05);
		//.range([0, x0.bandwidth()]);
		//console.log(x1, d3.map(data, function(d) { console.log(d.category); return d.category;}).keys());
		
		y.domain([0, d3.max(data, function(d) {return d.data*factor;})+0.05*factor])
		    
		    
		    //var z = d3.scaleOrdinal()
		    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		    var z = d3.scaleOrdinal(d3.schemeCategory10);

		if (params.bgcolor){
		    svg.append("rect")  
			.attr("x", -margin.left)
			.attr("y", -margin.top)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", params.bgcolor);
		}


		svg.append("g").selectAll("g")
		    .data(data)
		    .enter().append("g")
		    .style("fill", function(d, i) { return z(d.group); })
		    .attr("transform", function(d, i) { return "translate(" + x0(d.category) + ",0)"; })
		    //.selectAll("rect")
		    //.data(function(d) { return d; }).enter()
		    .append("rect")
		    .attr("width", x1.bandwidth())
		    .attr("height", function(d) { return y(0) - y(d.data*factor);})//function() {console.log( y); return y;})
		    .attr("x", function(d, i) { return x1(d.group); })
		    .attr("y", function(d, i) { return y(d.data*factor); })
		    .on("mouseover", function(d, i) {
			    svg.append("text")
				.attr("class", "title-text")
				.style("fill", z(d.group))
				.text(d.group + ', ' + d.category +': ' + Math.round(d.data*factor, 0) +'%' )
				.attr("text-anchor", "start")
				.attr("x", (width-margin.left - 100)/2)
				.attr("y", 5);
			})
		    .on("mouseout", function(d) {
			    svg.select(".title-text").remove();
			});



		xaxis = svg.append("g")
		    .attr("transform", "translate(0," + height + ")")
		    .attr("class", "xaxisml")
		    .call(d3.axisBottom(x0));
      
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
			})
		    .style("text-anchor", "end")
		    .attr("dx", "-.8em")
		    .attr("dy", ".15em")
		    .attr("transform", "rotate(-30)");


		// add the y Axis
		yaxis = svg.append("g")
		    .attr("class", "xaxisml")
		    .call(d3.axisLeft(y));
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
		
	    });



    });
