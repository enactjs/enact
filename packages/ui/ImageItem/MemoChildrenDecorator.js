import hoc from '@enact/core/hoc';
import pick from 'ramda/src/pick';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const MemoChildrenContext = React.createContext();

const MemoChildrenDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoChildrenDecorator (props) {
		return (
			<MemoChildrenContext.Provider value={props}>
				<Wrapped {...props} />
			</MemoChildrenContext.Provider>
		);
	}

	return MemoChildrenDecorator;
});

function useMemoChildrenContext () {
	return React.useContext(MemoChildrenContext);
}

// const defaultWithPropConfig = {
// 	/**
// 	 * The array includes the key strings of the context object
// 	 * which will be used as props.
// 	 *
// 	 * @type {Array}
// 	 * @default []
// 	 * @public
// 	 */
// 	filterProps: []
// };

// const MemoChildrenDOMAttributesContextDecorator = hoc(defaultWithPropConfig, (config, Wrapped) => {
// 	const {filterProps} = config;
// 	return class MemoChildrenDOMAttributesContext extends React.Component {
// 		static propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementAndUpdateDOMAttributesContextDecorator.prototype */ {
// 			filterProps: []
// 		}

// 		componentDidMount () {
// 			this.updateDOMAttributes();
// 		}

// 		node = null

// 		memoProps = {}

// 		memoChildren = null

// 		updateDOMAttributes () {
// 			const {selector} = this.props;
// 			const domNode = ReactDOM.findDOMNode(this);

// 			if (selector) {
// 				this.node = this.node || domNode && domNode.querySelector(selector) || null; // eslint-disable-line react/no-find-dom-node
// 			} else {
// 				this.node = this.node || domNode || null; // eslint-disable-line react/no-find-dom-node
// 			}

// 			if (this.node) {
// 				for (const prop in this.memoProps) {
// 					this.node.setAttribute(prop, this.memoProps[prop]);
// 				}
// 			}
// 		}

// 		render () {
// 			const {filterProps, ...rest} = this.props;
// 			return (
// 				<MemoChildrenContext.Consumer>
// 					{(context) => {
// 						this.memoProps = pick(filterProps, context);
// 						this.memoChildren = this.memoChildren || this.props.children;
// 						this.updateDOMAttributes();

// 						return this.memoChildren;
// 					}}
// 				</MemoChildrenContext.Consumer>
// 			);
// 		}
// 	}
// });

class MemoChildrenDOMAttributesContext extends React.Component {
	static propTypes = /** @lends sandstone/MemoChildrenDecorator.MemoChildrenDOMAttributesContext.prototype */ {
		attr: PropTypes.array,
		selector: PropTypes.string,
		value: PropTypes.object
	}

	static defaultProps = {
		attr: []
	}

	componentDidMount () {
		this.updateDOMAttributes();
	}

	node = null

	memoProps = {}

	memoChildren = null

	updateDOMAttributes () {
		const {selector} = this.props;
		const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

		if (selector) {
			this.node = this.node || domNode && domNode.querySelector(selector) || null;
		} else {
			this.node = this.node || domNode || null;
		}

		if (this.node) {
			for (const prop in this.memoProps) {
				this.node.setAttribute(prop, this.props.value && this.props.value[prop](this.memoProps[prop]) || this.memoProps[prop]);
			}
		}
	}

	render () {
		const {attr} = this.props;

		return (
			<MemoChildrenContext.Consumer>
				{(context) => {
					this.memoProps = pick(attr, context);
					this.memoChildren = this.memoChildren || this.props.children;
					this.updateDOMAttributes();

					return this.memoChildren;
				}}
			</MemoChildrenContext.Consumer>
		);
	}
}

export default MemoChildrenContext;
export {
	MemoChildrenContext,
	MemoChildrenDecorator,
	MemoChildrenDOMAttributesContext,
	useMemoChildrenContext
};
