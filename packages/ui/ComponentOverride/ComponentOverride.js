/**
 * Provides a utility component that either clones or creates a component instance based on the
 * incoming `component` prop value. This allows you to supply JSX as the component used in your prop
 * allowing you to add your own properties. They'll get mixed onto the component when it's used in
 * the parent component.
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
 * const LabeledIconButton = ({iconComponent, label, ...rest}) => {
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
 *
 * // Only the props defined by LabeledIconButton will be passed to CustomIcon
 * <LabeledIconButton
 *   label="Home"
 *   iconComponent={CustomIcon}
 * />
 *
 * // The color prop along with props defined by LabeledIconButton will be passed to CustomIcon
 * <LabeledIconButton
 *   label="Home"
 *   iconComponent={
 *     <CustomIcon color="green" />
 *   }
 * />
 * ```
 *
 * @class
 * @memberof ui/ComponentOverride
 * @ui
 * @public
 */
const ComponentOverride = ({component, ...props}) => component ? (
	(typeof component === 'function' || typeof component === 'string') && React.createElement(component, props) ||
	React.isValidElement(component) && React.cloneElement(component, props)
) : null;

export default ComponentOverride;
export {
	ComponentOverride
};
