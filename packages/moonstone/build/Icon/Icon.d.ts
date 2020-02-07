// Type definitions for moonstone/Icon

import { IconProps as ui_Icon_IconProps } from "@enact/ui/Icon";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface IconBaseProps extends ui_Icon_IconProps {
  /**
   * The size of the icon.
   */
  size?: "large" | "small";
}
/**
 * Renders a moonstone-styled icon without any behavior.
 */

export class IconBase extends React.Component<
  IconBaseProps & React.HTMLProps<HTMLElement>
> {}

/**
 * An object whose keys can be used as the child of an  Icon   component.
 * 
 * List of Icons:
 * ```
plus
minus
arrowhookleft
arrowhookright
ellipsis
check
circle
stop
play
pause
forward
backward
skipforward
skipbackward
pauseforward
pausebackward
pausejumpforward
pausejumpbackward
jumpforward
jumpbackward
denselist
bulletlist
list
drawer
arrowlargedown
arrowlargeup
arrowlargeleft
arrowlargeright
arrowsmallup
arrowsmalldown
arrowsmallleft
arrowsmallright
closex
search
rollforward
rollbackward
exitfullscreen
fullscreen
arrowshrinkleft
arrowshrinkright
arrowextend
arrowshrink
flag
funnel
trash
star
hollowstar
halfstar
gear
plug
lock
forward15
back15
continousplay
playlist
resumeplay
image
audio
music
languages
cc
ccon
ccoff
sub
recordings
livezoom
liveplayback
liveplaybackoff
repeat
repeatoff
series
repeatdownload
view360
view360off
info
cycle
bluetoothoff
verticalellipsis
arrowcurveright
picture
home
warning
scroll
densedrawer
starminus
liverecord
liveplay
contrast
edit
trashlock
arrowrightskip
volumecycle
movecursor
refresh
question
questionreversed
s
repeatone
repeatall
repeatnone
speakers
koreansubtitles
chinesesubtitles
arrowleftprevious
searchfilled
zoomin
zoomout
playlistadd
files
arrowupdown
brightness
download
playlistedit
font
musicon
musicoff
liverecordone
liveflagone
shuffle
sleep
notification
notificationoff
checkselection
```
 */
export declare const iconList: object;

export interface IconDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function IconDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & IconDecoratorProps>;

export interface IconProps extends Merge<IconBaseProps, IconDecoratorProps> {}
/**
 * A Moonstone-styled icon.
 */

export class Icon extends React.Component<
  IconProps & React.HTMLProps<HTMLElement>
> {}

export default Icon;
