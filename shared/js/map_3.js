import { numberWithCommas, $, $$, getDimensions } from 'shared/js/util.js'
import { Country } from 'shared/js/country.js'
import template from "shared/templates/landuse.html"

export default function map_3(settings, target) {

  const height = window.innerHeight;

  const ds = document.querySelector(`#${target}`);

  const map_height = height - getDimensions( document.querySelector(`#${target}_title`) )[1]

  ds.style.height = `${map_height}px`;

  const vectorTileStyling = {

      "australia" : function(properties, zoom) {

        var colour = (properties.Ownership==="Pastoral") ? '#66c2a5' : 
        (properties.Ownership==="Indigenous") ? '#e78ac3' :
        (properties.Ownership==="Private") ? '#66c2a5' :
        (properties.Ownership==="Public") ? '#8da0cb' :
        (properties.Ownership==="Unknown") ? '#8e8f8f' : "#a6d854" ;

        return {
          fill: true,
          weight: 1,
          fillColor: colour,
          color: 'white',
          fillOpacity: 1,
          opacity: 0.4
        }
      }
  };

  const tooltip = `{{Ownership}}`

  const tilesURL = `https://interactive.guim.co.uk/embed/aus/tileserver/woa/landuse/{z}/{x}/{y}.pbf`

  const country = new Country(target, tilesURL, vectorTileStyling, map_height, settings, tooltip, template)

}