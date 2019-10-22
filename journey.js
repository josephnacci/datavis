// set the dimensions and margins of the graph
var width = 800;
var height = 700;

// append the svg object to the body of the page
var svg = d3.select("#journey_map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// create dummy data -> just one element per circle



d3.json("http://localhost:8000/ref_time_journey.json", function(data){

	// A scale that gives a X target position for each group
	data = data['Carpe Diem Shopper']

	var steps = d3.map(data, function(d){return  +d.step;}).keys();


        var num_steps = steps.length;
	
	var x_range = [];
	var dwidth = 80;
	var N = 300;


	total_dist = 0
        for(i = 0; i < N; i++){

            y = (width-dwidth) - 4*(width - dwidth) / height**2 * (i*height/N - height/2 )**2;

            if (i == 0){
		prev_y = y;
            }
            total_dist += Math.sqrt((height/N)**2 + (prev_y - y)**2);
	    prev_y = y;
	}


	dist_cut = total_dist / (num_steps+1);

	
	running_dist = 0;
	for(i = 0; i < N; i++){
	    
            y = (width-dwidth) - 4*(width - dwidth) / height**2 * (i*height/N - height/2 )**2;
	    if (i == 0){
		prev_y = y;
	    }
	    running_dist += Math.sqrt((height/N)**2 + (prev_y - y)**2);
	    if (running_dist > dist_cut){
		x_range.push( (width-dwidth) - 4*(width - dwidth) / height**2 * (i*height/N - height/2 )**2);
		running_dist = 0
	    }
	    prev_y = y;

	};
    
	var y_range = [];
	for (i = 0; i < num_steps; i++){
	    y_range.push(50 + 0.9*height/num_steps * i)//* parseInt(i/3));
	};
	console.log(x_range);
	console.log(y_range);


	var x = d3.scaleOrdinal()
	    .domain(steps)
	    .range(x_range);


	var y = d3.scaleOrdinal()
	    .domain(steps)
	    .range(y_range);

// A color scale
	var color = d3.scaleOrdinal()
	    .domain(d3.map(data, function(d){return d.type;}).keys())
	    .range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']);
	
	
	var bg = svg.append("g")
	    .selectAll('fixedcircle')
	    .data(steps)
	    .enter()
            .append("circle")
            .attr("r", 60)
            .attr("cx", function(d){console.log(d); return x(d);})
            .attr("cy", function(d){ return y(d);})
	    .style("stroke", "gray")
	    .style("fill", "transparent")
	
	
	var circleRad = 5;

	var linesGrid = svg.append("g").selectAll("g")//svg_dot.selectAll("lines.grid")                                                                 
	    .data(data)
	    .enter()
	    .append("line");



	var bubble_factor = 10;
	
	// Initialize the circle: all located at the center of the svg area
	var node = svg.append("g")
	    .selectAll("circle")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("r", function(d, i){ return circleRad + d.size/bubble_factor})
	    .attr("cx", width / 2)
	    .attr("cy", height / 2)
	    .style("fill", function(d, i){ return color(d.type)})//d.group)})
	    .style("fill-opacity", 0.8)
	    .attr("stroke", "black")
	    .style("stroke-width", 2)
	    //.append('path')
	    //.attr('d', pathData)


	    .call(d3.drag() // call specific function when circle is dragged
		  .on("start", dragstarted)
		  .on("drag", dragged)
		  .on("end", dragended))
	    .on('mouseover', function(d, i){
		    linesGrid.attr('opacity', function(dl){

			    if (d.name == dl.name){
				    console.log(d.name, dl.name)
				    return 1;
				    //linesGrid._groups[0][i].attributes['opacity'] = 1;//('opacity', 1);

			    }
			    else{
				return 0;
			    }
			})
		    d3.select(this.parentNode).append("text")//appending it to path's parent which is the g(group) DOM
		    .attr("x", 0)
		    .attr("y", height/2)
		    .attr("dx", "6") // margin
		    .attr("dy", ".35em") // vertical-align
		    .attr("class", "mylabel")//adding a label class
		    .text(function() {
			    return d.name;
			});
		})
	    .on('mouseout', function(d, i){
		    linesGrid.attr('opacity', 0)
		    d3.selectAll(".mylabel").remove()//this will remove the text on mouse out
		});

	
	// Features of the forces applied to the nodes:
	var simulation = d3.forceSimulation()
	    .force("x", d3.forceX().strength(0.2).x( function(d){ return x(d.step) } ))
	    .force("y", d3.forceY().strength(0.2).y( function(d){ return y(d.step) } ))
	    //.force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
	    .force("charge", d3.forceManyBody().strength(3)) // Nodes are attracted one each other of value is > 0
	    .force("collide", d3.forceCollide().strength(1).radius(function(d, i) { return circleRad + d.size/bubble_factor}).iterations(1)); // Force that avoids circle overlapping
	
	// Apply these forces to the nodes and update their positions.
	// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
	simulation
	    .nodes(data)
	    .on("tick", function(d){
		    node
			.attr("cx", function(d){ return d.x; })
			.attr("cy", function(d){ return d.y; });
		    linesGrid.attr("x2", function(d) {                                                                                                                               
			    return d.x                                                                                                                                      
				})                                                                                                                                                  
			.attr("y2", function(d) {                                                                                                                               
				return d.y;// + heightScale_dot.bandwidth();//rangeBand()/2;                                                                                    
			    })                                                                                                                                                  

			});
	
	
	linesGrid.attr("class", "grid")
	    .attr("x1", 0)
	    .attr("y1", height/2)
	    .attr("x2", function(d) {
		    return d.y
		})
	    .attr("y2", function(d) {
		    return d.x;// + heightScale_dot.bandwidth();//rangeBand()/2;                                                    
		})
	    .attr('stroke', '#000')
	    .attr('stroke-width', 2)	
	    .attr("opacity", 0);
	



	
	// What happens when a circle is dragged?
	function dragstarted(d) {
	    if (!d3.event.active) simulation.alphaTarget(.03).restart();
	    d.fx = d.x;
	    d.fy = d.y;
	}
	function dragged(d) {
	    d.fx = d3.event.x;
	    d.fy = d3.event.y;
	}
	function dragended(d) {
	    if (!d3.event.active) simulation.alphaTarget(.03);
	    d.fx = null;
	    d.fy = null;
	}
	
	var keys = d3.map(data, function(d){return d.type;}).keys();
	
	var legend = svg.append("g")
	    .attr("font-family", "sans-serif")
	    .attr("font-size", 10)
	    .attr("text-anchor", "end")
	    .selectAll("g")
	    .data(keys)
	    .enter().append("g")
	    .attr("transform", function(d, i) { return "translate(" + -(i%keys.length/4) * 150 + "," + (i%4) * 22 + ")"; });
	
	legend.append("rect")
	    .attr("x", width-19)
	    .attr("width", 19)
	    .attr("height", 19)
	    .attr("fill", function(d){return color(d)});
	
	legend.append("text")
	    .attr("x", width -24)
	    .attr("y", 9.5)
	    .attr("dy", "0.32em")
	    .text(function(d) { return d; });
	
	
	
    
    });