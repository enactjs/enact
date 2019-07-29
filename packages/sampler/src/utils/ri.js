// Resolution Independence Convenience Utils
//

import ri from '@enact/ui/resolution';


const riSafe = (style) => {
	switch (typeof style) {
		case 'object':
			for (let rule in style) {
				if (typeof style[rule] === 'number') {
					style[rule] = ri.unit(ri.scale(style[rule]), 'rem');
				}
			}
			return style;
		default:
			return ri.unit(ri.scale(style), 'rem');
	}
};


export {
	riSafe
};
