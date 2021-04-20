import { numberWithCommas, $, $$, getDimensions } from 'shared/js/util.js'
import { Carto } from 'shared/js/carto.js'
import template from "shared/templates/ownership_map.html"

export default function ownership(settings) {

  const height = window.innerHeight;

  const ds = document.querySelector('#ownership_map_1');

  ds.innerHTML = template

  const map_height = height - getDimensions( document.querySelector('#ownership_map_1_title') )[1] - getDimensions( document.querySelector('.who') )[1]

  ds.style.height = `${map_height}px`;

  const vectorTileStyling = {

      "gain" : {
          weight: 0,
          color: '#0cb9a7',
          opacity: 1,
          fillColor: '#0cb9a7',
          fill: true,
          radius: 0.01,
          fillOpacity: 0.7
      },
      "loss" : {
          weight: 0,
          color: '#fa7600',
          opacity: 1,
          fillColor: '#fa7600',
          fill: true,
          radius: 0.01,
          fillOpacity: 0.7
      }

  };

  const tilesURL = "https://interactive.guim.co.uk/embed/aus/tileserver/ownership"

  const carto = new Carto("map", tilesURL, vectorTileStyling, map_height, settings)  // ID of the map div, location of the tileserver

}