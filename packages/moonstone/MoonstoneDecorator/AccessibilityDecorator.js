import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import {contextTypes, Publisher} from '@enact/core/internal/PubSub';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * {@link moonstone/MoonstoneDecorator.AccessibilityDecorator} is a Higher-order Component that
 * classifies an application with a target set of font sizing rules
 *
 * @class AccessibilityDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
const AccessibilityDecorator = hoc((config, Wrapped) => {
	const AccessibilityDecoratorBase = kind({
		name: 'AccessibilityDecoratorBase',

		propTypes: /** @lends moonstone/MoonstoneDecorator.AccessibilityDecorator.prototype */ {
			/**
			 * Enables additional features to help users visually differentiate components.
			 * The UI library will be responsible for using this information to adjust
			 * the components' contrast to this preset.
			 *
			 * @type {Boolean}
			 * @public
			 */
			highContrast: PropTypes.bool,

			/**
			 * Set the goal size of the text. The UI library will be responsible for using this
			 * information to adjust the components' text sizes to this preset.
			 * Current presets are `'normal'` (default), and `'large'`.
			 *
			 * @type {String}
			 * @default 'normal'
			 * @public
			 */
			textSize: PropTypes.oneOf(['normal', 'large'])
		},

		defaultProps: {
			highContrast: false,
			textSize: 'normal'
		},

		styles: {},	// Empty `styles` tells `kind` that we want to use `styler` later and don't have a base className.

		computed: {
			className: ({highContrast, textSize, styler}) => styler.append({
				['enact-a11y-high-contrast']: highContrast,
				['enact-text-' + (textSize)]: textSize
			})
		},

		render: (props) => {
			delete props.highContrast;
			delete props.textSize;
			return (
				<Wrapped {...props} />
			);
		}
	});

	return class extends React.Component {
		static displayName = 'AccessibilityDecorator'
		static contextTypes = contextTypes
		static childContextTypes = contextTypes

		static PropTypes = {
			/**
			 * Set the goal size of the text. The UI library will be responsible for using this
			 * information to adjust the components' text sizes to this preset.
			 * Current presets are `'normal'` (default), and `'large'`.
			 *
			 * @type {String}
			 * @default 'normal'
			 * @public
			 */
			textSize: PropTypes.oneOf(['normal', 'large'])
		}

		static DefaultProps = {
			textSize: 'normal'
		}

		constructor (props) {
			super(props);
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber()
			};
		}

		componentWillMount () {
			this.publisher = Publisher.create('textSize', this.context.Subscriber);
			this.publisher.publish({
				textSize: 'normal'
			});
		}

		componentDidUpdate () {
			this.publisher.publish(this.props.textSize);
		}

		render () {
			return <AccessibilityDecoratorBase {...this.props} />;
		}
	};
});

export default AccessibilityDecorator;
export {AccessibilityDecorator};
