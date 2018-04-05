function ilibPromise (Resource, constructorArgs = [], opts = {}) {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line no-new
		new Resource(
			...constructorArgs,
			{
				sync: false,
				...opts,
				onLoad: (resource) => {
					if (resource) {
						return void resolve(resource);
					}

					return void reject(resource);
				}
			}
		);
	});
}

export default ilibPromise;
export {
	ilibPromise as promise
};
