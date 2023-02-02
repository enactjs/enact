import curry from 'ramda/src/curry';

const map = {};

const toLowerCase = (name) => name ? name.toLowerCase() : '';

const forEachObj = curry(function (fn, set) {
	Object.keys(set).forEach(name => fn(name, set[name]));
});

const oneOrArray = curry(function (fn, name, keyCode) {
	if (Array.isArray(keyCode)) {
		keyCode.forEach(fn(name));
	} else {
		fn(name, keyCode);
	}
});

const addOne = curry(function (name, keyCode) {
	name = toLowerCase(name);
	if (name in map) {
		const index = map[name].indexOf(keyCode);
		if (index === -1) {
			map[name].push(keyCode);
		}
	} else if (name) {
		map[name] = [keyCode];
	}
});

const removeOne = curry(function (name, keyCode) {
	name = toLowerCase(name);
	if (name in map) {
		const keys = map[name];
		const index = keys.indexOf(keyCode);
		if (index === -1) {
			delete map[name];
		} else {
			keys.splice(index, 1);
		}
	}
});

const add = oneOrArray(addOne);

const addAll = forEachObj(add);

const remove = oneOrArray(removeOne);

const removeAll = forEachObj(remove);

const is = curry(function (name, keyCode) {
	name = toLowerCase(name);
	return name in map && map[name].indexOf(keyCode) >= 0;
});

export {
	add,
	addAll,
	is,
	remove,
	removeAll
};
