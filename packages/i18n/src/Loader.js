/* global XMLHttpRequest, ILIB_BASE_PATH, ILIB_RESOURCES_PATH, ILIB_ADDITIONAL_RESOURCES_PATH, ILIB_CACHE_ID */

import {memoize} from '@enact/core/util';
import Loader from 'ilib/lib/Loader';
import LocaleInfo from 'ilib/lib/LocaleInfo';
import xhr from 'xhr';

import ZoneInfoFile from './zoneinfo';

const getImpl = (url, callback, sync) => {
	if (typeof XMLHttpRequest !== 'undefined') {
		xhr.XMLHttpRequest = XMLHttpRequest || xhr.XMLHttpRequest;
		let req;
		xhr({url, sync, beforeSend: (r) => (req = r)}, (err, resp, body) => {
			let error = err || resp.statusCode !== 200 && resp.statusCode;
			// false failure from chrome and file:// urls
			if (error && req.status === 0 && req.response.length > 0) {
				body = req.response;
				error = false;
			}

			let json = null;
			try {
				json = error ? null : JSON.parse(body);
			} catch (e) {
				error = 'Failed to parse ILIB JSON data';
			}

			callback(json, error);
		});
	} else {
		callback(null, new Error('Not a web browser environment'));
	}
};

const getSync = (url, callback) => getImpl(url, callback, true);

const get = memoize((url) => new Promise((resolve, reject) => {
	getImpl(url, (json, error) => {
		if (error) {
			reject(error);
		} else {
			resolve(json);
		}
	}, false);
}));

const iLibBase = typeof ILIB_BASE_PATH === 'undefined' ? '/ilib' : ILIB_BASE_PATH;
const iLibResources = typeof ILIB_RESOURCES_PATH === 'undefined' ? '/locale' : ILIB_RESOURCES_PATH;
const cachePrefix = 'ENACT-ILIB-';
const cacheKey = cachePrefix + 'CACHE-ID';
const cacheID = typeof ILIB_CACHE_ID === 'undefined' ? '$ILIB' : ILIB_CACHE_ID;
const timeStampKey = 'l10n_timestamp';
const ILIB_ADDITIONAL_RESOURCES_PATH = 'resources_0';

function EnyoLoader () {
	console.log("EnyoLoader creator!!");
	this.base = iLibBase;
	// TODO: full enyo.platform implementation for improved accuracy
	if (typeof window === 'object' && typeof window.PalmSystem === 'object') {
		this.webos = true;
	}
}

EnyoLoader.prototype = new Loader();
EnyoLoader.prototype.constructor = EnyoLoader;

EnyoLoader.prototype._createZoneFile = function (path) {
	console.log("EnyoLoader.prototype._createZoneFile");
	let zone = path.substring(path.indexOf('zoneinfo'));

	// remove the .json suffix to get the name of the zone
	zone = zone.substring(0, zone.length - 5);

	try {
		const zif = new ZoneInfoFile('/usr/share/' + zone);

		// only get the info for this year. Later we can get the info
		// for any historical or future year too
		return zif.getIlibZoneInfo(new Date());
	} catch (e) {
		// no file, so just return nothing
	}
};

EnyoLoader.prototype._pathjoin = function (_root, subpath) {
	if (!_root || !_root.length) {
		return subpath;
	}
	if (!subpath || !subpath.length) {
		return _root;
	}
	return _root + (_root.charAt(_root.length - 1) !== '/' ? '/' : '') + subpath;
};

/**
 * Load the list of files asynchronously. This uses recursion in
 * order to create a queue of files that will be loaded serially.
 * Each layer, starting at the bottom, loads a file and then loads
 * the layer on top of it. The very top file on the stack will have
 * zero files to load, so instead it will be the one to call the
 * callback to notify the caller that all the content is loaded.
 *
 * @param {Array.<string>} paths array of strings containing relative paths for required locale data
 *	files
 * @param {Array} results empty array in which to place the resulting json when it is loaded from a
 *	file
 * @param {Object} params An object full of parameters that the caller is passing to this function
 *	to help load the files
 * @param {function(Array.<Object>)} callback callback to call when this function is finished
 *	attempting to load all the files that exist and can be loaded
 *
 * @returns {Promise}
 */
EnyoLoader.prototype._loadFilesAsync = function (path, params, cache, rootPath) {
	console.log("EnyoLoader.prototype._loadFeilsAsync");
	let _root = iLibResources;
	if (typeof rootPath !== 'undefined') {
		_root = rootPath;
	} else if (params && typeof params.root !== 'undefined') {
		_root = params.root; // Deprecated; to be removed in future
	}
	let cacheItem = cache.data.shift(),
		url;

	if (this.webos && path.indexOf('zoneinfo') !== -1) {
		// TODO: Sort out async zone file loading
		return this._createZoneFile(path);
	} else if (cacheItem) {
		return Promise.resolve(cacheItem);
	}

	return this.loadManifests(_root).then(() => {
		const isRootAvailable = this.isAvailable(_root, path);
		if (isRootAvailable) {
			url = this._pathjoin(_root, path);
		} else {
			const localeBase = this._pathjoin(this.base, 'locale');
			const isBaseAvailable = this.isAvailable(localeBase, path);
			if (isBaseAvailable) {
				url = this._pathjoin(localeBase, path);
			}
		}

		if (url) {
			return get(url).then(json => {
				if (typeof json === 'object') {
					cache.update = true;
					return json;
				} else if (path === 'localeinfo.json') {
					return LocaleInfo.defaultInfo;
				}
			});
		}

		return null;
	});
};

EnyoLoader.prototype._loadFilesCache = function (_root, paths) {
	console.log("EnyoLoader.prototype._loadFilesCache ", paths);
	this._validateCache();
	if (typeof window !== 'undefined' && window.localStorage && paths.length > 0) {
		const a = cachePrefix + _root + '/' + paths[0];
		console.log("Will find ", a);
		let stored = window.localStorage.getItem(a);
		console.log("STORED::::: ", stored);
		if (stored) {
			const target = JSON.stringify(paths);
			const data = JSON.parse(stored);
			if (data.target === target) {
				return data.value;
			} else {
				console.log("Should remove from localstorage!!!!! item");
				window.localStorage.removeItem(a);

			}
		}
	}
	return new Array(paths.length);
};

EnyoLoader.prototype._storeFilesCache = function (_root, paths, data) {
	console.log("EnyoLoader.prototype._storeFilesCache");
	if (typeof window !== 'undefined' && window.localStorage && paths.length > 0) {
		let target = JSON.stringify(paths);
		window.localStorage.setItem(cachePrefix + _root + '/' + paths[0], JSON.stringify({target: target, value: data}));
	}
};

EnyoLoader.prototype._clearStringsCache = function () {
	for (let i = 0; i < window.localStorage.length; i++) {
		const currentKey = window.localStorage.key(i);
		console.log(i , ", ", currentKey);
		if (currentKey.includes('strings.json')) {
			console.log("Removing . . . . . . . . . . . . . . . . . . . . . . currentKey ", currentKey);
			window.localStorage.removeItem(currentKey);
		}
	}
	console.log(window.localStorage);
};

EnyoLoader.prototype._validateCache = function () {
	console.log("EnyoLoader.prototype._validateCache");
	if (!this._cacheValidated && typeof window !== 'undefined' && window.localStorage) {
		let activeID = window.localStorage.getItem(cacheKey);
		if (activeID !== cacheID) {
			for (let i = 0; i < window.localStorage.length; i++) {
				let key = window.localStorage.key(i);
				if (key.indexOf(cachePrefix) === 0) {
					window.localStorage.removeItem(key);
					i--;
				}
			}
			window.localStorage.setItem(cacheKey, cacheID);
		}
	}
	this._cacheValidated = true;
};

EnyoLoader.prototype.loadFiles = function (paths, sync, params, callback, rootPath) {
	console.log("EnyoLoader.prototype.loadFiles");
	console.log("rootPaths: ", rootPath);
	let _root = iLibResources;
	if (typeof rootPath !== 'undefined') {
		_root = rootPath;
	} else if (params && typeof params.root !== 'undefined') {
		_root = params.root; // Deprecated; to be removed in future
	}

	if (sync) {
		console.log("ROOOT: ", _root);
		console.log("paths: ", paths);
		this.loadManifestsSync(_root);
		for (let addedRoot of this.addPaths) {
			this.loadManifestsSync(addedRoot);
		}

		let cache = {data: this._loadFilesCache(_root, paths)};

		let ret = [];
		let locdata = this._pathjoin(this.base, 'locale');
		// synchronous
		paths.forEach(function (path, index) {
			if (this.webos && path.indexOf('zoneinfo') !== -1) {
				ret.push(this._createZoneFile(path));
			} else if (cache.data[index]) {
				ret.push(cache.data[index]);
			} else {
				let found = false;

				const handler = (json, err) => {
					if (!err && typeof json === 'object') {
						cache.update = true;
						ret.push(json);
						found = true;
					}
				};

				for (let addedRoot of this.addPaths) {
					if (this.isAvailable(addedRoot, path)) {
						getSync(this._pathjoin(addedRoot, path), handler);
					}
				}

				if (!found && this.isAvailable(_root, path)) {
					getSync(this._pathjoin(_root, path), handler);
				}

				if (!found && this.isAvailable(locdata, path)) {
					getSync(this._pathjoin(locdata, path), handler);
				}

				if (!found) {
					if (path === 'localeinfo.json') {
						// Use default locale info when xhr on root localeinfo.json fails/skips
						ret.push(LocaleInfo.defaultInfo);
					} else {
						// not there, so fill in a blank entry in the array
						// eslint-disable-next-line no-undefined
						ret.push(undefined);
					}
				}
			}
		}.bind(this));

		if (cache.update) {
			this._storeFilesCache(_root, paths, ret);
		}
		if (typeof callback === 'function') {
			callback.call(this, ret);
		}
		return ret;
	} else {
		// asynchronous
		let cache = {data: this._loadFilesCache(_root, paths)};

		Promise.all(paths.map(path => this._loadFilesAsync(path, params, cache))).then(results => {
			if (cache.update) {
				this._storeFilesCache(_root, paths, results);
			}
			if (typeof callback === 'function') {
				callback.call(this, results);
			}
		});
	}
};

EnyoLoader.prototype._handleManifest = function (dirpath, filepath, json) {
	console.log("EnyoLoader.prototype._handleManifest");
	const isAdditionalPath = dirpath.includes(ILIB_ADDITIONAL_RESOURCES_PATH);
	// star indicates there was no ilibmanifest.json, so always try to load files from
	// that dir
	if (json != null) {
		if (typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.setItem(cachePrefix + filepath, JSON.stringify(json));
		}
		// Need to clear string cache
		this._clearStringsCache();

		this.manifest[dirpath] = json.files;
	} else if (isAdditionalPath) {
		// If the path is an ilib additional resources path and json is null then make it null
		// so that we prevent loading everything.
		this.manifest[dirpath] = [];
		if (typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.setItem(cachePrefix + filepath, JSON.stringify({[timeStampKey]: new Date().getTime()}));
		}
	} else {
		this.manifest[dirpath] = '*';
	}

	return this.manifest[dirpath];
};

EnyoLoader.prototype._validateManifest = function (cachedManifest, filepath, sync) {
	/* isif (!this.webos) {
		return cachedManifest;
	}*/

	if (cachedManifest) {
		const cachedTimeStamp = JSON.parse(cachedManifest)[timeStampKey];
		if (cachedTimeStamp) {
			let newManifest;
			if (sync) {
				getSync(filepath, (json) => {
					newManifest = json;
				});
			} else {
				get(filepath).then(json => {
					newManifest = json;
				});
			}
			console.log("new manifest: " + JSON.stringify(newManifest));
			if (newManifest === null && filepath.includes(ILIB_ADDITIONAL_RESOURCES_PATH)) {
				// If new manifest is null and the filepath has ILIB_ADDITIONAL_RESOURCES_PATH,
				// meaning we need to clear string cache
				this._clearStringsCache();

				return false;
			} else if (newManifest[timeStampKey]) {
				// If new manifest has timestamp, compare old one and see if it's the same
				return (cachedTimeStamp === newManifest[timeStampKey]);
			} else {
				console.log("There is no timestampkey!!! ");
				return false;
			}
		} else {
			// Use cachedManifest as usual
			return true;
		}
	}

	return false;
};

EnyoLoader.prototype._loadManifest = function (_root, subpath, sync) {
	if (!this.manifest) {
		this.manifest = {};
	}

	const dirpath = this._pathjoin(_root, subpath);
	const filepath = this._pathjoin(dirpath, 'ilibmanifest.json');
	console.log("EnyoLoader.prototype._loadManifest", filepath);
	console.log("EnyoLoader.prototype._loadManifest", dirpath);
	/* if (!this.webos && this.manifest[dirpath]) {
		return;
	}*/

	let cachedManifest;
	if (typeof window !== 'undefined' && window.localStorage) {
		cachedManifest = window.localStorage.getItem(cachePrefix + filepath);
	}

	if (this._validateManifest(cachedManifest, filepath, sync)) {
		this.manifest[dirpath] = JSON.parse(cachedManifest).files;

		return sync ? this.manifest[dirpath] : Promise.resolve(this.manifest[dirpath]);
	}

	if (sync) {
		getSync(filepath, (json) => {
			this._handleManifest(dirpath, filepath, json);
		});

		return;
	}

	return get(filepath).then(json => this._handleManifest(dirpath, filepath, json));
};

EnyoLoader.prototype.loadManifests = function (_root) {
	console.log("EnyoLoader.prototype.loadManifests");
	this._validateCache();
	return Promise.all([
		// standard ilib locale data
		this._loadManifest(this.base, 'locale'),
		// the app's resources dir
		this._loadManifest('', iLibResources),
		// maybe it's a custom root? If so, try to load
		// the manifest file first in case it is there
		this._loadManifest(_root, '')
	]);
};

EnyoLoader.prototype.loadManifestsSync = function (_root) {
	console.log("EnyoLoader.prototype.loadManifestsSync", _root);
	// load standard manifests
	if (!this.manifest) {
		console.log("!this.manifest");
		this._validateCache();
		this._loadManifest(this.base, 'locale', true); // standard ilib locale data
		this._loadManifest('', iLibResources, true);     // the app's resources dir
	}

	if (!this.manifest[_root]) {
		console.log("!this.manifest[_root]");
		// maybe it's a custom root? If so, try to load
		// the manifest file first in case it is there
		this._loadManifest(_root, '', true);
	}
};

EnyoLoader.prototype.isAvailable = function (_root, path) {
	console.log("EnyoLoader.prototype.isAvailable");
	// util.print('enyo loader: isAvailable ' + path + '? ');
	// star means attempt to load everything because there was no manifest in that dir
	if (this.manifest[_root] === '*' || (this.manifest[_root] && this.manifest[_root].indexOf(path) !== -1)) {
		// util.print('true\n');
		return true;
	}

	// util.print('false\n');
	return false;
};

export default EnyoLoader;
export {EnyoLoader as Loader};

