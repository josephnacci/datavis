var groupedBar = (function groupedBar(data, selector, params){


	if (!(params.margin)){
	    var margin = {top: 30, right: 30, bottom: 60, left: 40};
	}
	else{
	    var margin = params.margin;
	}

	if ('width' in params){
	    width = params.width
	}
	else{
	    width = 400 - margin.left - margin.right;
	}
	
	if ('height' in params){
	    height = params.height - margin.top - margin.bottom;
	}
	else{
	    height = 300 - margin.top - margin.bottom;
	}



	var y = d3.scaleLinear()
        .range([height, 0]);
    
	var x0 = d3.scaleBand();
        

	var x1 = d3.scaleBand();

	d3.selectAll(selector + " > *").remove();

	var svg = d3.select(selector).append("svg")
	.attr("id", selector.slice(1,selector.length))
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

	var div = d3.select(selector).append("div")
	.attr("class", "tooltip")
	.style("opacity", 1)
	.style("background", "#aaa")
	.style("position", "absolute");


	d3.json(data, function(all_data) {
		

		button_location = {left: -margin.left, top: 0}
		var button_selector = selector.slice(1, selector.length);		
		var button_div = d3.select(selector).append("div")
		    .attr("class", "chart_transition"+button_selector)
		    .style("opacity", 1)
		    .style("background", "#aaa")
		    .style("position", "relative");
		
		

		
		console.log(width, height);
		
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
				d3.select("#"+button_selector + Object.keys(all_data['data'])[1].replace(/\s+/g, '')).style('background-color', '#ddd')    
				d3.select(this).style('background-color', '#99ccee');
				base_render(all_data, Object.keys(all_data['data'])[0])
				    });
		    d3.select("#"+button_selector + Object.keys(all_data['data'])[1].replace(/\s+/g, ''))
			.on("click", function(d, i) {
				d3.select("#"+button_selector +Object.keys(all_data['data'])[0].replace(/\s+/g, '')).style('background-color', '#ddd')    
				d3.select(this).style('background-color', '#99ccee');
				base_render(all_data, Object.keys(all_data['data'])[1])
				    });

		    
		}
		else{

		    console.log('hi');
		    
		}
		function base_render(all_data, primary_key){
		    
		    xlabel = all_data['xlabel'];
		    title = all_data['title'];
		    ylabel = all_data['ylabel'];
		    highlight = all_data['highlight'];
		    data = all_data['data'];
		    
		    if (primary_key){
			data = data[primary_key];
		    }
			

		    console.log(xlabel, title, ylabel, highlight, data);

		    factor = 1;
		    if (params.num_type == 'percent'){
			factor = 100;
		    }
		    
		    //x0.domain(['group 1', '0']);
		    //console.log(x0);
		    
		    x0.domain(d3.map(data, function(d) { return d.category;}).keys())
			.rangeRound([0, width])//width - margin.right])
			.paddingInner(0.2);
		    //.range([0, width], 0.5);
		    //console.log(x0('group 0'), d3.map(data, function(d) { console.log(d.groups); return d.groups;}).keys());
		    
		    x1.domain(d3.map(data, function(d) { return d.group;}).keys())
			.rangeRound([0, x0.bandwidth()])
			.padding(0.2);
		    //.range([0, x0.bandwidth()]);
		    //console.log(x1, d3.map(data, function(d) { console.log(d.category); return d.category;}).keys());
		    
		    y.domain([0, d3.max(data, function(d) {return d.data*factor;})+0.05*factor]);
		    
		    
		    //var z = d3.scaleOrdinal()
		    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		    if (params.colorscheme){
			var z = d3.scaleOrdinal(params.colorscheme);
		    }
		    else{
			var z = d3.scaleOrdinal(d3.schemeCategory10);
		    }
		    
		    
		    if (params.bgcolor){
			svg.append("rect")  
			    .attr("x", -margin.left)
			    .attr("y", -margin.top)
			    .attr("width", "100%")
			    .attr("height", "100%")
			    .attr("fill", params.bgcolor);
		    }
		    
		    var stroke_width=5;
		    
		    if (params.num_type == "percent"){
			suffix = '%';
		    }
		    else{
			suffix = '';
		    }
		    
		    svg.append("g").selectAll("g")
			.data(data)
			.enter().append("g")
			.style("stroke", function(d, i) { return z(d.group); })
			.attr('stroke-width', stroke_width)
			.attr("transform", function(d, i) { return "translate(" + x0(d.category) + ",0)"; })
			//.selectAll("rect")
			//.data(function(d) { return d; }).enter()
			.append("rect")
			.attr("width", x1.bandwidth()-stroke_width/2)
			.attr("height", function(d) { return y(0) - y(d.data*factor) - stroke_width/2;})//function() {console.log( y); return y;})
			.attr("x", function(d, i) { return x1(d.group); })
			.attr("y", function(d, i) { return y(d.data*factor); })
			.style('fill', function(d) {if (params.fill_bar == 'fill'){
				    return z(d.group);
				}
				else{
				    return params.bg_color;
				}})
			.on("mouseover", function(d, i) {
				svg.append("text")
				    .attr("class", "title-text")
				    .style("fill", z(d.group))
				    .text(d.group + ', ' + d.category +': ' + (d.data*factor).toFixed(1) + suffix )
				    .attr("text-anchor", "start")
				    .attr("x", (width-margin.left - 100)/2)
				    .attr("y", 10);
			    })
			.on("mouseout", function(d) {
				svg.select(".title-text").remove();
			    });
		    
		    
		    if (!(highlight==="")){
			svg.append("circle")
			    .attr("class", "highlight-circle")
			    .attr("cx", width-margin.right)
			    .attr("cy", margin.top)
			    .attr("r", 10)
			    .style("fill", 'red')
			    .each(pulse)
			    .on("mouseover", mouseOver)
			    .on("mouseout", mouseOut);
		    }
		    
		    function mouseOver() {
			div.transition()
			    .duration(20)
			    .style("opacity", .9);
			div.html("<div style=';position: absolute; text-align: center;  width: 300px;  height: 200px;  padding: 2px;  font: 12px sans-serif;  background: lightsteelblue;  border: 0px;  border-radius: 8px;  pointer-events: none;'>" + highlight+ " </div>")
			    .style("left", width-margin.right - 270)//(d3.event.pageX - 60) + "px")
			    .style("top", margin.top+50)//(d3.event.pageY - 28) + "px")
			    .style("fill", "white");
			console.log('hi');
		    }
		    
		    function mouseOut(){ 
			div.transition()
			    .duration(20)
			    .style("opacity", 0);
			
		    }
		    
		    
		    function pulse() {
			var circle = svg.selectAll(".highlight-circle");
			(function repeat() {
			    circle = circle.transition()
				.duration(1500)
				.attr("r", 5)
				.transition()
				.duration(1500)
				.attr("r", 10)
				.ease(d3.easeSin)
				.on("end", repeat);
			})();
		    };
		    
		    
		    
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
				    return 'black';
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
			.attr("class", "y label")
			.attr("text-anchor", "middle")
			.attr("x", -height/2)
			.attr("y", -margin.left)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
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
			.text(ylabel);
		    
		    
		    
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
		    
		    
		    //
		    //
		    //
		    //svg.append("text")
		    //    .attr("transform", "rotate(-90)")
		    //    .attr("y", 0 – margin.left)
		    //    .attr("x", 0 - (height / 2))
		    //    .attr("dy", "1em")
		    //    .style("text-anchor", "middle")
		    //    .text(ylabel);
		    
		}	

	    });
    });

