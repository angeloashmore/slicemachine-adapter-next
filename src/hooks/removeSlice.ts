import { RemoveSliceContext, RemoveSliceHook } from "slicemachine";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { PluginOptions } from "../types";
import { buildSliceLibraryIndexFileContents } from "../lib/buildSliceLibraryIndexFileContents";

type Args = {
	context: RemoveSliceContext;
	pluginOptions: PluginOptions;
};

const removeSliceDir = async (args: Args) => {
	const dir = path.join(
		args.context.data.sliceLibrary.path,
		args.context.data.model.id,
	);

	await fs.rmdir(dir);
};

const updateSliceLibraryIndexFile = async (args: Args) => {
	const { filePath, contents } = await buildSliceLibraryIndexFileContents({
		sliceLibraryID: args.context.data.sliceLibrary.path,
		typescript: args.pluginOptions.typescript,
		prettier: args.pluginOptions.prettier,
		getSliceLibrarySliceIDs: args.context.actions.getSliceLibrarySliceIDs,
		projectRootDir: args.context.project.rootDir,
	});

	await fs.writeFile(filePath, contents);
};

export const removeSlice: RemoveSliceHook<PluginOptions> = async (
	context,
	pluginOptions,
) => {
	await Promise.allSettled([
		removeSliceDir({ context, pluginOptions }),
		updateSliceLibraryIndexFile({ context, pluginOptions }),
	]);
};
