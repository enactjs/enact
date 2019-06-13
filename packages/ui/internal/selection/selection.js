import curry2 from '@enact/core/internal/fp/curry2';
import curry3 from '@enact/core/internal/fp/curry3';

/**
 * Determines if `item` is selected
 *
 * @param	{*}			item		Usually a number but could be anything within the `selected` list
 * @param	{*|Array}	selected	One or many selected items
 *
 * @returns	{Boolean}				`true` if item is equal to or contained in `selected`
 * @private
 */
const isSelected = curry2(function (item, selected) {
	return item === selected || Array.isArray(selected) && selected.indexOf(item) >= 0;
});

/**
 * Selects or deselects an `item` based on the `mode` and returns a copy of `selected` with the new
 * selected state.
 *
 * `single` - Toggles the selection state of `item`. Always returns either `item` or null.
 * `radio` - Always selects `item`
 * `multiple` - Toggles the selection state `item` like `single` but doesn't replace other selected
 * items.
 *
 * @param	{String}	mode		Selection mode (`single`, `radio`, or `multiple`)
 * @param	{*}			item		The selected item
 * @param	{*|Array}	selected	The current selection
 *
 * @returns {*|Array}				The updated selection
 * @private
 */
const select = curry3(function (mode, item, selected) {
	if (mode === 'radio') {
		// When selection is disabled, when selecting only 1, or when selecting the
		// first of multiple, we can forward the source event as is.
		return item;
	} else if (mode === 'single') {
		// When selecting 0 or 1, we have to unselect it if selected
		return isSelected(item, selected) ? null : item;
	} else if (selected == null) {
		// When selection 0 or n but no prior selection, wrap item in an array
		return [item];
	} else {
		// Otherwise we're selecting multiple so we have to either deselect it if
		// already selected or select it if not.
		let updated = Array.isArray(selected) ? selected.slice() : [selected];
		const index = updated.indexOf(item);
		if (index >= 0) {
			if (updated.length === 1) {
				// item should be deselected and is the only item in the array so return null
				updated = null;
			} else {
				// otherwise there are multiple selected so remove item
				updated.splice(index, 1);
			}
		} else {
			// insert and sort
			updated.push(item);
			updated = updated.sort((a, b) => a - b);
		}

		return updated;
	}
});

export {
	isSelected,
	select
};
