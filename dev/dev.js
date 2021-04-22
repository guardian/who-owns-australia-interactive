
import * as d3 from 'd3'
import shuffle from 'shared/js/shuffle';

var nodes = []

var fades = []

var shadow = []

var total = 0

var simulation = null

var canvas = document.querySelector("#master")

var width = 920 //window.innerWidth;

var height = 880 // window.innerHeight;

canvas.width = width;

canvas.height = height;

var ctx = canvas.getContext("2d")


var copy_canvas = document.querySelector("#copy")

copy_canvas.width = width;

copy_canvas.height = height;

var copy_ctx = copy_canvas.getContext("2d")


var overlay_canvas = document.querySelector("#overlay")

overlay_canvas.width = width;

overlay_canvas.height = height;

var overlay_ctx = overlay_canvas.getContext("2d")



var projection = d3.geoMercator()
                .scale(1)
                .translate([0,0])

projection.fitSize([width, height], {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[104.671555,-7.237148],[160.569992,-7.237148],[160.569992,-46.833892],[104.671555,-46.833892],[104.671555,-7.237148]]]
        }
    });

var path = d3.geoPath()
            .projection(projection)
            .context(ctx);

function getColour(type) {

    var colours = [ "green", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff" ]

    var licenses = [ "Exploration Tenement", "Production Tenement Application", "Production Tenement", "Exploration Tenement Application", "Retention Tenement", "Exploration Release Area", null ]

    var index = licenses.indexOf(type); 

    return colours[index]

}




var imageData

function drawLGAS() {

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4) {

        // data[i];     // red
        // data[i + 1]; // green
        // data[i + 2]; // blue
        // data[i + 3]; // alpha

        var hex = rgb2hex( data[i], data[i + 1], data[i + 2] )



        if (hex!='#000000' && hex!='#ffffff') {

          //console.log(hex)

          var x = (i / 4) % imageData.width;

          var y = Math.floor((i / 4) / imageData.width);

          var category =  (hex==='#69c3a6') ? 'pap' :
                          (hex==='#92a6cb') ? 'pub' :
                          (hex==='#e78ec3') ? 'ind' : 'dis' ;

          var node = createNode(x, y, category, hex)

          if (category==='dis') {

            fades.push(node)

          } else {

            //console.log("Boom")

            nodes.push(node)

          }

          //if (hex!='#e78ec3' && hex!='#69c3a6') {
            //console.log(hex)
          //}

          //console.log(projection.invert([x,y])) // Get latitude and longitude

        }
    }

    nodes = shuffle(nodes)

    fades = shuffle(fades)

    total = nodes.length

    console.log(fades.length)

    nodele()

    window.requestAnimationFrame(step);

    atomized()

}

function step() {

  nodele()
  
  if (nodes.length > 0) {
    window.requestAnimationFrame(step);
  }
}


function nodele() {

  if (simulation!=null) {

      simulation.stop()

  }

  var cap = (nodes.length > 1000) ? 1000 : nodes.length

  var batch = nodes.slice(0, cap)

  for (var i = 0; i < batch.length; i++) {

    setPixel(imageData, batch[i].x, batch[i].y, 255, 255, 255);

    if (i < batch.length / 10) {

      shadow.push(batch[i])

    }

  }


  var fCap = (fades.length > 1000) ? 1000 : fades.length

  var fBatch = fades.slice(0, fCap)

  console.log(fBatch.length)

  for (var i = 0; i < fBatch.length; i++) {

    setPixel(imageData, fBatch[i].x, fBatch[i].y, 255, 255, 255);

  }

  fades.splice (0, fCap);


  var cluster = shadow.filter( item => { return !(Math.abs(item.x - width / 2) <= 10) && !(Math.abs(item.y - height / 2) <= 10)})

  shadow = cluster

  if (simulation!=null) {

      simulation.nodes(shadow)

  }

  var percentage = 100 / total * ( total - nodes.length)

  overlay_ctx.beginPath();
  overlay_ctx.arc(width / 2, height / 2, percentage / 1.5, 0, 2 * Math.PI, true);
  overlay_ctx.fillStyle = 'green'
  overlay_ctx.fill();

  nodes.splice (0, cap);

  ctx.putImageData(imageData, 0, 0);

  if (simulation!=null) {

    simulation.alpha(0.2).restart();

  }

}

function setPixel(imageData, x, y, r, g, b, a) {
    var index = 4 * (x + y * imageData.width);
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
}


function rgb2hex(r, g, b){
 return "#" +
  ("0" + parseInt(r,10).toString(16)).slice(-2) +
  ("0" + parseInt(g,10).toString(16)).slice(-2) +
  ("0" + parseInt(b,10).toString(16)).slice(-2) ;
}

function createNode(x, y, category, hex) {

  var strength = Math.random() * (-0.1 - -0.3) + -0.3;

  return { 
    radius: 1.5,
    category: category,
    x: x,
    y: y,
    strength: strength,
    colour: hex
  }
}

function atomized() {

  console.log("Hello")

    simulation = d3.forceSimulation(shadow)
      .force('charge', d3.forceManyBody().strength(-1))
      .force('x', d3.forceX().x((d) => width / 2).strength(0.8))
      .force('y', d3.forceY().y((d) => height  / 2).strength(0.8))
      .force('collision', d3.forceCollide().radius((d) => d.radius).iterations(16))
      .alphaDecay(0.001)
      .on('tick', ticked);

    function ticked(){

        copy_ctx.save();

        copy_ctx.clearRect(0, 0, width, height);

        shadow.forEach(function(d, i) {

            copy_ctx.beginPath();
            copy_ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, true);
            copy_ctx.fillStyle = d.colour
            copy_ctx.fill();

        });

        copy_ctx.restore();

    }

    

}


function init() {

    var img = new Image();

    img.onload = function () {

        ctx.drawImage(img, 0, 0, width, height);

        drawLGAS()

    };

    img.src = "<%= path %>/ownership.png";
    
}


init() 

