/*
Connector to PostgreSQL
includes simple query builder
спизжено из метархии, спасибо им, но я выбросил то что мне не нужно
*/
async () => {
  const { Pool } = require('pg');
  const OPERATORS = ['>=', '<=', '<>', '>', '<'];

  const updates = (delta, firstArgIndex = 1) => {
    const clause = [];
    const args = [];
    let i = firstArgIndex;
    const keys = Object.keys(delta);
    for (const key of keys) {
      const value = delta[key];
      clause.push(`"${key}" = $${i++}`);
      const empty = value === null || value === undefined;
      const data = empty ? null : value.toString();
      args.push(data);
    }
    return { clause: clause.join(', '), args };
  };

  const queryToString = (prepared) => {
    let { sql } = prepared;
    let i = 1;
    for (const arg of prepared.args) {
      sql = sql.replace('$' + i.toString(), `"${arg}"`);
      i++;
    }
    return sql;
  };

  const whereValue = (value) => {
    if (typeof value === 'string') {
      for (const op of OPERATORS) {
        const len = op.length;
        if (value.startsWith(op)) {
          return [op, value.substring(len)];
        }
      }
      if (value.includes('*') || value.includes('?')) {
        const mask = value.replace(/\*/g, '%').replace(/\?/g, '_');
        return ['LIKE', mask];
      }
    }
    return ['=', value];
  };

  const buildFields = (fields) => {
    if (fields[0] === '*') return '*';
    const list = [];
    for (const field of fields) {
      list.push(field.includes('(') ? field : `"${field}"`);
    }
    return list.join(', ');
  };

  const buildWhere = (conditions, firstArgIndex = 1) => {
    const disjunction = [];
    const args = [];
    let i = firstArgIndex;
    for (const where of conditions) {
      const conjunction = [];
      const keys = Object.keys(where);
      for (const key of keys) {
        const [operator, value] = whereValue(where[key]);
        conjunction.push(`"${key}" ${operator} $${i++}`);
        args.push(value);
      }
      disjunction.push(conjunction.join(' AND '));
    }
    return { clause: disjunction.join(' OR '), args };
  };

  class Modify {
    constructor(db, sql, args) {
      this.db = db;
      this.sql = sql;
      this.args = args;
      this.options = {};
    }

    returning(field) {
      const fields = typeof field === 'string' ? [field] : field;
      this.options.returning = fields;
      return this;
    }

    prepare() {
      const sql = [this.sql];
      const { returning } = this.options;
      if (returning) {
        if (returning[0] === '*') sql.push('RETURNING *');
        else sql.push('RETURNING "' + returning.join('", "') + '"');
      }
      return { sql: sql.join(' '), args: this.args };
    }

    then(resolve, reject) {
      const { sql, args } = this.prepare();
      return this.db
        .query(sql, args)
        .then(({ rows }) => resolve(rows[0]), reject);
    }

    toString() {
      return queryToString(this.prepare());
    }

    toObject() {
      return {
        sql: this.sql,
        args: [...this.args],
        options: this.options,
      };
    }

    static from(db, metadata) {
      const { sql, args, options } = metadata;
      const modify = new Modify(db, sql, args);
      Object.assign(modify.options, options);
      return modify;
    }
  }

  class Query {
    constructor(db, table, fields, ...where) {
      this.db = db;
      this.table = table;
      this.fields = fields;
      this.where = where;
    }

    prepare() {
      const args = [];
      const { table, fields, where } = this;
      const names = buildFields(fields);
      const sql = [`SELECT ${names} FROM "${table}"`];
      if (where.length !== 0) {
        const cond = buildWhere(where);
        sql.push('WHERE ' + cond.clause);
        args.push(...cond.args);
      }
      return { sql: sql.join(' '), args };
    }

    then(resolve, reject) {
      const { sql, args } = this.prepare();
      return this.db
        .query(sql, args)
        .then(({ rows }) => (resolve ? resolve(rows) : rows), reject);
    }
    catch(onReject) {
      return this.then(null, onReject);
    }
  }

  class PGDatabase {
    constructor(options) {
      this.pool = new Pool(options);
      this.console = console;
      this.model = options.model || null;
    }
    select(table, fields = ['*'], ...conditions) {
      return new Query(this, table, fields, ...conditions);
    }

    query(sql, values) {
      const data = values ? values.join(',') : '';
      this.console.debug(`${sql}\n[${data}]`);

      return this.pool.query(sql, values).catch((error) => {
        this.console.error('DB Error!', error);
        throw error;
      });
    }

    insert(table, record) {
      const keys = Object.keys(record);
      const nums = new Array(keys.length);
      const data = new Array(keys.length);
      let i = 0;
      for (const key of keys) {
        data[i] = record[key];
        nums[i] = `$${++i}`;
      }
      const fields = '"' + keys.join('", "') + '"';
      const params = nums.join(', ');

      const entity = this.model ? this.model.entities.get(table) : null;
      if (entity && entity.kind === 'registry') {
        return this.register(table, fields, params, data);
      }

      const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`;
      return new Modify(this, sql, data);
    }

    delete(table, ...conditions) {
      const { clause, args } = buildWhere(conditions);
      const sql = `DELETE FROM "${table}" WHERE ${clause}`;
      return new Modify(this, sql, args);
    }

    update(table, delta = null, ...conditions) {
      const upd = updates(delta);
      const cond = buildWhere(conditions, upd.args.length + 1);
      const sql = `UPDATE "${table}" SET ${upd.clause} WHERE ${cond.clause}`;
      const args = [...upd.args, ...cond.args];
      return new Modify(this, sql, args);
    }
  }

  return {
    create: (options) => new PGDatabase(options),
  };
};
