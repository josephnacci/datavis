var chloropleth = function chloropleth(all_data, selector, params) {
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
    .scale(1000) //.translate([487.5, 305])
    //.center([0,20])                // GPS of location to zoom on
    //.scale(99)                       // This is like the zoom
    .translate([width / 2, height / 2]);

    //d3.queue()
    //.defer(d3.json, "gz_2010_us_040_00_500k.json")//https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
    //.defer(d3.csv, "all_data")//https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv") // Position of circles
    //.await(ready);

    //function ready(error, dataGeo, data) {
    dataGeo = all_data["data_params"]["dataGeo"];
    data = all_data["data"];
    console.log(data);
    chart_params = all_data["data_params"];
    // Create a color scale

  var threshold = d3
    .scaleThreshold()
    .domain([0.5, 0.8, 1, 1.2, 1.5, 2])
    .range(["#de425b", "#de7d64", "#e4b08f", "#cbbe8e", "#95a658", "#488f31"]);
  
    xExtent = [d3.min(d3.values(data), function(d, i) { return +d['Dentist Rate']; }), d3.max(d3.values(data), function(d, i) { return +d['Dentist Rate']; })]
    console.log(xExtent, all_data["data_params"]["slope"]);
  
    if (all_data["data_params"]["slope"] == 'false'){
	var color = d3.scaleSequential(d3.interpolateBlues).domain(xExtent);

    }
    else{
	if (xExtent[0] < 0){
	    var color = d3.scaleLinear().range(['red', 'white', 'blue']).domain([xExtent[0], 0, xExtent[1]]);
	}
	else{
	    var color = d3.scaleSequential(d3.interpolateBrBG).domain(xExtent);

	}
    }

    // Add a scale for bubble size
    var valueExtent = d3.extent(data, function(d) {
	    return +d.n;
	});

  var size = d3
    .scaleSqrt()
    .domain(valueExtent) // What's in the data
    .range([0.8, 1]); // Size in pixel

    // Draw the map
    //
  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(dataGeo, dataGeo.objects.counties).features)
    .enter()
    .append("path")
    .attr("fill", function(d) {
	    return (d.id in data) ? color(data[d.id]["Dentist Rate"]) : color(0);
	})
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "black")
    .style("stroke-width", 0.1)
    .style("opacity", 1);

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

    // --------------- //
    // ADD LEGEND //
    // --------------- //

    var formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".0f");

  var xAxis = d3
    .axisBottom(color)
    .tickSize(13)
    .tickValues(threshold.domain());

    //.tickFormat(function(d) { return d === 0.5 ? formatPercent(d) : formatNumber(100 * d); });

    svg.call(xAxis);

    svg.select(".domain").remove();

  svg
    .selectAll("rect")
    .data(
	  threshold.range().map(function(c) {
		  var d = threshold.invertExtent(c);
		  if (d[0] == null) d[0] = color.domain()[0];
		  if (d[1] == null) d[1] = color.domain()[1];
		  return d;
	      })
	  )
    .enter()
    .insert("rect", ".tick")
    .attr("height", 8)
    .attr("x", function(d) {
	    return color(d[0]);
	})
    .attr("width", function(d) {
	    return color(d[1]) - color(d[0]);
	})
    .attr("fill", function(d) {
	    return threshold(d[0]);
	});

  svg
    .append("text")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .attr("y", 20)
    .text("Fan index");
};
