var EventEmitter = require('../node_modules/mako-event-emitter/build/EventEmitter');

/**
 * Emits a 'navigation' event when the URL fragment changes and
 * it matches a predefined route. Example usage:
 * ```javascript
 * var router = new Router({
 *   '/user/:id/login': function (id) { ... },	
 *   '/commit/:hash/file/:file': function (hash, file) { ... }
 * });
 *
 * router.on('navigate', function (fn) {
 *   fn();
 * });
 * ```
 *
 * @param {object} routes - pairing of paths like '/hi/:mom' to 
 *	functions that handle the route
 */
var Router = function (routes) {
	var replacer = /:[^\s/]+/g,
		replacement = '([\\w-]+)',
		instance = this,
		path;

	this.routes = [];
	this.interval = null;
	this.lastHash = this.getHash();

	for(path in routes) {
		this.routes.push({
			regexp: new RegExp(replacer, replacement),
			fn: routes[path]
		});
	}
	
	if(window.hasOwnProperty('onhashchange')) {
		window.onhashchange = function () {
			instance.lastHash = instance.getHash();
			return instance.onHashChange();
		};
	}
	else {
		this.interval = setInterval(function () {
			var newHash = instance.getHash();
			if(newHash !== instance.lastHash) {
				instance.lastHash = newHash;
				return instance.onHashChange();
			}
		});
	}
};

Router.prototype = new EventEmitter();

/**
 * Fired when a hash change is detected
 *
 * @private
 */
Router.prototype.onHashChange = function () {
	var result,
		route,
		i;

	for(i=0; i<this.routes.length; i++) {
		route = this.routes[i];
		result = this.lastHash.match(route.regexp);
		if(result) {
			this.emit.apply(this, ['navigate'].concat(result));
		}
	}
};

/**
 * Browser-safe method which returns the current URL fragment
 *
 * @return {string}
 */
Router.prototype.getHash = function () {
	var href = window.location.href,
		i = href.indexOf('#');

	if(i <= 0) {
		return '';
	}
	else {
		return href.substring(i + 1);
	}
};

/**
 * Navigate to a specific URL fragment, optionally replacing
 * the current entry in the browser's history.
 *
 * @param {string} hash - The URL hash to navigate to
 * @param {boolean} [replace=false]
 */
Router.prototype.navigate = function (hash, replace) {
	if(replace === undefined) {
		replace = false;
	}

	if(replace) {
		window.location.replace(hash);
	}
	else {
		window.location.assign(hash);
	}
};


/* global module */
module.exports = Router;