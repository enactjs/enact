import {checkDefaultBounds} from '../PropTypeValidators';
// React added a secret prop to prevent runtime use of PropTypes.  We're not doing that.  They don't
// export it so we're cheating!
const secret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

it('Should not return an error if value is valid', () => {
	const fn = () => {
		return checkDefaultBounds({value: 50, max: 100, min: 0}, 'value', 'test', 'prop', null, secret);
	};
	let actual = fn();
	let expected = 'null';

	expect(actual).to.be.an(expected);
});

it('Should return an error if value is over 100', () => {
	const fn = () => {
		return checkDefaultBounds({value: 101, max: 100, min: 0}, 'value', 'test', 'prop', null, secret);
	};

	let actual = fn();
	let expected = Error;

	expect(actual).to.be.an.instanceof(expected);
});

it('Should return an error if value is under 0', () => {
	const fn = () => {
		return checkDefaultBounds({value: -1, max: 100, min: 0}, 'value', 'test', 'prop', null, secret);
	};

	let actual = fn();
	let expected = Error;

	expect(actual).to.be.an.instanceof(expected);
});
