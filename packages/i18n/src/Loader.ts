/* global XMLHttpRequest, ILIB_BASE_PATH, ILIB_RESOURCES_PATH, ILIB_ADDITIONAL_RESOURCES_PATH, ILIB_CACHE_ID */

import {memoize} from '@enact/core/util';
import Loader from 'ilib/lib/Loader';
import LocaleInfo from 'ilib/lib/LocaleInfo';
import xhr from 'xhr';

import ZoneInfoFile from './zoneinfo';
import type {IlibZoneInfo} from '../types/IlibZoneInfo';

type LoadCallback = (json: any, error?: unknown) => void;

interface LoadParams {
	/** Deprecated resource root override; to be removed in future */
	root?: string;
	[key: string]: unknown;
}

interface FilesCache {
	data: any[];
	update?: boolean;
}

type ManifestEntry = string[] | '*';

const getImpl = (url: string, callback: LoadCallback, sync?: boolean) => {
	if (typeof XMLHttpRequest !== 'undefined') {
		xhr.XMLHttpRequest = XMLHttpRequest || xhr.XMLHttpRequest;
		let req: XMLHttpRequest | undefined;
		xhr({url, sync, beforeSend: (r) => (req = r)}, (err, resp, body) => {
			let error: unknown = err || resp.statusCode !== 200 && resp.statusCode;
			// false failure from chrome and file:// urls
			if (error && req && req.status === 0 && req.response.length > 0) {
				body = req.response;
				error = false;
			}

			let json = null;
			try {
				json = error ? null : JSON.parse(body);
			} catch {
				error = 'Failed to parse ILIB JSON data';
			}

			callback(json, error);
		});
	} else {
		callback(null, new Error('Not a web browser environment'));
	}
};

const getSync = (url: string, callback: LoadCallback) => getImpl(url, callback, true);

// @enact/core's memoize doesn't preserve its argument's type (it's typed via the generic,
// any-collapsing `Callback`), so the annotation here restores what memoize erases
const get: (url: string) => Promise<any> = memoize((url: string) => new Promise<any>((resolve, reject) => {
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

function setLocalStorageItem (keyName: string, keyValue: string) {
	const regex = new RegExp(`${cachePrefix}${iLibResources}/([a-z]{2,3}/)+[a-z]+.json`);
	try {
		window.localStorage.setItem(keyName, keyValue);
	} catch {
		Object.keys(window.localStorage).forEach((key) => {
			if (regex.test(key) && !key.includes(keyName.slice(0, keyName.lastIndexOf('/')))) {
				window.localStorage.removeItem(key);
			}
		});
		window.localStorage.setItem(keyName, keyValue);
	}
}

class EnactLoader extends Loader {
	base: string;
	webos?: boolean;
	manifest?: {[dirpath: string]: ManifestEntry};
	private _cacheValidated?: boolean;

	constructor () {
		super();
		this.base = iLibBase;
		// TODO: full enact.platform implementation for improved accuracy
		if (typeof window === 'object' && typeof (window.webOSSystem ?? window.PalmSystem) === 'object') {
			this.webos = true;
		}
	}

	_createZoneFile (path: string): IlibZoneInfo | undefined {
		let zone = path.substring(path.indexOf('zoneinfo'));

		// remove the .json suffix to get the name of the zone
		zone = zone.substring(0, zone.length - 5);

		try {
			const zif = new ZoneInfoFile('/usr/share/' + zone);

			// only get the info for this year. Later we can get the info
			// for any historical or future year too
			return zif.getIlibZoneInfo(new Date());
		} catch {
			// no file, so just return nothing
		}
	}

	_pathjoin (_root: string | undefined, subpath: string): string {
		if (!_root || !_root.length) {
			return subpath;
		}
		if (!subpath || !subpath.length) {
			return _root;
		}
		return _root + (_root.charAt(_root.length - 1) !== '/' ? '/' : '') + subpath;
	}

	/**
	 * Load a file asynchronously. Used by `loadFiles()`, which creates a queue
	 * of files that are either resolved from the cache or loaded serially.
	 *
	 * @param {string} path relative path for a required locale data file
	 * @param {Object} params An object full of parameters that the caller is passing to this
	 *	function to help load the files
	 * @param {Object} cache Cache lookup results for the requested paths; consumed one entry per
	 *	call
	 * @param {string} [rootPath] Custom resource root path
	 *
	 * @returns {Promise|Object} Resolves with the file contents, or the zone info object for
	 *	webOS zoneinfo paths
	 */
	_loadFilesAsync (path: string, params: LoadParams | undefined, cache: FilesCache, rootPath?: string): Promise<any> | IlibZoneInfo | undefined {
		let _root = iLibResources;
		if (typeof rootPath !== 'undefined') {
			_root = rootPath;
		} else if (params && typeof params.root !== 'undefined') {
			_root = params.root; // Deprecated; to be removed in future
		}
		let cacheItem = cache.data.shift();
		let url: string | undefined;

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
	}

	_loadFilesCache (_root: string, paths: string[]): any[] {
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
	}

	_storeFilesCache (_root: string, paths: string[], data: any[]) {
		if (typeof window !== 'undefined' && window.localStorage && paths.length > 0) {
			let target = JSON.stringify(paths);
			setLocalStorageItem(cachePrefix + _root + '/' + paths[0], JSON.stringify({target: target, value: data}));
		}
	}

	_clearStringsCache () {
		if (typeof window !== 'undefined' && window.localStorage) {
			// Remove cache of app's strings
			for (let i = 0; i < window.localStorage.length; i++) {
				const currentKey = window.localStorage.key(i);
				if (currentKey !== null && currentKey.includes('strings.json')) {
					window.localStorage.removeItem(currentKey);
				}
			}
		}
	}

	_validateCache () {
		if (!this._cacheValidated && typeof window !== 'undefined' && window.localStorage) {
			let activeID = window.localStorage.getItem(cacheKey);
			if (activeID !== cacheID) {
				for (let i = 0; i < window.localStorage.length; i++) {
					let key = window.localStorage.key(i);
					if (key !== null && key.indexOf(cachePrefix) === 0) {
						window.localStorage.removeItem(key);
						i--;
					}
				}
				setLocalStorageItem(cacheKey, cacheID);
			}
		}
		this._cacheValidated = true;
	}

	loadFiles (paths: string[], sync?: boolean, params?: LoadParams, callback?: (results: any[]) => void, rootPath?: string): any[] | undefined {
		let _root = iLibResources;
		if (typeof rootPath !== 'undefined') {
			_root = rootPath;
		} else if (params && typeof params.root !== 'undefined') {
			_root = params.root; // Deprecated; to be removed in future
		}

		if (sync) {
			this.loadManifestsSync(_root);
			if (this.addPaths && Array.isArray(this.addPaths)) {
				for (let addedRoot of this.addPaths) {
					this.loadManifestsSync(addedRoot);
				}
			}

			let cache: FilesCache = {data: this._loadFilesCache(_root, paths)};
			let ret: any[] = [];
			let locdata = this._pathjoin(this.base, 'locale');
			// synchronous
			paths.forEach((path, index) => {
				if (this.webos && path.indexOf('zoneinfo') !== -1) {
					ret.push(this._createZoneFile(path));
				} else if (cache.data[index]) {
					ret.push(cache.data[index]);
				} else {
					let found = false;

					const handler: LoadCallback = (json, err) => {
						if (!err && typeof json === 'object') {
							cache.update = true;
							ret.push(json);
							found = true;
						}
					};

					const handleAdditionalResourcesPath: LoadCallback = (json, err) => {
						if (!err && typeof json === 'object') {
							if (found) {
								// Overwrite the _root/path result
								Object.assign(ret[ret.length - 1], json);
							} else {
								// This case is where the file is only in the additional resources path
								cache.update = true;
								ret.push(json);
								found = true;
							}
						}
					};

					if (this.isAvailable(_root, path)) {
						getSync(this._pathjoin(_root, path), handler);
					}

					if (this.addPaths && Array.isArray(this.addPaths) && index === paths.length - 1) {
						for (let addedRoot of this.addPaths) {
							for (let i = 0; i <= index; i++) {
								if (this.isAvailable(addedRoot, paths[i])) {
									getSync(this._pathjoin(addedRoot, paths[i]), handleAdditionalResourcesPath);
								}
							}
						}
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
			});

			if (cache.update) {
				this._storeFilesCache(_root, paths, ret);
			}
			if (typeof callback === 'function') {
				callback.call(this, ret);
			}
			return ret;
		} else {
			// asynchronous
			let cache: FilesCache = {data: this._loadFilesCache(_root, paths)};

			Promise.all(paths.map(path => this._loadFilesAsync(path, params, cache, rootPath))).then(results => {
				if (cache.update) {
					this._storeFilesCache(_root, paths, results);
				}
				if (typeof callback === 'function') {
					callback.call(this, results);
				}
			});
		}
	}

	_handleManifest (dirpath: string, filepath: string, json: any): ManifestEntry {
		const isAdditionalPath = typeof ILIB_ADDITIONAL_RESOURCES_PATH !== 'undefined' ? dirpath.includes(ILIB_ADDITIONAL_RESOURCES_PATH) : false;
		// star indicates there was no ilibmanifest.json, so always try to load files from
		// that dir
		if (json != null) {
			if (typeof window !== 'undefined' && window.localStorage) {
				setLocalStorageItem(cachePrefix + filepath, JSON.stringify(json));
			}

			// Need to clear string cache
			this._clearStringsCache();

			this.manifest![dirpath] = json.files;
		} else if (isAdditionalPath) {
			// If the path is an ilib additional resources path and json is null then make it null
			// so that we prevent loading everything.
			this.manifest![dirpath] = [];
			if (typeof window !== 'undefined' && window.localStorage) {
				setLocalStorageItem(cachePrefix + filepath, JSON.stringify({[timeStampKey]: new Date().getTime()}));
			}
		} else {
			this.manifest![dirpath] = '*';
		}

		return this.manifest![dirpath];
	}

	_validateManifest (cachedManifest: string | null | undefined, filepath: string, sync?: boolean): boolean {
		if (cachedManifest) {
			const cachedTimeStamp = JSON.parse(cachedManifest)[timeStampKey];
			if (cachedTimeStamp) {
				let newManifest: any;
				if (sync) {
					getSync(filepath, (json) => {
						newManifest = json;
					});
				} else {
					get(filepath).then(json => {
						newManifest = json;
					});
				}
				if (newManifest === null && typeof ILIB_ADDITIONAL_RESOURCES_PATH !== 'undefined' && filepath.includes(ILIB_ADDITIONAL_RESOURCES_PATH)) {
					// If new manifest is null and the filepath has ILIB_ADDITIONAL_RESOURCES_PATH,
					// meaning we need to clear string cache
					this._clearStringsCache();

					return false;
				} else if (newManifest && newManifest[timeStampKey]) {
					// If new manifest has timestamp, compare old one and see if it's the same
					return (cachedTimeStamp === newManifest[timeStampKey]);
				} else {
					return false;
				}
			} else {
				// Use cachedManifest as usual
				return true;
			}
		}

		return false;
	}

	_loadManifest (_root: string, subpath: string, sync?: boolean): ManifestEntry | Promise<ManifestEntry> | undefined {
		if (!this.manifest) {
			this.manifest = {};
		}

		const dirpath = this._pathjoin(_root, subpath);
		const filepath = this._pathjoin(dirpath, 'ilibmanifest.json');

		let cachedManifest: string | null | undefined;
		if (typeof window !== 'undefined' && window.localStorage) {
			cachedManifest = window.localStorage.getItem(cachePrefix + filepath);
		}

		if (this._validateManifest(cachedManifest, filepath, sync)) {
			this.manifest![dirpath] = JSON.parse(cachedManifest!).files;

			return sync ? this.manifest![dirpath] : Promise.resolve(this.manifest![dirpath]);
		}

		if (sync) {
			getSync(filepath, (json) => {
				this._handleManifest(dirpath, filepath, json);
			});

			return;
		}

		return get(filepath).then(json => this._handleManifest(dirpath, filepath, json));
	}

	loadManifests (_root: string): Promise<unknown[]> {
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
	}

	loadManifestsSync (_root: string) {
		// load standard manifests
		if (!this.manifest) {
			this._validateCache();
			this._loadManifest(this.base, 'locale', true); // standard ilib locale data
			this._loadManifest('', iLibResources, true);     // the app's resources dir
		}

		if (!this.manifest![_root]) {
			// maybe it's a custom root? If so, try to load
			// the manifest file first in case it is there
			this._loadManifest(_root, '', true);
		}
	}

	isAvailable (_root: string, path: string): boolean {
		// util.print('enact loader: isAvailable ' + path + '? ');
		// star means attempt to load everything because there was no manifest in that dir
		if (this.manifest![_root] === '*' || (this.manifest![_root] && this.manifest![_root].indexOf(path) !== -1)) {
			// util.print('true\n');
			return true;
		}

		// util.print('false\n');
		return false;
	}
}

export default EnactLoader;
export {EnactLoader as Loader};
