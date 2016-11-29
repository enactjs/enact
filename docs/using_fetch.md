---
title: Using the Fetch API
---

The [Fetch API][fetchApi] provides a simple, [Promise][promiseAPI]-based API for retrieving remote resources over HTTP. It should be used in place of XMLHttpRequest to better support isomorphic applications. Web browsers are beginning to support the Fetch API (`fetch`) but for maximum compatibility, the Enact framework provides an isomorphic fetch module (`@enact/core/fetch`) which ensures consistent behavior on server and client.

## Simple Example

### The Old Way (XMLHttpRequest)

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

### The New Way (fetch)

```
	fetch('./api/some.json').then(function(response) {
		// do successful response handling
	}).catch(function(err) {
		 // do failure handling
	});
```

## See Also
*   Using [Fetch][usingFetchApi] - Mozilla Developer Network

[fetchApi]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[promiseApi]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[usingFetchApi]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

</section>
