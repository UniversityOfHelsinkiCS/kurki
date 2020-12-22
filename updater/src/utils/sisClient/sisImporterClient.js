class SisImporterClient {
  constructor({ httpClient, token }) {
    this.httpClient = httpClient;
    this.token = token;
  }

  getAuthorizedRequestOptions(options) {
    const normalizedOptions = options ? options : {};

    const { params } = normalizedOptions;

    return {
      ...normalizedOptions,
      params: { token: this.token, ...params },
    };
  }

  get(url, options) {
    console.log("====================")
    console.log(url, this.getAuthorizedRequestOptions(options))
    console.log("====================")
    return this.httpClient.get(url, this.getAuthorizedRequestOptions(options));
  }
}

export default SisImporterClient;
