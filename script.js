d3.csv("./data/HappinessReport.csv").then(function(data) {

    /* DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 150, right: 50, bottom: 150};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    /* FILTER THE DATA */
    const filtered_data = data.filter(function(d) {
        return d.year == 2015;
    });

    /* DETERMINE MIN AND MAX VALUES OF VARIABLES */
    const freedom = {
        min: d3.min(filtered_data, function(d) { return +d.freedom; }),
        max: d3.max(filtered_data, function(d) { return +d.freedom; })
    };

    const trust = {
        min: d3.min(filtered_data, function(d) { return +d.trust; }),
        max: d3.max(filtered_data, function(d) { return +d.trust })
    };

    const score = {
        min: d3.min(filtered_data, function(d) { return +d.score; }),
        max: d3.max(filtered_data, function(d) { return +d.score; })
    }

    /* CREATE SCALES */
    const xScale = d3.scaleLinear()
        .domain([trust.min, trust.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([freedom.min, freedom.max])
        .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
        .domain([score.min, score.max])
        .range([3, 20]);

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    /* DRAW AXES */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    /* DRAW POINTS */
    const points = svg.selectAll("circle")
        .data(filtered_data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.trust); })
            .attr("cy", function(d) { return yScale(d.freedom); })
            .attr("r", function(d) { return rScale(d.score); })
            .attr("fill", function(d) { return colorScale(d.region); })
            .attr("opacity", 0.8)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
            
    
    /* DRAW AXIS LABELS */
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", margin.left + (width - margin.left - margin.right)/2)
        .attr("y", height-margin.bottom/2)
        .attr("text-anchor", "middle")
        .text("Trust in Their Government");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x", -(margin.top + (height - margin.top - margin.bottom)/2))
        .attr("y", margin.left/2)
        .attr("text-anchor", "middle")
        .text("Freedom to Make Life Choices");

    /* TOOLTIP */

    const tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");
    
    points.on("mouseover", function(e, d) {

        let cx = +d3.select(this).attr("cx");
        let cy = +d3.select(this).attr("cy");

        tooltip.style("visibility", "visible")
            .style("left", `${cx}px`)
            .style("top", `${cy}px`)
            .html(`<b>Country:</b> ${d.country}<br><b>Happiness Score:</b> ${d.score}<br><b>Freedom to Make Life Choices:</b> ${d.freedom}<br><b>Trust in Their Government:</b> ${d.trust}`);

        d3.select(this)
            .attr("stroke", "#F6C900")
            .attr("stroke-width", 5);

        }).on("mouseout", function() {

        tooltip.style("visibility", "hidden");
        
        d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        });

    /* FILTER BY CHECKBOX */

    d3.selectAll(".type--option").on("click", function() {

    let region = d3.select(this).property("value");
    
    let selection = points.filter(function(d) {
        return d.region === region;
    });

    let isChecked = d3.select(this).property("checked");

    if (isChecked == true) {
        selection.attr("opacity",1);
    } else {
        selection.attr("opacity",0);
    }

    });


});
