/* globals global */

/**
 * Returns the fetch API function, regardless of browser of Node environment.
 * See https://fetch.spec.whatwg.org for more details.
 *
 * @example
 *	fetch('flowers.jpg').then(function(response) {
 *		if(response.ok) {
 *			response.blob().then(function(myBlob) {
 *				var objectURL = URL.createObjectURL(myBlob);
 *				myImage.src = objectURL;
 *			});
 *		} else {
 *			console.log('Network response was not ok.');
 *		}
 *	}).catch(function(error) {
 *		console.log('There has been a problem with your fetch: ' + error.message);
 *	});
 *
 * @param  {String|Object} url    Direct URL string or Request object to fetch
 * @param  {Object} [options]     Options containing custom settings for the request
 *
 * @returns {Function}            Fetch API functionality
 */

let fetchFn, headersObj, requestObj, responseObj;

if (typeof window === 'object') {
	// Web-based environment
	fetchFn = window.fetch;
	headersObj = window.Headers;
	requestObj = window.Request;
	responseObj = window.Response;
} else if (typeof global === 'object') {
	// Node-based environment
	fetchFn = global.fetch;
	headersObj = global.Headers;
	requestObj = global.Request;
	responseObj = global.Response;
}

export default fetchFn;
export {fetchFn as fetch, headersObj as Header, requestObj as Request, responseObj as Response};
