import {useEffect, useState} from 'react';

/**
 * Creates one instance of the class, `Ctor` with the provided `args`, for the life of the
 * component.
 *
 * ```
 * class MyClass {
 *   constructor ({value}) {
 *     this.value = value;
 *   }
 *
 *   handleEvent = (ev) => {
 *     if (ev.key === 'Enter') {
 *       // do something with this.value
 *     }
 *   }
 * }
 *
 * function Component (props) {
 *   const inst = useClass(MyClass, props.value);
 *   return <div onClick={inst.handleEvent} />
 * }
 * ```
 *
 * @param {Function} Ctor Class constructor
 * @param  {...any}  args Arguments to pass to the constructor
 * @returns {Object}      An instance of `Ctor`
 * @private
 */
function useClass (Ctor, ...args) {
	const [state, setState] = useState(new Ctor(...args));

	useEffect(() => {
		setState(prevCtor => prevCtor || new Ctor(...args));
	}, [Ctor, args]);

	return state;
}

export default useClass;
export {
	useClass
};
