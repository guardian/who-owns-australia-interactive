import { numberWithCommas, $, $$, getDimensions } from 'shared/js/util.js'
import { Cartographer } from 'shared/js/cartographer.js'
import legend from "shared/templates/woa.html"

export default function map_3(settings, target) {

  const height = window.innerHeight;

  const ds = document.querySelector(`#${target}`);

  const map_height = height - getDimensions( document.querySelector(`#${target}_title`) )[1]

  ds.style.height = `${map_height}px`;

  const vectorTileStyling = {

      "australia" : function(properties, zoom) {

          var colour = (properties.Category==="Australian") ? '#11b9a7' : (properties.Category==="Unknown") ? '#bb4f35' : '#efca18'

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

  const tooltip = `{{#Owner}}<strong>Name: </strong>{{Name}}<br/><strong>Owner: </strong>{{Owner}}{{/Owner}}{{^Owner}}Ownership unknown{{/Owner}}`

  const tilesURL = `https://interactive.guim.co.uk/embed/aus/tileserver/woa/ownership/{z}/{x}/{y}.pbf`

  const country = new Cartographer(target, tilesURL, vectorTileStyling, map_height, settings, tooltip, legend, 'Local or overseas ownership')

}