var w_width = 500;
var h_height = 200;

var barChartParams = {'width': 300,
		      'height': 200,
		      'selector': '#zulily_spend'};

//barChartWindowParams = barChart().drawWindow(barChartParams);
//
//barChartWindowParams['data_url'] =  "http://localhost:5000/zulily_spend"
//barChartWindowParams = barChart().fillChart(barChartWindowParams);



pieChart("http://localhost:5000/zulily_spend", "#zulily_spend");

hGroupedBar("http://localhost:5000/attitude_by_spend", "#att_by_spend")


multiLine("http://localhost:5000/line", "#multiline")
//
////barChart("sales.csv", "#bar_chart", 500).fillChart("sales_2.csv", chartBase);
//
//
////barChart("sales_2.csv", "#bar_chart_2", 500)
//
//
//
//hGroupedBar("http://localhost:5000/grouped_bar", "#grouped_bar_2");
//
//hGroupedBar("http://localhost:5000/bar_chart", "#grouped_bar_2");
//
//
//var scatterChartParams = {'width': 300,
//			  'height': 200,
//			  'selector': '#scatter'};
//var scatterChartWindowParams = groupedScatter().drawWindow(scatterChartParams);
//scatterChartWindowParams['data_url'] = "http://localhost:5000/scatter_plot"//https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
//groupedScatter().fillChart(scatterChartWindowParams)
//
//
//multiHistogram("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_doubleHist.csv", "#hist");

