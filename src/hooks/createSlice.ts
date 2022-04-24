import type { CreateSliceHook, CreateSliceContext } from "slicemachine";
import { generateTypes } from "prismic-ts-codegen";
import { stripIndent } from "common-tags";
import semver from "semver";

import { prettierFormat } from "../lib/prettierFormat";
import { pascalCase } from "../lib/pascalCase";

import { PluginOptions } from "../types";

// TODO: Replace abstracted `fs` function with `fs` directly.
// Testing can be handled using mock-fs

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

	args.context.actions.writeFile(path, contents);
};

const createComponentFile = async (args: CreateFileArgs) => {
	const path = args.context.resolvePath(
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
		contents = await prettierFormat(path, contents);
	}

	args.context.actions.writeFile(path, contents);
};

const createTypesFile = async (args: CreateFileArgs) => {
	const path = args.context.resolvePath(args.dir, "types.ts");

	let contents = generateTypes({
		sharedSliceModels: [args.context.data.model],
	});

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(path, contents);
	}

	args.context.actions.writeFile(path, contents);
};

const upsertSliceLibraryIndexFile = async (args: CreateFileArgs) => {
	const path = args.context.resolvePath(
		args.context.data.sliceLibrary.path,
		args.pluginOptions.typescript ? "index.ts" : "index.js",
	);

	const packageJSON = JSON.parse(
		await args.context.actions.readFile(
			args.context.resolvePath("package.json"),
		),
	);
	const isReactLazyCompatible =
		semver.satisfies("18", packageJSON.dependencies.react) &&
		semver.satisfies("12", packageJSON.dependencies.next);

	let contents: string;

	if (isReactLazyCompatible) {
		contents = stripIndent`
			import * as React from 'react'

			export const components = {
				text: React.lazy(() => import('./Text'))
			}
		`;
	} else {
		contents = stripIndent`
			import dynamic from 'next/dynamic'

			export const components = {
				text: dynamic(() => import('./Text'))
			}
		`;
	}

	if (args.pluginOptions.prettier) {
		contents = await prettierFormat(path, contents);
	}

	args.context.actions.writeFile(path, contents);
};

export const createSlice: CreateSliceHook<PluginOptions> = async (
	context,
	pluginOptions,
) => {
	const dir = context.resolvePath(
		context.data.sliceLibrary.path,
		context.data.model.id,
	);

	await context.actions.createDir(dir);

	await Promise.allSettled([
		createModelFile({ dir, context, pluginOptions }),
		createComponentFile({ dir, context, pluginOptions }),
		createTypesFile({ dir, context, pluginOptions }),
		upsertSliceLibraryIndexFile({ dir, context, pluginOptions }),
	]);
};
