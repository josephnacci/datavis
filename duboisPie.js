var margin = {top: 10, left: 10, right: 10, bottom: 10};
var width = 500;
var height = 500; //this is the double because are showing just the half of the pie
var radius = Math.min(width, height) / 2.3;

//array of colors for the pie (in the same order as the dataset)

 
data = [
	{'group': 'men',  label: 'CDU', value: 1 },
	{'group': 'men',  label: 'SPD', value: 2 },
	{'group': 'men',  label: 'Die Grünen', value: 1 },
	{'group': 'men',  label: 'Die Mitte', value: 1 },
	{'group': 'men',  label: 'dd', value: 3},
	{'group': 'women',  label: 'CDU', value: 1 },
	{'group': 'women',  label: 'SPD', value: 1 },
	{'group': 'women',  label: 'Die Grünen', value: 1 },
	{'group': 'women',  label: 'Die Mitte', value: 5 },
	{'group': 'women',  label: 'dd', value: 8}
	];

console.log(d3.map(data, function(d){return d.label;}).keys());

var keys = d3.map(data, function(d){return d.label;}).keys();

var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#85a8ba', '#96b6c5', '#adc4ce', '#eee0c9', '#f1f0e8', '#e4decb', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#46f0f0', '#1d1d1b', '#be1522', '#3aaa35', '#0e71b8', '#f39200']);
    


var svg = d3.select("#chart")
    .append("svg")              //create the SVG element inside the <body>
    .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height)
    .append("svg:g")                //make a group to hold our pie chart
    .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');    //move the center of the pie chart from 0, 0 to radius, radius
 
var arc = d3.arc()              //this will create <path> elements for us using arc data
    .innerRadius(0)
    .outerRadius(radius);
 
var angle = 30;

var pie1 = d3.pie()           //this will create arc data for us given a list of values
    .startAngle((90 - angle) * (Math.PI/180))
    .endAngle((-90 + angle) * (Math.PI/180))
    .padAngle(.0) // some space between slices
    .sort(null) //No! we don't want to order it by size
    .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array



function getFilteredData(data, group) {
    console.log(data.filter(function(point) { return point.group === group; }));
    return data.filter(function(point) { return point.group === group; });
}


var arcs1 = svg.data([getFilteredData(data, 'men')])                   //associate our data with the document
    .selectAll("g.slice1")     //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie1)  //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
    .enter()   //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g")  //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice1");    //allow us to style things in the slices (like text)
 
arcs1.append("svg:path")
    .attr("fill", function(d, i) { return d3.rgb(color(d.data.label)).darker(1); } ) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 
arcs1.append("svg:text")                            //add a label to each slice
    .attr("fill", "#000")
    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	    //we have to make sure to set these before calling arc.centroid
	    d.innerRadius = 0;
	    d.outerRadius = radius;
	    return "translate(" +  d3.arc().innerRadius(0)
                .outerRadius(radius*1.7).centroid(d)  + ")";        //this gives us a pair of coordinates like [50, 50]
	})
    .attr("text-anchor", "middle")                          //center the text on it's origin
    .text(function(d, i) { return d.data.value; });      //get the label from our original data array


var pie2 = d3.pie()           //this will create arc data for us given a list of values
     .startAngle((90 - angle + 180) * (Math.PI/180))
     .endAngle((-90 + angle + 180) * (Math.PI/180))
     .padAngle(.0) // some space between slices
     .sort(null) //No! we don't want to order it by size
    .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array


///// facing down

var arcs2 = svg.data([getFilteredData(data, 'women')])                   //associate our data with the document
    .selectAll("g.slice2")     //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie2)  //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
    .enter()   //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g")  //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice2");    //allow us to style things in the slices (like text)

arcs2.append("svg:path")
    .attr("fill", function(d, i) { return d3.rgb(color(d.data.label)).darker(1); } ) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 
arcs2.append("svg:text")                                     //add a label to each slice
    .attr("fill", "#000")
    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	    
	    //we have to make sure to set these before calling arc.centroid
	    d.innerRadius = 0;
	    d.outerRadius = radius;
	    return "translate(" +  d3.arc()              //this will create <path> elements for us using arc data                                                                                                  
		.innerRadius(0)
		.outerRadius(radius*1.7).centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	})
    .attr("text-anchor", "middle")                          //center the text on it's origin
    .text(function(d, i) { return d.data.value; });      //get the label from our original data array



svg.append("text")
    .attr("x", 0)             
    .attr("y", -height/2 + margin.top + 10)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .text("Men");



svg.append("text")
    .attr("x", 0)             
    .attr("y", height/2 - margin.bottom - 10)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .text("Women");


var legend = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys)
    .enter().append("g")
    .attr("transform", function(d, i) { console.log(d); return 'translate(' + 0 +  ',' + 0 + ')';})//" + -(i%keys.length/4) * 150 + "," + (i%4) * 22 + ")"; });

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
