export type PluginOptions = {
	prettier?: boolean;
} & (
	| {
			typescript?: false;
			jsxExtension?: boolean;
	  }
	| {
			typescript: true;
			jsxExtension?: never;
	  }
);
