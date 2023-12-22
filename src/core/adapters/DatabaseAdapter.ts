export default interface DatabaseAdapter {
  connect(): Promise<void>;
  query(stmt: string, values?: any[]): Promise<any>;
  close(): Promise<void>;
  end(): Promise<void>;
  checkConnection(): Boolean;
}
