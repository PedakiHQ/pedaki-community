export interface CacheMechanism {
  clearCacheUrl(url: string): void | Promise<void>;
}
