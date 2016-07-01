// Should be in enyo-core
const hoc = (defaultConfig, hawk) => (config, maybeWrapped) => {
	if (typeof config === 'function') {
		return hawk(defaultConfig, config);
	} else {
		const cfg = Object.assign({}, defaultConfig, config);
		if (typeof maybeWrapped === 'function') {
			return hawk(cfg, maybeWrapped);
		} else {
			return (Wrapped) => hawk(cfg, Wrapped);
		}
	}
};

export default hoc;
export {hoc};
