import { CodeSnippetHook } from "slicemachine";
import * as prismicT from "@prismicio/types";
import { stripIndent } from "common-tags";

const dotPath = (segments: string[]): string => {
	return segments.join(".");
};

export const codeSnippet: CodeSnippetHook = (context, _pluginOptions) => {
	const { model, fieldPath, sliceLibrary } = context.data;

	const label = "React";

	switch (model.type) {
		case prismicT.CustomTypeModelFieldType.Link: {
			return {
				label,
				language: "tsx",
				preCode: stripIndent`
					import { PrismicLink } from '@prismicio/react'
				`,
				code: stripIndent`
					<PrismicLink field={${dotPath(fieldPath)}}>Link</PrismicLink>
				`,
			};
		}

		case prismicT.CustomTypeModelFieldType.Group: {
			return {
				label,
				language: "tsx",
				code: stripIndent`
					${dotPath(fieldPath)}.map(item => (
					  // Render content for item
					))
				`,
			};
		}

		case prismicT.CustomTypeModelFieldType.Slices: {
			return {
				label,
				language: "tsx",
				preCode: stripIndent`
					import { SliceZone } from '@prismicio/react'
					import { components } from '../${sliceLibrary.path}'
				`,
				code: stripIndent`
					<SliceZone
					  slices={${dotPath(fieldPath)}}
					  components={components}
					/>
				`,
			};
		}

		default: {
			return {
				label,
				language: "tsx",
				code: dotPath(fieldPath),
			};
		}
	}
};
