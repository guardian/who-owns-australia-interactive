//if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"s
import * as flubber from "flubber"
import * as d3 from 'd3'

async function animate(colour, path, target) {

  return new Promise(function(resolve, reject) {

    try {

      var array = Array.from(document.querySelectorAll(`.${colour}`)).map(d => d.getAttribute("d"));

      var interpolators = flubber.combine(array, path);

      d3.selectAll(`.${colour}`)
          .data(interpolators)
          .transition()
          .duration(2000)
          .attrTween("d", function(interpolator) { return interpolator; });

      setTimeout(function(){ 

        d3.select(`${target}`).style("display", "block")

      }, 1800);

      setTimeout(function(){ 

        resolve(); 

      }, 2200);
        
    } catch(err) {

      reject(err)

    }

  });

}

async function wrapper() {

  d3.select("#background_map")
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .style("opacity", 0)

  const rose = await animate("pink", "M510.6,944.9c0,102.4-83.1,185.5-185.5,185.5s-185.5-83.1-185.5-185.5s83.1-185.5,185.5-185.5S510.6,842.5,510.6,944.9z", "#one")

  console.log("Pink")

  const bleue = await animate("blue", "M1862.7,940.7c0,136.1-110.4,246.5-246.5,246.5s-246.5-110.4-246.5-246.5s110.4-246.5,246.5-246.5S1862.7,804.6,1862.7,940.7z", "#two")

  console.log("Blue")

  const verte = await animate("green", "M1266.6,941.6c0,180.9-146.6,327.5-327.5,327.5s-327.5-146.6-327.5-327.5s146.6-327.5,327.5-327.5S1266.6,760.8,1266.6,941.6z", "#three")

  console.log("Green")

  return 'end'

}


wrapper().then(message => console.log(message))


