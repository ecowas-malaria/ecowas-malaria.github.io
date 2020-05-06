
var vise=document.getElementById('serere').selectedOptions[0].text
var vise2 = 'assets/theme/data/'+vise+'.csv'

//Carte CEDEAO
var width = 300, height = 200;
var path = d3.geoPath();
var projection = d3.geoMercator().center([-2, 14]).scale(500).translate([width / 2, height / 2]);
path.projection(projection);

var svg = d3.select('#mapcedeao').append("svg").attr("id", "svg").attr("width", width).attr("height", height);

var ecowas = svg.append("g");
var pays=svg.append("g");
//Dessiner la carte de la CEDEAO
d3.json('assets/theme/data/map.geojson').then(function(geojson) {
    //console.log(geojson)
    ecowas.selectAll("g").data(geojson.features).enter().append('g').attr("class",function(d){return d.properties.name}).attr("fill","black").attr("stroke", "white").attr("stroke-width", "0").append("path").attr("d", path).attr("class", 'path')
    var tooltip0 = d3.select("#ecowas0")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip0")
    .style("background-color", "rgba(200, 200, 200, 0.2)")
    .style('font-weight', 'bold')
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '150px')

  // Mobilité
  var mouseover0 = function(d) {
    tooltip0
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 0.6)
  }
  var mousemove0 = function(d) {
    tooltip0
      .html(d.properties.name)
      .style("left", (d3.mouse(this)[0]+280) + "px")
      .style("top", (d3.mouse(this)[1]) + 420 + "px")
      .style('color', 'white')
  }
  var mouseleave0 = function(d) {
    tooltip0
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
  }
    d3.select("#svg").selectAll("g").on('mouseenter', function(d){
        d3.select(this).selectAll('g').on('mouseenter', mouseover0);
        d3.select(this).selectAll('g').on('mouseleave', mouseleave0);
        d3.select(this).selectAll('g').on('mousemove', mousemove0);
    })

    d3.select("#svg").selectAll('g').selectAll('.'+vise).attr('fill', "black");   
});
/*-----------------------------------------
-------------------------------------------
-------------------------------------------
------------------------------------------*/

//Line Chart et Barchart 1
var svg2=d3.select("#casld2").append("svg").attr("width",420).attr("height",height+15);
var svg3=d3.select("#casld1").append("svg").attr("width",420).attr("height",height+15);
var svg4=d3.select('#heatmapp').append('svg').attr('width', 540).attr('height', 300).attr('id', 'map');
var margin = {top: 20, right: 20, bottom: 30, left: 100};
var x = d3.scaleBand().rangeRound([0, 370]).padding(0.7),
y = d3.scaleLinear().rangeRound([height-20, 0]);
var x1 = d3.scaleBand().rangeRound([0, 370]).padding(0.7),
y1 = d3.scaleLinear().rangeRound([height-20, 0]);

var g = svg2.append("g")
    .attr("transform", "translate(" + 45 + "," + 0 + ")");
var g1 = svg2.append("g")
    .attr("transform", "translate(" + 45 + "," + 0 + ")");
var g2 = svg3.append("g")
    .attr("transform", "translate(" + 60 + "," + 0 + ")");
var g3 = svg3.append("g")
    .attr("transform", "translate(" + 60 + "," + 0 + ")");

d3.csv('assets/theme/data/pays.csv')
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Country;

          return d;  
        });
    })
    .then((data) => {

        x.domain(data.map(function(d) { return d.Annees; }));
        y.domain([0, d3.max(data, function(d) { return d.Deces; })]);
        x1.domain(data.map(function(d) { return d.Annees; }));
        y1.domain([0, d3.max(data, function(d) { return d.Malades; })]);

        var line = d3.area()
        .x(function(d) { return x(d.Annees); })
        .y0(y(0))
        .y1(function(d) { return y(d.Deces); });

        g.append("path")
        .attr('fill', "rgba(10,10,10,0.2)").attr('stroke', "none")
        .transition()
        .duration(4000)
        .attr("d", function(d) { return line(data); })
        .attr("fill","rgba(255,255,255,0.2)").attr("stroke","#69a3b2").attr("stroke-width",2);
        
        var line1 = d3.area()
        .x(function(d) { return x1(d.Annees); })
        .y0(y(0))
        .y1(function(d) { return y1(d.Malades); });
        
        g2.append("path")
        .attr('fill', "rgba(10,10,10,0.2)").attr('stroke',"none")
        .transition()
        .duration(4000)
        .attr("d", function(d) { return line1(data); })
        .attr("fill","rgba(255,255,255,0.2)").attr("stroke","#69a3b2").attr("stroke-width",2);

        g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 180 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)" )
        .style('font-size', '8px');

        g2.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 180 + ")")
        .call(d3.axisBottom(x1).ticks(1))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)" )
        .style('font-size', '8px');

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");
        g2.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y1).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");

  // Création tooltip
  var tooltip1 = d3.select("#graph1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip1")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '100%')

  // Appel des fonctions de mobilité
  var mouseover1 = function(d) {
    tooltip1
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
      .style('fill', 'white')
  }
  var mousemove1 = function(d) {
    tooltip1
      .html(d.Country+ ': ' + d.Malades+' Cas confirmés de 2000 à 2017 ')
      .style("left", "0 px")
      .style("top", "0 px")
      .style('color', 'black')
  }
  var mouseleave1 = function(d) {
    tooltip1
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .style('fill', 'orange')
  }

        var tooltip2 = d3.select("#graph2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip2")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('width', '100%')

      // Appel des fonctions de mobilité
      var mouseover2 = function(d) {
        tooltip2
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
          .style('fill', 'white')
      }
      var mousemove2 = function(d) {
        tooltip2
        .html(d.Country+ ': ' + d.Deces+' Décès confirmés de 2000 à 2017 ')
        .style("left", "100 px")
        .style("top", "200 px")
        .style('color', 'black')
      }
      var mouseleave2 = function(d) {
        tooltip2
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
          .style('fill', 'red')
      }

        g.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Annees); })
            .attr("y", height-20)
            .attr("width", x.bandwidth())
            .attr("height",0)
            .attr("fill","white")
            .transition()
            .duration(3000)
            .attr("y", function(d) { return y(d.Deces); })
            .attr("height", function(d) { return height -20- y(d.Deces); })
            .attr("fill", "red");
        g2.selectAll(".bar1")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x1(d.Annees); })
            .attr("y", height-20)
            .attr("width", x.bandwidth())
            .attr("height",0)
            .attr("fill","white")
            .transition()
            .duration(3000)
            .attr("y", function(d) { return y1(d.Malades); })
            .attr("height", function(d) { return height -20- y1(d.Malades); })
            .attr("fill", "orange");
        d3.selectAll('.bar1').on("mouseover", mouseover1)
        d3.selectAll('.bar1').on("mousemove", mousemove1)
        d3.selectAll('.bar1').on("mouseleave", mouseleave1);
        d3.selectAll('.bar').on("mouseover", mouseover2)
        d3.selectAll('.bar').on("mousemove", mousemove2)
        d3.selectAll('.bar').on("mouseleave", mouseleave2);

            var total=d3.sum(data, function(d) {return (d["Malades"]);})
            var total2=d3.sum(data, function(d) {return (d["Deces"]);})
            var moy=total/18
            var moy1=total2/18
            d3.select("#som1").append("text").attr("x",90).attr('y',23).text(total).attr('class', 'coul1').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#som2").append("text").attr("x",90).attr('y',23).text(total2).attr('class', 'coul2').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#moy1").append("text").attr("x",125).attr('y',23).text(parseInt(moy)).attr('class', 'coul1').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#moy2").append("text").attr("x",125).attr('y',23).text(parseInt(moy1)).attr('class', 'coul2').style('font-size', "30px").style('font-family', 'sans-serif, arial')


            
    })
    .catch((error) => {
            throw error;
    });

    d3.csv('assets/theme/data/ecowas.csv')
    .then((data)=>{

    /*Heatmap--------------------------------
            ---------------------------------------*/
            var payes=d3.map(data, function(d){return d.Annees}).keys()
            var mal=d3.map(data, function(d){return d.Country}).keys()
            // Abscisses 
  var z = d3.scaleBand()
    .range([ 80, 520 ])
    .domain(payes)
    .padding(0.05);
  svg4.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(z).tickSize(0))
    .select(".domain").remove()

  // Ordonnées
  var t = d3.scaleBand()
    .range([ height, 0 ])
    .domain(mal)
    .padding(0.05);
  svg4.append("g")
    .style("font-size", 15)
    .style('color', 'white')
    .call(d3.axisRight(t).tickSize(0))
    .select(".domain").remove()

  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

  // Création tooltip
  var tooltip = d3.select("#chal")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "rgba(200, 200, 200, 0.6)")
    .style('font-weight', 'bold')
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '200px')

  // Appel fonctions
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(d.Country+' en 20'+ d.Annees +': <br/> Cas confirmes: ' + d.Malades+'<br/>Deces: '+d.Deces)
      .style("left", (d3.mouse(this)[0]+280) + "px")
      .style("top", (d3.mouse(this)[1]) + 420 + "px")
      .style('color', 'black')
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // Rect
  svg4.selectAll()
    .data(data, function(d) {return d.Country+':'+d.Annees;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return z(d.Annees)})
      .attr("y", function(d) { return t(d.Country) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", z.bandwidth() )
      .attr("height", t.bandwidth() )
      .style("fill", function(d) {
        if(d.Deces>10000){
            return "#f00505"
        }
        else if(d.Deces>6000){
            return "#ff2C05"
        }
        else if(d.Deces>4500){
            return "#fd6104"
        }
        else if(d.Deces>2000){
            return "#fd9a01"
        }
        else if(d.Deces>2000){
            return "#ffce03"
        }
        else {
            return "#fef001"
        }
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    var gradient = svg4.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");

            gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fef001");
            gradient.append("stop")
            .attr("offset", "17%")
            .attr("stop-color", "#ffce03");
            gradient.append("stop")
            .attr("offset", "34%")
            .attr("stop-color", "#fd9a01");
            gradient.append("stop")
            .attr("offset", "57%")
            .attr("stop-color", "#fd6104");
            gradient.append("stop")
            .attr("offset", "85%")
            .attr("stop-color", "#ff2C05");
            gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#f00505");


    d3.select('#map').append('rect').attr('x', 83).attr('y', height+40)
    .attr('width',427).attr('height', 15).attr('fill','url(#gradient)')
    .attr('rx', 4).attr('ry',4)

    svg4.append('text').attr('x',85).attr('y',height+70).text('0 Décès').attr('fill', 'white')
    svg4.append('text').attr('x', 420).attr('y', height+70).text('+10000 Décès').attr('fill', 'white')
})
var svg5=d3.select('#diagC').append('svg').attr('width','380').attr('height', 240).append('g').attr('transform', 'translate(50,0)')
var svg6=d3.select('#diagD').append('svg').attr('width','380').attr('height', 240).append('g').attr('transform', 'translate(50,0)')
d3.csv("assets/theme/data/annees.csv")
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {
        //Abscisse
        var absc=d3.scaleBand()
        .range([ 0, 320 ])
        .domain(data.map(function(d) { return d.Annees; }))
        .padding(1);
        svg5.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(absc))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        // Ordonnées
        var ord = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Malades; })])
        .range([ 200, 0]);
        svg5.append("g")
        .call(d3.axisLeft(ord))
        .selectAll("text")
        .style("text-anchor", "end").style('font-size', "8px");

        svg5.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return absc(d.Annees); })
        .attr("cy", function(d) { return ord(d.Malades); })
        .attr("r", "6")
        .style("fill", "orange")
        .attr("stroke", "black")
        .attr('class', 'cercles')
        /*------------------------
        --------------------------
        -------------------------*/
        var absc1=d3.scaleBand()
        .range([ 0, 320 ])
        .domain(data.map(function(d) { return d.Annees; }))
        .padding(1);
        svg6.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(absc1))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        // Add Y axis
        var ord1 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Deces; })])
        .range([ 200, 0]);
        svg6.append("g")
        .call(d3.axisLeft(ord1))
        .selectAll("text")
        .style("text-anchor", "end").style('font-size', "8px");
        // Lines
        /*svg6.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) { return absc1(d.Annees); })
        .attr("x2", function(d) { return absc1(d.Annees); })
        .attr("y1", function(d) { return ord1(d.Deces); })
        .attr("y2", ord(0))
        .attr("stroke", "grey")
        .attr('class', 'cercles1')*/
        // Circles
        svg6.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return absc1(d.Annees); })
        .attr("cy", function(d) { return ord1(d.Deces); })
        .attr("r", "6")
        .style("fill", "red")
        .attr("stroke", "black")
        .attr('class', 'cercles1')

        var texte=svg5.append("text").data(data)
        var texte2=svg6.append("text").data(data)
        d3.selectAll('.cercles').on('mousemove', function(d, i){
            //d3.select(this).on('mousemove', function(){
                d3.select(this).style('fill', 'white')       
                texte.attr('class', 'texte')
                .attr('x', function(){return absc(d.Annees)}).attr('y', function(){return ord(d.Malades)})
                .text(function(){return d.Malades})
                .style('fill', 'white').style('stroke-width', 1).style('stroke', 'white')
            //})
        });
        d3.selectAll('.cercles').on('mouseleave', function(d){
          d3.select(this).style('fill', 'orange');
          texte.text('');
        })

        d3.selectAll('.cercles1').on('mousemove', function(d, i){
            //d3.select(this).on('mousemove', function(){
                d3.select(this).style('fill', 'white')       
                texte2.attr('class', 'texte')
                .attr('x', function(){return absc1(d.Annees)}).attr('y', function(){return ord1(d.Deces)})
                .attr('width', "100").attr('height', '40').text(function(){return d.Deces})
                .style('fill', 'white').style('stroke-width', 1).style('stroke', 'white')
            //})
        });
        d3.selectAll('.cercles1').on('mouseleave', function(d){
          d3.select(this).style('fill', 'red');
          texte2.text('');
        })
    })
    .catch((error) => {
            throw error;
    });

//}
/*----------------------------------------
------------------------------------------
----------------------------------------
------------------------------------------
-----------------------------------------*/
function VizMalaria(){
var pal=d3.select("#viz").selectAll('div').selectAll('svg')
var pal2=pal.selectAll('*')
var tool1=d3.select('#graph1').selectAll('.tooltip1').remove()
var tool2=d3.select('#graph2').selectAll('.tooltip2').remove()
var tool3=d3.select('#ecowas0').selectAll('.tooltip0').remove()
pal2.remove();

var vise=document.getElementById('serere').selectedOptions[0].text
var vise2 = 'assets/theme/data/'+vise+'.csv'

//Carte CEDEAO
var width = 300, height = 200;
var path = d3.geoPath();
var projection = d3.geoMercator().center([-2, 14]).scale(500).translate([width / 2, height / 2]);
path.projection(projection);

var svg = d3.select('#mapcedeao').append("svg").attr("id", "svg").attr("width", width).attr("height", height);

var ecowas = svg.append("g");
var pays=svg.append("g");
//Dessiner la carte de la CEDEAO
d3.json('assets/theme/data/map.geojson').then(function(geojson) {
    //console.log(geojson)
    ecowas.selectAll("g").data(geojson.features).enter().append('g').attr("class",function(d){return d.properties.name}).attr("fill","white").attr("stroke", "white").attr("stroke-width", "0").append("path").attr("d", path).attr("class", 'path')
    var tooltip0 = d3.select("#ecowas0")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip0")
    .style("background-color", "rgba(200, 200, 200, 0.2)")
    .style('font-weight', 'bold')
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '150px')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover0 = function(d) {
    tooltip0
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 0.6)
  }
  var mousemove0 = function(d) {
    tooltip0
      .html(d.properties.name)
      .style("left", (d3.mouse(this)[0]+280) + "px")
      .style("top", (d3.mouse(this)[1]) + 420 + "px")
      .style('color', 'white')
  }
  var mouseleave0 = function(d) {
    tooltip0
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1)
  }
    d3.select("#svg").selectAll("g").on('mouseenter', function(d){
        d3.select(this).selectAll('g').on('mouseenter', mouseover0);
        d3.select(this).selectAll('g').on('mouseleave', mouseleave0);
        d3.select(this).selectAll('g').on('mousemove', mousemove0);
    })
    //d3.selectAll('#svg').selectAll('g').selectAll('*').style('display', 'none');
    d3.select("#svg").selectAll('g').selectAll('.'+vise).attr('fill', "black");   
});
/*-----------------------------------------
-------------------------------------------
-------------------------------------------
------------------------------------------*/

//Line Chart et Barchart 1
var svg2=d3.select("#casld2").append("svg").attr("width",420).attr("height",height+15);
var svg3=d3.select("#casld1").append("svg").attr("width",420).attr("height",height+15);
var svg4=d3.select('#heatmapp').append('svg').attr('width', 540).attr('height', 300).attr('id', 'map');
var margin = {top: 20, right: 20, bottom: 30, left: 100};
var x = d3.scaleBand().rangeRound([0, 370]).padding(0.7),
y = d3.scaleLinear().rangeRound([height-20, 0]);
var x1 = d3.scaleBand().rangeRound([0, 370]).padding(0.7),
y1 = d3.scaleLinear().rangeRound([height-20, 0]);

var g = svg2.append("g")
    .attr("transform", "translate(" + 45 + "," + 0 + ")");
var g1 = svg2.append("g")
    .attr("transform", "translate(" + 45 + "," + 0 + ")");
var g2 = svg3.append("g")
    .attr("transform", "translate(" + 60 + "," + 0 + ")");
var g3 = svg3.append("g")
    .attr("transform", "translate(" + 60 + "," + 0 + ")");

d3.csv(vise2)
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {

        document.getElementById('serere1').value='2017'
        document.getElementById('serere2').value='2017'

        x.domain(data.map(function(d) { return d.Annees; }));
        y.domain([0, d3.max(data, function(d) { return d.Deces; })]);
        x1.domain(data.map(function(d) { return d.Annees; }));
        y1.domain([0, d3.max(data, function(d) { return d.Malades; })]);

        var line = d3.area()
        .x(function(d) { return x(d.Annees); })
        .y0(y(0))
        .y1(function(d) { return y(d.Deces); });

        g.append("path")
        .attr('fill', "rgba(10,10,10,0.2)").attr('stroke', "none")
        .transition()
        .duration(4000)
        .attr("d", function(d) { return line(data); })
        .attr("fill","rgba(255,255,255,0.2)").attr("stroke","#69a3b2").attr("stroke-width",2);
        
        var line1 = d3.area()
        .x(function(d) { return x1(d.Annees); })
        .y0(y(0))
        .y1(function(d) { return y1(d.Malades); });
        
        g2.append("path")
        .attr('fill', "rgba(10,10,10,0.2)").attr('stroke',"none")
        .transition()
        .duration(4000)
        .attr("d", function(d) { return line1(data); })
        .attr("fill","rgba(255,255,255,0.2)").attr("stroke","#69a3b2").attr("stroke-width",2);

        g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 180 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

        g2.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 180 + ")")
        .call(d3.axisBottom(x1).ticks(1))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");
        g2.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y1).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Deces");

              // create a tooltip
  var tooltip1 = d3.select("#graph1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip1")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '100%')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover1 = function(d) {
    tooltip1
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
      .style('fill', 'white')
  }
  var mousemove1 = function(d) {
    tooltip1
      .html(d.Country+ ': ' + d.Malades+' Cas confirmés en '+d.Annees)
      .style("left", "0 px")
      .style("top", "0 px")
      .style('color', 'black')
  }
  var mouseleave1 = function(d) {
    tooltip1
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .style('fill', 'orange')
  }

        var tooltip2 = d3.select("#graph2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip2")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('width', '100%')

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover2 = function(d) {
        tooltip2
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
          .style('fill', 'white')
      }
      var mousemove2 = function(d) {
        tooltip2
        .html(d.Country+ ': ' + d.Deces+' Décès confirmés en '+d.Annees)
        .style("left", "100 px")
        .style("top", "200 px")
        .style('color', 'black')
      }
      var mouseleave2 = function(d) {
        tooltip2
          .style("opacity", 0)
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
          .style('fill', 'red')
      }

        g.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Annees); })
            .attr("y", height-20)
            .attr("width", x.bandwidth())
            .attr("height",0)
            .attr("fill","white")
            .transition()
            .duration(3000)
            .attr("y", function(d) { return y(d.Deces); })
            .attr("height", function(d) { return height -20- y(d.Deces); })
            .attr("fill", "red");
        g2.selectAll(".bar1")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar1")
          .attr("x", function(d) { return x1(d.Annees); })
          .attr("y", height-20)
          .attr("width", x.bandwidth())
          .attr("height",0)
          .attr("fill","white")
          .transition()
          .duration(3000)
          .attr("y", function(d) { return y1(d.Malades); })
          .attr("height", function(d) { return height -20- y1(d.Malades); })
          .attr("fill", "orange");
        d3.selectAll('.bar1').on("mouseover", mouseover1)
        d3.selectAll('.bar1').on("mousemove", mousemove1)
        d3.selectAll('.bar1').on("mouseleave", mouseleave1);
        d3.selectAll('.bar').on("mouseover", mouseover2)
        d3.selectAll('.bar').on("mousemove", mousemove2)
        d3.selectAll('.bar').on("mouseleave", mouseleave2);

        var total=d3.sum(data, function(d) {return (d["Malades"]);})
            var total2=d3.sum(data, function(d) {return (d["Deces"]);})
            var moy=d3.mean(data, function(d) {return (d["Malades"]);})
            var moy1=d3.mean(data, function(d) {return (d["Deces"]);})
            d3.select("#som1").append("text").attr("x",90).attr('y',23).text(total).attr('class', 'coul1').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#som2").append("text").attr("x",90).attr('y',23).text(total2).attr('class', 'coul2').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#moy1").append("text").attr("x",125).attr('y',23).text(parseInt(moy)).attr('class', 'coul1').style('font-size', "30px").style('font-family', 'sans-serif, arial')
            d3.select("#moy2").append("text").attr("x",125).attr('y',23).text(parseInt(moy1)).attr('class', 'coul2').style('font-size', "30px").style('font-family', 'sans-serif, arial')


            
    })
    .catch((error) => {
            throw error;
    });

  d3.csv('assets/theme/data/ecowas.csv')
    .then((data)=>{

    /*Heatmap--------------------------------
            ---------------------------------------*/
            var payes=d3.map(data, function(d){return d.Annees}).keys()
            var mal=d3.map(data, function(d){return d.Country}).keys()
            // Build X scales and axis:
  var z = d3.scaleBand()
    .range([ 80, 520 ])
    .domain(payes)
    .padding(0.05);
  svg4.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(z).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var t = d3.scaleBand()
    .range([ height, 0 ])
    .domain(mal)
    .padding(0.05);
  svg4.append("g")
    .style("font-size", 15)
    .style('color', 'white')
    .call(d3.axisRight(t).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100])

  // create a tooltip
  var tooltip = d3.select("#chal")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "rgba(200, 200, 200, 0.6)")
    .style('font-weight', 'bold')
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style('width', '200px')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(d.Country+' en 20'+ d.Annees +': <br/> Cas confirmes: ' + d.Malades+'<br/>Deces: '+d.Deces)
      .style("left", (d3.mouse(this)[0]+280) + "px")
      .style("top", (d3.mouse(this)[1]) + 420 + "px")
      .style('color', 'black')
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  svg4.selectAll()
    .data(data, function(d) {return d.Country+':'+d.Annees;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return z(d.Annees) })
      .attr("y", function(d) { return t(d.Country) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", z.bandwidth() )
      .attr("height", t.bandwidth() )
      .style("fill", function(d) {
        if(d.Deces>10000){
            return "#f00505"
        }
        else if(d.Deces>6000){
            return "#ff2C05"
        }
        else if(d.Deces>4500){
            return "#fd6104"
        }
        else if(d.Deces>2000){
            return "#fd9a01"
        }
        else if(d.Deces>2000){
            return "#ffce03"
        }
        else {
            return "#fef001"
        }
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    var gradient = svg4.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");

            gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fef001");
            gradient.append("stop")
            .attr("offset", "17%")
            .attr("stop-color", "#ffce03");
            gradient.append("stop")
            .attr("offset", "34%")
            .attr("stop-color", "#fd9a01");
            gradient.append("stop")
            .attr("offset", "57%")
            .attr("stop-color", "#fd6104");
            gradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#ff2C05");
            gradient.append("stop")
            .attr("offset", "85%")
            .attr("stop-color", "#f00505");


    d3.select('#map').append('rect').attr('x', 86).attr('y', height+40)
    .attr('width',430).attr('height', 15).attr('fill','url(#gradient)')
    .attr('rx', 4).attr('ry',4)

    svg4.append('text').attr('x',88).attr('y',height+70).text('0 Décès').attr('fill', 'white')
    svg4.append('text').attr('x', 420).attr('y', height+70).text('+10000 Décès').attr('fill', 'white')
})
var svg5=d3.select('#diagC').append('svg').attr('width','380').attr('height', 300).append('g').attr('transform', 'translate(50,0)')
var svg6=d3.select('#diagD').append('svg').attr('width','380').attr('height', 300).append('g').attr('transform', 'translate(50,0)')

d3.csv("assets/theme/data/2017.csv")
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {
      var tot=d3.sum(data, function(d) {return (d["Malades"]);})
      var tot2=d3.sum(data, function(d) {return (d["Deces"]);})
      var part1=(tot2*100/tot).toFixed(3)
      var donc=[]
      var base=d3.pie().value(function(d){return d.Malades})
      var base2=d3.pie().value(function(d){return d.Deces})
      var segments=d3.arc().outerRadius(120).innerRadius(0)
      var couleur=["#fbb4ae","#b3cde3","#ccebc5","#df2a7f","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2", "#bffaed","#decbe4","#accaac","#7fedca","#ba7bf3"]
      var couleur2=["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999","#a6cee3","#fdb462","#007fff","#56adf8","#bff781"]
      
      var sections=svg5.append('g').attr('transform', 'translate(80,145)').attr('id','path1')
      .selectAll('path').data(base(data))
      sections.enter().append('path').attr('d', segments)
      .attr('fill', function(d,i){return couleur2[i]})
      
      var sections2=svg6.append('g').attr('transform', 'translate(85,145)').attr('id','path2')
      .selectAll('path').data(base2(data))
      sections2.enter().append('path').attr('d', segments)
      .attr('fill', function(d,i){return couleur[i]})

      var c1=svg5.append('g').attr('transform', 'translate(-80,0)')
      var cercle=c1.selectAll('.circle1').data(data).enter().append('circle').attr('class', 'circle1')
      cercle.attr('cx',300).attr('cy',function(d,i){return 8 + 20*i}).attr("r",4).attr('fill',function(d,i){return couleur2[i]})  
      var texte=c1.selectAll('.texte').data(data).enter().append('text').attr('x', 305).attr('y', function(d,i){return 13+20*i}).text(function(d){return d.Country}).attr('class', 'texte').style('fill', 'white').style('font-size', '12px')
      
      var c2=svg6.append('g').attr('transform', 'translate(-80,0)')
      var cercle2=c2.selectAll('.circle2').data(data).enter().append('circle').attr('class', 'circle2')
      cercle2.attr('cx',300).attr('cy',function(d,i){return 8 + 20*i}).attr("r",4).attr('fill',function(d,i){return couleur[i]})  
      var texte2=c2.selectAll('.texte2').data(data).enter().append('text').attr('x', 305).attr('y', function(d,i){return 13+20*i}).text(function(d){return d.Country}).attr('class', 'texte2').style('fill', 'white').style('font-size', '12px')
      
      d3.selectAll('.texte').on('mousemove', function(d,i){
        d3.select(this).text(function(){return (d.Malades*100/tot).toFixed(3)+"%"})
      })
      d3.selectAll('.texte').on('mouseleave', function(d,i){
        d3.select(this).text(function(){return d.Country})
      })
      d3.selectAll('.texte2').on('mousemove', function(d,i){
        d3.select(this).text(function(){return (d.Malades*100/tot).toFixed(3)+"%"})
      })
      d3.selectAll('.texte2').on('mouseleave', function(d,i){
        d3.select(this).text(function(){return d.Country})
      })

      //Abscisse
        /*var absc=d3.scaleBand()
        .range([ 0, 320 ])
        .domain(data.map(function(d) { return d.Annees; }))
        .padding(1);
        svg5.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(absc))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        // Ordonnées
        var ord = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Malades; })])
        .range([ 200, 0]);
        svg5.append("g")
        .call(d3.axisLeft(ord))
        .selectAll("text")
        .style("text-anchor", "end").style('font-size', "8px");

        svg5.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return absc(d.Annees); })
        .attr("cy", function(d) { return ord(d.Malades); })
        .attr("r", "6")
        .style("fill", "orange")
        .attr("stroke", "black")
        .attr('class', 'cercles')
        /*------------------------
        --------------------------
        -------------------------*/
        /*var absc1=d3.scaleBand()
        .range([ 0, 320 ])
        .domain(data.map(function(d) { return d.Annees; }))
        .padding(1);
        svg6.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(d3.axisBottom(absc1))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        // Add Y axis
        var ord1 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.Deces; })])
        .range([ 200, 0]);
        svg6.append("g")
        .call(d3.axisLeft(ord1))
        .selectAll("text")
        .style("text-anchor", "end").style('font-size', "8px");
        // Lines
        /*svg6.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) { return absc1(d.Annees); })
        .attr("x2", function(d) { return absc1(d.Annees); })
        .attr("y1", function(d) { return ord1(d.Deces); })
        .attr("y2", ord(0))
        .attr("stroke", "grey")
        .attr('class', 'cercles1')*/
        /*/ Circles
        svg6.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return absc1(d.Annees); })
        .attr("cy", function(d) { return ord1(d.Deces); })
        .attr("r", "6")
        .style("fill", "red")
        .attr("stroke", "black")
        .attr('class', 'cercles1')

        /*var texte=svg5.append("text").data(data)
        var texte2=svg6.append("text").data(data)
        d3.selectAll('.cercles').on('mousemove', function(d, i){
            //d3.select(this).on('mousemove', function(){
                d3.select(this).style('fill', 'white')       
                texte.attr('class', 'texte')
                .attr('x', function(){return absc(d.Annees)}).attr('y', function(){return ord(d.Malades)})
                .attr('width', "100").attr('height', '80').text(function(){return d.Malades})
                .style('fill', 'white').style('stroke-width', 1).style('stroke', 'white')
            //})
        });
        d3.selectAll('.cercles').on('mouseleave', function(d){d3.select(this).style('fill', 'orange')})

        d3.selectAll('.cercles1').on('mousemove', function(d, i){
            //d3.select(this).on('mousemove', function(){
                d3.select(this).style('fill', 'white')       
                texte2.attr('class', 'texte')
                .attr('x', function(){return absc1(d.Annees)}).attr('y', function(){return ord1(d.Deces)})
                .attr('width', "100").attr('height', '40').text(function(){return d.Deces})
                .style('fill', 'white').style('stroke-width', 1).style('stroke', 'white')
            //})
        });
        d3.selectAll('.cercles1').on('mouseleave', function(d){d3.select(this).style('fill', 'red')})*/
    })
    .catch((error) => {
            throw error;
    });

}

/*------------------------------------------------*/
function VizMalaria1(){
var pal=d3.select("#cede").selectAll('svg')
var pal2=pal.selectAll('*')
var tool1=d3.select('#cede1').selectAll('svg').selectAll('*').remove()
pal2.remove();

var vise=document.getElementById('serere1').selectedOptions[0].text
document.getElementById('serere2').value=vise;
//vise1=document.getElementById('serere2').selectedOptions[0].text
var vise2 = 'assets/theme/data/'+vise+'.csv'
//vise3 = 'assets/theme/data/'+vise1+'.csv'
var svg5=d3.select('#diagC').append('svg').attr('width','380').attr('height', 300).append('g').attr('transform', 'translate(50,0)')
var svg6=d3.select('#diagD').append('svg').attr('width','380').attr('height', 300).append('g').attr('transform', 'translate(50,0)')

d3.csv(vise2)
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {
      var tot=d3.sum(data, function(d) {return (d["Malades"]);})
      var tot2=d3.sum(data, function(d) {return (d["Deces"]);})
      var part1=(tot2*100/tot).toFixed(3)
      var donc=[]
      var base=d3.pie().value(function(d){return d.Malades})
      var base2=d3.pie().value(function(d){return d.Deces})
      var segments=d3.arc().outerRadius(120).innerRadius(0)
      var couleur=["#fbb4ae","#b3cde3","#ccebc5","#df2a7f","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2", "#bffaed","#decbe4","#accaac","#7fedca","#ba7bf3"]
      var couleur2=["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999","#a6cee3","#fdb462","#007fff","#56adf8","#bff781"]
      
      var sections=svg5.append('g').attr('transform', 'translate(80,145)').attr('id','path1')
      .selectAll('path').data(base(data))
      sections.enter().append('path').attr('d', segments)
      .attr('fill', function(d,i){return couleur2[i]})
      
      var sections2=svg6.append('g').attr('transform', 'translate(85,145)').attr('id','path2')
      .selectAll('path').data(base2(data))
      sections2.enter().append('path').attr('d', segments)
      .attr('fill', function(d,i){return couleur[i]})

      var c1=svg5.append('g').attr('transform', 'translate(-80,0)')
      var cercle=c1.selectAll('.circle1').data(data).enter().append('circle').attr('class', 'circle1')
      cercle.attr('cx',300).attr('cy',function(d,i){return 8 + 20*i}).attr("r",4).attr('fill',function(d,i){return couleur2[i]})  
      var texte=c1.selectAll('.texte').data(data).enter().append('text').attr('x', 305).attr('y', function(d,i){return 13+20*i}).text(function(d){return d.Country}).attr('class', 'texte').style('fill', 'white')
      
      var c2=svg6.append('g').attr('transform', 'translate(-80,0)')
      var cercle2=c2.selectAll('.circle2').data(data).enter().append('circle').attr('class', 'circle2')
      cercle2.attr('cx',300).attr('cy',function(d,i){return 8 + 20*i}).attr("r",4).attr('fill',function(d,i){return couleur[i]})  
      var texte2=c2.selectAll('.texte2').data(data).enter().append('text').attr('x', 305).attr('y', function(d,i){return 13+20*i}).text(function(d){return d.Country}).attr('class', 'texte2').style('fill', 'white')
      
      d3.selectAll('.texte').on('mousemove', function(d,i){
        d3.select(this).text(function(){return (d.Malades*100/tot).toFixed(3)+"%"})
      })
      d3.selectAll('.texte').on('mouseleave', function(d,i){
        d3.select(this).text(function(){return d.Country})
      })
      d3.selectAll('.texte2').on('mousemove', function(d,i){
        d3.select(this).text(function(){return (d.Deces*100/tot2).toFixed(3)+"%"})
      })
      d3.selectAll('.texte2').on('mouseleave', function(d,i){
        d3.select(this).text(function(){return d.Country})
      })
    })
    .catch((error) => {
            throw error;
    });
}
/*------------------------------------*/
function VizMalaria2(){
var pal=d3.select("#cede1").selectAll('svg')
var pal2=pal.selectAll('*')
var tool1=d3.select('#cede').selectAll('svg').selectAll('*').remove()
pal2.remove();

//var vise=document.getElementById('serere1').selectedOptions[0].text
vise1=document.getElementById('serere2').selectedOptions[0].text
document.getElementById('serere1').value=vise1;
//var vise2 = 'assets/theme/data/'+vise+'.csv'
vise3 = 'assets/theme/data/'+vise1+'.csv'
var svg5=d3.select('#diagC').append('svg').attr('width','380').attr('height', 300).append('g').attr('transform', 'translate(50,0)')
var svg6=d3.select('#diagD').append('svg').attr('width','380').attr('height', 300).append('g').attr('transform', 'translate(50,0)')

d3.csv(vise3)
    .then((data) => {
        return data.map((d) => {
          d.Deces = +d.Deces;
          d.Malades=+d.Malades;
          d.Annees=d.Annees;

          return d;  
        });
    })
    .then((data) => {
      var tot=d3.sum(data, function(d) {return (d["Malades"]);})
      var tot2=d3.sum(data, function(d) {return (d["Deces"]);})
      //var part1=(tot2*100/tot).toFixed(3)
      //var donc=[]
      var base=d3.pie().value(function(d){return d.Malades})
      var base2=d3.pie().value(function(d){return d.Deces})
      var segments=d3.arc().outerRadius(120).innerRadius(0)
      var couleur=["#fbb4ae","#b3cde3","#ccebc5","#df2a7f","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2", "#bffaed","#decbe4","#accaac","#7fedca","#ba7bf3"]
      var couleur2=["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999","#a6cee3","#fdb462","#007fff","#56adf8","#bff781"]
      
      var sections=svg5.append('g').attr('transform', 'translate(80,145)').attr('id','path1')
      .selectAll('path').data(base(data))
      sections.enter().append('path').attr('d', segments)
      .attr('fill', function(d,i){return couleur2[i]})
      
      var sections2=svg6.append('g').attr('transform', 'translate(85,145)').attr('id','path2')
      .selectAll('path').data(base2(data))
      sections2.enter().append('path').attr('d', segments)
      .attr('fill', function(d,i){return couleur[i]})

      var c1=svg5.append('g').attr('transform', 'translate(-80,0)')
      var cercle=c1.selectAll('.circle1').data(data).enter().append('circle').attr('class', 'circle1')
      cercle.attr('cx',300).attr('cy',function(d,i){return 8 + 20*i}).attr("r",4).attr('fill',function(d,i){return couleur2[i]})  
      var texte=c1.selectAll('.texte').data(data).enter().append('text').attr('x', 305).attr('y', function(d,i){return 13+20*i}).text(function(d){return d.Country}).attr('class', 'texte').style('fill', 'white')
      
      var c2=svg6.append('g').attr('transform', 'translate(-80,0)')
      var cercle2=c2.selectAll('.circle2').data(data).enter().append('circle').attr('class', 'circle2')
      cercle2.attr('cx',300).attr('cy',function(d,i){return 8 + 20*i}).attr("r",4).attr('fill',function(d,i){return couleur[i]})  
      var texte2=c2.selectAll('.texte2').data(data).enter().append('text').attr('x', 305).attr('y', function(d,i){return 13+20*i}).text(function(d){return d.Country}).attr('class', 'texte2').style('fill', 'white')
      
      d3.selectAll('.texte').on('mousemove', function(d,i){
        d3.select(this).text(function(){return (d.Malades*100/tot).toFixed(3)+"%"})
      })
      d3.selectAll('.texte').on('mouseleave', function(d,i){
        d3.select(this).text(function(){return d.Country})
      })
      d3.selectAll('.texte2').on('mousemove', function(d,i){
        d3.select(this).text(function(){return (d.Deces*100/tot2).toFixed(3)+"%"})
      })
      d3.selectAll('.texte2').on('mouseleave', function(d,i){
        d3.select(this).text(function(){return d.Country})
      })
    })
    .catch((error) => {
            throw error;
    });
}