import {forwardRef, useId, useImperativeHandle, useRef} from 'react';

const WithRef = (WrappedComponent) => {
	const HoC = forwardRef(function ({['data-withref-id']: givenId, referrerName, ...rest}, ref) {
		const divRef = useRef();
		const generatedId = useId();
		const id = givenId || generatedId;

		useImperativeHandle(ref, () => {
			const node = divRef.current;
			const attributeSelector = `[data-withref-id="${node.getAttribute('data-withref-target')}"]`;
			const selector = `:scope ${attributeSelector}, :scope :has(${attributeSelector})`;
			return node?.parentElement?.querySelector(selector) || null;
		}, []);

		return (
			<>
				<WrappedComponent {...rest} data-withref-id={id} />
				<div data-withref-target={id} data-withref-referrer={referrerName} ref={divRef} style={{display: 'none'}} />
			</>
		);
	});

	HoC.displayName = 'WithRef';

	return HoC;
};

export default WithRef;
export {WithRef};
