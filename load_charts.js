var w_width = 500;
var h_height = 200;

var barChartParams = {'width': 300,
		      'height': 200,
		      'selector': '#zulily_spend'};

//barChartWindowParams = barChart().drawWindow(barChartParams);
//
//barChartWindowParams['data_url'] =  "http://localhost:5000/zulily_spend"
//barChartWindowParams = barChart().fillChart(barChartWindowParams);

bar_params = {
    title: "Consider x for yourself",
    bgcolor: "black",
    num_type: "money",
    "width": 700,
    "height": 400,
    "colorscheme": ["#7F00FF", "#aaa"],
    fill_bar: 'nofill',
    sort: 'group_value'

};

var persona = "Most Valuable Shopper";
var persona = "Carpe Diem Shopper";
//groupedBar(
//	   //"https://app.naccix.io/zulily/hour_of_day?persona=" + persona,
//	   "http://localhost:8000/groupedBar.json",
//	   "#groupedBar",
//	   bar_params
//	   );

//groupedBar(
	   //	   "http://localhost:8000/test_multi_bar.json",//app.naccix.io/zulily/age?persona=" + persona,
//	   "#groupedBar",
//	   params
//	   );

//pyramidChart("http://localhost:8000/pandora_age.json",
//	     "#agePlot", 'undefined');

//scatterPlot("http://localhost:8000/pandora_social.json",
//	    "#socialPlot", {'axes': 'show_axes'});


scatterPlot("http://localhost:8000/luminary_attitudes.json",
	    "#socialPlot", {'axes': ''});


//heatmap("http://localhost:8000/show_corr_1.json",
//	"#heatmap_1", {})
//
//heatmap("http://localhost:8000/show_corr_2.json",
//	"#heatmap_2", {})




//dotPlot(
//	   "http://localhost:8000/pandora_age.json",//app.naccix.io/zulily/age?persona=" + persona,
//	   "#dotPlot",
//	   { num_type: "percent", bgcolor: "white", "colorscheme": ["#CC3300", "#000"],  height: 400, width: 600, sort: 'none'}
//	   );




//dotPlot(
//	   "https://app.naccix.io/zulily/attitudes?persona=" + persona,
//	   "#dotPlot",
//	   { num_type: "percent", bgcolor: "black", "colorscheme": ["#7F00FF", "#aaa"],  height: 400, sort: 'outgroup_value'}
//
//	   );
////
////
//
////pieChart(
////	"http://localhost:8000/test_multi_pie.json",//app.naccix.io/zulily/age?persona=" + persona,                                                            
////	"#pie",
////           params
////	);
//params = {
//    bgcolor: 'black',
//    "width": 300,
//    "height": 300,
//    "colorscheme": ["#7F00FF", "#aaa"],
//  
//};
//
//pieChart(
//	"https://app.naccix.io/zulily/web_vs_app?persona=" + persona,                                                            
//	"#pie",
//	params
//	);


//journeyMap('https://app.naccix.io/zulily/step_journey?persona=' + persona, '#journey_map', {cutoff: 40, bubble_factor: 50, bgcolor: 'black'})
//journeyMap('http://localhost:8000/unicef_ref_time_journey.json', '#journey_map', {cutoff: 8, bubble_factor: 5, bgcolor: 'black'})

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

