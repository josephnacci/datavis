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
