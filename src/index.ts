import type { Plugin } from "slicemachine";

import { PluginOptions } from "./types";

import { createSlice } from "./hooks/createSlice";

export const plugin: Plugin<PluginOptions> = (context, _pluginOptions) => {
	context.hook("createSlice", createSlice);
	context.hook("updateSlice", createSlice);
};
