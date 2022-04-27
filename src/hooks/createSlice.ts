import type { CreateSliceHook, CreateSliceContext } from "slicemachine";
import { generateTypes } from "prismic-ts-codegen";
import { stripIndent } from "common-tags";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { prettierFormat } from "../lib/prettierFormat";
import { pascalCase } from "../lib/pascalCase";

import { PluginOptions } from "../types";
import { buildSliceLibraryIndexFileContents } from "../lib/buildSliceLibraryIndexFileContents";

type Args = {
	dir: string;
	context: CreateSliceContext;
	pluginOptions: PluginOptions;
};

const createModelFile = async (args: Args) => {
	const filePath = path.join(args.dir, "model.json");

	let contents = JSON.stringify(args.context.data.model);

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(filePath, contents);
	}

	await fs.writeFile(filePath, contents);
};

const createComponentFile = async (args: Args) => {
	const filePath = path.join(
		args.dir,
		args.pluginOptions.typescript
			? "index.tsx"
			: `index.${args.pluginOptions.jsxExtension ? "jsx" : "js"}`,
	);
	const model = args.context.data.model;
	const pascalID = pascalCase(model.id);

	let contents: string;

	if (args.pluginOptions.typescript) {
		contents = stripIndent`
			import { SliceComponentProps } from "@prismicio/react";
			import { ${pascalID}Slice } from "./types";

			/**
			 * Props for \`${pascalID}\`.
			 */
			type ${pascalID}Props = SliceComponentProps<${pascalID}Slice>;

			/**
			 * Component for "${model.name}" Slices.
			 */
			const ${pascalID} = ({ slice }: ${pascalID}Props): React.Element => {
				return (
					<section
						data-slice-type={slice.slice_type}
						data-slice-variation={slice.variation}
					>
						Placeholder component for ${model.id} (variation: {slice.variation}) Slices
					</section>
				);
			};

			export default ${pascalID}
		`;
	} else {
		contents = stripIndent`
			/**
			 * @typedef {import("./types").${pascalID}Slice} ${pascalID}Slice
			 *
			 * @typedef {import("./SliceZone").SliceComponentProps<${pascalID}Slice>} ${pascalID}Props
			 */

			/**
			 * @param {${pascalID}Props}
			 */
			const ${pascalID} = ({ slice }) => {
				return (
					<section
						data-slice-type={slice.slice_type}
						data-slice-variation={slice.variation}
					>
						Placeholder component for ${model.id} (variation: {slice.variation}) Slices
					</section>
				);
			};

			export default ${pascalID};
		`;
	}

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(filePath, contents);
	}

	await fs.writeFile(filePath, contents);
};

const createTypesFile = async (args: Args) => {
	const filePath = path.join(args.dir, "types.ts");

	let contents = generateTypes({
		sharedSliceModels: [args.context.data.model],
	});

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(filePath, contents);
	}

	await fs.writeFile(filePath, contents);
};

const upsertSliceLibraryIndexFile = async (args: Args) => {
	const { filePath, contents } = await buildSliceLibraryIndexFileContents({
		sliceLibraryID: args.context.data.sliceLibrary.path,
		typescript: args.pluginOptions.typescript,
		prettier: args.pluginOptions.prettier,
		getSliceLibrarySliceIDs: args.context.actions.getSliceLibrarySliceIDs,
		projectRootDir: args.context.project.rootDir,
	});

	await fs.writeFile(filePath, contents);
};

export const createSlice: CreateSliceHook<PluginOptions> = async (
	context,
	pluginOptions,
) => {
	const dir = path.join(context.data.sliceLibrary.path, context.data.model.id);

	await fs.mkdir(dir, { recursive: true });

	await Promise.allSettled([
		createModelFile({ dir, context, pluginOptions }),
		createComponentFile({ dir, context, pluginOptions }),
		createTypesFile({ dir, context, pluginOptions }),
		upsertSliceLibraryIndexFile({ dir, context, pluginOptions }),
	]);
};
