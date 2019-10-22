var w_width = 500;
var h_height = 200;

var barChartParams = {'width': 300,
		      'height': 200,
		      'selector': '#zulily_spend'};

//barChartWindowParams = barChart().drawWindow(barChartParams);
//
//barChartWindowParams['data_url'] =  "http://localhost:5000/zulily_spend"
//barChartWindowParams = barChart().fillChart(barChartWindowParams);

params = {
    title: "Consider x for yourself",
    bgcolor: "black",
    num_type: "percent",
    "width": 700,
    "height": 300,
    "colorscheme": ["#7F00FF", "#aaa"]
};


groupedBar(
	   "http://localhost:8000/groupedBar.json",//app.naccix.io/zulily/age?persona=" + persona,
	   "#groupedBar",
	   params
	   );

dotPlot(
	   "http://localhost:8000/dotPlot.json",//app.naccix.io/zulily/age?persona=" + persona,
	   "#dotPlot",
	   params
	   );



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

