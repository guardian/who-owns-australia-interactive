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

          var palette = ['#94003a', '#9b013c', '#a2043e', '#a90a41', '#b01144', '#b61746', '#bc1e49', '#c1254c', '#c72b50', '#cc3253', '#d13856', '#d53f5a', '#da465d', '#de4c61', '#e25365', '#e65a69', '#e9606d', '#ed6771', '#f06e75', '#f37479', '#f67b7e', '#f88282', '#fb8987', '#fd8f8c', '#ff9690', '#ff9e96', '#ffa59b', '#ffada0', '#ffb4a6', '#ffbbab', '#ffc2b0', '#ffc9b5', '#ffd0bb', '#ffd7c0', '#ffdec5', '#ffe4cb', '#ffebd0', '#fff2d5', '#fff8db', '#ffffe0']

          var opacity = (properties['Owner rank']!="" && properties['Owner rank']<21) ? 1 : 0 ;

          var colour = (properties['Owner rank']!="" && properties['Owner rank']<21) ? palette[properties['Owner rank']] : 'white'

          return {
            fill: true,
            weight: 1,
            color: 'white',
            fillColor: colour,
            fillOpacity: opacity,
            opacity: opacity
          }
      }

  };

  const tooltip = `{{#Owner}}<strong>Name: </strong>{{Name}}<br/><strong>Owner: </strong>{{Owner}}{{/Owner}}{{^Owner}}Ownership unknown{{/Owner}}`

  const tilesURL = `https://interactive.guim.co.uk/embed/aus/tileserver/woa/ownership/{z}/{x}/{y}.pbf`

  const country = new Cartographer(target, tilesURL, vectorTileStyling, map_height, settings, tooltip, legend, 'Top 20 pastoral owners')

}