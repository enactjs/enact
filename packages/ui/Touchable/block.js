let blocking = false;
const block = () => {
	blocking = true;
	return true;
};
const unblock = () => {
	blocking = false;
	return true;
};
const isBlocked = () => blocking;
const isNotBlocked = () => !blocking;

export {
	block,
	isBlocked,
	isNotBlocked,
	unblock
};
