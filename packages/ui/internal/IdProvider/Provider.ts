interface ProviderEntry {
	id: string;
	onUnmount?: (id: string) => void;
}

let GlobalId = 0;
const ID_KEY = '$$ID$$';

class Provider {
	prefix?: string;
	ids: Record<string, ProviderEntry>;

	constructor (prefix?: string) {
		this.prefix = prefix;
		this.ids = {};
	}

	unload () {
		// Call the onUnmount handler for each generated id (note: not the key)
		for (const key in this.ids) {
			const {id, onUnmount} = this.ids[key];

			if (typeof onUnmount === 'function') {
				onUnmount(id);
			}
		}
	}

	generate = (key: string = ID_KEY, idPrefix: string | undefined = this.prefix, onUnmount?: (id: string) => void): string => {
		// if an id has been generated for the key, return it
		if (key in this.ids) {
			return this.ids[key].id;
		}

		// otherwise generate a new id (with an optional prefix), cache it, and return it
		const id = `${idPrefix}${++GlobalId}`;
		this.ids[typeof key === 'undefined' ? `generated-${id}` : key] = {
			id,
			onUnmount
		};

		return id;
	};
}

export default Provider;
export {
	Provider
};
