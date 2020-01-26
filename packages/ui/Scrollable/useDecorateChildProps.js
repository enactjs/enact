import classNames from 'classnames';
import warning from 'warning';

const useDecorateChildProps = (instance) => (childComponentName, props) => {
	if (!instance[childComponentName]) {
		instance[childComponentName] = {};
	}

	if (typeof props === 'object') {
		for (const prop in props) {
			if (prop === 'className') {
				if (!instance[childComponentName].classNames) {
					instance[childComponentName].classNames = [];
				}

				warning(
					Array.isArray(props.className),
					`Unsupported other types for 'className' prop except Array`
				);

				// Add className string in the `className` prop.
				instance[childComponentName].classNames = [...instance[childComponentName].classNames, ...props.className];
				instance[childComponentName].className = classNames(...instance[childComponentName].classNames);
			} else {
				warning(
					!instance[childComponentName][prop],
					`Unsupported to push value in the same prop.`
				);

				// Override the previous value.
				instance[childComponentName][prop] = props[prop];
			}
		}
	}
};

export default useDecorateChildProps;
