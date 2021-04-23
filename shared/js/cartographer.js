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

export class Cartographer {

    constructor(map, tilesURL, vectorTileStyling, height, settings, tooltip, template, dropdown) {

        var self = this

        this.carto = `${map}`

        this.tilesURL = tilesURL

        this.vectorTileStyling = vectorTileStyling

        this.settings = settings

        this.tooltip = tooltip

        this.template = template

        this.dropdown = dropdown

        this.initMap()

    }

    initMap() {

        var self = this

        this.map = new L.Map(self.carto, { 

            renderer: L.svg(),

            gestureHandling: true

        })

        var zoom = (this.settings.screenWidth < 500) ? 2 : (this.settings.screenWidth < 700) ? 1 : 0 ;

        //this.map.setView(new L.LatLng(coordinates[0].lat, coordinates[0].lng), coordinates[0].zoom - zoom);
        this.map.fitBounds([
          [-44.5748, 111.7309],
          [-8.4289, 155.0171]
        ])

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

        if (self.dropdown === 'Local or overseas ownership' ) {

            legend.addTo(self.map);

        }

        

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