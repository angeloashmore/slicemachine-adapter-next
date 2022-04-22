import prettier from "prettier";

/**
 * Formats a file's contents for a given path using Prettier. It uses the
 * appropriate Prettier configuration file for the path, just like the Prettier CLI.
 *
 * @param path - Path to the file to format.
 * @param contents - Contents of the file to format.
 * @param options - Prettier options to control formatting.
 *
 * @returns Formatted version of `contents`.
 */
export const prettierFormat = async (
	path: string,
	contents: string,
	options?: prettier.Options,
) => {
	const config = (await prettier.resolveConfig(path)) || undefined;

	return prettier.format(contents, { ...config, ...options });
};
