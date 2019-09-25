/*var initStackedBarChart = {
    draw: function(config) {
    me = this,
    domEle = config.element,
    
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xScale = d3.scaleBand().range([0, width]).padding(0.1),
    yScale = d3.scaleLinear().range([height, 0]),
    color = d3.scaleOrdinal(d3.schemeCategory20),
    xAxis = d3.axisBottom(xScale),
    yAxis =  d3.axisLeft(yScale),
    svg = d3.select("#"+domEle).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/
var stackedBar = (function multLine(data_url, selector, params){

	console.log(selector);
	//var svg = d3.select(selector).append("svg")
	//margin = {top: 20, right: 20, bottom: 30, left: 40},
	//width = 960 - margin.left - margin.right,
	//height = 500 - margin.top - margin.bottom,
	//g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var margin = {top: 20, right: 150, bottom: 40, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

	// append the svg object to the body of the page                                                                                                                     

	d3.selectAll(selector + " > *").remove();

	var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	// set x scale
	var x = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.05)
	.align(0.1);
	
	// set y scale
	var y = d3.scaleLinear()
	.rangeRound([height, 0]);
	
	// set the colors
	//d3.scaleOrdinal(d3[categorical[0].name])

	//    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	
	//stackKey = config.key,
	//data = config.data,
	
	
	d3.json(data_url,  function(raw_data){
		console.log(raw_data);
		var z = d3.scaleOrdinal().range(d3.schemeCategory20);
		persona_data = raw_data;//['social shopper'];
		data = persona_data['data'];
		keys = persona_data['keys'];

		data.forEach(function(d){
			d.total = 0;
			keys.forEach(function(k){

				d.total += d[k];
			    })
			    });
		//all_keys = data.map(function(d) { console.log(d.keys); return d.step;});
		//keys = [];
		//console.log(all_keys);
		//for (var i=0; i< all_keys.length ; i++){
		//    console.log(all_keys[i], keys.includes(all_keys[i]));
		//    if (!(keys.includes(all_keys[i]))){
		//keys.push(all_keys[i]);
		//    }
		//}
		console.log(keys);


		x.domain(data.map(function(d) { return d.step; }));
		y.domain([0, d3.max(data, function(d) { return d.total; })*1.2]).nice();
		

		//all_categories = d3.values(persona_data['cat_map']);
		//categories = [];
		//for (i=0; i< all_categories.length; i++){
		//    if (!(categories.includes(all_categories[i]))){
		//categories.push(all_categories[i]);
		//    }
		//}
		categories = keys;
		console.log(categories);
		z.domain(categories);
		stack = d3.stack().keys(keys)(data);

    
		if (params.bgcolor){
		    svg.append("rect")  
			.attr("x", -margin.left)
			.attr("y", -margin.top)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", params.bgcolor);
		}

		svg.append("g")
		    .selectAll("g")
		    .data(stack)
		    .enter().append("g")
		    .attr("fill", function(d) { return z(d.key); })
		    .attr('class', 'bar')
		    .on("mouseover", function(d, i, all) { 
			    var xPosition = d3.mouse(this)[0] - 5;
			    var yPosition = d3.mouse(this)[1] - 5;
			    tooltip.attr("transform", "translate(" + width + "," + height/2 + ")")
				.selectAll('text')
				.style('fill', function(){
					if (params.textcolor){
					    if (params.textcolor == 'white'){
						return 'white';
					    }
					}
					else{
					    return 'black';
					}
				    });
			    tooltip.select("text").text(d.key);
			    tooltip.style("display", null); })
		    .selectAll("rect")
		    .data(function(d) { return d; })
		    .enter().append("rect")
		    .attr("x", function(d) { return x(d.data.step); })
		    .attr("y", function(d) { return y(d[1] || 0); })
		    .attr("height", function(d) { return y(d[0] || 0) - y(d[1] || 0); })
		    .attr("width", x.bandwidth())
		    .on("mouseout", function() { tooltip.style("display", "none"); });

		var xaxis = svg.append("g")
		    .attr("class", "axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(x));
   
		xaxis.selectAll("path")
		    .style("stroke", function(){
			    if (params.textcolor){
				if (params.textcolor == 'white'){
				    return 'white';
				}
			    }
			    else{
      return 'black'
	  }
			});
		xaxis.selectAll("text")
		    .style('fill', function(){
			    if (params.textcolor){
				if (params.textcolor == 'white'){
				    return 'white';
				}
			    }
			    else{
      return 'black'
	  }
			});
    

		var yaxis = svg.append("g")
		    .attr("class", "axis")
		    .call(d3.axisLeft(y).ticks(null, "s"))
		    ;
    
		yaxis.selectAll("path")
		    .style("stroke", function(){
			    if (params.textcolor){
				if (params.textcolor == 'white'){
				    return 'white';
				}
			    }
			    else{
				return 'black';
			    }
			});
    
		yaxis.selectAll("text")
		    .style('fill', function(){
			    console.log(params.textcolor);
			    if (params.textcolor){
				if (params.textcolor == 'white'){
				    return 'white';
				}
			    }
			    else{
				return 'black';
			    }
			});
      

		var legend = svg.append("g")
		    .attr("font-family", "sans-serif")
		    .attr("font-size", 10)
		    .attr("text-anchor", "end")
		    .selectAll("g")
		    .data(categories)
		    .enter().append("g")
		    .attr("transform", function(d, i) { return "translate(" + -(i%keys.length/4) * 150 + "," + (i%4) * 22 + ")"; });

		legend.append("rect")
		    .attr("x", width-19)
		    .attr("width", 19)
		    .attr("height", 19)
		    .attr("fill", z);

		legend.append("text")
		    .attr("x", width -24)
		    .attr("y", 9.5)
		    .attr("dy", "0.32em")
		    .text(function(d) { return d; })
		    .style('fill', function(){
			    console.log(params.textcolor);
			    if (params.textcolor){
				if (params.textcolor == 'white'){
				    return 'white';
				}
			    }
			    else{
				return 'black';
			    }
			});
	    });

	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
	.attr("class", "stacked_tooltip")
	.style("display", "none");
      
	tooltip.append("rect")
	.attr("width", 80)
	.attr("height", 20)
	.attr("fill", "white")
	.style("opacity", 0.5);

	tooltip.append("text")
	.attr("x", 0)
	.attr("dy", "1.2em")
	.style("text-anchor", "center")
	.attr("font-size", "12px")
	.attr("font-weight", "bold")
	.style('fill', function(){
		console.log(params.textcolor);
		if (params.textcolor){
		    if (params.textcolor == 'white'){
			return 'white';
		    }
		}
		else{
		    return 'black';
		}
	    });

    });
