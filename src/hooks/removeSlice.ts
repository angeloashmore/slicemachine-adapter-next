import { RemoveSliceHook } from "slicemachine";

import { PluginOptions } from "../types";

export const removeSlice: RemoveSliceHook<PluginOptions> = async (
	context,
	pluginOptions,
) => {
	const dir = context.resolvePath(
		context.data.sliceLibrary.path,
		context.data.model.id,
	);

	await context.actions.removeDir(dir);
};
