(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Alows subscrubing to events, emitting events. This should
 * generally be used as an object's prototype, instead of a stand
 * alone instance.
 *
 * @constructor
 * @prop {object} listeners - a dynamic map of event 'types' to 
 *	the functions registered to handle those events.
 */
var EventEmitter = function () {
	this.listeners = {};
};

/**
 * Add a handler for a message type 
 *
 * @param {string} type - message type
 * @param {function} fn - handler to add
 */
EventEmitter.prototype.on = function (type, fn, ctx) {
	var wrapped;

	ctx = ctx || this;	
	wrapped = function () {
		fn.apply(ctx, Array.prototype.slice.call(arguments, 0));
	};

	fn.wrapped = wrapped;

	if(!this.listeners[type]) {
		this.listeners[type] = [wrapped];
	}
	else {
		this.listeners[type].push(wrapped);
	}
};

/**
 * Add a handler for a message type which removes itself
 * after a single execution
 *
 * @param {string} type - message type
 * @param {function} fn - handler to add
 */
EventEmitter.prototype.once = function (type, fn, ctx) {
	var wrapped;

	ctx = ctx || this;

	wrapped = function () {
		ctx.off(type, fn);
		fn.apply(ctx, Array.prototype.slice(arguments, 0));
	};

	fn.wrapped = wrapped;

	if(!this.listeners[type]) {
		this.listeners[type] = [wrapped];
	}
	else {
		this.listeners[type].push(wrapped);
	}	
};

/**
 * Remove a handler for a message type 
 *
 * @param {string} type - message type
 * @param {function} fn - handler to remove
 */
EventEmitter.prototype.off = function (type, fn) {
	var index, index2;

	if(this.listeners[type]) {
		index = this.listeners[type].indexOf(fn);
		index2 = this.listeners[type].indexOf(fn.wrapped);
		if(index > -1) {
			this.listeners[type].splice(index, 1);
			return true;
		}
		else if(index2 > -1) {
			this.listeners[type].splice(index2, 1);
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
};

/**
 * Triggers an event of a specific type, with any additional payload 
 * passed.
 *
 * @param {string} type - the type of event to emit
 * @param {...(object|number|string)} payload - Any additional arguments
 *	will be sent to the handlers for this event
 */
EventEmitter.prototype.emit = function (type) {
	var payload = Array.prototype.slice.call(arguments, 1),
		fns = this.listeners[type] || [],
		i;

	for(i=0; i<fns.length; i++) {
		fns[i](payload);
	}
};

module.exports = EventEmitter;
},{}]},{},[1])
},{}],2:[function(require,module,exports){
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
},{"../node_modules/mako-event-emitter/build/EventEmitter":1}]},{},[2])