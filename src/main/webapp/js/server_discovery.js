// $(document).ready(function () {
//     $.ajax({
//         method: 'GET',
//         url: _config.api.invokeUrl,
//         success: drawGraphs,
//         error: function ajaxError(jqXHR) {
//             console.error('Response: ', jqXHR.responseText);
//             alert('An error occurred:\n' + jqXHR.responseText);
//         }
//     });
// });

$(document).ready(function () {
    d3.json("groups.json", function (error, treeData) {
        if (treeData.length > 0) {
            drawGraphs(treeData);
        }
    });
});

function drawGraphs(data) {
    var fullSizeInPercent = 100;
    var fullWidthInPixel = $(window).width();
    var fullHeightInPixel = $(window).height();
    
    var groups = Object.keys(data);
    var numberOfGraphs = groups.length;
    var oneGraphHeightInPercent = fullSizeInPercent / numberOfGraphs;
    var oneGraphHeightInPixel = fullHeightInPixel / numberOfGraphs;
    
    
    for (var index = 0; index < numberOfGraphs; index++) {
        var nameOfGroup = groups[index];
        var root = data[nameOfGroup]["entryPoint"];
        draw(root, oneGraphHeightInPercent + '%', fullWidthInPixel, oneGraphHeightInPixel);
    }
}


function draw(root, heightInPercent, widthInPixel, heightInPixel) {
    var i = 0;
    var circleSize = 20;
    var arrowSize = circleSize / 2;
    
    var tree = d3.layout.tree()
                 .size([heightInPixel, widthInPixel]);
    
    var diagonal = d3.svg.diagonal()
                     .projection(function (d) {
                         return [d.y, d.x];
                     });
    
    var svg = d3.select("body")
                .append("svg")
                .attr("height", heightInPercent);
    
    var marker = svg.append('svg:defs')
                    .append('svg:marker')
                    .attr('id', 'start-arrow');
    
    var markerPath = marker.append("svg:path");
    
    
    setMarkerStyle(marker, circleSize, arrowSize);
    setMarkerPathStyle(markerPath, circleSize, arrowSize);
    
    var graph = svg.append("g");
    svg.select('g').style('transform', "translate(0px,-" + heightInPixel / 2 + "px)");
    
    
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
    
    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 180;
    });
    
    // Declare the nodes…
    var node = graph.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });
    
    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });
    
    nodeEnter.append("circle")
             .attr("r", circleSize);
    
    nodeEnter.append("text")
             .attr("id", "nodeName")
             .attr("x", -circleSize)
             .attr("y", -2 * circleSize)
             .attr("dy", ".35em")
             .text(function (d) {
                 return d.name;
             })
             .style("fill-opacity", 1);
    
    // Declare the links…
    var link = graph.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    });
    
    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal)
        .attr("style", "marker-start: url(\"#start-arrow\");");
}

function setMarkerStyle(markerElement, circleSize, markerSize) {
    var viewBoxAttrValue = '0 -' + circleSize / 2 + ' ' + circleSize + ' ' + circleSize;
    markerElement.attr('viewBox', viewBoxAttrValue)
                 .attr('refX', -2 * markerSize)
                 .attr('markerWidth', markerSize)
                 .attr('markerHeight', markerSize)
                 .attr('orient', 'auto');
}

function setMarkerPathStyle(markerPathElement, circleSize, markerSize) {
    var dAttrValue = 'M' + 2 * circleSize + ',-' + 2 * markerSize + 'L0,0L' + circleSize + ',' + circleSize / 2;
    markerPathElement.attr('d', dAttrValue)
                     .attr('fill', '#000');
}
