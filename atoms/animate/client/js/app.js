//if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"s


import * as flubber from "flubber"
import * as d3 from 'd3'

async function animate(colour, path, target) {

  return new Promise(function(resolve, reject) {

    try {

      var array = Array.from(document.querySelectorAll(`.${colour}`)).map(d => d.getAttribute("d"));

      var interpolators = flubber.combine(array, path);

      d3.select(`#${colour}`)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 0)


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

  const rose = await animate("pink", "M547,973.9c0,135.1-109.5,244.6-244.6,244.6S57.9,1109,57.9,973.9s109.5-244.6,244.6-244.6 S547,838.8,547,973.9z", "#one")

  console.log("Pink")

  const bleue = await animate("blue", "M1947,973.9c0,75.7-61.3,137-137,137s-137-61.3-137-137s61.3-137,137-137S1947,898.2,1947,973.9z", "#two")

  console.log("Blue")

  const verte = await animate("green", "M1611.1,973.9c0,277.3-224.8,502-502,502s-502-224.8-502-502s224.8-502,502-502S1611.1,696.7,1611.1,973.9z", "#three")

  console.log("Green")

  return 'end'

}

setTimeout(function(){
  wrapper().then(message => console.log(message))
}, 3000);






