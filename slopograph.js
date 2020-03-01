var slopograph = function slopo(raw_data, selector, params) {
    //chart size definition
    var margin = { top: 10, right: 100, bottom: 30, left: 100 };

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
    WIDTH = width;
    HEIGHT = height;

    LEFT_MARGIN = margin.left;
    RIGHT_MARGIN = margin.right;
    TOP_MARGIN = margin.top;
    BOTTOM_MARGIN = margin.bottom;

    ELIGIBLE_SIZE = HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

    function _to_data(y1, y2, d) {
	var y1d = d[y1];
	var y2d = d[y2];
	var _d = {};
	for (var k1 in y1d) {
	    _d[k1] = {};
	    _d[k1]["left"] = y1d[k1];
	    _d[k1]["right"] = 0;
	    _d[k1]["label"] = k1;
	}
	for (var k2 in y2d) {
	    if (!_d.hasOwnProperty(k2)) {
		_d[k2] = {};
		_d[k2].left = 0;
		_d[k2]["label"] = k2;
	    }
	    _d[k2].right = y2d[k2];
	    if (_d[k2].right === NaN) {
		_d[k2].right = 0;
	    }
	}
	Y1 = y1;
	Y2 = y2;
	d = [];
	var di;
	for (var k in _d) {
	    di = _d[k];
	    d.push(di);
	}
	return d;
    }

    function _max_key(v) {
	var vi, max_side;
	var _m = undefined;
	for (var i = 0; i < v.length; i += 1) {
	    vi = v[i];
	    max_side = Math.max(vi.left, vi.right);
	    if (_m == undefined || max_side > _m) {
		_m = max_side;
	    }
	}
	return _m;
    }

    function _min_key(v) {
	var vi, min_side;
	var _m = undefined;
	for (var i = 0; i < v.length; i += 1) {
	    vi = v[i];
	    min_side = Math.min(vi.left, vi.right);
	    if (_m == undefined || min_side < _m) {
		_m = min_side;
	    }
	}
	return _m;
    }

    function _min_max(v) {
	var vi, min_side, max_side;
	var _max = undefined;
	var _min = undefined;

	for (var i = 0; i < v.length; i += 1) {
	    vi = v[i];
	    min_side = Math.min(vi.left_coord, vi.right_coord);
	    max_side = Math.max(vi.left_coord, vi.right_coord);

	    if (_min == undefined || min_side < _min) {
		_min = min_side;
	    }
	    if (_max == undefined || max_side > _max) {
		_max = max_side;
	    }
	}
	return [_min, _max];
    }

    //

    function _slopegraph_preprocess(d) {
	// computes y coords for each data point
	// create two separate object arrays for each side, then order them together, and THEN run the shifting alg.

	var offset;

	var font_size = 15;
	var l = d.length;

	var max = _max_key(d);
	var min = _min_key(d);
	var range = max - min;

	//
	var left = [];
	var right = [];
	var di;
	for (var i = 0; i < d.length; i += 1) {
	    di = d[i];
	    left.push({
		    label: di.label,
			value: di.left,
			side: "left",
			coord: di.left_coord
			});
	    right.push({
		    label: di.label,
			value: di.right,
			side: "right",
			coord: di.right_coord
			});
	}

	var both = left.concat(right);
    both
	.sort(function(a, b) {
		if (a.value > b.value) {
		    return 1;
		} else if (a.value < b.value) {
		    return -1;
		} else {
		    if (a.label > b.label) {
			return 1;
		    } else if (a.lable < b.label) {
			return -1;
		    } else {
			return 0;
		    }
		}
	    })
	.reverse();
	var new_data = {};
	var side, label, val, coord;
	for (var i = 0; i < both.length; i += 1) {
	    label = both[i].label;
	    side = both[i].side;
	    val = both[i].value;
	    coord = both[i].coord;

	    if (!new_data.hasOwnProperty(both[i].label)) {
		new_data[label] = {};
	    }
	    new_data[label][side] = val;

	    if (i > 0) {
		if (
          coord - font_size < both[i - 1].coord ||
          !(val === both[i - 1].value && side != both[i - 1].side)
		    ) {
		    new_data[label][side + "_coord"] = coord + font_size;

		    for (j = i; j < both.length; j += 1) {
			both[j].coord = both[j].coord + font_size;
		    }
		} else {
		    new_data[label][side + "_coord"] = coord;
		}

		if (val === both[i - 1].value && side !== both[i - 1].side) {
		    new_data[label][side + "_coord"] = both[i - 1].coord;
		}
	    } else {
		new_data[label][side + "_coord"] = coord;
	    }
	}
	d = [];

	for (var label in new_data) {
	    val = new_data[label];
	    val.label = label;
	    d.push(val);
	}

	filter_data = [];
	for (var point in d) {
	    console.log(point);
	    if ((d[point].left > 0.15) | (d[point].right > 0.15)) {
		filter_data.push(d[point]);
	    }
	}

	return filter_data;
    }

    //d3.json("slopo_pandora.json", function(error, all_data) {

    var all_data = raw_data["data"];
    var left_column = raw_data["data_params"]["left"];
    var right_column = raw_data["data_params"]["right"];
    var left_name = raw_data["data_params"]["left_name"];
    var right_name = raw_data["data_params"]["right_name"];

    //console.log(all_data, error);
    var data = _to_data(left_column, right_column, all_data);

    data = _slopegraph_preprocess(data);

  var _y = d3
    .scaleLinear()
    .domain([_min_key(data), _max_key(data)])
    .range([TOP_MARGIN, HEIGHT - BOTTOM_MARGIN]);

    function y(d, i) {
	return HEIGHT - _y(d);
    }

    //
    seen_left = {};
    seen_right = {};
    for (var i = 0; i < data.length; i += 1) {
	data[i].left_coord = y(data[i].left);

	if (typeof seen_left[data[i].left] !== "undefined") {
	    data[i].left_offset = seen_left[data[i].left] * 50;
	} else {
	    seen_left[data[i].left] = 0;
	    data[i].left_offset = 0;
	}
	seen_left[data[i].left] = seen_left[data[i].left] + 1;

	data[i].right_coord = y(data[i].right);

	if (typeof seen_right[data[i].right] !== "undefined") {
	    data[i].right_offset = seen_right[data[i].right] * 50;
	} else {
	    seen_right[data[i].right] = 0;
	    data[i].right_offset = 0;
	}
	seen_right[data[i].right] = seen_right[data[i].right] + 1;
    }

    //console.log(data);
    var min, max;
    var _ = _min_max(data);
    min = _[0];
    max = _[1];

    //HEIGHT = max + TOP_MARGIN + BOTTOM_MARGIN

    d3.selectAll(selector + " > *").remove();

  var svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var selector_class = selector.slice(1, selector.length);

  _y = d3
    .scaleLinear()
    .domain([max, min])
    .range([TOP_MARGIN, HEIGHT - BOTTOM_MARGIN]);

    function y(d, i) {
	return HEIGHT - _y(d);
    }

  svg
    .selectAll(".left_labels")
    .data(data)
    .enter()
    .append("svg:text")
    .attr("class", "left_labels")
    .attr("x", function(d, i) {
	    return LEFT_MARGIN - 35 - d.left_offset;
	}) //LEFT_MARGIN-35)
    .attr("y", function(d, i) {
	    return y(d.left_coord);
	})
    .attr("dy", ".35em")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .text(function(d, i) {
	    return d.label;
	})
    .attr("fill", "black")
    .on("mouseover", function(d, i) {
	    d3.select(this).attr("font-weight", "bold");
      svg
	    .selectAll(".right_labels")
	    .attr("font-weight", function(d2, i2) {
		    return d2.label == d.label ? "bold" : "normal";
		})
	    .attr("opacity", function(d2, i2) {
		    return d2.label == d.label ? "1" : "0.3";
		});
      svg
	    .selectAll(".left_labels")
	    .attr("font-weight", function(d2, i2) {
		    return d2.label == d.label ? "bold" : "normal";
		})
	    .attr("opacity", function(d2, i2) {
		    return d2.label == d.label ? "1" : "0.3";
		});

      svg
	    .selectAll(".left_values")
	    .attr("font-weight", function(d2, i2) {
		    return d2.label == d.label ? "bold" : "normal";
		})
	    .attr("opacity", function(d2, i2) {
		    return d2.label == d.label ? "1" : "0.3";
		});
      svg
	    .selectAll(".right_values")
	    .attr("font-weight", function(d2, i2) {
		    return d2.label == d.label ? "bold" : "normal";
		})
	    .attr("opacity", function(d2, i2) {
		    return d2.label == d.label ? "1" : "0.3";
		});
      svg
	    .selectAll(".slopes")
	    .attr("stroke-width", function(d2, i2) {
		    return d2.label == d.label ? "4" : "1";
		})
	    .attr("opacity", function(d2, i2) {
		    return d2.label == d.label ? "1" : "0.3";
		});
	})
    .on("mouseout", function(d, i) {
	    d3.select(this).attr("font-weight", "normal");
      svg
	    .selectAll(".left_labels")
	    .attr("font-weight", "normal")
	    .attr("opacity", 1);
      svg
	    .selectAll(".right_labels")
	    .attr("font-weight", "normal")
	    .attr("opacity", 1);
      svg
	    .selectAll(".left_values")
	    .attr("font-weight", "normal")
	    .attr("opacity", 1);
      svg
	    .selectAll(".right_values")
	    .attr("font-weight", "normal")
	    .attr("opacity", 1);
      svg
	    .selectAll(".slopes")
	    .attr("stroke-width", 1)
	    .attr("opacity", 1);
	});

  svg
    .selectAll(".left_values")
    .data(data)
    .enter()
    .append("svg:text")
    .attr("class", "left_values")
    .attr("x", LEFT_MARGIN - 10)
    .attr("y", function(d, i) {
	    return y(d.left_coord);
	})
    .attr("dy", ".35em")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .text(function(d, i) {
	    return (d.left * 100).toFixed(0) + '%';
	})
    .attr("fill", "black");

  svg
    .selectAll(".right_labels")
    .data(data)
    .enter()
    .append("svg:text")
    .attr("class", "right_labels")
    .attr("x", function(d, i) {
	    return WIDTH - RIGHT_MARGIN + d.right_offset;
	}) //LEFT_MARGIN-35)WIDTH-RIGHT_MARGIN)
    .attr("y", function(d, i) {
	    return y(d.right_coord);
	})
    .attr("dy", ".35em")
    .attr("dx", 35)
    .attr("font-size", 10)
    .text(function(d, i) {
	    return d.label;
	})
    .attr("fill", "black")
    .on("mouseover", function(d, i) {
	    console.log(d);
	    d3.select(this).attr("font-weight", "bold");
          svg
	      .selectAll(".right_labels")
	      .attr("font-weight", function(d2, i2) {
		      return d2.label == d.label ? "bold" : "normal";
		  })
	      .attr("opacity", function(d2, i2) {
		      return d2.label == d.label ? "1" : "0.3";
		  });

      svg
	  .selectAll(".left_labels")
	  .attr("font-weight", function(d2, i2) {
		  return d2.label == d.label ? "bold" : "normal";
	      })
	  .attr("opacity", function(d2, i2) {
		  return d2.label == d.label ? "1" : "0.3";
	      });
      svg
	  .selectAll(".left_values")
	  .attr("font-weight", function(d2, i2) {
		  return d2.label == d.label ? "bold" : "normal";
	      })
	  .attr("opacity", function(d2, i2) {
		  return d2.label == d.label ? "1" : "0.3";
	      });
      svg
	  .selectAll(".right_values")
	  .attr("font-weight", function(d2, i2) {
		  return d2.label == d.label ? "bold" : "normal";
	      })
	  .attr("opacity", function(d2, i2) {
		  return d2.label == d.label ? "1" : "0.3";
	      });
      svg
	  .selectAll(".slopes")
	  .attr("stroke-width", function(d2, i2) {
		  return d2.label == d.label ? "4" : "1";
	      })
	  .attr("opacity", function(d2, i2) {
		  return d2.label == d.label ? "1" : "0.3";
	      });
	})
    .on("mouseout", function(d, i) {
	    d3.select(this)
		.attr("font-weight", "normal")
		.attr("opacity", 1);
      svg
	  .selectAll(".left_labels")
	  .attr("font-weight", "normal")
	  .attr("opacity", 1);
      svg
	  .selectAll(".right_labels")
	  .attr("font-weight", "normal")
	  .attr("opacity", 1);
      svg
	  .selectAll(".left_values")
	  .attr("font-weight", "normal")
	  .attr("opacity", 1);
      svg
	  .selectAll(".right_values")
	  .attr("font-weight", "normal")
	  .attr("opacity", 1);
      svg
	  .selectAll(".slopes")
	  .attr("stroke-width", 1)
	  .attr("opacity", 1);
	});
    //
  svg
    .selectAll(".right_values")
    .data(data)
    .enter()
    .append("svg:text")
    .attr("class", "right_values")
    .attr("x", WIDTH - RIGHT_MARGIN)
    .attr("y", function(d, i) {
	    return y(d.right_coord);
	})
    .attr("dy", ".35em")
    .attr("dx", 10)
    .attr("font-size", 10)
    .text(function(d, i) {
	    return (d.right * 100).toFixed(0) + '%';
	})
    .attr("fill", "black");

  svg
    .append("svg:text")
    .attr("x", LEFT_MARGIN-30)
    .attr("y", TOP_MARGIN / 2)
    .attr("text-anchor", "end")
    .attr("opacity", 0.5)
    .text(left_name);

    //
  svg
    .append("svg:text")
    .attr("x", WIDTH - RIGHT_MARGIN+30)
    .attr("y", TOP_MARGIN / 2)
    .attr("opacity", 0.5)
    .text(right_name);

  svg
    .append("svg:line")
    .attr("x1", LEFT_MARGIN / 2)
    .attr("x2", WIDTH - RIGHT_MARGIN / 2)
    .attr("y1", (TOP_MARGIN * 2) / 3)
    .attr("y2", (TOP_MARGIN * 2) / 3)
    .attr("stroke", "black")
    .attr("opacity", 0.5);

  svg
    .append("svg:text")
    .attr("x", WIDTH / 2)
    .attr("y", TOP_MARGIN / 2)
    .attr("text-anchor", "middle")
    .text("% of images that contain")
    .attr("font-variant", "small-caps");

  svg
    .selectAll(".slopes")
    .data(data)
    .enter()
    .append("svg:line")
    .attr("class", "slopes")
    .attr("x1", LEFT_MARGIN)
    .attr("x2", WIDTH - RIGHT_MARGIN)
    .attr("y1", function(d, i) {
	    return y(d.left_coord);
	})
    .attr("y2", function(d, i) {
	    return y(d.right_coord);
	})
    .attr("opacity", 0.6)
    .attr("stroke", "black");
};
