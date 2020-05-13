var chloropleth_2d = function chloropleth_2d(all_data, selector, params) {
    var margin = { top: 10, right: 10, bottom: 10, left: 10 };

    if ("width" in params) {
	width = params.width - margin.left - margin.right;
    } else {
	width = 800 - margin.left - margin.right;
    }

    if ("height" in params) {
	height = params.height - margin.top - margin.bottom;
    } else {
	height = 405 - margin.top - margin.bottom;
    }

    d3.selectAll(selector + " > *").remove();

    selector_class = selector.slice(1,selector.length)
  
    // The svg
  var svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Map and projection
  var projection = d3
    .geoAlbersUsa()
    .scale(1200) //.translate([487.5, 305])
    //.center([0,20])                // GPS of location to zoom on
    //.scale(99)                       // This is like the zoom
    .translate([width / 2, height / 2]);

    //d3.queue()
    //.defer(d3.json, "gz_2010_us_040_00_500k.json")//https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
    //.defer(d3.csv, "all_data")//https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv") // Position of circles
    //.await(ready);

    //function ready(error, dataGeo, data) {
    var dataGeo = all_data["data_params"]["dataGeo"];
    var data = all_data["data"];
    console.log(data);
    var chart_params = all_data["data_params"];
    // Create a color scale

    //ndim 1
    var ndim_x = chart_params["ndim_x"];
    var ndim_y = chart_params["ndim_y"];
    console.log(ndim_x, ndim_y)
    //test scale:
    //color order goes: [[0,1,2],[3,4,5],[6,7,8]]
    if (ndim_x == 3 && ndim_y == 3) {
    var color_range = [
		       "#21313e",
		       "#64464a",
		       "#a85b56",
		       "#3c613a",
		       "#617351",
		       "#868668",
		       "#579236",
		       "#5ea258",
      "#65b27a"
		       ];
    } else if (ndim_x == 4 && ndim_y == 3) {
    var color_range = [
		       "#21313e",
		       "#534047",
		       "#865050",
		       "#b96059",
		       "#3c613a",
		       "#586f4b",
		       "#747d5d",
		       "#908b6e",
		       "#579236",
		       "#5c9e4f",
		       "#61aa69",
      "#66b683"
		       ];
    }

    function color_function(xval, yval) {
	var i = 0;
	while (xval > xthresh[i]) {
	    i += 1;
	}
	var xcolor = i;

	var i = 0;
	while (yval > ythresh[i]) {
	    i += 1;
	}
	var ycolor = i;
	return color_range[xcolor + ndim_x * ycolor];
    }

    //var threshold = d3
    //  .scaleThreshold()
    //  .domain()
    //  .range(["#de425b", "#de7d64", "#e4b08f", "#cbbe8e", "#95a658", "#488f31"]);

    sort_x = d3.values(data).sort(function(a, b) {
	    return d3.ascending(+a.x, +b.x);
	});

    sort_y = d3.values(data).sort(function(a, b) {
	    return d3.ascending(+a.y, +b.y);
	});

    xthresh = [];
    for (i = 0; i < ndim_x; i++) {
	xthresh.push(sort_x[Math.floor(sort_x.length / ndim_x) * (i + 1)]["x"]);
    }

    ythresh = [];
    for (i = 0; i < ndim_y; i++) {
	ythresh.push(sort_y[Math.floor(sort_y.length / ndim_y) * (i + 1)]["y"]);
    }
    console.log(xthresh, ythresh);

  xExtent = [
	     d3.min(d3.values(data), function(d, i) {
		     return +d["x"];
		 }),
	     d3.max(d3.values(data), function(d, i) {
		     return +d["x"];
		 })
	     ];
  yExtent = [
	     d3.min(d3.values(data), function(d, i) {
		     return +d["y"];
		 }),
	     d3.max(d3.values(data), function(d, i) {
		     return +d["y"];
		 })
	     ];

    console.log(xExtent, all_data["data_params"]["slope"]);

    if (all_data["data_params"]["slope"] == "false") {
	var color = d3.scaleSequential(d3.interpolateBlues).domain(xExtent);
    } else {
	if (xExtent[0] < 0) {
      var color = d3
      .scaleLinear()
      .range(["red", "white", "blue"])
      .domain([xExtent[0], 0, xExtent[1]]);
	} else {
	    var color = d3.scaleSequential(d3.interpolateBrBG).domain(xExtent);
	}
    }

    // Add a scale for bubble size

    //
  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(dataGeo, dataGeo.objects.counties).features)
    .enter()
    .append("path")
    .attr("fill", function(d) {
      return d.id in data
      ? color_function(data[d.id]["x"], data[d.id]["y"])
      : color(0);
	})
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "black")
    .style("stroke-width", 0.1)
    .style("opacity", 1);

  
var legend_mouseover_text = svg
    .append("text")
    .attr('id', 'legend_mouseover_text' + selector_class)
    .attr("x", params.legend_x-600)
    .attr("y", params.legend_y-40)
    .text('');

  var legend_instruction_text = svg
    .append("text")
    .attr('id', 'legend_mouseover_text' + selector_class)
    .attr("x", params.legend_x-45)
    .attr("y", params.legend_y+3*18+10)
    .text('Rollover to see counties');

  
    //legend
  var legend = svg
    .append("g")
    .selectAll("g") //.selectAll("circle.y2015")
    .data(color_range)
    .enter()
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("x", function(d, i) {
	    return params.legend_x + (i % ndim_x) * 18;
	})
    .attr("y", function(d, i) {
	    return params.legend_y + Math.floor(i / ndim_x) * 18;
	})
    .attr("fill", function(d, i) {
	    return d;
	})
    .style("stroke", "black")
    .style("stroke-width", 1)
    .on("mouseover", function(d, i) {
	    svg.selectAll("path").style("opacity", function(d1) {
		    if (d1.id in data) {
			if (d == color_function(data[d1.id]["x"], data[d1.id]["y"])) {
			    return 1;
			} else {
			    return 0.2;
			}
		    }
        
		    xdim = (i % ndim_x)
		    ydim = Math.floor(i / ndim_x)
        
		    svg.select('#legend_mouseover_text' + selector_class)
		    .text('Showing counties with ' + (xdim==0?'low':(xdim==1?'middle':'high')) +
                ' ' + chart_params["x_metric"] + ' and ' + 
			  (ydim==0?'low':(ydim==1?'middle':'high'))+ ' ' + chart_params["y_metric"])
        
		});
	})
    .on("mouseout", function(d) {
	    svg.selectAll("path").style("opacity", 1);
	    svg.select('#legend_mouseover_text' + selector_class).text('')

	});

    //legend text x
  var legend_x_text = svg
    .append("g")
    .selectAll("g") //.selectAll("circle.y2015")
    .data(xthresh)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
	    return params.legend_x + i * 18 + 9;
	})
    .attr("y", function(d, i) {
	    return params.legend_y - 2;
	})
    .text(function(d, i) {
	    console.log(
			[0].concat(xthresh)[i].toFixed(1) +
          " - " +
			[0].concat(xthresh)[i + 1].toFixed(1)
			);
	    return (
		    [0].concat(xthresh)[i].toFixed(1) +
        " - " +
		    [0].concat(xthresh)[i + 1].toFixed(1)
		    );
	})
    .style("text-anchor", "start")
    .attr("transform", function(d, i) {
	    return (
        "rotate(-45 " +
        (params.legend_x + i * 18 + 9) +
        " " +
        (params.legend_y - 2) +
        ")"
		    );
	});

  var legend_x_label = svg
    .append("text")
    .attr("x", params.legend_x)
    .attr("y", params.legend_y - 50)
    .text(chart_params["x_metric"]);

  var legend_y_text = svg
    .append("g")
    .selectAll("g") //.selectAll("circle.y2015")
    .data(ythresh)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
	    return params.legend_x - 2;
	})
    .attr("y", function(d, i) {
	    return params.legend_y + i * 18 + 15;
	})
    .text(function(d, i) {
	    return (
		    [0].concat(ythresh)[i].toFixed(1) +
        " - " +
		    [0].concat(ythresh)[i + 1].toFixed(1)
		    );
	})
    .style("text-anchor", "end");

  var legend_y_label = svg
    .append("text")
    .attr("x", params.legend_x - 70)
    .attr("y", params.legend_y)
    .text(chart_params["y_metric"])
    .style("text-anchor", "end")
    .attr("transform", function(d, i) {
	    return (
		    "rotate(-90 " + (params.legend_x - 70) + " " + params.legend_y + ")"
		    );
	});

    var selector_class = selector.slice(1, selector.length);
  var tooltipDiv = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip" + selector_class)
    .attr("class", "tooltip tooltip" + selector_class)
    .style("background-color", "#C4C4C4")
    .style("padding", "5px")
    .style("border-radius", "10px")
    .style("opacity", 0);

    // Add circles:

    // Add title and explanation
  title = svg
    .append("text")
    .attr("x", params.title_x)
    .attr("y", params.title_y)
    .attr("dy", "0.36em")
    .style("text-anchor", "middle")
    .text(chart_params["title"]);

    //text styling
  svg
    .selectAll("text")
    .attr("font-family", "proxima-nova, sans-serif")
    .attr("font-style", "normal")
    .attr("font-weight", "normal")
    .attr("font-size", params.font_size + "px")
    .attr("line-height", "20px")
    .attr("letter-spacing", "0.3px")
    .attr("fill", params.font_color);

    //title text styling
  title
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .attr("fill", params.font_color);

    legend_x_text.attr("font-size", "10px");
    legend_y_text.attr("font-size", "10px");
    legend_instruction_text.attr("font-size", "10px");
    legend_x_label.attr("font-size", "12px").attr("font-weight", "bold");
    legend_y_label.attr("font-size", "12px").attr("font-weight", "bold");
    legend_mouseover_text.attr("font-size", "16px")
    // --------------- //
    // ADD LEGEND //
    // --------------- //
  
    function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
        words = text
		    .text()
		    .split(/\s+/)
		    .reverse(),
		    word,
		    line = [],
		    lineNumber = 0,
		    lineHeight = 1, // ems
		    y = text.attr("y"),
		    dy = parseFloat(text.attr("dy")),
		    dx = -0.9,
        tspan = text
		    .text(null)
		    .append("tspan")
		    .attr("x", 0)
		    .attr("y", y)
		    .attr("dy", dy + "em")
		    .attr("dx", dx + "em")
		    .style("fill", function(d) {
			    if (params.bgcolor) {
				if (params.bgcolor == "black") {
				    return "white";
				}
			    } else {
				return "black";
			    }
			});

		while ((word = words.pop())) {
		    line.push(word);
		    tspan.text(line.join(" "));
		    if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
          tspan = text
	      .append("tspan")
	      .attr("x", 0)
	      .attr("y", y)
	      .attr("dy", ++lineNumber * lineHeight + "em")
	      .attr("dx", dx + "em")
	      .text(word)
	      .style("fill", function(d) {
		      if (params.bgcolor) {
			  if (params.bgcolor == "black") {
			      return "white";
			  }
		      } else {
			  return "black";
		      }
		  });
		    }
		}
	    });
    }
};
