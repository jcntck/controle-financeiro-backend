import DatabaseAdapter from '../../src/core/adapters/DatabaseAdapter';

export default async function (dbAdapter: DatabaseAdapter, tableName: string) {
  await dbAdapter.query(`DELETE FROM ${tableName};`);
  await dbAdapter.query(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1;`);
}
