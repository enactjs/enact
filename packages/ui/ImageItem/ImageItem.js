/**
 * Unstyled image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/ImageItem
 * @exports ImageItem
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import pick from 'ramda/src/pick';
import React from 'react';
import ReactDOM from 'react-dom';

import ComponentOverride from '../ComponentOverride';
import Image from '../Image';
import {Cell, Column, Row} from '../Layout';
import {selectSrc} from '../resolution';

import componentCss from './ImageItem.module.less';

// Adapts ComponentOverride to work within Cell since both use the component prop
function ImageOverride ({imageComponent, ...rest}) {
	return ComponentOverride({
		component: imageComponent,
		...rest
	});
}

const MemoChildrenContext = React.createContext();

const MemoChildrenDecorator = hoc((config, Wrapped) => {
	function CacheContextDecorator (props) {
		return (
			<MemoChildrenContext.Provider value={props}>
				<Wrapped {...props} />
			</MemoChildrenContext.Provider>
		);
	}

	return CacheContextDecorator;
});

function useMemoChildrenContext () {
	return React.useContext(MemoChildrenContext);
}

const defaultWithPropConfig = {
	/**
	 * The array includes the key strings of the context object
	 * which will be used as props.
	 *
	 * @type {Array}
	 * @default []
	 * @public
	 */
	filterProps: []
};

const MemoChildrenDOMAttributesContextDecorator = hoc(defaultWithPropConfig, (config, Wrapped) => {
	const {filterProps} = config;
	return class MemoChildrenDOMAttributesContext extends React.Component {
		static propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementAndUpdateDOMAttributesContextDecorator.prototype */ {
			filterProps: []
		}

		componentDidMount () {
			this.updateDOMAttributes();
		}

		node = null

		cachedProps = {}

		cachedChildren = null

		updateDOMAttributes () {
			this.node = this.node || ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

			if (this.node) {
				for (const prop in this.cachedProps) {
					this.node.setAttribute(prop, this.cachedProps[prop]);
				}
			}
		}

		render () {
			const {filterProps, ...rest} = this.props;
			return (
				<MemoChildrenContext.Consumer>
					{(context) => {
						this.cachedProps = pick(filterProps, context);
						this.cachedChildren = this.cachedChildren || this.props.children;
						this.updateDOMAttributes();

						return this.cachedChildren;
					}}
				</MemoChildrenContext.Consumer>
			);
		}
	}
});

class MemoChildrenDOMAttributesContext extends React.Component {
	static propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementAndUpdateDOMAttributesContextDecorator.prototype */ {
		attr: []
	}

	componentDidMount () {
		this.updateDOMAttributes();
	}

	node = null

	cachedProps = {}

	cachedChildren = null

	updateDOMAttributes () {
		this.node = this.node || ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

		if (this.node) {
			for (const prop in this.cachedProps) {
				this.node.setAttribute(prop, this.props.value && this.props.value[prop](this.cachedProps[prop]) || this.cachedProps[prop]);
			}
		}
	}

	render () {
		const {attr} = this.props;
		return (
			<MemoChildrenContext.Consumer>
				{(context) => {
					this.cachedProps = pick(attr, context);
					this.cachedChildren = this.cachedChildren || this.props.children;
					this.updateDOMAttributes();

					return this.cachedChildren;
				}}
			</MemoChildrenContext.Consumer>
		);
	}
}

/**
 * A basic image item without any behavior.
 *
 * @class ImageItem
 * @memberof ui/ImageItem
 * @ui
 * @public
 */
const ImageItemBase = kind({
	name: 'ui:ImageItem',

	propTypes: /** @lends ui/ImageItem.ImageItem.prototype */ {
		/**
		 * The caption displayed with the image.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `imageItem` - The root component class
		 * * `caption` - The caption component class
		 * * `horizontal` - Applied when `orientation="horizontal"
		 * * `image` - The image component class
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `vertical` - Applied when `orientation="vertical"
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The component used to render the image component.
		 *
		 * @type {Component|Element}
		 * @public
		 */
		imageComponent: EnactPropTypes.componentOverride,

		/**
		 * The layout orientation of the component.
		 *
		 * @type {('horizontal'|'vertical')}
		 * @default 'vertical'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * A placeholder image to be displayed before the image is loaded.
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Applies a selected visual effect to the image.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * String value or Object of values used to determine which image will appear on a specific
		 * screenSize.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	defaultProps: {
		imageComponent: Image,
		orientation: 'vertical',
		selected: false
	},

	functional: true,

	styles: {
		css: componentCss,
		className: 'imageItem',
		publicClassNames: true
	},

	computed: {
		isHorizntal : ({orientation}) => (orientation === 'horizontal'),
		imgCompWithoutSrc: ({css, imageComponent, isHorizntal, placeholder, src}) => {
			return React.useMemo(() => {
				console.log('ui:imgCompWithoutSrc');

				return (
					<Cell
						className={css.image}
						component={ImageOverride}
						imageComponent={imageComponent}
						placeholder={placeholder}
						shrink={isHorizntal}
						src={src}
						context={MemoChildrenDOMAttributesContext}
					/>
				);
			}, [Object.values(css).join(''), imageComponent.type.displayName, isHorizntal, placeholder]);
		},
		imgComp: ({imgCompWithoutSrc, src}) => {
			return React.useMemo(() => {
				console.log('ui:imgComp');

				return (
					<MemoChildrenDOMAttributesContext attr={['src']} value={{src: selectSrc}}>
						{imgCompWithoutSrc}
					</MemoChildrenDOMAttributesContext>
				);
			}, [src]);
		},
		children: ({children, css, isHorizntal}) => {
			return React.useMemo(() => {
				console.log('ui:children');

				return (
					<Cell
						className={css.caption}
						shrink={!isHorizntal}
						// eslint-disable-next-line no-undefined
						align={isHorizntal ? 'center' : undefined}
					>
						<MemoChildrenContext.Consumer>
							{({children}) => (children)}
						</MemoChildrenContext.Consumer>
					</Cell>
				);
			}, [Object.values(css).join(''), isHorizntal])
		},
		// children: ({children, childrenWrapper}) => {
		// 	return React.useMemo(() => {
		// 		// console.log(children, childrenWrapper)
		// 		children ? React.cloneElement(childrenWrapper, null, children) : null
		// 	}, [children, childrenWrapper])
		// }
		className: ({orientation, selected, styler}) => {
			return styler.append(
				React.useMemo(() => {
					console.log('ui:className');

					return {
						selected,
						horizontal: orientation === 'horizontal',
						vertical: orientation === 'vertical'
					};
				}, [orientation, selected])
			);
		}
	},

	render: ({children, css, imgComp, orientation, ...rest}) => {
		delete rest.childrenWrapper;
		delete rest.css;
		delete rest.imageComponent;
		delete rest.isHorizntal;
		delete rest.orientation;
		delete rest.placeholder;
		delete rest.selected;
		delete rest.src;

		// console.log('data-index', rest['data-index'])

		const Component = orientation === 'horizontal' ? Row : Column;

		return (
			<MemoChildrenDOMAttributesContext attr={['data-index']}>
				<Component {...rest}>
					{imgComp}
					{children}
				</Component>
			</MemoChildrenDOMAttributesContext>
		);
	}
});

export default ImageItemBase;
export {
	ImageItemBase as ImageItem,
	ImageItemBase,
	MemoChildrenDecorator
};
