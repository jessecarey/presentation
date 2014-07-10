var color = d3.scale.category20c();
var x = d3.scale.linear().domain([0,9]).range([0,760]);
var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

function initialize() {
	
	
	var svg = d3.select("#graphone").select(".graph").append("svg").attr("height", 350);
	d3.select("#graphtwo").select(".graph").append("svg").attr("height", 350);
	d3.select("#graphthree").select(".graph").append("svg").attr("height", 350);
	d3.select("#graphfour").select(".graph").append("svg").attr("height", 350);
	
	
	var g = svg.append("g");
	g.append("rect").attr("x", 650).attr("y", 30)
	.attr("height", 20).attr("width", 20).style("fill", color(0))
	.on("mouseover", function(){
		d3.selectAll(".open").style("opacity", 1)
	}).on("mouseout", function(){
		d3.selectAll(".open").style("opacity", .8)
	});
	g.append("text").attr("x", 700).attr("y", 42)
	.text("Open");
	g.append("rect").attr("x", 650).attr("y", 60)
	.attr("height", 20).attr("width", 20).style("fill", "orange")
	.on("mouseover", function(){
		d3.selectAll(".pd").style("opacity", 1)
	}).on("mouseout", function(){
		d3.selectAll(".pd").style("opacity", .8)
	});
	
	g.append("text").attr("x", 700).attr("y", 75)
	.text("Past Due");
	generateGraphOne();
	generateGraphTwo(0);
	generateGraphThree();
	generateGraphFour(1);

}

function generateGraphOne() {
	var xOrdinal = d3.scale.ordinal().domain(
			[ "one", "two", "three", "four", "five", "six", "seven", "eight",
					"nine", "ten" ]).range(0, 10).rangePoints([ 0, 760 ]);
	var y = d3.scale.linear().domain([0, 220]).range([320,25]);
	console.log(y(100));
	var xAxis = d3.svg.axis().scale(xOrdinal).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).ticks(5).orient("left");
	svg = d3.select("#graphone").select("svg");
	svg.append("g").attr("transform", "translate(25,330)").attr("class",
			"x axis").call(xAxis);
	svg.append("g").attr("transform", "translate(-15,0)")
	.attr("class", "y axis").call(yAxis);
	layerOne = svg.append("g");
	layerTwo = svg.append("g");
	layerOne.selectAll("rect").data(tasksByType).enter().append("rect")
	.attr("class", "open")
	.style(
			"fill", function() {
				return color(0);
			}).attr("width", 40).attr("height", function(d) {
		return d.open;
	}).attr("x", function(d, i) {
		return x(i);
	}).attr("y", function(d) {
		return 330 - d.open;
	}).on("mouseover", function(d, i) {
		d3.select(this).style("opacity", 1);
		div.transition().duration(200)
		.style("opacity", .9);
		div.html(d.open);
	}).on("mouseout", function() {
		d3.select(this).style("opacity", .8);
	}).on("click", function(d, i) {
		generateGraphTwo(i);
		updateTitle(1, i + 1);
	}).append("title").text(function(d){
		return "Open: " + d.open;
		
	})

	;

	layerTwo.selectAll("rect").data(tasksByType).enter().append("rect")
	.attr("class", "pd")
	.style(
			"fill", "orange").attr("width", 40).attr("height", function(d) {
		return d.pd;
	}).attr("x", function(d, i) {
		return x(i);
	}).attr("y", function(d) {
		return 330 - d.pd;
	}).on("mouseover", function() {
		d3.select(this).style("opacity", 1);
	}).on("mouseout", function() {
		d3.select(this).style("opacity", .8);
	}).on("click", function(d, i) {
		generateGraphTwo(i);
		updateTitle(1, i + 1);

	}).append("title").text(function(d){
		return "Past Due: " + d.pd;
	});
}

function generateGraphTwo(pos) {
	d3.select("#graphtwo").select("svg").selectAll("*").remove();
	var data = tasksByType[pos];
	var pieData = [ {
		"label" : "open",
		"value" : data.open - (data.pd + data.app)
	}, {
		"label" : "pd",
		"value" : data.pd
	}, {
		"label" : "appr",
		"value" : data.app
	} ];
	var vis = d3.select("#graphtwo").select("svg").data([ pieData ])
			.append("g").attr("transform", "translate(400, 190)");
	var arc = d3.svg.arc().outerRadius(150);
	var pie = d3.layout.pie().value(function(d) {
		return d.value;
	});
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr(
			"class", "slice");
	arcs.append("svg:path").attr("fill", function(d, i) {
		return color(i);
	}).attr("d", arc);
	arcs.append("svg:text").attr("transform", function(d) {
		d.innerRadius = 0;
		d.outerRadius = 100;
		return "translate(" + arc.centroid(d) + ")";
	}).attr("text-anchor", "middle").text(function(d, i) {
		return pieData[i].label + ": " + pieData[i].value;
	});

	d3.select("#graphtwo").select("svg").append("text").attr("x", 500).attr(
			"y", 50).text("Total Open: " + data.open)

}

function generateGraphThree() {
	/*
	 * svg = d3.select("#graphthree").select("svg"); layerOne = svg.append("g");
	 * layerTwo = svg.append("g");
	 * layerOne.selectAll("rect").data(tasksByTeam).enter().append("rect").style(
	 * "fill", "teal").attr("width", 80).attr("height", function(d) { return
	 * d.open; }).attr("x", function(d, i) { return i * 160 + 25; }).attr("y",
	 * function(d) { return 350 - d.open; }).on("click", function(d, i) {
	 * console.log("TEST"); generateGraphFour(i + 1); }).on("mouseover",
	 * function(){ d3.select(this).style("opacity", 1); }).on("mouseout",
	 * function(){ d3.select(this).style("opacity", .8); }) ;
	 * 
	 * layerTwo.selectAll("rect").data(tasksByTeam).enter().append("rect").style(
	 * "fill", "blue").attr("width", 80).attr("height", function(d) { return
	 * d.pd; }).attr("x", function(d, i) { return i * 160 + 25; }).attr("y",
	 * function(d) { return 350 - d.pd; }).on("click", function(d, i) {
	 * console.log("TEST"); generateGraphFour(i + 1); }).on("mouseover",
	 * function(){ d3.select(this).style("opacity", 1); }).on("mouseout",
	 * function(){ d3.select(this).style("opacity", .8); })
	 */
	svg = d3.select("#graphthree").select("svg");
	tasksByTeam.forEach(function(d, i) {
		svg.append("circle")
		.attr("class", "open")
		.attr("cx", function() {
			return bindX(i)
		}).attr("cy", function() {
			return bindY(i)
		}).attr("r", function() {
			return d.open / 2;
		}).style("fill", color(0)).on("click", function() {
			generateGraphFourTran(i+1);
			updateTitle(0, d.type)
		}).on("mouseover", function() {
			d3.select(this).style("opacity", 1);
		}).on("mouseout", function() {
			d3.select(this).style("opacity", .8);
		}).append("title").text(d.type + " Open: " + d.open);

		svg.append("circle")
		.attr("class", "pd")
		.attr("cx", function() {
			return bindX(i)
		}).attr("cy", function() {
			return bindY(i)
		}).attr("r", function() {
			return d.pd / 2;
		}).style("fill", "orange").on("click", function() {
			generateGraphFourTran(i+1);
			updateTitle(0, d.type)
		}).on("mouseover", function() {
			d3.select(this).style("opacity", 1);
		}).on("mouseout", function() {
			d3.select(this).style("opacity", .8);
		}).append("title").text(d.type + " Past Due " + d.pd);
	})

}

function generateGraphFour(employee) {
	d3.select("#graphfour").select("svg").selectAll("*").remove();

	var xOrdinal = d3.scale.ordinal().domain(
			[ "one", "two", "three", "four", "five", "six", "seven", "eight",
					"nine", "ten" ]).range(0, 10).rangePoints([ 0, 760 ]);
	var xAxis = d3.svg.axis().scale(xOrdinal).orient("bottom");
	svg = d3.select("#graphfour").select("svg");
	svg.append("g").attr("transform", "translate(25,330)").attr("class",
			"x axis").call(xAxis);
	
	
	var data;
	if (employee == 1)
		data = person1;
	else if (employee == 2)
		data = person2;
	else if (employee == 3)
		data = person3;
	else if (employee == 4)
		data = person4
	else if (employee == 5)
		data = person5
	console.log(employee)
	layerOne = svg.append("g").attr("id", "layerOne");
	layerTwo = svg.append("g").attr("id", "layerTwo");
	layerOne.selectAll("rect").data(data).enter().append("rect")
	.attr("class", "open")
	.style("fill",
			color(0)).attr("width", 40).attr("height", function(d) {
		return (d.open * 10);
	}).attr("x", function(d, i) {
		return x(i);
	}).attr("y", function(d) {
		return 330 - (d.open * 10);
	}).append("title").text(function(d){
		return "Open " + d.open;
	});

	layerTwo.selectAll("rect").data(data).enter().append("rect")
	.attr("class", "pd")
	.style("fill",
			"orange").attr("width", 40).attr("height", function(d) {
		return d.pd * 10;
	}).attr("x", function(d, i) {
		return x(i);
	}).attr("y", function(d) {
		return 330 - (d.pd * 10);
	}).append("title").text(function(d){
		return "Past Due " + d.pd;
	});
}

function generateGraphFourTran(employee){
	var data;
	if (employee == 1)
		data = person1;
	else if (employee == 2)
		data = person2;
	else if (employee == 3)
		data = person3;
	else if (employee == 4)
		data = person4
	else if (employee == 5)
		data = person5
	console.log(data)
	svg = d3.select("#graphfour").select("svg");
	layerOne = svg.select("#layerOne");
	layerTwo = svg.select("#layerTwo");
	layerOne.selectAll("rect").data(data).transition()
	.duration(1500).ease("bounce")
	.attr("width", 40).attr("height", function(d) {
		return d.open * 10;
	}).attr("x", function(d, i) {
		return x(i);
	}).attr("y", function(d) {
		return 330 - (d.open * 10);
	}).select("title").text(function(d){
		return "Open " + d.open;
	});

	layerTwo.selectAll("rect").data(data).transition()
	.duration(1500).ease("bounce")
	.attr("width", 40).attr("height", function(d) {
		return d.pd * 10;
	}).attr("x", function(d, i) {
		return x(i);
	}).attr("y", function(d) {
		return 330 - (d.pd * 10);
	}).select("title").text(function(d){
		return "Past Due " + d.pd;
	});
}

function updateTitle(pos, num) {
	if (pos == 1) {
		document.getElementById("tasktitle").innerHTML = "Open Tasks Type "
				+ num;
	} else {
		document.getElementById("employeetitle").innerHTML = "Open Tasks By Type For "
				+ num;
	}
}
function bindX(i) {
	if (i == 0)
		return 420;
	if (i == 1)
		return 150;
	if (i == 2)
		return 320;
	if (i == 3)
		return 650;
	if (i == 4)
		return 40
}

function bindY(i) {
	if (i == 0)
		return 250;
	if (i == 1)
		return 160;
	if (i == 2)
		return 80;
	if (i == 3)
		return 200;
	if (i == 4)
		return 78
}
