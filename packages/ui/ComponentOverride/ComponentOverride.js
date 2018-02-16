/**
 * Provides a utility component that either clones or creates a component instance based on the
 * incoming `component` prop value.
 *
 * @module ui/ComponentOverride
 */

import React from 'react';

/**
 * Utility to either create or clone a component instance with the given set of props.
 *
 * `ComponentOverride` can be used to support props that either accept a type, (e.g. `Button`) or an
 * element (e.g. `<Button customProp="value" />`) and return a new element which includes the
 * remaining props specified.
 *
 * ```
 * const LabeledIconButton = ({iconComponent = IconButton, label, ...rest}) => {
 *   return (
 *     <div {...rest}>
 *       <ComponentOverride
 *         component={iconComponent}
 *         icon="house"
 *       />
 *       <span>{label}</span>
 *     </div>
 *   );
 * };
 *
 * // Usage
 * <LabeledIconButton
 *   label="Home"
 * /> // would use <IconButton icon="house" />
 *
 * <LabeledIconButton
 *   label="Home"
 *   iconComponent={CustomIcon}
 * /> // would use <CustomIcon icon="house" />
 *
 * <LabeledIconButton
 *   label="Home"
 *   iconComponent={
 *     <CustomIcon color="green" />
 *   }
 * /> // would use <CustomIcon color="green" icon="house" />
 * ```
 *
 * @class
 * @memberof ui/ComponentOverride
 * @ui
 * @public
 */
const ComponentOverride = ({component, ...props}) => component ? (
	typeof component === 'function' && React.createElement(component, props) ||
	React.isValidElement(component) && React.cloneElement(component, props)
) : null;

export default ComponentOverride;
export {
	ComponentOverride
};
