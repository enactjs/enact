import hoc from '@enact/core/hoc';
import SkinnableBase from '@enact/ui/Skinnable';

const defaultConfig = {
	skins: {
		dark: 'moonstone',
		light: 'moonstone-light'
	}
};

const Skinnable = hoc(defaultConfig, SkinnableBase);

export default Skinnable;
export {
	Skinnable
};
