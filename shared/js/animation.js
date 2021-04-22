import * as flubber from "flubber"
import * as d3 from 'd3'


export default function animation() {

  async function animate(colour, path, target, image) {

    return new Promise(function(resolve, reject) {

      try {

        var array = Array.from(document.querySelectorAll(`.${colour}`)).map(d => d.getAttribute("d"));

        var interpolators = flubber.combine(array, path);

        d3.select(`#${image}`)
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

    const rose = await animate("pink", "M1206.5,283.3c0,113.3-91.8,205.1-205.1,205.1s-205.1-91.8-205.1-205.1S888,78.2,1001.3,78.2S1206.5,170,1206.5,283.3z", "#one", "pink")

    console.log("Pink")

    const bleue = await animate("blue", "M1272.6,1589c0,150.6-122,272.6-272.6,272.6s-272.6-122-272.6-272.6s122-272.6,272.6-272.6S1272.6,1438.5,1272.6,1589z", "#two", "blue")

    console.log("Blue")

    const verte = await animate("green", "M1364.6,900.7c0,200-162.2,362.2-362.2,362.2s-362.2-162.2-362.2-362.2s162.2-362.2,362.2-362.2S1364.6,700.7,1364.6,900.7z", "#three", "green")

    console.log("Green")

    return 'end'

  }


  wrapper().then(message => console.log(message))

}