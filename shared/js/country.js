// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
//import { Loader, LoaderOptions } from 'google-maps';
import L from 'leaflet'
import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js'
import 'shared/js/L.CanvasOverlay.js'
import 'shared/js/Leaflet.GoogleMutant.js'
import 'shared/js/TileLayer.JSONTiles.js'
import mustache from "shared/js/mustache"
import { GestureHandling } from "leaflet-gesture-handling";
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
//import tippy from 'tippy.js';
import mapstyles from 'shared/js/mapstyles.json'
import coordinates from 'shared/js/coordinates'

/*---------------------- */

export class Country {

    constructor(map, tilesURL, vectorTileStyling, height, settings, tooltip, template) {

        var self = this

        this.carto = `${map}`

        this.tilesURL = tilesURL

        this.vectorTileStyling = vectorTileStyling

        this.settings = settings

        this.tooltip = tooltip

        this.template = template

        this.dropdown = 'Local or overseas ownership'

        this.initMap()

    }

    initMap() {

        var self = this

        this.map = new L.Map(self.carto, { 

            renderer: L.svg(),

            gestureHandling: true

        })

        var zoom = (this.settings.screenWidth < 500) ? 2 : (this.settings.screenWidth < 700) ? 1 : 0 ;

        this.map.setView(new L.LatLng(coordinates[0].lat, coordinates[0].lng), coordinates[0].zoom - zoom);


        this.info = L.control();

        this.info.onAdd = function (map) {

            this._div = L.DomUtil.create('div', 'info infobox');

            this.update('<strong>Who owns Australia</strong>');
            
            return this._div;
        };

        this.info.update = function (html) {

            this._div.innerHTML = html

        };

        this.info.addTo(self.map);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legendary')

            div.innerHTML = self.template

            return div;
        };

        legend.addTo(self.map);

        //tippy('[data-tippy-content]');

        var google = L.gridLayer.googleMutant({

            styles: mapstyles,

        }).addTo(self.map);

        // https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html

        function commas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        var vectorGrid = L.vectorGrid.protobuf(self.tilesURL, {
            
            vectorTileLayerStyles: self.vectorTileStyling,

            interactive: true,

            maxNativeZoom: 12,

            getFeatureId: function(f) {
                return f.properties.id;
            }

        })
        .on('mouseout', function(e) {

            self.info.update(`<strong>Who owns Australia</strong>`);

        })
        .on('mouseover', function(e) {

            var html = mustache(self.tooltip, e.layer.properties)

            if (self.dropdown != 'Local or overseas ownership' ) {

                if (e.layer.properties['Owner rank']<21) {

                    html += `<br/><strong>Size ranking: </strong>${e.layer.properties['Owner rank']}`

                }

                // <br/><strong>Area: </strong>${commas(parseInt(e.layer.properties['Owner area']))

            }

            self.info.update(html);

        }).addTo(self.map);

        var style = {
            fillColor: 'red',
            fillOpacity: 0.5,
            fillOpacity: 1,
            stroke: true,
            fill: true,
            color: 'red',
            opacity: 1,
            weight: 2,
        };

        document.querySelector('#flicker').onchange = (event) => {
            var inputText = event.target.value;
            self.dropdown = inputText
            document.querySelector('.selection-name').innerHTML = inputText
            document.querySelector('.legendary').classList.toggle('hide');

            if (inputText==="Local or overseas ownership") {
                self.ownership(vectorGrid)
            } else {
                self.companies(vectorGrid)
            }


        }

    }

    ownership(vectorGrid) {

        vectorGrid.options.vectorTileLayerStyles.australia = function (properties, zoom) {

          var colour = (properties.Category==="Australian") ? '#11b9a7' : (properties.Category==="Unknown") ? '#bb4f35' : '#efca18'

          return {
            fill: true,
            weight: 1,
            fillColor: colour,
            color: 'white',
            fillOpacity: 1,
            opacity: 0.4
          }
        };
        
        vectorGrid.redraw();

    }

    companies(vectorGrid) {

        var palette = ['#94003a', '#9b013c', '#a2043e', '#a90a41', '#b01144', '#b61746', '#bc1e49', '#c1254c', '#c72b50', '#cc3253', '#d13856', '#d53f5a', '#da465d', '#de4c61', '#e25365', '#e65a69', '#e9606d', '#ed6771', '#f06e75', '#f37479', '#f67b7e', '#f88282', '#fb8987', '#fd8f8c', '#ff9690', '#ff9e96', '#ffa59b', '#ffada0', '#ffb4a6', '#ffbbab', '#ffc2b0', '#ffc9b5', '#ffd0bb', '#ffd7c0', '#ffdec5', '#ffe4cb', '#ffebd0', '#fff2d5', '#fff8db', '#ffffe0']

        vectorGrid.options.vectorTileLayerStyles.australia = function (properties, zoom) {

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
        };

        vectorGrid.redraw();
    }

    resizer() {

        var self = this

        window.addEventListener("resize", function() {

            clearTimeout(document.body.data)

            document.body.data = setTimeout( function() { 

               //self.map_container.style.height = `${window.innerHeight}px`;

            }, 200);

        });

    }

}