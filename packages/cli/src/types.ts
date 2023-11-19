export type BaseOptions = {
  help: boolean | undefined;
  version: boolean | undefined;
} & Record<string, unknown>;

export interface Command {
  handle: (options: BaseOptions) => void | Promise<void>;
}
