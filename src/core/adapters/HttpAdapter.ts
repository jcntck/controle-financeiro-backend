export default interface HttpAdapter {
  on(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}
