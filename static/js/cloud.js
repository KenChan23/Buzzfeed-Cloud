$(function() {
    var countClicks = 0;
    $('#generate-text').click(function(){
        // var fill = d3.scale.category20();
    //what range of font sizes do we want, we will scale the word counts

    d3.select('.col.meme-image').append('div').classed('preloader-wrapper', true).classed('big', true).classed('active', true)
                                .style('position', 'relative').style('margin-top','180px')
                                .append('div').classed('spinner-layer', true).classed('spinner-blue-only', true)
                                .style('border-color', '#FFF600')
                                .append('div').classed('circle-clipper', true).classed('left', true)
                                .append('div').classed('circle', true).style('border-width', '10px');
                                
    countClicks++;

    var MIN_SIZE = 0;
    var MAX_SIZE = 80;
    var results;

    var parentWidth = 400;
    var parentHeight = 400;

    var fontSize = d3.scale.log().range([MIN_SIZE, MAX_SIZE]);

    //create my cloud object
    var mycloud = d3.layout.cloud().size([400, 400])
          .words([])
          .padding(2)
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          // .rotate(function() { return 0; })
          .font("Roboto")
          .fontSize(function(d) { return fontSize(d.size); })
          .on("end", draw);

    //render the cloud with animations
     function draw(words) {
        //fade existing tag cloud out
        d3.select(".col.meme-image").selectAll("svg").selectAll("g")
            .transition()
                .duration(1000)
                .style("opacity", 1e-6)
                .remove();
        //render new tag cloud
        d3.select(".col.meme-image").selectAll("svg")
            .append("g")
                 .attr("transform", "translate(" + parseInt(parentWidth) / 2 + "," + parseInt(parentHeight) / 2 + ")")
                .selectAll("text")
                .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return ((d.size) * 1) + "px"; })
            .style("font-family", "Roboto")
            .style("font-weight", "bold")
            .style("fill", function(d, i){ return "white" })
            // .style("fill", function(d, i) {console.log(d.size); return (d.size > MAX_SIZE / 2) ? "#ee3322" : "#FFF600"; })
            .style("opacity", 1e-6)
            .style("stroke-width", "1.5px")
            .style("stroke", "black")
            // .style("stroke", function(d, i){console.log(d.size); return (d.size > MAX_SIZE / 2) ? "#FFF600" : "#ee3322"; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .text(function(d) { return d.text; });
      }

    //ajax call
    function get_words() {
        
        var deferredData = new jQuery.Deferred();

        $.ajax({
          url: '/data',
          type: 'GET',
          dataType: 'json',
          success: function(data){
            // alert(data);
            //make ajax call
            deferredData.resolve(data);
          }, 
          complete: function(xhr, textStatus){
            console.log("Finished" + xhr);
            console.log(results);
            mycloud.stop().words(results).start();
          },
          error: function(error){
            console.warn("error");
          }
        })
        console.log("Testing" + deferredData);
        return deferredData;
        
    };

    //create SVG container
    d3.select(".col.meme-image").append("svg")
        .attr("width", parentWidth)
        .attr("height", parentHeight);

    //render first cloud
    var wordDeferred = get_words();


        $.when(wordDeferred).done(function(data){
                // Remove old SVG element and children elements
                d3.select('.col.meme-image div.preloader-wrapper.active').remove();
                d3.select('#subtitle').text('');
                if(countClicks > 1){
                    d3.select(".col.meme-image").select("svg").remove();
                }
                  d3.select('.col.meme-image').style("background", "url(" + data.img + ")");
                  d3.select('#subtitle').append('a').attr('href', data.url).attr('target', '_blank').style('color', '#666666').text(data.title);
                  // console.log(d3.select('.col.meme-image'));

                  // console.log(data.cloud.length);
                  if(data.cloud.length >= 30)
                   results = (data.cloud).sort(function(a, b) { return a.size < b.size ? 1 : -1; })
                        .slice(0, 30);
                  else
                    results = (data.cloud).sort(function(a, b){ return a.size < b.size ? 1 : -1; })

                  // var top30 = (data.cloud).slice(0,30);
                  // console.log(results);
                  // for (key in json){
                  //   words_array.push({text: key, size: json[key]})
                  // }
                  //render cloud
        });



    //start streaming
    // var interval = setInterval(function(){get_words()}, 15000);
    });
    
});