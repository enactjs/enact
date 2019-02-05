import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import Registry from '@enact/core/internal/Registry';
import {ResizeContext} from '@enact/ui/internal/Resize';

/**
 * A higher-order component that classifies an application with a target set of font sizing rules.
 *
 * @class AccessibilityDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const AccessibilityDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars
	return class extends React.Component {
		static contextType = ResizeContext;

		static displayName = 'AccessibilityDecorator'

		static propTypes =  /** @lends moonstone/MoonstoneDecorator.AccessibilityDecorator.prototype */ {
			/**
			 * Enables additional features to help users visually differentiate components.
			 *
			 * The UI library will be responsible for using this information to adjust
			 * the components' contrast to this preset.
			 *
			 * @type {Boolean}
			 * @public
			 */
			highContrast: PropTypes.bool,

			/**
			 * Sets the goal size of the text.
			 *
			 * The UI library will be responsible for using this
			 * information to adjust the components' text sizes to this preset.
			 * Current presets are `'normal'` (default), and `'large'`.
			 *
			 * @type {String}
			 * @default 'normal'
			 * @public
			 */
			textSize: PropTypes.oneOf(['normal', 'large'])
		}

		static defaultProps = {
			highContrast: false,
			textSize: 'normal'
		}

		componentDidMount () {
			this.resize.parent = this.context;
		}

		componentDidUpdate (prevProps) {
			if (prevProps.textSize !== this.props.textSize) {
				this.resize.notify({});
			}
		}

		resize = Registry.create();

		render () {
			const {className, highContrast, textSize, ...props} = this.props;
			const accessibilityClassName = highContrast ? `enact-a11y-high-contrast enact-text-${textSize}` : `enact-text-${textSize}`;
			const combinedClassName = className ? `${className} ${accessibilityClassName}` : accessibilityClassName;
			const variants = {};
			if (highContrast) variants.highContrast = true;
			if (textSize === 'large') variants.largeText = true;

			return (
				<ResizeContext.Provider value={this.resize.subscriber}>
					<Wrapped className={combinedClassName} skinVariants={variants} {...props} />;
				</ResizeContext.Provider>
			);
		}
	};
});

export default AccessibilityDecorator;
export {AccessibilityDecorator};
