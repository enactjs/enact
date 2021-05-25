import kind from '@enact/core/kind';
import {forProp, forward, handle, preventDefault} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import useHandlers from '@enact/core/useHandlers';
import PropTypes from 'prop-types';
import {Component} from 'react';

import useLink from './useLink';

/**
 * A component that is used to make a trigger to navigate inside of {@link ui/Routable.Routable} component.
 * 
 * In the following example, `Sample` would render `Main` with two Links for `About` and `FAQ`.
 * If `About` is clicked, the content of `About` would be displayed under `Main`.
 * 
 * ```
 * const Views = Routable({navigate: 'onNavigate'}, ({children}) => <div>{children}</div>);
 * 
 * const Main = () => (
 *	  <div>
 *		  <Link path="./about">About</Link>
 *		  <Link path="./faq">FAQ</Link>
 *	  </div>
 * );
 *
 * const About = () => (<div>Greetings! We are Enact team.</div>);
 * 
 * const Faq = () => (<div>List of FAQ</div>);
 * 
 * const Sample = (props) => {
 *	  const [path, nav] = useState('main'); // use 'main' for the default path
 *	  const handleNavigate = useCallback((ev) => nav(ev.path), [nav]); // if onNavigate is called with a new path, update the state
 *
 *	  return (
 *		  <Views {...props} path={path} onNavigate={handleNavigate}>
 *			  <Route path="main" component={Main}>
 *				  <Route path="about" component={About} />
 *				  <Route path="faq" component={Faq} />
 *			  </Route>
 *		  </Views>
 *	  );
 * };
 * ```
 *
 * @class Link
 * @ui
 * @memberof ui/Routable
 * @public
 */
const LinkBase = kind({
	name: 'Link',

	propTypes: {
		/**
		 * The `path` to navigate matches the path of the {@link ui/Routable.Routable} container.
		 *
		 * @type {String}
		 * @required
		 * @public
		 * @memberof ui/Routable.Link.prototype
		 */
		path: PropTypes.string.isRequired,

		/**
		 * Applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 * @memberof ui/Routable.Link.prototype
		 */
		disabled: PropTypes.bool
	},

	defaultProps: {
		disabled: false
	},

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forward('onClick'),
			preventDefault
		)
	},

	render: ({path, ...rest}) => {
		/* eslint-disable jsx-a11y/anchor-has-content */
		return (
			<a href={path} {...rest} />
		);
		/* eslint-enable jsx-a11y/anchor-has-content */
	}
});

/**
 * A higher-order component that adds support to a component to handle navigates actions.
 * When using Linked component you must give the `path` property. And the component should forward `onClick` event.
 * 
 * ```
 * const CustomItemBase = kind({
 *	  name: 'CustomItem',
 *
 *	  handlers: {
 *		  onClick: handle(
 *			  forward('onClick')
 *		  )
 *	  },
 *
 *	  render: ({...rest}) => {
 *		  return (
 *			  <div {...rest} />
 *		 );
 *	  }
 * });
 *
 * const CustomItem = Linkable(CustomItemBase);
 *
 * const Main = () => (
 *	  <div>
 *		  <CustomItem path="./about">About</CustomItem>
 *		  <CustomItem path="./faq">FAQ</CustomItem>
 *	  </div>
 * );
 * ```
 *
 * @class Linkable
 * @memberof ui/Routable
 * @hoc
 * @public
 */
const Linkable = hoc({navigate: 'onClick'}, (config, Wrapped) => {
	const {navigate} = config;

	const navHandlers = {
		[navigate]: handle(
			forward(navigate),
			(ev, props, hook) => {
				hook.navigate(props);
			}
		)
	};

	// eslint-disable-next-line no-shadow
	function Linkable (props) {
		const link = useLink();
		const handlers = useHandlers(navHandlers, props, link);

		return (
			<Wrapped {...props} {...handlers} />
		);
	}

	// TODO: Added to maintain `ref` compatibility with 3.x. Remove in 4.0
	return class LinkableAdapter extends Component {
		render () {
			return (
				<Linkable {...this.props} />
			);
		}
	};
});

const Link = Linkable(LinkBase);

export default Link;
export {
	Link,
	LinkBase,
	Linkable
};
