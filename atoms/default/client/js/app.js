// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import ownership from "shared/js/ownership"
import map_2 from "shared/js/map_2"
import map_3 from "shared/js/map_3"
import { Loader, LoaderOptions } from 'google-maps';

// https://preview.gutools.co.uk/australia-news/ng-interactive/2021/may/03/who-owns-australia-top-20-private-landholders-own-more-than-all-indigenous-communities

import config from 'shared/settings/settings'
import preflight from 'shared/js/preflight'
const settings = preflight(config)

//import shareable from "shared/js/shareable";

const timer = ms => new Promise(res => setTimeout(res, ms)) 

async function alphabet() {

  return new Promise(function(resolve, reject) {

        try {

		    var loader = new Loader('AIzaSyD8Op4vGvy_plVVJGjuC5r0ZbqmmoTOmKk');

		    loader.load().then(data => resolve(data))

        } catch(e) {

            reject(e);

        }

  });

}

async function load () {

  document.querySelector(".header-share-container").style.display = "none";

  /*

  if (!settings.app.isApp) {

    const share = new shareable(settings.social, settings.app).precheck()

  } else {

    document.querySelector(".header-share-container").style.display = "none";

  }

  */

  await alphabet().then(data => {

    ownership(settings)

    map_2(settings, 'state_ownership')

    map_3(settings, 'biggest_owners')


  })

}

load();

