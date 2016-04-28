var fullwidth = 900;
var fullheight = 250;

var margin = {top: 20, right: 50, bottom: 20, left: 200};

var height = fullheight - margin.top - margin.bottom;
var width = fullwidth - margin.left - margin.right;

var vis = d3.select("#barchart").append("svg");
var svg = vis
    .attr("width", fullwidth)
    .attr("height", fullheight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("g")
        .attr("class", "x axis");


    var xScale = d3.scale.linear()
        .range([0, width]);

    var yScale = d3.scale.ordinal()
        .rangeRoundBands([0, height], .1);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(10)
        .innerTickSize([5])
        .outerTickSize([5]);

    var mybartooltip = d3.select("body")
        .append("div")
        .attr("class", "mybartooltip");
    var barcolorrange = d3.scale.linear()
                    .range(["rgb(241,88,36)","rgb(252,220,211)"])
                    .domain(["100","40"]);
    var explain = {
      "Age": "Age gap of University is usually bigger than high school,thus we also put this variable into our survey, which shows that people who aged twenty-five to thirty may be less stress than other younger students.",
      "Gender": "The survey result shows that there is no significant difference between female and male in terms of stress level.",
      "Grade": "Turns out that senior students are more likely to feel stressed than junior students, the inner reasons maybe graduation and other tests. The percentage is 73.7% VS 88.6%.",
      "Nation": "The result turns out that Hispanic or Latino students are stressed.",
      "Major": "Since the sample size of our survey isn't big enough, some result show on the chart, for example, School of Music, may not be accurate enough. However, you still can find out students from school of communication feel less stressed at school.",
      "Job": "People who has a job seem to be more likely to feel stressed, the reason maybe they must give their attention to both study and work at the same time.",
      "Test": "There is obvious difference between students who are preparing for a test and those who don't have to. From our survey, those tests include GRE, GMAT, MCAT, LSAT and so on.",
      "GPA": "Same as tests, students who need to maintain a certain GPA for reasons such as scholarship or financial aid are more stressed."

    };

   d3.csv("data/dataforbar.csv", function(error, data) {

    var column = d3.select("#menu select").property("value");
    var dataset = bigfirst(data, column);


    console.log(column);

    //setup our ui -- requires access to data variable, so inside csv
    d3.select("#menu select")
        .on("change", function() {
            column = d3.select("#menu select").property("value");
            dataset = bigfirst(data, column);

            d3.select("#explain p").html(explain[column]);


    });

      });

    function bigfirst(data, column){
      data.sort(function(a,b){
        return d3.descending(+a[column],+b[column]);
      })
      if (column === "Age" || column === "Job"){
        slicedata = data.slice(0,3);
      } else if (column === "Gender" || column === "Test" || column === "GPA") {
        slicedata = data.slice(0,2);
      } else if (column === "Grade") {
        slicedata = data.slice(0,6);
      } else if (column === "Nation") {
        slicedata = data.slice(0,4);
      } else if (column === "Major") {
        slicedata = data.slice(0,11);
      } else {
        slicedata = data.slice(0,10);
      }

      redraw(slicedata,column);
    }

    //get the descending values;

    function redraw(data, column) {

        var max = d3.max(data, function(d) {return +d[column];});

        xScale.domain([0, max]);
        yScale.domain(d3.range(slicedata.length));

        var bars = svg.selectAll("rect.bar")
            .data(data, function (d) {
              return d.Affects;
            });

           bars
                .attr("fill", "black")
                .attr("opacity","0.8");

            //enter - new bars get set to darkorange when we "redraw."
            bars.enter()
                .append("rect")
                .attr("class", "bar")

                .attr("fill", "orange")
                .attr("opacity","0.8")
                .on("mouseover", mouseoverBar)
                .on("mouseout", mouseoutBar);
          //exit -- remove ones that aren't in the index set
            bars.exit()
                .transition()
                .duration(300)
                .attr("width", 0)
                .remove();
            //at goes here at the end of exit?

            // transition -- move the bars to proper widths and location
            bars
                .transition()
                .duration(500)
                .ease("quad")
                .attr("width", function(d) {
                    return xScale(+d[column]);
                })
                .attr("height", yScale.rangeBand())//TODO: In an ordinal scale bar chart, what goes here?)
                .attr("fill", function(d){
                  return barcolorrange(+d[column]);
                })
                .attr("opacity","0.7")// do what you like with the colors
                .attr("transform", function(d,i) {
                    return "translate(0," + yScale(i) + ")";
                });
                svg.transition().select(".x.axis")
                    .call(xAxis);

            //  We are attaching the labels separately, not in a group with the bars...

            var labels = svg.selectAll("text.labels")
                .data(data, function (d) {
                  return d.Affects;
                });

            // everything gets a class and a text field.  But we assign attributes in the transition.
            labels.enter()
                .append("text")
                .attr("class", "labels");

            labels.exit()
                .remove();

            labels.transition()
                .duration(500)//: How long do you want this to last?)
                .text(function(d) {
                    return +d[column] + "%";
                })
                .attr("x", function(d){
                  return xScale(+d[column]);
                })
                .attr("y", function(d,i) {
                  return yScale(i);
                })
                .attr("dy", "1.5em")
                .attr("dx", "35px")
                .attr("text-anchor", "end");

            var labelsdrivername = svg.selectAll("text.labelsdrivername")
               .data(data,function(d){
                 return d.Affects;
               });

            labelsdrivername.enter()
                  .append("text")
                  .attr("class", "labelsdrivername");
            labelsdrivername.transition()
                  .duration(500)
                  .text(function(d){
                    return d.Affects;
                  })
                  .attr("x",-3)
                  .attr("transform", function(d,i) {
                          return "translate(" + 0+ "," + yScale(i) + ")"
                  })
                  .attr("dy", function(column){
                    if (column.Affects === "School of Nursing and Health Studies" ||column.Affects === "College of Arts and Sciences" || column.Affects === "College of Engineering" ||column.Affects === "School of Architecture" || column.Affects === "School of Business Administration" || column.Affects === "School of Communication" || column.Affects === "School of Education and Human Development"|| column.Affects === "School of Law" || column.Affects === "School of Music" ||column.Affects === "School of Marine and Atmospheric Science" || column.Affects === "School of Medicine"){
                      return "10px";
                    } else {
                      return "25px";
                    }
                  })
                  .attr("dx", "-3px")
                  .attr("text-anchor", "end");

              labelsdrivername.exit()
                  .remove();


                  function mouseoverBar(d) {
                    d3.select(this)
                      .classed("focused", true)
                      .classed("unfocused", false)

                    mybartooltip
                    .style("display", null)
                    .html("<p>Causes:" + " " +column + "</br>" +"Percentage: " + +d[column] +
                          "</p>")
                          .style("top", (d3.event.pageY - 10) + "px" )
                          .style("left", (d3.event.pageX + 10) + "px");

                  }

                  function mouseoutBar(d) {
                    d3.select(this)
                    .classed("focused", false)
                    .classed("unfocused", true)

                    mybartooltip
                    .style("display","none");

                  }



              }

// svg.append("circle")
//  .attr("cx",650)
//  .attr("cy",340)
//  .style("fill","rgb(250,67,52)")
//  .attr("r",6)
//
// svg.append("text")
// .attr("x",660)
// .attr("y",346)
// .attr("font-size","16px")
// .attr("font-weight","bold")
// .style("text-anchor", "left")
// .text("Ferrair");
//
// svg.append("circle")
//  .attr("cx",650)
//  .attr("cy",360)
//  .style("fill","rgb(137,141,142)")
//  .attr("r",6)
//
// svg.append("text")
// .attr("x",660)
// .attr("y",366)
// .attr("font-size","16px")
// .attr("font-weight","bold")
// .style("text-anchor", "left")
// .text("Mercedes");
//
// svg.append("circle")
//    .attr("cx",650)
//    .attr("cy",380)
//    .attr("r",6)
//    .style("fill","rgb(9,103,159)")
//
//  svg.append("text")
//  .attr("x",660)
//  .attr("y",386)
//  .attr("font-size","16px")
//  .attr("font-weight","bold")
//  .style("text-anchor", "left")
//  .text("Williams");
//
//  svg.append("circle")
//     .attr("cx",650)
//     .attr("cy",400)
//     .attr("r",6)
//     .style("fill","rgb(248,160,53)")
//
//   svg.append("text")
//   .attr("x",660)
//   .attr("y",406)
//   .attr("font-size","16px")
//   .attr("font-weight","bold")
//   .style("text-anchor", "left")
//   .text("McLaren");
//
//   svg.append("circle")
//     .attr("cx",650)
//     .attr("cy",420)
//     .attr("r",6)
//     .style("fill","rgb(172,62,100)")
//
//   svg.append("text")
//   .attr("x",660)
//   .attr("y",426)
//   .attr("font-size","16px")
//   .attr("font-weight","bold")
//   .style("text-anchor", "left")
//   .text("Red Bull");
//
//   svg.append("circle")
//     .attr("cx",650)
//     .attr("cy",440)
//     .attr("r",6)
//     .style("fill","rgb(184,192,201)")
//
//   svg.append("text")
//   .attr("x",660)
//   .attr("y",446)
//   .attr("font-size","16px")
//   .attr("font-weight","bold")
//   .style("text-anchor", "left")
//   .text("Other Teams");
