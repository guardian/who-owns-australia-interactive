// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
//import { Loader, LoaderOptions } from 'google-maps';
import L from 'leaflet'
import 'shared/js/Leaflet.GoogleMutant.js'
import mapstyles from 'shared/js/mapstyles.json'
import coordinates from 'shared/js/coordinates'
import { GestureHandling } from "leaflet-gesture-handling";
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
import template from "shared/templates/landuse.html"
/*---------------------- */

export class Carto {

    constructor(map, tilesURL, vectorTileStyling, map_height, settings) {

        var self = this

        this.carto = `${map}`

        this.tilesURL = tilesURL

        this.settings = settings

        var maps = document.querySelectorAll(".map_container");

        Array.from(maps).forEach(function(element) {

          element.style.height = `${map_height}px`;

        });

        var map = document.querySelector(`#${map}`);

        map.style.height = `${map_height}px`;

        if (settings.app.isApp) {

        }

        this.initMap()
    }

    initMap() {

        var self = this

        var ownership = L.tileLayer(`${self.tilesURL}/{z}/{x}/{y}.png`, {tms: true, opacity: 1, attribution: "", minZoom: 2, maxZoom: 9})

        this.map = new L.Map(self.carto, { 
            renderer: L.canvas(),
            maxZoom: 12,
            //scrollWheelZoom: false,
            //dragging: true,
            //zoomControl: true,
            //doubleClickZoom: true,
            //zoomAnimation: false,
            //tap: false,
            //keyboard: false,
            //touchZoom: false,
            gestureHandling: true
        })


        var zoom = (this.settings.screenWidth < 500) ? 2 : (this.settings.screenWidth < 700) ? 1 : 0 ;

        //this.map.setView(new L.LatLng(coordinates[0].lat, coordinates[0].lng), coordinates[0].zoom - zoom);

        /*this.map.fitBounds([
          [-32.811571, 113.391738],
          [-11.820931, 153.192672]
        ])*/

        this.map.fitBounds([
          [-44.5748, 111.7309],
          [-8.4289, 155.0171]
        ])


        var styled = L.gridLayer.googleMutant({

            styles: mapstyles

        }).addTo(self.map)

       // var overlays = { "<b style='color:#fa7600; opacity:6.5; vertical-align:text-top;'>⬤</b>&nbsp;Tree ownership": ownership, "<b style='color:#0cb9a7; opacity:6.5; vertical-align:text-top;'>⬤</b>&nbsp;Tree gain": gain }

        //L.control.layers({}, overlays, { collapsed: false, position: 'bottomright', autoZIndex : true }).addTo(self.map);

        ownership.addTo(self.map);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend')

            div.innerHTML = template

            return div;
        };

        legend.addTo(self.map);

        this.resizer()

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