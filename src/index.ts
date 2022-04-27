import type { Plugin } from "slicemachine";

import { PluginOptions } from "./types";

import { createSlice } from "./hooks/createSlice";
import { removeSlice } from "./hooks/removeSlice";
import { codeSnippet } from "./hooks/codeSnippet";

export const plugin: Plugin<PluginOptions> = (context, _pluginOptions) => {
	context.hook("createSlice", createSlice);
	context.hook("updateSlice", createSlice);
	context.hook("removeSlice", removeSlice);
	context.hook("codeSnippet", codeSnippet);
};
