/**
 * A utility component that either clones or creates a component instance based on the
 * incoming `component` prop value.
 *
 * This allows you to supply JSX as the component used in your prop
 * allowing you to add your own properties. They'll get mixed onto the component when it's used in
 * the parent component.
 *
 * @module ui/ComponentOverride
 * @exports ComponentOverride
 */

import {isValidElement, cloneElement} from 'react';
import {isValidElementType} from 'react-is';

/**
 * Utility to either create or clone a component instance with the given set of props.
 *
 * `ComponentOverride` can be used to support props that either accept a type, (e.g. `Button`) or an
 * element (e.g. `<Button customProp="value" />`) and return a new element which includes the
 * remaining props specified.
 *
 * Example:
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
const ComponentOverride = ({component: Component, ...props}) => {
	// Despite its capitalized, component-like signature, this is also called directly as a plain
	// function, including from the render of a class `kind`. React Compiler would otherwise compile it as a component and emit a `useMemoCache`
	// call, which throws "Invalid hook call" on those direct-call paths.
	// TODO: rewrite this component to work properly with babel-plugin-react-compiler
	'use no memo';

	return Component && (
		isValidElementType(Component) && (
			<Component {...props} />
		) || isValidElement(Component) && (
			cloneElement(Component, props)
		)
	) || null;
};

export default ComponentOverride;
export {
	ComponentOverride
};
