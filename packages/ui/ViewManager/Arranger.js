import React from 'react';
import {accelerate, clearTransform, compose, fadeIn, fadeOut, reverse, slideInPartial, slideOutPartial} from './arrange';

export const SlideArranger = ({amount = 100, enter, leave}) => ({
	enter: reverse(compose(clearTransform, fadeIn, slideInPartial(amount, enter), accelerate)),
	leave: reverse(compose(clearTransform, fadeOut, slideOutPartial(amount, leave), accelerate))
});

export const SlideRightArranger = SlideArranger({enter: 'left', leave: 'right'});

export const SlideLeftArranger = SlideArranger({enter: 'right', leave: 'left'});

export const SlideTopArranger = SlideArranger({enter: 'bottom', leave: 'top'});

export const SlideBottomArranger = SlideArranger({enter: 'top', leave: 'bottom'});

export const shape = React.PropTypes.shape({
	enter: React.PropTypes.func,
	leave: React.PropTypes.func
});
