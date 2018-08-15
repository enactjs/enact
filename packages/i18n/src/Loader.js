/* global XMLHttpRequest, ILIB_BASE_PATH, ILIB_RESOURCES_PATH, ILIB_CACHE_ID */

import xhr from 'xhr';

import Loader from '@enact/i18n/ilib/lib/Loader';
import LocaleInfo from '@enact/i18n/ilib/lib/LocaleInfo';
import ZoneInfoFile from '@enact/i18n/src/zoneinfo';

const inProgressRequests = {};

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
			const json = error ? null : JSON.parse(body);
			callback(json, error);
		});
	} else {
		callback(null, new Error('Not a web browser environment'));
	}
};

const getSync = (url, callback) => getImpl(url, callback, true);

const get = (url) => {
	inProgressRequests[url] = inProgressRequests[url] || new Promise((resolve, reject) => {
		getImpl(url, (json, error) => {
			delete inProgressRequests[url];

			if (error) {
				reject(error);
			} else {
				resolve(json);
			}
		}, false);
	});

	return inProgressRequests[url];
};

const iLibBase = ILIB_BASE_PATH;
const iLibResources = ILIB_RESOURCES_PATH;
const cachePrefix = 'ENACT-ILIB-';
const cacheKey = cachePrefix + 'CACHE-ID';
const cacheID = ILIB_CACHE_ID;

function EnyoLoader () {
	this.base = iLibBase;
	// TODO: full enyo.platform implementation for improved accuracy
	if (typeof window === 'object' && typeof window.PalmSystem === 'object') {
		this.webos = true;
	}
}

EnyoLoader.prototype = new Loader();
EnyoLoader.prototype.constructor = EnyoLoader;

EnyoLoader.prototype._createZoneFile = function (path) {
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
 * @returns {undefined}
 */
EnyoLoader.prototype._loadFilesAsync = async function (path, params, cache) {
	console.log('🚀 loading asynchronously', path);

	let _root = iLibResources;
	if (params && typeof params.root !== 'undefined') {
		_root = params.root;
	}
	let cacheItem = cache.data.shift(),
		url;

	if (this.webos && path.indexOf('zoneinfo') !== -1) {
		return this._createZoneFile(path);
	} else if (cacheItem) {
		return cacheItem;
	}

	await this.loadManifests(_root);

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
};

EnyoLoader.prototype._loadFilesCache = function (_root, paths) {
	this._validateCache();
	if (typeof window !== 'undefined' && window.localStorage && paths.length > 0) {
		let stored = window.localStorage.getItem(cachePrefix + _root + '/' + paths[0]);
		if (stored) {
			const target = JSON.stringify(paths);
			const data = JSON.parse(stored);
			if (data.target === target) {
				return data.value;
			} else {
				window.localStorage.removeItem(cachePrefix + _root + '/' + paths[0]);
			}
		}
	}
	return new Array(paths.length);
};

EnyoLoader.prototype._storeFilesCache = function (_root, paths, data) {
	if (typeof window !== 'undefined' && window.localStorage && paths.length > 0) {
		let target = JSON.stringify(paths);
		window.localStorage.setItem(cachePrefix + _root + '/' + paths[0], JSON.stringify({target: target, value: data}));
	}
};

EnyoLoader.prototype._validateCache = function () {
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

EnyoLoader.prototype.loadFiles = function (paths, sync, params, callback) {
	let _root = (params && typeof params.root !== 'undefined') ? params.root : iLibResources;
	let cache = {data: this._loadFilesCache(_root, paths)};
	if (sync) {
		let ret = [];
		let locdata = this._pathjoin(this.base, 'locale');
		// synchronous
		paths.forEach(function (path, index) {
			console.log('loading synchronously', path);
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

				this.loadManifestsSync(_root);

				if (this.isAvailable(_root, path, true)) {
					getSync(this._pathjoin(_root, path), handler);
				}

				if (!found && this.isAvailable(locdata, path, true)) {
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
	}

	// asynchronous
	Promise.all(paths.map(path => this._loadFilesAsync(path, params, cache))).then(results => {
		if (cache.update) {
			this._storeFilesCache(_root, paths, results);
		}
		if (typeof callback === 'function') {
			callback.call(this, results);
		}
	});
};

EnyoLoader.prototype._handleManifest = function (dirpath, filepath, json) {
	// star indicates there was no ilibmanifest.json, so always try to load files from
	// that dir
	if (typeof json === 'object') {
		if (typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.setItem(cachePrefix + filepath, JSON.stringify(json));
		}
		this.manifest[dirpath] = json.files;
	} else {
		this.manifest[dirpath] = '*';
	}

	return this.manifest[dirpath];
};

EnyoLoader.prototype._loadManifest = function (_root, subpath, sync) {
	if (!this.manifest) {
		this.manifest = {};
	}

	const dirpath = this._pathjoin(_root, subpath);
	const filepath = this._pathjoin(dirpath, 'ilibmanifest.json');

	let cachedManifest;
	if (typeof window !== 'undefined' && window.localStorage) {
		cachedManifest = window.localStorage.getItem(cachePrefix + filepath);
	}

	if (cachedManifest) {
		this.manifest[dirpath] = JSON.parse(cachedManifest).files;

		return sync ? this.manifest[dirpath] : Promise.resolve(this.manifest[dirpath]);
	}

	if (sync) {
		getSync(filepath, (json) => {
			if (json) {
				this._handleManifest(dirpath, filepath, json);
			}
		});

		return;
	}

	return get(filepath).then(json => this._handleManifest(dirpath, filepath, json));
};

EnyoLoader.prototype.loadManifests = async function (_root) {
	// load standard manifests
	if (!this.manifest) {
		this._validateCache();
		await this._loadManifest(this.base, 'locale'); // standard ilib locale data
		await this._loadManifest('', iLibResources);     // the app's resources dir
	}

	if (!this.manifest[_root]) {
		// maybe it's a custom root? If so, try to load
		// the manifest file first in case it is there
		await this._loadManifest(_root, '');
	}
};

EnyoLoader.prototype.loadManifestsSync = function (_root) {
	// load standard manifests
	if (!this.manifest) {
		this._validateCache();
		this._loadManifest(this.base, 'locale', true); // standard ilib locale data
		this._loadManifest('', iLibResources, true);     // the app's resources dir
	}

	if (!this.manifest[_root]) {
		// maybe it's a custom root? If so, try to load
		// the manifest file first in case it is there
		this._loadManifest(_root, '', true);
	}
};

EnyoLoader.prototype.isAvailable = function (_root, path) {
	// util.print('enyo loader: isAvailable ' + path + '? ');
	// star means attempt to load everything because there was no manifest in that dir
	if (this.manifest[_root] === '*' || this.manifest[_root].indexOf(path) !== -1) {
		// util.print('true\n');
		return true;
	}

	// util.print('false\n');
	return false;
};

export default EnyoLoader;
export {EnyoLoader as Loader};

