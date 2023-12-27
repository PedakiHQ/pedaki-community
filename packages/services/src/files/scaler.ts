export class SharpImageScaler {
  supported(mimeType: string): boolean {
    return mimeType === 'image/jpeg' || mimeType === 'image/png' || mimeType === 'image/gif';
  }
}
