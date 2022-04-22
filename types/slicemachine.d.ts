type Promisable<T> = T | PromiseLike<T>;

declare module "slicemachine" {
	import * as prismicT from "@prismicio/types";

	export type Plugin<PluginOptions = DefaultPluginOptions> = (
		slicemachine: SliceMachine<PluginOptions>,
		pluginOptions: PluginOptions,
	) => Promiseable<void>;

	export interface SliceMachine<PluginOptions = DefaultPluginOptions>
		extends Omit<PluginContext, "data"> {
		hook(name: "createSlice", fn: Hook["createSlice"]): void;
	}

	export type CreateSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type CreateSliceContext = PluginContext<CreateSliceData>;
	export type CreateSliceHook<PluginOptions = DefaultPluginOptions> = (
		context: CreateSliceContext,
		pluginOptions: PluginOptions,
	) => Promisable<void>;

	interface Hook<PluginOptions = DefaultPluginOptions> {
		createSlice<>(
			context: PluginContext<{
				sliceLibrary: SliceLibrary;
				model: prismicT.SharedSliceModel;
			}>,
			pluginOptions: PluginOptions,
		): Promisable<void>;
	}

	export interface SliceLibrary {
		name: string;
	}

	export interface PluginContext<TData = never> {
		data: TData;
		actions: Actions;
		project: Project;
		logger: Logger;
		resolvePath: ResolvePath;
	}

	export interface Actions {
		createFile(path: string, contents: string): Promise<void>;
		fileExists(path: string): Promise<boolean>;
		createDir(path: string, config?: CreateDirConfig): Promise<void>;
		dirExists(path: string): Promise<boolean>;
		readSliceModelFile(path: string): Promise<prismicT.SharedSliceModel>;
		readCustomTypeModelFile(path: string): Promise<prismicT.CustomTypeModel>;
	}

	type CreateDirConfig = {
		recursive?: boolean;
	};

	type ResolvePath = (...pathSegments: string[]) => string;

	export interface Project {
		rootDir: string;
		config: ProjectConfig;
	}

	export interface ProjectConfig {
		version: string;
		repositoryName: string;
		apiEndpoint?: string;
		localSliceSimulatorURL?: string;
		plugins: PluginConfig[];
	}

	export interface PluginConfig<PluginOptions = DefaultPluginOptions> {
		resolve: string;
		options: PluginOptions;
	}

	export type DefaultPluginOptions = Record<string, unknown>;

	export interface Logger {
		error(message: string): void;
		warn(message: string): void;
		info(message: string): void;
		verbose(message: string): void;
		debug(message: string): void;
	}
}
