var svgWidth = 960;
var svgHeight = 660;

var chartMargin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// var chosenXAxis = "poverty";
// var chosenYAxis = "smokes";

// function xScale(povertyData, chosenXAxis) {
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
//         d3.max(povertyData, d => d[chosenXAxis]) * 1.2
//         ])
//         .range([0, chartWidth]);

//     return xLinearScale;
// }

// function yScale(smokesData, chosenYAxis) {
//     var yLinearScale = d3.scaleLinear()
//         .domain([d3.min(smokesData, d => d[chosenYAxis]) * 0.8,
//         d3.max(smokesData, d => d[chosenYAxis]) * 1.2
//         ])
//         .range([chartHeight, 0]);

//     return yLinearScale;
// }
  

d3.csv("./assets/data/data.csv", function(behaviorData) { // -0.385218228 ? What is this column in the csv?
    // if (error) return console.warn(error); This kept giving me empty warnings on the data, so I removed this.

    console.log(behaviorData);

    behaviorData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    var yScale = d3.scaleLinear()
        .domain([8, d3.max(behaviorData, data => data.smokes)])
        .range([chartHeight, 0]);

    var xScale = d3.scaleLinear()
        .domain([8, d3.max(behaviorData, data => data.poverty)])
        .range([0, chartWidth]);

    // var yLinearScale = yScale(behaviorData, chosenYAxis);
    // var xLinearScale = xScale(behaviorData, chosenXAxis);

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    chartGroup.selectAll(".point")
        .data(behaviorData)
        .enter()
        .append("circle")
        .classed("point", true)
        .attr("cx", d => xScale(d.smokes))
        .attr("cy", d => yScale(d.poverty))
        .attr("r", 7)
        .attr("stroke", "lightblue")
        .attr("fill", "lightblue");

    chartGroup.selectAll(".text_label")
        .data(behaviorData)
        .enter()
        .append("text")
        .classed("text_label", true)
        .text(d => d.abbr)
        .attr("x", d => xScale(d.smokes))
        .attr("y", d => yScale(d.poverty));

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left - 5)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("In Poverty (%)");
    
    chartGroup.append("text")
        .attr("y", chartHeight + 40)
        .attr("x", (chartWidth / 2))
        .classed("axis-text", true)
        .text("Are Smokers (%)");
});
