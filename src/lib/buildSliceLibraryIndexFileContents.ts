import * as path from "node:path";
import { createRequire } from "node:module";
import { Actions } from "slicemachine";
import { source } from "common-tags";
import semver from "semver";

import { prettierFormat } from "../lib/prettierFormat";
import { pascalCase } from "../lib/pascalCase";

type BuildSliceLibraryIndexFileContentsArgs = {
	sliceLibraryID: string;
	getSliceLibrarySliceIDs: Actions["getSliceLibrarySliceIDs"];
	projectRootDir: string;
	typescript?: boolean;
	prettier?: boolean;
};

export const buildSliceLibraryIndexFileContents = async (
	args: BuildSliceLibraryIndexFileContentsArgs,
): Promise<{ filePath: string; contents: string }> => {
	const filePath = path.join(
		args.sliceLibraryID,
		args.typescript ? "index.ts" : "index.js",
	);
	const sliceIDs = await args.getSliceLibrarySliceIDs(args.sliceLibraryID);
	const require = createRequire(args.projectRootDir);
	const isReactLazyCompatible =
		semver.satisfies("18", require("react/package.json").version) &&
		semver.satisfies("12", require("next/package.json").version);

	let contents: string;

	if (isReactLazyCompatible) {
		contents = source`
			import * as React from 'react'

			export const components = {
				${sliceIDs.map(
					(id) => `${id}: React.lazy(() => import('./${pascalCase(id)}')),`,
				)}
			}
		`;
	} else {
		contents = source`
			import dynamic from 'next/dynamic'

			export const components = {
				${sliceIDs.map((id) => `${id}: dynamic(() => import('./${pascalCase(id)}')),`)}
			}
		`;
	}

	if (args.prettier) {
		contents = await prettierFormat(filePath, contents);
	}

	return { filePath, contents };
};
