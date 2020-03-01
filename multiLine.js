var multiLine = function multLine(all_data, selector, params) {
    //chart size definition
    var margin = { top: 70, right: 50, bottom: 30, left: 50 };

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

  var svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var selector_class = selector.slice(1, selector.length);

    data = all_data["data"];
    chart_params = all_data["data_params"];
    console.log(data);

    /* Format Data */
    if (params.time_axis === 1) {
	var parseDate = d3.timeParse(params.time_parse);
	data.forEach(function(d) {
		d.x = parseDate(d.x);
	    });
	console.log(data);

	/* Scale */
    var xScale = d3
	.scaleTime()
	.domain(
		d3.extent(
			  data.map(function(d) {
				  return d.x;
			      })
			  )
		)
	.range([0, width]);
    } else {
    var xScale = d3
    .scalePoint()
    .domain(
	    data.map(function(d) {
		    console.log(d.x);
		    return d.x;
		})
	    )
    .range([0, width]);
    }

    if (params.y_type === "percent") {
	factor = 100;
    } else {
	factor = 1;
    }
    // get max value for each group
    // this is to display the different trends on the same scale
    // clicking on the curve or the legend will show a curve on it's legit scale
    norm_factors = [];

    for (let d = 0; d < chart_params["group_names"].length; d++) {
	//if (chart_params['group_names'].length > 1){
	max = d3.max(data, function(e) {
		return e.y[d];
	    });
	norm_factors.push(max);
	//.map(x => x * factor));
	//}
	//else{
	//  console.log(d.y);
	//  return d.y;
	//}
    }

    norm_factors.push(1);

  var yScale = d3
    .scaleLinear()
    .domain([
	     0,
	     d3.max(data, function(d) {
		     //if (chart_params['group_names'].length > 1){
		     if (params.normalize_flag == 1) {
			 return 1;
		     } else {
			 return d3.max(d.y.map(x => x * factor));
		     }
		     //}
		     //else{
		     //  console.log(d.y);
		     //  return d.y;
		     //}
		 }) *
        1.1 +
        0.03 * factor
	     ])
    .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

  let lines = svg
    .append("g")
    .attr("class", "line")
    .attr("fill", "none");

    if (params.tooltip === 1) {
    var tooltipDiv = d3
	.select("body")
	.append("div")
	.attr("id", "tooltip" + selector_class)
	.attr("class", "tooltip tooltip" + selector_class)
	.style("background-color", "#C4C4C4")
	.style("padding", "5px")
	.style("border-radius", "10px")
	.style("opacity", 0);
    }

    var colors = params.color_list;

  mouseover_text = svg
    .selectAll("g") //svg.selectAll("lines.grid")
    .data(data)
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", params.title_y + 30);

    function plotLines(normalize_flag) {
	yaxis = svg.append("g");

	for (group = 0; group < chart_params["group_names"].length; group++) {
      lines = svg
	  .append("g")
	  .selectAll("g")
	  .data([data])
	  .enter();

      dots = svg
	  .append("g")
	  .selectAll("g") //svg.selectAll("lines.grid")
	  .data(data)
	  .enter();

      var valueline = d3
	  .line()
	  .x(function(d) {
		  return xScale(d.x);
	      })
	  .y(function(d) {
		  return yScale(
				d.y[group] / (normalize_flag === 0 ? 1 : norm_factors[group])
				);
	      });

      lines
	  .append("path")
	  .attr(
		"class",
          "line" + selector_class + " line" + selector_class + group
		)
	  .style("stroke", colors[group])
	  .style("stroke-width", 3)
	  .attr("d", valueline)
	  .attr("fill", "none");

      dots
	  .append("circle")
	  .attr(
		"class",
          "circle" + selector_class + " circle" + selector_class + group
		) // + group)
	  .attr("cx", function(d) {
		  return xScale(d.x);
	      })
	  .attr("cy", function(d) {
		  return yScale(
				d.y[group] / (normalize_flag === 0 ? 1 : norm_factors[group])
				);
	      })
	  .attr("fill", colors[group])
	  .attr("r", params.point_size + "px");
      if (params.tooltip === 1) {
        dots
	    .on("mouseover", function(d) {
		    tooltipDiv.style("opacity", 0.9);
            tooltipDiv
		.html(
                "<strong> Week of " +
		d.x.toDateString() +
                  "</strong><br>" +
                  "<span style='width:" +
                  2 * params.point_size +
                  ";height:" +
                  2 * params.point_size +
                  ";background-color:" +
                  colors[0] +
                  ";display:inline-block;border-radius:50%;'></span> " +
		(factor * d.y[0]).toFixed(0) +
                  " sign-ups <br>" +
                  "<span style='width:" +
                  2 * params.point_size +
                  ";height:" +
                  2 * params.point_size +
                  ";background-color:" +
                  colors[1] +
                  ";display:inline-block;border-radius:50%;'></span> " +
		(factor * d.y[1]).toFixed(0) +
                  " sign-ups"
		      )
		.style("left", d3.event.pageX + 30 + "px")
		.style("top", d3.event.pageY - 50 + "px");
		})
	    .on("mouseout", function(d) {
            tooltipDiv
		.style("opacity", 0)
		.style("top", d3.event.pageX + 100 + "px");
		});
      }
	}

	// Add the X Axis
    xaxis = svg
	.append("g")
	.attr("transform", "translate(0," + (height) + ")")
	.call(d3.axisBottom(xScale));

    xaxis.selectAll(".tick text").call(wrap, 100);

    // Add the Y Axis
    yaxis.call(
      d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-width)
	       );
    yaxis.selectAll("text").attr("dx", "-0.5em");

    //y grid line
    yaxis
	.selectAll("line")
	.attr("stroke-dasharray", "4 6")
	.attr("stroke-width", params.grid_width)
	.attr("stroke", params.grid_color)
	.style("z-index", "-10000");

    if (params.hide_y_axis == 1) {
	yaxis.call(g => g.select(".domain").remove());
    }
    if (params.hide_x_axis == 1) {
	xaxis.call(g => g.select(".domain").remove());
    }
    }

    plotLines(params.normalize_flag);
    //drawSecondAxis(group_id)

    norm_names = [];
    for (let i = 0; i < chart_params["group_names"].length; i++) {
	norm_names.push({
		name: chart_params["group_names"][i],
		    norm_val: norm_factors[i]
		    });
    }
    var length_array = [0];
    var row_array = [0];
    var row_count = 0;
    for (let i = 0; i < norm_names.length; i++) {
	length_array.push(length_array[i] + norm_names[i]["name"].length);
	if ((length_array[i]+ norm_names[i]["name"].length) * 10 + params.legend_x_anchor > width - margin.left) {
	    row_count += 1;
	    row_array.push(row_count);
	    length_array[i + 1] = 0;
	} else {
	    row_array.push(row_count);
	}
    }

    yaxis_secondary = svg.append("g");

    var legend = svg.append("g").attr("class", "legend");
    current_x = params.legend_x_anchor + params.point_size;
    //for (var i = 0; i < classes.length; i++) {
    //brand_color[classes[i]] = colors[i];
    //current_x;
  legend
    .append("g")
    .selectAll("g") //svg_dot.selectAll("lines.grid")
    .data(norm_names)
    .enter()
    .append("circle")
    .attr("class", "dots")
    .attr("cx", function(d, i) {
	    return length_array[i] * 10 + params.legend_x_anchor;
	}) //current_x)
    .attr("cy", function(d, i) {
	    return params.legend_y_anchor + 20 + 15 * row_array[i];
	})
    .attr("fill", function(d, i) {
	    return colors[i];
	})
    .attr("r", params.point_size * 2)
    .on("mouseover", function(d, i1) {
	    //plotLines(0)
	    if (params.normalize_flag == 1) {
		yaxis_secondary.attr("opacity", 0);
		yaxis_secondary.exit().remove();
		d3.selectAll(".circle" + selector_class).style("opacity", 1);
		d3.selectAll(".line" + selector_class).style("opacity", 1);

		// function to set
        yScale2 = d3
	    .scaleLinear()
	    .domain([0, d.norm_val + 0.03 * factor])
	    .range([height - margin.top, 0]);

        yaxis_secondary = svg.append("g");

        yaxis_secondary.call(
          d3
	  .axisRight(yScale2)
	  .ticks(5)
	  .tickSize(width)
			     );
        yaxis_secondary
	    .selectAll("text")
	    .attr("dx", "0.5em")
	    .attr("font-color", colors[i1]);

        //y grid line
        yaxis_secondary
	    .selectAll("line")
	    .attr("stroke-dasharray", "4 6")
	    .attr("stroke-width", params.grid_width)
	    .attr("stroke", colors[i1])
	    .style("z-index", "-10000");

        if (params.hide_y_axis == 1) {
	    yaxis_secondary.call(g => g.select(".domain").remove());
        }
	    }

	    d3.selectAll(".circle" + selector_class).style("opacity", function(
									       d2,
        i2
									       ) {
							       if ("circle" + selector_class + i1 == this.classList[1]) {
								   return 1;
							       } else {
								   return 0.2;
							       }
							   });
	    d3.selectAll(".line" + selector_class).style("opacity", function(d2, i2) {
		    if ("line" + selector_class + i1 == this.classList[1]) {
			return 1;
		    } else {
			return 0.1;
		    }
		});
	})
    .on("mouseout", function(d) {
	    yaxis_secondary.attr('opacity', 0);
	    yaxis_secondary.exit().remove();
	    d3.selectAll(".circle" + selector_class).style("opacity", 1);
	    d3.selectAll(".line" + selector_class).style("opacity", 1);
	});

  legend
    .append("g")
    .selectAll("g") //svg_dot.selectAll("lines.grid")
    .data(chart_params["group_names"])
    .enter()

    .append("text")
    .attr("fill", "#000")
    .attr("x", function(d, i) {
	    return length_array[i] * 10 + 10 + params.legend_x_anchor;
	})
    .attr("y", function(d, i) {
	    return params.legend_y_anchor + 20 + 15 * row_array[i];
	})
    .attr("dy", "0.32em")
    .style("text-anchor", "left")
    .text(function(d) {
	    return d;
	});

    //////Title
  title = svg
    .append("text")
    .attr("x", params.title_x)
    .attr("y", params.title_y)
    .attr("dy", "0.36em")
    .style("text-anchor", "left")
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
		    lineHeight = 1.1, // ems
		    y = text.attr("y"),
		    dy = parseFloat(text.attr("dy")),
		    dx = 0,
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
	      .text(word);
		    }
		}
	    });
    }
};
