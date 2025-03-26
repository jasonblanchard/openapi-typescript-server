export class NoAcceptableContentType extends Error {
  constructor(contentType: string) {
    super(`No acceptable content type for Accept: ${contentType}`);
  }
}
