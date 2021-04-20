L.TileLayer.JSONTiles = L.TileLayer.extend({

	jsonTilesDB: null,

	initialize: function(url, options, db) {

		this.jsonTilesDB = db;

		L.Util.setOptions(this, options);
	},
	getTileUrl: function (tilePoint, zoom) {

		var tile = this.jsonTilesDB.find( (item) => {

			return item.x === tilePoint.x && item.y === tilePoint.y && item.z === tilePoint.z

		})

		return (tile) ? tile.base64 : this.jsonTilesDB[0].base64

	},
	_loadTile: function (tile, tilePoint, zoom) {

		this.getTileUrl(tilePoint, zoom);

	}
});

