import type {Restrict} from './ContainerConfig';
import type {SpotlightContainerConfig} from './SpotlightContainerConfig';

type SpotlightContainerHandler = (ev: any, props?: any, context?: any) => any;

/**
 * Props managed by {@link spotlight/SpotlightContainerDecorator.SpotlightContainer}.
 */
export interface SpotlightContainerProps {
	disabled?: boolean;
	id?: string;
	muted?: boolean;
	restrict?: Restrict;
}

/**
 * DOM attributes representing spotlight container metadata.
 */
export interface SpotlightContainerAttributes {
	'data-spotlight-container': boolean;
	'data-spotlight-id'?: string | null;
	'data-spotlight-container-disabled'?: boolean;
	'data-spotlight-container-muted'?: boolean;
}

/**
 * Configuration for {@link spotlight/SpotlightContainerDecorator.useSpotlightContainer}.
 */
export interface UseSpotlightContainerConfig extends SpotlightContainerConfig, SpotlightContainerProps {}

/**
 * Object returned by {@link spotlight/SpotlightContainerDecorator.useSpotlightContainer}.
 */
export interface UseSpotlightContainerResult {
	attributes: SpotlightContainerAttributes;
	onBlurCapture: SpotlightContainerHandler;
	onFocusCapture: SpotlightContainerHandler;
	onPointerEnter: SpotlightContainerHandler;
	onPointerLeave: SpotlightContainerHandler;
}

/**
 * Props for {@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}.
 */
export interface SpotlightContainerDecoratorProps {
	spotlightDisabled?: boolean;
	spotlightId?: string;
	spotlightMuted?: boolean;
	spotlightRestrict?: Restrict;
	[prop: string]: any;
}

/**
 * Props for {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}.
 */
export interface SpotlightRootDecoratorProps {
	[prop: string]: any;
}
