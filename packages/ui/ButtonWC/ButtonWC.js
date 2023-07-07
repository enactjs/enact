/**
 * Unstyled button components and behaviors to be customized by a theme or application.
 *
 * @module ui/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonDecorator
 */

import {createComponent} from '@lit-labs/react';
import * as Lit from 'lit';
import compose from 'ramda/src/compose';
import * as React from 'react';

import ForwardRef from '../ForwardRef';
import Touchable from '../Touchable';

class PocButtonSimple extends Lit.LitElement { // eslint-disable-line no-unused-vars
	static styles = [Lit.css`
		:host {
			position: relative;
			display: inline-block;
			box-sizing: border-box;
			vertical-align: middle;
			text-align: center;
			z-index: 0;
		}
		.root {
			height: 100%;
			width: 100%;
		}
		.background::slotted(*) {
			position: absolute;
			display: inline-block;
			height: 100%;
			width: 100%;
			inset: 0;
			z-index: -1;
		}
		.content {
			display: flex;
			box-sizing: border-box;
			justify-content: center;
			align-items: center;
			height: 100%;
		}
	`];

	static properties = {
		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link ui/Button.Button}, the `ref` prop is forwarded to this component
		 * as `componentRef`.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		componentRef: {attribute: false},

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `button` - The root component class
		 * * `bg` - The background node of the button
		 * * `client` - The content node of the button
		 * * `hasIcon` - Applied when there is an `icon` present
		 * * `icon` - The icon node, when `icon` is set
		 * * `large` - Applied when `size` prop is `'large'`
		 * * `minWidth` - Applied when `minWidth` prop is `true`
		 * * `pressed` - Applied when `pressed` prop is `true`
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `small` - Applied when `size` prop is `'small'`
		 *
		 * @type {Object}
		 * @public
		 */
		css: {attribute: false},

		/**
		 * Additional DOM nodes which may be necessary for decorating the Button.
		 *
		 * @type {Node}
		 * @private
		 */
		decoration: {attribute: false},

		/**
		 * Applies the `disabled` class.
		 *
		 * When `true`, the button is shown as disabled.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: {attribute: false},

		/**
		 * The icon displayed within the Button.
		 *
		 * The icon will be displayed before the natural reading order of the text, regardless
		 * of locale. Any string that is valid for its {@link ui/Button.Button.iconComponent} is
		 * valid here. If `icon` is specified as a string and `iconButton` is undefined, the icon is
		 * not rendered.
		 *
		 * This also supports a custom icon, in the form of a DOM node or a Component,
		 * with the caveat that if you supply a custom icon, you are responsible for sizing and
		 * locale positioning of the custom component.
		 *
		 * Setting this to `true` means the `iconComponent` will be rendered but with empty content.
		 * This may be useful if you've customized the `iconComponent` to render the icon content
		 * externally.
		 *
		 * @type {Node|Boolean}
		 * @public
		 */
		icon: {attribute: false},

		/**
		 * Enforces a minimum width for the component.
		 *
		 * Applies the `minWidth` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		minWidth: {attribute: false},

		/**
		 * Indicates the component is depressed.
		 *
		 * Applies the `pressed` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: {attribute: false},

		/**
		 * Indicates the component is selected.
		 *
		 * Applies the `selected` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: {attribute: false},

		/**
		 * The size of the button.
		 *
		 * Applies the CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {String}
		 * @public
		 */
		size: {attribute: false}
	};

	log (message, showProperties = false) {
		const logStyleBegin = [
			'font-size: 18px',
			'color: red',
			'background: white'
		].join(';');
		console.log('%c%s', logStyleBegin, `🔻${message}`); // eslint-disable-line no-console

		if (showProperties) {
			const propertyNames = [
				'componentRef',
				'css',
				'decoration',
				'disabled',
				'icon',
				'minWidth',
				'pressed',
				'selected',
				'size'
			];

			for (const name in propertyNames) {
				console.log(name, propertyNames[name], this[propertyNames[name]]); // eslint-disable-line no-console
			}
		}

		const logStyleEnd = [
			'font-size: 12px',
			'color: orange'
		].join(';');
		console.log('%c%s', logStyleEnd, `🔺${message}`); // eslint-disable-line no-console
	}

	/*
	 * Standard custom element lifecycle
	 */

	constructor () {
		super();
		this.disabled = false;
		this.minWidth = true;
		this.pressed = false;
		this.selected = false;
	}

	connectedCallback () {
		super.connectedCallback();
		this.log('connectedCallback');
	}

	disconnectedCallback () {
		super.disconnectedCallback();
		this.log('disconnectedCallback');
	}

	/*
	 * Reactive update cycle
	 */

	shouldUpdate () {
		this.log('shouldUpdate', true);
		return true;
	}

	willUpdate () {
		this.log('willUpdate');
	}

	update () {
		super.update();
		this.log('update');
	}

	firstUpdated () {
		this.log('firstUpdated');
	}

	updated () {
		this.log('updated', true);
	}

	render () {
		this.log('render');
		/*
		const {children, componentRef, css, decoration, disabled, icon, ...rest} = this;
		delete rest.minWidth;
		delete rest.pressed;
		delete rest.selected;
		delete rest.size;
		*/

		const {css, decoration, disabled, icon} = this;
		const decorationNode = decoration ? `<div className={${css.decoration}}>${decoration}</div>` : '';
		return Lit.html`
			<div role="button" class="root" aria-disabled=${disabled} disabled=${disabled}>
				${decorationNode}
				<slot name="background" class="background ${css.bg}"></slot>
				<slot class="content"></slot>
			</div>
		`;
	}
}
customElements.define('poc-button-simple', PocButtonSimple); // eslint-disable-line

/**
 * A basic button component structure without any behaviors applied to it.
 *
 * @class ButtonBase
 * @memberof ui/Button
 * @ui
 * @public
 */
const ButtonBase = createComponent({
	tagName: 'poc-button-simple',
	elementClass: PocButtonSimple,
	react: React,
	events: {}
});

/**
 * A higher-order component that adds touch support to a [ButtonBase]{@link ui/Button.ButtonBase}.
 *
 * @hoc
 * @memberof ui/Button
 * @mixes ui/Touchable.Touchable
 * @public
 */
const ButtonDecorator = compose(
	ForwardRef({prop: 'componentRef'}),
	Touchable({activeProp: 'pressed'})
);

/**
 * A minimally-styled button component with touch support.
 *
 * @class Button
 * @memberof ui/Button
 * @extends ui/Button.ButtonBase
 * @mixes ui/Button.ButtonDecorator
 * @omit componentRef
 * @ui
 * @public
 */
const Button = ButtonDecorator(ButtonBase);

export default Button;
export {
	Button,
	ButtonBase,
	ButtonDecorator
};
