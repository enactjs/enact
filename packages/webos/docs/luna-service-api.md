---
title: Luna Service API
---

The [Luna service API](http://webostv.developer.lge.com/api/webos-service-api/) is available on webOS platforms and allows developers to create applications that can
make use of platform features, such as the `Settings Service` or the `Media Database`.

### LS2Request

The Enact framework provides `@enact/webos/LS2Request` for developers to interact with the API.

#### Example

```
	import LS2Request from '@enact/webos/LS2Request';
	
	...
	
	startNetwork = () => {
		// to cancel a request you must store a reference
		this.findNetworkReq = new LS2Request().send({
			service: 'luna://com.webos.service.wifi',
			method: 'findnetworks',
			onSuccess: this.findNetworkSuccess
		});
	}
	
	findNetworkSuccess = (res) => {
		if (res.foundNetworks) {
			this.setState({
				foundNetworks: res.foundNetworks
			});
		}
	}
```
