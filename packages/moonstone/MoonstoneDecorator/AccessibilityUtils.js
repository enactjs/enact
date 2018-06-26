import hoc from '@enact/core/hoc';
import {contextTypes, Publisher} from '@enact/core/internal/PubSub';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes =  /** @lends moonstone/MoonstoneDecorator.AccessibilityDecorator.prototype */ {
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
};

const defaultProps = {
	highContrast: false,
	textSize: 'normal'
};

const createResizePublisher = (subscriber) => Publisher.create('resize', subscriber);

const onTextSizeChange = (props, prevProps, publisher) => {
	if (prevProps.textSize !== props.textSize) {
		publisher.publish({
			horizontal: true,
			vertical: true
		});
	}
};

const createClassName = (className, highContrast, textSize) => {
	const accessibilityClassName = highContrast ? `enact-a11y-high-contrast enact-text-${textSize}` : `enact-text-${textSize}`;
	return className ? `${className} ${accessibilityClassName}` : accessibilityClassName;
};
/**
 * {@link moonstone/MoonstoneDecorator.AccessibilityDecorator} is a Higher-order Component that
 * classifies an application with a target set of font sizing rules
 *
 * @class AccessibilityDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
// const AccessibilityDecorator = hoc((config, Wrapped) => {
// 	return class extends React.Component {
// 		static displayName = 'AccessibilityDecorator'

// 		render () {
// 			const {className, highContrast, textSize, ...props} = this.props;
// 			const accessibilityClassName = highContrast ? `enact-a11y-high-contrast enact-text-${textSize}` : `enact-text-${textSize}`;
// 			const combinedClassName = className ? `${className} ${accessibilityClassName}` : accessibilityClassName;

// 			return <Wrapped className={combinedClassName} {...props} />;
// 		}
// 	};
// });
const Accessibility = {
	propTypes,
	defaultProps,
	createResizePublisher,
	onTextSizeChange,
	createClassName
};
export default Accessibility;
export {
    Accessibility,
    propTypes,
    defaultProps,
    createResizePublisher,
    onTextSizeChange,
    createClassName
};
