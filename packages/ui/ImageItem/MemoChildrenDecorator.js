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

class MemoChildrenDOMAttributesContext extends React.Component {
	static propTypes = /** @lends sandstone/MemoChildrenDecorator.MemoChildrenDOMAttributesContext.prototype */ {
		attr: PropTypes.array,
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
		this.node = this.node || ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

		if (this.node) {
			for (const prop in this.memoProps) {
				this.node.setAttribute(prop, this.memoProps[prop]);
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

const reducedComputed = (props, initialContext = {}) => {
	return Object.keys(props).reduce(function (context, key) {
		return {
			...context,
			[key]: props[key](context)
		};
	}, initialContext);
};

export default MemoChildrenContext;
export {
	MemoChildrenContext,
	MemoChildrenDecorator,
	MemoChildrenDOMAttributesContext,
	reducedComputed
};
