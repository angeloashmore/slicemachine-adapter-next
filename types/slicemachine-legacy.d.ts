declare module "slicemachine-legacy" {
	import * as prismicT from "@prismicio/types";

	export interface SliceMachinePlugin<
		TPluginOptions extends PluginOptions = PluginOptions,
		TProject extends Project = Project,
	> {
		onCreateSlice(
			context: PluginContext<
				TProject,
				{
					sliceLibrary: SliceLibrary;
					model: prismicT.SharedSliceModel;
				}
			>,
			pluginOptions: TPluginOptions,
		): Promise<void>;

		// onUpdateSlice
		// onDeleteSlice

		// onCreateCustomType
		// onUpdateCustomType
		// onDeleteCustomType

		getSliceLibraryIDs(
			context: PluginContext<TProject>,
			pluginOptions: TPluginOptions,
		): Promise<string[]>;
		getSliceLibrarySliceIDs(
			context: PluginContext<
				TProject,
				{
					sliceLibraryID: string;
				}
			>,
			pluginOptions: TPluginOptions,
		): Promise<string[]>;
		getSliceModel(
			context: PluginContext<
				TProject,
				{
					sliceLibraryID: string;
					sliceID: string;
				}
			>,
			pluginOptions: TPluginOptions,
		): Promise<prismicT.SharedSliceModel>;
	}

	export interface SliceLibrary {
		name: string;
	}

	export interface PluginContext<
		TProject extends Project = Project,
		TData = never,
	> {
		data: TData;
		actions: Actions;
		project: TProject;
		logger: Logger;
	}

	export interface Actions {
		createFile(path: string, contents: string): Promise<void>;
		fileExists(path: string): Promise<boolean>;
		createDir(path: string): Promise<void>;
		dirExists(path: string): Promise<boolean>;
		readSliceModelFile(path: string): Promise<prismicT.SharedSliceModel>;
		readCustomTypeModelFile(path: string): Promise<prismicT.CustomTypeModel>;
	}

	export interface Project<Plugins extends Plugin = Plugin> {
		rootDir: string;
		config: ProjectConfig<Plugins>;
		sliceLibraries: SliceLibrary[];
		customTypeModels: prismicT.CustomTypeModel[];
	}

	export interface ProjectConfig<Plugins extends Plugin = Plugin> {
		version: string;
		repositoryName: string;
		apiEndpoint?: string;
		localSliceSimulatorURL?: string;
	}

	export interface Plugin<
		Resolve extends string = string,
		TPluginOptions extends PluginOptions = PluginOptions,
	> {
		resolve: Resolve;
		options: TPluginOptions;
	}

	export type PluginOptions = Record<string, unknown>;
}
