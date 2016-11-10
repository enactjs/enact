<section>

## Using the Fetch API

To perform resource requests, developers should use the [Fetch API][fetchApi].

### Why Fetch?

Web browsers are beginning to support the Fetch API (fetch).  For browsers that do not, developers can use a polyfill
([fetch][polyFetch], for example)  Developers can also use modules (such as [isomorphic-fetch][isoFetch]) to ensure their app
code is consistent on both client and server.

The Enact framework provides an isomorphic fetch (`@enact/core/fetch`) for your convenience.

#### Simple Example

##### The Old Way (XMLHttpRequest)

```
	function successHandler(response) {  
	  // do successful response handling
	}
	
	function failureHandler(err) {  
	  // do failure handling
	}
	
	var request = new XMLHttpRequest();  
	request.onload = successHandler;  
	request.onerror = failureHandler;  
	request.open('get', './api/some.json');  
	request.send();
```

##### The New Way (fetch)

```
	fetch('./api/some.json').then(function(response) {
		// do successful response handling
	}).catch(function(err) {
		 // do failure handling
	});
```

### See Also
*   Using Fetch][usingFetchApi] - Mozilla Developer Network

[fetchApi]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[usingFetchApi]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
[polyFetch]: https://github.com/github/fetch
[isoFetch]: https://github.com/matthew-andrews/isomorphic-fetch

</section>