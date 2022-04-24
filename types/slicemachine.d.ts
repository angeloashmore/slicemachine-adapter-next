type Promisable<T> = T | PromiseLike<T>;

declare module "slicemachine" {
	import * as prismicT from "@prismicio/types";

	export type Plugin<PluginOptions = DefaultPluginOptions> = (
		context: SliceMachineContext<PluginOptions>,
		pluginOptions: PluginOptions,
	) => Promiseable<void>;

	export interface SliceMachineContext<PluginOptions = DefaultPluginOptions>
		extends Omit<PluginContext, "data"> {
		hook(name: "createSlice", fn: CreateSliceHook<PluginOptions>): void;
		hook(name: "updateSlice", fn: UpdateSliceHook<PluginOptions>): void;
	}

	export type CreateSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type CreateSliceContext = PluginContext<CreateSliceData>;
	export type CreateSliceHook<PluginOptions = DefaultPluginOptions> = Hook<
		CreateSliceContext,
		PluginOptions
	>;

	export type UpdateSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type UpdateSliceContext = PluginContext<UpdateSliceData>;
	export type UpdateSliceHook<PluginOptions = DefaultPluginOptions> = Hook<
		UpdateSliceContext,
		PluginOptions
	>;

	export type RemoveSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type RemoveSliceContext = PluginContext<RemoveSliceData>;
	export type RemoveSliceHook<PluginOptions = DefaultPluginOptions> = Hook<
		RemoveSliceContext,
		PluginOptions
	>;

	type Hook<
		Context extends PluginContext = PluginContext,
		PluginOptions = DefaultPluginOptions,
		ReturnType = Promisable<void>,
	> = (context: Context, pluginOptions: PluginOptions) => ReturnType;

	export interface SliceLibrary {
		path: string;
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
		fileExists(path: string): Promise<boolean>;
		writeFile(
			path: string,
			contents: string,
			config?: WriteFileConfig,
		): Promise<void>;
		readFile(path: string): Promise<string>;
		removeFile(path: string): Promise<void>;
		dirExists(path: string): Promise<boolean>;
		createDir(path: string, config?: CreateDirConfig): Promise<void>;
		removeDir(path: string): Promise<void>;
		readSliceModelFile(path: string): Promise<prismicT.SharedSliceModel>;
		readCustomTypeModelFile(path: string): Promise<prismicT.CustomTypeModel>;
	}

	type WriteFileConfig = {
		overwrite?: boolean;
	};

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
