declare module "slicemachine" {
	import * as prismicT from "@prismicio/types";

	// ===========================================================================
	//
	// Primary types
	//
	// ===========================================================================

	export type Plugin<PluginOptions = DefaultPluginOptions> = (
		context: SliceMachineContext<PluginOptions>,
		pluginOptions: PluginOptions,
	) => Promiseable<void>;

	export interface SliceMachineContext<PluginOptions = DefaultPluginOptions>
		extends Omit<PluginContext, "data"> {
		hook(name: "createSlice", fn: CreateSliceHook<PluginOptions>): void;
		hook(name: "updateSlice", fn: UpdateSliceHook<PluginOptions>): void;
		hook(name: "removeSlice", fn: RemoveSliceHook<PluginOptions>): void;
		hook(name: "codeSnippet", fn: CodeSnippetsHook<PluginOptions>): void;
	}

	// ===========================================================================
	//
	// HOOK: createSlice
	//
	// ===========================================================================

	export type CreateSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type CreateSliceContext = PluginContext<CreateSliceData>;
	export type CreateSliceHook<PluginOptions = DefaultPluginOptions> = Hook<
		CreateSliceContext,
		PluginOptions
	>;

	// ===========================================================================
	//
	// HOOK: updateSlice
	//
	// ===========================================================================

	export type UpdateSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type UpdateSliceContext = PluginContext<UpdateSliceData>;
	export type UpdateSliceHook<PluginOptions = DefaultPluginOptions> = Hook<
		UpdateSliceContext,
		PluginOptions
	>;

	// ===========================================================================
	//
	// HOOK: removeSlice
	//
	// ===========================================================================

	export type RemoveSliceData = {
		sliceLibrary: SliceLibrary;
		model: prismicT.SharedSliceModel;
	};
	export type RemoveSliceContext = PluginContext<RemoveSliceData>;
	export type RemoveSliceHook<PluginOptions = DefaultPluginOptions> = Hook<
		RemoveSliceContext,
		PluginOptions
	>;

	// ===========================================================================
	//
	// HOOK: codeSnippets
	//
	// ===========================================================================

	enum RootModelType {
		Slice = "Slice",
		CustomType = "CustomType",
	}
	export type CodeSnippetData = {
		fieldPath: string[];
		sliceLibrary: SliceLibrary;
	} & (
		| {
				rootModelType: RootModelType.Slice;
				rootModel: prismicT.SharedSliceModel;
				model: prismicT.CustomTypeModelFieldForGroup;
		  }
		| {
				rootModelType: RootModelType.CustomType;
				rootModel: prismicT.CustomTypeModel;
				model: prismicT.CustomTypeModelField;
		  }
	);
	type CodeSnippetDescriptor = {
		label: string;
		language: string;
		preCode?: string;
		code: string;
		postCode?: string;
	};
	export type CodeSnippetReturnType = Promisable<
		CodeSnippetDescriptor | CodeSnippetDescriptor[] | undefined
	>;
	export type CodeSnippetContext = PluginContext<CodeSnippetData>;
	export type CodeSnippetHook<PluginOptions = DefaultPluginOptions> = Hook<
		CodeSnippetContext,
		PluginOptions,
		CodeSnippetReturnType
	>;

	// ===========================================================================
	//
	// General types
	//
	// ===========================================================================

	type Promisable<T> = T | PromiseLike<T>;

	type Hook<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Context extends PluginContext<any> = PluginContext,
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
	}

	export interface Actions {
		getSliceLibrarySliceIDs(sliceLibraryID: string): Promise<string[]>;
	}

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
