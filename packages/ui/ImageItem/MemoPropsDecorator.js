import hoc from '@enact/core/hoc';
import pick from 'ramda/src/pick';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const MemoPropsContext = React.createContext();

const MemoPropsDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoPropsDecorator (props) {
		return (
			<MemoPropsContext.Provider value={props}>
				<Wrapped {...props} />
			</MemoPropsContext.Provider>
		);
	}

	return MemoPropsDecorator;
});

class MemoPropsDOMAttributesContext extends React.Component {
	static propTypes = /** @lends sandstone/MemoPropsDecorator.MemoPropsDOMAttributesContext.prototype */ {
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
			<MemoPropsContext.Consumer>
				{(context) => {
					this.memoProps = pick(attr, context);
					this.memoChildren = this.memoChildren || this.props.children;
					this.updateDOMAttributes();

					return this.memoChildren;
				}}
			</MemoPropsContext.Consumer>
		);
	}
}

export default MemoPropsContext;
export {
	MemoPropsContext,
	MemoPropsDecorator,
	MemoPropsDOMAttributesContext
};
