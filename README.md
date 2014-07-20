##API

###Router(routes)
 - `routes` *object* - pairing of paths like '/hi/:mom' to  	functions that handle the route

Emits a &#39;navigation&#39; event when the URL fragment changes and it matches a predefined route. Example usage:

```javascript
var router = new Router({
  &#39;/user/:id/login&#39;: function (id) { ... },    
  &#39;/commit/:hash/file/:file&#39;: function (hash, file) { ... }
});

router.on(&#39;navigate&#39;, function (fn) {
  fn();
});
```

###Router.prototype.navigate(hash, [replace=false])
 - `hash` *string* - The URL hash to navigate to
 - `[replace=false]` *boolean* 

Navigate to a specific URL fragment, optionally replacing the current entry in the browser&#39;s history.

```javascript
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
```
