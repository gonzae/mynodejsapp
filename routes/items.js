var express = require('express');
var router = express.Router();
var http = require('http');
var Item = require('../models/item');

/* GET items page. */
router.get('/:search', function(req, res) {

	callback = function(response) {
		var str = '';
		var items = [];

		console.log("[DEBUG] statusCode: " + response.statusCode);

		response.on('data', function (chunk) {
			str += chunk;
		});

		response.on('end', function () {
			var parsedResponse = JSON.parse(str);
			var itemsResponse = parsedResponse.data;

			for(var i in itemsResponse) {
				var itemReq = itemsResponse[i];
				item = new Item(itemReq);
				items.push(item);
			}

			//res.send(items);
			res.render('items', { items: items });

		});

		response.on('error', function(e) {
  			console.log("[ERROR] Message: " + e.message);
		});

	}

	http.get("http://api-v2.olx.com/items?location=www.olx.com.ar&searchTerm=" + req.params.search, callback).end();

});

module.exports = router;