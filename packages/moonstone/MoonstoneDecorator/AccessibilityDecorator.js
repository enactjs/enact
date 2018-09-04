import hoc from '@enact/core/hoc';
import {contextTypes, Publisher} from '@enact/core/internal/PubSub';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * A higher-order component that classifies an application with a target set of font sizing rules.
 *
 * @class AccessibilityDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const AccessibilityDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
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

		static contextTypes = contextTypes

		static childContextTypes = contextTypes

		static defaultProps = {
			highContrast: false,
			textSize: 'normal'
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber()
			};
		}

		componentWillMount () {
			this.publisher = Publisher.create('resize', this.context.Subscriber);
		}

		componentDidUpdate (prevProps) {
			if (prevProps.textSize !== this.props.textSize) {
				this.publisher.publish({
					horizontal: true,
					vertical: true
				});
			}
		}

		render () {
			const {className, highContrast, textSize, ...props} = this.props;
			const accessibilityClassName = highContrast ? `enact-a11y-high-contrast enact-text-${textSize}` : `enact-text-${textSize}`;
			const combinedClassName = className ? `${className} ${accessibilityClassName}` : accessibilityClassName;

			return <Wrapped className={combinedClassName} {...props} />;
		}
	};
});

export default AccessibilityDecorator;
export {AccessibilityDecorator};
