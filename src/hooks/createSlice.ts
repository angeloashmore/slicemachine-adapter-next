import type { CreateSliceHook, CreateSliceContext } from "slicemachine";
import { stripIndent } from "common-tags";

import { prettierFormat } from "../lib/prettierFormat";

import { PluginOptions } from "../types";

type CreateFileArgs = {
	dir: string;
	context: CreateSliceContext;
	pluginOptions: PluginOptions;
};

const createModelFile = async (args: CreateFileArgs) => {
	const path = args.context.resolvePath(args.dir, "model.json");

	let contents = JSON.stringify(args.context.data.model);

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(path, contents);
	}

	args.context.actions.createFile(path, contents);
};

const createComponentFile = async (args: CreateFileArgs) => {
	const path = args.context.resolvePath(args.dir, "component.json");

	let contents: string;

	if (args.pluginOptions.typescript) {
		contents = stripIndent`
			import { SliceComponentProps } from "@prismicio/react";
			import { TextSlice } from "./types";

			type TextProps = SliceComponentProps<TextSlice>;

			const Text = ({ slice }: TextProps): React.Element => {
				return (
					<div data-slice-type={slice.slice_type}>
						<section>
							Placeholder component for Text ({slice.variation}) Slices
						</section>
					</div>
				);
			};

			export default Text
		`;
	} else {
		contents = stripIndent`
			const Text = ({ slice }) => {
				return (
					<div data-slice-type={slice.slice_type}>
						<section>
							Placeholder component for Text ({slice.variation}) Slices
						</section>
					</div>
				);
			};

			export default Text
		`;
	}

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(path, contents);
	}

	args.context.actions.createFile(path, contents);
};

const createTypesFile = async (args: CreateFileArgs) => {
	const path = args.context.resolvePath(args.dir, "types.ts");

	let contents = "";

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(path, contents);
	}

	args.context.actions.createFile(path, contents);
};

export const createSlice: CreateSliceHook<PluginOptions> = async (
	context,
	pluginOptions,
) => {
	const dir = context.resolvePath(`./src/slices`, context.data.model.id);

	await context.actions.createDir(dir);

	await Promise.allSettled([
		createModelFile({ dir, context, pluginOptions }),
		createComponentFile({ dir, context, pluginOptions }),
		createTypesFile({ dir, context, pluginOptions }),
	]);
};
