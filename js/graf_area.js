
      var margin = {top: 20, right: 55, bottom: 30, left: 80},
          width  = 1300 - margin.left - margin.right,
          height = 500  - margin.top  - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .rangeRound([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var stack = d3.layout.stack()
          .offset("zero")
          .values(function (d) { return d.values; })
          .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
          .y(function (d) { return d.value; });

      var area = d3.svg.area()
          .interpolate("cardinal")
          .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
          .y0(function (d) { return y(d.y0); })
          .y1(function (d) { return y(d.y0 + d.y); });

      var color = d3.scale.ordinal()
          .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

      var svg = d3.select("body").append("svg")
          .attr("width",  width  + margin.left + margin.right)
          .attr("height", height + margin.top  + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var svg2 = d3.select("body").append("svg")
          .attr("width",  2500)
          .attr("height", height + margin.top  + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + 0 + "," + margin.top + ")");

      d3.csv("data/evolucao_tempo.csv", function (error, data) {

        var labelVar = 'quarter';
        var varNames = d3.keys(data[0])
            .filter(function (key) { return key !== labelVar;});
        color.domain(varNames);

        var seriesArr = [], series = {};
        varNames.forEach(function (name) {
          series[name] = {name: name, values:[]};
          seriesArr.push(series[name]);
        });

        data.forEach(function (d) {
          varNames.map(function (name) {
            series[name].values.push({name: name, label: d[labelVar], value: +d[name]});
          });
        });

        x.domain(data.map(function (d) { return d.quarter; }));

        stack(seriesArr);

        y.domain([0, d3.max(seriesArr, function (c) { 
            return d3.max(c.values, function (d) { return d.y0 + d.y; });
          })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")  
           .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Número de Casos");

        var selection = svg.selectAll(".series")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "series");

        selection.append("path")
          .attr("class", "streamPath")
          .attr("d", function (d) { return area(d.values); })
          .style("fill", function (d) { return color(d.name); })
          .style("stroke", "grey");

        /*var points = svg.selectAll(".seriesPoints")
          .data(seriesArr)
          .enter().append("g")
            .attr("class", "seriesPoints");

        points.selectAll(".point")
          .data(function (d) { return d.values; })
          .enter().append("circle")
           .attr("class", "point")
           .attr("cx", function (d) { return x(d.label) + x.rangeBand() / 2; })
           .attr("cy", function (d) { return y(d.y0 + d.y); })
           .attr("r", "10px")
           .style("fill",function (d) { return color(d.name); })
           .on("mouseover", function (d) { showPopover.call(this, d); })
           .on("mouseout",  function (d) { removePopovers(); })*/

        var legend = svg2.selectAll(".legend")
            .data(varNames.slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width +100)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color)
            .style("stroke", "grey");

        legend.append("text")
            .attr("x", width - 12)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });

        /*function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

        function showPopover (d) {
          $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html : true,
            content: function() { 
              return "QuartoAno: " + d.label + 
                     "<br/>Casos: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
          });
          $(this).popover('show')
        }*/

      });