import xhr from 'xhr';

import Loader from '../ilib/lib/Loader';
import ZoneInfoFile from './zoneinfo';
import ilibLocale from '../ilib/locale/ilibmanifest.json';

const get = (url, callback) => {
	if (typeof window === 'object') {
		xhr({url, sync: true}, (err, resp, body) => {
			const error = err || resp.statusCode !== 200 && resp.statusCode;
			const json = error ? null : JSON.parse(body);
			callback(json, error);
		});
	} else {
		callback(null, new Error('Not a web browser environment'));
	}
};

function EnyoLoader () {
	this.base = ilibLocale.path.substring(0, ilibLocale.path.lastIndexOf('/locale'));
	// TODO: enyo.platform
	// if (platform.platformName === 'webos') {
	// 	this.webos = true;
	// }
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
 * @param {Object} context function to call this method in the context of
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
EnyoLoader.prototype._loadFilesAsync = function (context, paths, results, params, callback) {
	let _root = ilibLocale.resources;
	if (params && typeof params.root !== 'undefined') {
		_root = params.root;
	}
	if (paths.length > 0) {
		let path = paths.shift(),
			url;

		if (this.webos && path.indexOf('zoneinfo') !== -1) {
			results.push(this._createZoneFile(path));
		} else {
			if (this.isAvailable(_root, path)) {
				url = this._pathjoin(_root, path);
			} else if (this.isAvailable(this.base + 'locale', path)) {
				url = this._pathjoin(this._pathjoin(this.base, 'locale'), path);
			}

			let resultFunc = (json, err) => {
				// eslint-disable-next-line no-undefined
				results.push(!err && (typeof json === 'object') ? json : undefined);
				if (paths.length > 0) {
					this._loadFilesAsync(context, paths, results, params, callback);
				} else {
					// only the bottom item on the stack will call the callback
					callback.call(context, results);
				}
			};

			if (url) {
				get(url, resultFunc);
			} else {
				// nothing to load, so go to the next file
				resultFunc({});
			}
		}
	}
};

EnyoLoader.prototype.loadFiles = function (paths, sync, params, callback) {
	if (sync) {
		let ret = [];
		let _root = ilibLocale.resources;
		let locdata = this._pathjoin(this.base, 'locale');
		if (params && typeof params.root !== 'undefined') {
			_root = params.root;
		}
		// synchronous
		paths.forEach(function (path) {
			if (this.webos && path.indexOf('zoneinfo') !== -1) {
				ret.push(this._createZoneFile(path));
			} else {
				let found = false;

				const handler = (json, err) => {
					if (!err && typeof json === 'object') {
						ret.push(json);
						found = true;
					}
				};

				if (this.isAvailable(_root, path)) {
					get(this._pathjoin(_root, path), handler);
				}

				if (!found && this.isAvailable(locdata, path)) {
					get(this._pathjoin(locdata, path), handler);
				}

				if (!found) {
					// not there, so fill in a blank entry in the array
					// eslint-disable-next-line no-undefined
					ret.push(undefined);
				}
			}
		}.bind(this));

		if (typeof callback === 'function') {
			callback.call(this, ret);
		}
		return ret;
	}

	// asynchronous
	const results = [];
	this._loadFilesAsync(this, paths, results, params, callback);
};

EnyoLoader.prototype._loadManifest = function (_root, subpath) {
	if (!this.manifest) {
		this.manifest = {};
	}

	const dirpath = this._pathjoin(_root, subpath);
	const filepath = this._pathjoin(dirpath, 'ilibmanifest.json');

	// util.print('enyo loader: loading manifest ' + filepath + '\n');

	const handler = (json, err) => {
		// console.log((!inSender.failed && json ? 'success' : 'failed'));
		// star indicates there was no ilibmanifest.json, so always try to load files from that dir
		this.manifest[dirpath] = (!err && typeof json === 'object') ? json.files : '*';
	};

	get(filepath, handler);
};

EnyoLoader.prototype._loadStandardManifests = function () {
	// util.print('enyo loader: load manifests\n');
	if (!this.manifest) {
		this._loadManifest(this.base, 'locale'); // standard ilib locale data
		this._loadManifest('', ilibLocale.resources);     // the app's resources dir
	}
};

EnyoLoader.prototype.listAvailableFiles = function () {
	// util.print('enyo loader: list available files called\n');
	this._loadStandardManifests();
	return this.manifest;
};

EnyoLoader.prototype.isAvailable = function (_root, path) {
	this._loadStandardManifests();

	if (!this.manifest[_root]) {
		// maybe it's a custom root? If so, try to load
		// the manifest file first in case it is there
		this._loadManifest(_root, '');
	}

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
