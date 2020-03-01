var multiDotPlot = function multiDotPlot(all_data, selector, params) {
    var margin_dot = { top: 100, right: 200, bottom: 50, left: 100 };

    var width_dot = 1000 - margin_dot.left - margin_dot.right,
    height_dot = params.height - margin_dot.top - margin_dot.bottom;

    //.paddingInner(0.);
    //.rangeRoundBands([ margin_dot.top, height_dot], 0.1);

    if (params.xy_orientation == "vertical") {
	c_1_1 = "y1";
	c_1_2 = "y2";
	c_2_1 = "x1";
	c_2_2 = "x2";
	c_point_1 = "cy";
	c_point_2 = "cx";
	dim_1 = "height";
	dim_2 = "width";

	var widthScale_dot = d3.scaleLinear().range([height_dot, 0]);

	var heightScale_dot = d3.scalePoint().rangeRound([0, width_dot]); //width - margin. //.ordinal()

	var xAxis_dot = d3.scaleLinear().range([height_dot, 0]); //svg.axis()
	//.scale(widthScale_dot)
	//.orient("bottom");

	var yAxis_dot = d3.scalePoint().range([0, width_dot]); //svg.axis()
	//.scale(heightScale_dot)
	//.orient("left")
	//.innerTickSize([0]);
    } else {
	c_1_1 = "x1";
	c_1_2 = "x2";
	c_2_1 = "y1";
	c_2_2 = "y2";
	c_point_1 = "cx";
	c_point_2 = "cy";
	dim_1 = "width";
	dim_2 = "height";

	var widthScale_dot = d3.scaleLinear().range([0, width_dot]);

	var heightScale_dot = d3.scalePoint().rangeRound([0, height_dot]); //width - margin. //.ordinal()

	var xAxis_dot = d3.scaleLinear().range([0, width_dot]); //svg.axis()
	//.scale(widthScale_dot)
	//.orient("bottom");

	var yAxis_dot = d3.scalePoint().range([0, height_dot]); //svg.axis()
	//.scale(heightScale_dot)
	//.orient("left")
	//.innerTickSize([0]);
    }

    var fullwidth = 200,
    fullheight = 1000;
    //var svg_dot = d3.select(selector)
    //.append("svg")
    //.attr("width", fullwidth)
    //.attr("height", fullheight);
    d3.selectAll(selector + " > *").remove();

  var svg_dot = d3
    .select(selector)
    .append("svg")
    .attr(dim_1, width_dot + margin_dot.left + margin_dot.right)
    .attr(dim_2, height_dot + margin_dot.top + margin_dot.bottom)
    .append("g")
    .attr(
	  "transform",
      "translate(" + margin_dot.left + "," + margin_dot.top + ")"
	  );

    var dim_type = "material";
    var axis_value = "object";
    var default_dim_value = "silver";

    drawChart(all_data, "fraction", dim_type, default_dim_value, axis_value); //current_object, current_material);

    ////BUTTON SECTION

    button_location = { left: params.button_x, top: params.button_y };
    var button_selector = selector.slice(1, selector.length);

  var button_div = d3
    .select(selector)
    .append("div")
    .attr("class", "chart_transition")
    .style("opacity", 1)
    .style("position", "relative");

  button_div
    .html(
      "<div id='buttons" +
        button_selector +
        "' style=';position: absolute; text-align: center;  padding: 0px;  border: 0px;'>" +
        "<button style='  border: none; background: #9DA8FB;' id='percent'>" +
        "%" +
        "</button>" +
        "<button style='  border: none;background: #BDBDBD;' id='count'>" +
        "#" +
        "</button>" +
        " </div>"
	  )
    .style("left", button_location.left) //(d3.event.pageX - 60) + "px")
    .style("top", button_location.top) //(d3.event.pageY - 28) + "px")
    .style("fill", "white");

    d3.select("#percent")
    .style("background-color", "#9DA8FB")
    .on("click", function(d, i) {
	    d3.select("#count").style("background-color", "#BDBDBD");
	    d3.select(this).style("background-color", "#9DA8FB");
	    drawChart(
		      all_data,
		      "fraction",
		      dim_type,
		      default_dim_value,
		      dim_types[!d3.select("#dim_dd").selectedIndex ? 1 : 0]
		      );
	});

    d3.select("#count")
    .style("background-color", "#BDBDBD")
    .on("click", function(d, i) {
	    d3.select("#percent").style("background-color", "#BDBDBD");
	    d3.select(this).style("background-color", "#9DA8FB");
	    drawChart(
		      all_data,
		      "count",
		      dim_type,
		      default_dim_value,
		      dim_types[!d3.select("#dim_dd").selectedIndex ? 1 : 0]
		      );
	});

    ///// select material or object subgroup
    //function dimTypeSelect(){}
    dim_val_dd_location = {
	left: params.button_x - 180,
	top: params.button_y - 8
    };
    dim_dd_location = { left: params.button_x - 450, top: params.button_y - 8 };

    var dim_val_dd_selector = selector.slice(1, selector.length);

  var dim_val_dd_div = d3
    .select(selector)
    .append("span")
    .attr("class", "dim_val_dd")
    .style("opacity", 1)
    .style("position", "relative")
    .style("left", dim_val_dd_location.left) //(d3.event.pageX - 60) + "px")
    .style("top", dim_val_dd_location.top) //(d3.event.pageY - 28) + "px")
    .style("background-color", "transparent")
    .style("text-decoration", "underline")
    .style("color", "blue");
    dim_val_dd_div.html("<span class='custom-select' id='dim_val_dd'></span>");

    setValdd(dim_type);

    function setValdd(dim_type) {
	d3.select("#dim_val_dd").remove();

	dim_val_dd_div.html("<span id='dim_val_dd'></span>");

	var unique = [];
	var distinct = [];
	for (let i = 0; i < all_data["data"].length; i++) {
	    if (!unique[all_data["data"][i][dim_type]]) {
		distinct.push(all_data["data"][i][dim_type]);
		unique[all_data["data"][i][dim_type]] = 1;
	    }
	}
	//dim_val_types = ["charms", "bracelet"];
	//dim_val_sel = ["charms", "bracelet"];
	dim_val_types = distinct;
	dim_val_sel = distinct;

    var select = d3
        .select("#dim_val_dd")
        .append("select")
        .on("change", function(d) {
		default_dim_value = dim_val_sel[this.selectedIndex];

		d3.select("#count").style("background-color", "#BDBDBD");
		d3.select("#percent").style("background-color", "#9DA8FB");

		drawChart(
			  all_data,
			  "fraction",
			  dim_type,
			  default_dim_value,
            axis_value
			  );
	    }),
	options = select.selectAll("option").data(dim_val_types); // Data join

    // Enter selection
    options
	.enter()
	.append("option")
	.text(function(d, i) {
		return dim_val_sel[i];
	    });
    }

    ///// SLICE ON (MATERIAL OR OBJECT) DROPDOWN SECTION

    var dim_dd_selector = selector.slice(1, selector.length);

  var dim_dd_div = d3
    .select(selector)
    .append("span")
    .attr("class", "dim_dd")
    .style("opacity", 1)
    .style("position", "relative")
    .style("left", dim_dd_location.left) //(d3.event.pageX - 60) + "px")
    .style("top", dim_dd_location.top) //(d3.event.pageY - 28) + "px")
    .style("fill", "white")
    .attr("font-family", "proxima-nova, sans-serif")
    .style("color", "blue")
    .attr("font-style", "normal")
    .attr("font-weight", "normal")
    .attr("font-size", params.font_size + "px")
    .attr("line-height", "20px")
    .attr("letter-spacing", "0.3px")
    //.attr("fill", params.font_color)
    .style("text-decoration", "underline");
    dim_dd_div.html("<span class='select' id='dim_dd'></span>");

    var dim_types = ["material", "object"];
    var dim_sel = ["Material", "Jewelry type"];

  var select = d3
    .select("#dim_dd")
    .append("select")
    .on("change", function(d) {
	    dim_type = dim_types[this.selectedIndex];
	    if (dim_type == "material") {
		default_dim_value = "silver";
	    } else {
		default_dim_value = "ring";
	    }
	    //axis_value = dim_types[!(this.selectedIndex) ? 1 : 0]
	    setValdd(dim_type);

	    d3.select("#count").style("background-color", "#BDBDBD");
	    d3.select("#percent").style("background-color", "#9DA8FB");

	    drawChart(
		      all_data,
		      "fraction",
		      dim_type,
		      default_dim_value,
          axis_value
		      );
	}),
    options = select.selectAll("option").data(dim_types); // Data join

    // Enter selection
  options
    .enter()
    .append("option")
    .text(function(d, i) {
	    return dim_sel[i];
	});


    //onsole.log(data);
    /////////////////////////DOTS
    //dot_data.sort(function(a, b) {
    //return d3.descending(+a.year2015, +b.year2015);
    //    });

    function drawChart(all_data, display_type, dim_type, dim_value, axis_value) {
	function processData(data, dim_type, dim_value) {
	    new_data = [];
	    for (var i = 0; i < data.length; i++) {
		if (data[i][dim_type] == dim_value) {
		    new_data.push(data[i]);
		}
	    }
	    return new_data;
	}

	axis_value = dim_type === "object" ? "material" : "object";

	svg_dot.selectAll("*").remove();
	var data = processData(all_data["data"], dim_type, dim_value);
	var chart_params = all_data["data_params"];
	var classes = chart_params["classes"];

	var chart_value = display_type;


	pandora_score_of_question = {};
	mean_question = {};

	if (params.sort_by === "brand") {
	    data = data.sort(function(x, y) {
		    return (
          pandora_score_of_question[y[axis_value]] -
          pandora_score_of_question[x[axis_value]]
			    ); //d3.descending(+x.score, +y.score);
		});
	} else {
	    data = data.sort(function(x, y) {
		    var n_1 = mean_question[y[axis_value]].length;
		    var mean_1 = mean_question[y[axis_value]].reduce((a, b) => a + b) / n_1;
		    var s_1 = Math.sqrt(
          mean_question[y[axis_value]]
	  .map(x => Math.pow(x - mean_1, 2))
	  .reduce((a, b) => a + b) / n_1
					);

		    var n_2 = mean_question[x[axis_value]].length;
		    var mean_2 = mean_question[x[axis_value]].reduce((a, b) => a + b) / n_2;
		    var s_2 = Math.sqrt(
          mean_question[x[axis_value]]
	  .map(x => Math.pow(x - mean_2, 2))
	  .reduce((a, b) => a + b) / n_2
					);

		    return (
			    (pandora_score_of_question[y[axis_value]] - mean_1) / s_1 -
			    (pandora_score_of_question[x[axis_value]] - mean_2) / s_2
			    ); //d3.descending(+x.score, +y.score);
		});
	}

	widthScale_dot.domain([
			       d3.min(data, function(d) {
				       return d[chart_value];
				   }),
			       d3.max(data, function(d) {
				       return d[chart_value];
				   }) * 1.05
			       ]);

	// js map: will make a new array out of all the d.name fields
    heightScale_dot
	.domain(
		data.map(function(d) {
			return d[axis_value];
		    })
		)
	.rangeRound([0, height_dot]); //width - margin.right])

    yAxis_dot
	.domain(
		data.map(function(d) {
			return d[axis_value];
		    })
		)
	.rangeRound([0, height_dot]); //width - margin.right])

    //var brands = ["Zales", "Kay", "Pandora", "Tiffany & Co.", "Jared"]; //target', 'walmart', 'ebay', 'zulily', 'amazon', 'macys'];

    var colors = params.color_list;
    var brand_color = {};
    for (var i = 0; i < classes.length; i++) {
	brand_color[classes[i]] = colors[i];
    }

    // Make the faint lines from y labels to highest dot

    var linesGrid = svg_dot
	.append("g")
	.selectAll("g") //svg_dot.selectAll("lines.grid")
	.data(data)
	.enter()
	.append("line");

    linesGrid
	.attr("class", "grid")
	.attr(c_1_1, margin_dot.left)
	.attr(c_2_1, function(d) {
		//console.log(d.question, heightScale_dot(d.question), console.log(heightScale_dot.bandwidth()));
		return heightScale_dot(d[axis_value]); // + heightScale_dot.bandwidth();//rangeBand()/2;
	    })
	.attr(c_1_2, function(d) {
		return widthScale_dot(+d[chart_value]);
	    })
	.attr(c_2_2, function(d) {
		return heightScale_dot(d[axis_value]); // + heightScale_dot.bandwidth();//rangeBand()/2;
	    });

    //linesGrid.exit().remove();

    var dots_customer = svg_dot
	.append("g")
	.selectAll("g") //.selectAll("circle.y2015")
	.data(data)
	.enter()
	.append("circle");

    dots_customer
	.attr("class", "dots")
	.attr(c_point_1, function(d) {
		return widthScale_dot(+d[chart_value]);
	    })
	.attr("r", function(d) {
		if (d.company === "pandora") {
		    return 9;
		} else {
		    return 7;
		}
	    }) //heightScale_dot.bandwidth()/5)//rangeBand()/5)
	.attr(c_point_2, function(d) {
		return heightScale_dot(d[axis_value]); // + heightScale_dot.bandwidth()/2;//rangeBand()/2;
	    })
	.style("fill", function(d) {
		return brand_color[d.company];
	    })
	.on("mouseover", function(d) {
		d3.selectAll(".dots").style("opacity", function(d2, i) {
			//console.log(d.name, d2.name);
			if (d.company == d2.company) {
			    return 1;
			} else {
			    return 0.2;
			}
		    });
	    })
	.on("mouseout", function(d) {
		d3.selectAll(".dots").style("opacity", 1);
	    })
	.append("title")
	.text(function(d) {
		if (display_type == "fraction") {
		    return (
            d["material"] +
            " " +
            d["object"] +
            "s" +
            " (" +
            d.company +
            "): " +
            d[chart_value].toFixed(1) +
            "% of all items"
			    );
		} else if (params.y_type == "money") {
		    return (
			    d[axis_value] + " (persona only): $" + Math.round(d[chart_value], 2)
			    );
		} else {
		    return (
            d["material"] +
            " " +
            d["object"] +
            "s" +
            " (" +
            d.company +
            "): " +
            d[chart_value].toFixed(0) +
            " items"
			    );
		}
	    });

    dots_customer.exit().remove();

    // add the axes

    if (params.xy_orientation == "vertical") {
      svg_dot
	  .append("g")
	  .attr("class", "x axis dot")
	  .attr("transform", "translate(" + margin_dot.left + ",0)")

	  .attr("opacity", "0")
	  .call(xAxis_dot);

      svg_dot
	  .append("g")
	  .attr(
		"transform",
          "translate(" + margin_dot.left + "," + height_dot + ")"
		)

	  .attr("class", "yaxisdot")
	  .call(d3.axisBottom(yAxis_dot));
    } else {
      xaxis = svg_dot
	  .append("g")
	  .attr("transform", "translate(0," + height_dot + ")")
	  .call(d3.axisBottom(widthScale_dot).tickFormat(d => (chart_value == "fraction") ? (d + "%") : d));

      xaxis.selectAll(".tick text").call(wrap, 30);

      // Add the Y Axis
      yaxis = svg_dot
	  .append("g")
	  .call(d3.axisLeft(yAxis_dot).tickSize(-width_dot));
      yaxis.selectAll("text").attr("dx", "-0.5em");

      //y grid line
      yaxis
	  .selectAll("line")
	  .attr("stroke-dasharray", "4 6")
	  .attr("stroke-width", params.grid_width)
	  .attr("stroke", params.grid_color)
	  .attr("z-index", "-10000");

      if (params.hide_y_axis == 1) {
	  yaxis.call(g => g.select(".domain").remove());
      }
      if (params.hide_x_axis == 1) {
	  xaxis.call(g => g.select(".domain").remove());
      }
    }
    xaxis.exit().remove();
    yaxis.exit().remove();
    //svg_dot.exit().remove();

    //////Title
    title = svg_dot
	.append("text")
	.attr("x", params.title_x)
	.attr("y", params.title_y)
	.attr("dy", "0.36em")
	.style("text-anchor", "left")
	.text(chart_params["title"]);

    //text styling
    svg_dot
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

    var legend = svg_dot.append("g").attr("class", "legend");
    current_x = params.legend_x_anchor + params.point_size;
    //for (var i = 0; i < classes.length; i++) {
    //brand_color[classes[i]] = colors[i];
    //current_x;
    legend
	.append("g")
	.selectAll("g") //svg_dot.selectAll("lines.grid")
	.data(classes)
	.enter()
	.append("circle")
	.attr("class", "dots")
	.attr("cx", function(d, i) {
		return i * 100;
	    }) //current_x)
	.attr("cy", params.legend_y_anchor + 20)
	.attr("fill", function(d, i) {
		return brand_color[d];
	    })
	.attr("r", params.point_size)
	.on("mouseover", function(d, i) {
		d3.selectAll(".dots").style("opacity", function(d2, i) {
			if ((d == d2.company) | (d == d2)) {
			    return 1;
			} else {
			    return 0.2;
			}
		    });
	    })
	.on("mouseout", function(d) {
		d3.selectAll(".dots").style("opacity", 1);
	    });

    legend
	.append("g")
	.selectAll("g") //svg_dot.selectAll("lines.grid")
	.data(classes)
	.enter()

	.append("text")
	.attr("fill", "#000")
	.attr("x", function(d, i) {
		return i * 100 + 7;
	    })
	.attr("y", params.legend_y_anchor + 20)
	.attr("dy", "0.32em")
	.style("text-anchor", "left")
	.text(function(d) {
		return d;
	    });

    //}
    }

    /*
    svg_dot
      .append("g")
      .attr("class", "x axis dot")
      .attr(
        "transform",
        "translate(" + margin_dot.left + "," + height_dot + ")"
      )
      .attr("opacity", "0")
      .call(xAxis_dot);

    svg_dot
      .append("g")
      .attr("class", "yaxisdot")
      .attr("transform", "translate(" + margin_dot.left + ",0)")
      .call(d3.axisLeft(yAxis_dot));
    */

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
