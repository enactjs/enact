import hoc from '@enact/core/hoc';
import pick from 'ramda/src/pick';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const MemoPropsContext = React.createContext();

const MemoPropsDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoPropsDecorator (props) {
		const children = React.useRef(null);

		children.current = children.current || <Wrapped {...props} />;

		return (
			<MemoPropsContext.Provider value={props}>
				{children.current}
			</MemoPropsContext.Provider>
		);
	}

	return MemoPropsDecorator;
});

const MemoPropsContextDecorator = hoc((config = {}, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoPropsDecorator (props) {
		const context = React.useContext(MemoPropsContext);
		const memoProps = pick(config.props, context);

		return (
			<Wrapped {...props} {...memoProps} />
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

const MemoComponentDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoComponentDecorator (props) {
		const children = React.useRef(null);

		children.current = children.current || <Wrapped {...props} />;

		return children.current;
	}

	return MemoComponentDecorator;
});

export default MemoPropsContext;
export {
	MemoComponentDecorator,
	MemoPropsContext,
	MemoPropsContextDecorator,
	MemoPropsDecorator,
	MemoPropsDOMAttributesContext
};
