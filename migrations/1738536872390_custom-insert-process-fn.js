/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createFunction('insert_process', ['processId varchar(9)', 'publicAddress varchar(42)', 'secure boolean', 'pathname varchar(255)', 'locked boolean', 'metadata jsonb'], {
    returns: 'void',
    language: 'plpgsql',
    replace: true
  }, `
    BEGIN
      INSERT INTO process (id, "publicAddress", secure, pathname, locked, "taskId", "clusterArn", metadata) 
      VALUES (processId, publicAddress, secure, pathname, locked, metadata->>'taskId', metadata->>'clusterArn', metadata)
      ON CONFLICT (id) DO NOTHING;
    END;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.createFunction('insert_process', ['processId varchar(9)', 'publicAddress varchar(42)', 'secure boolean', 'pathname varchar(255)', 'locked boolean', 'metadata jsonb'], {
    returns: 'void',
    language: 'plpgsql',
    replace: true
  }, `
    BEGIN
      INSERT INTO process (id, "publicAddress", secure, pathname, locked, metadata)
      VALUES (processId, publicAddress, secure, pathname, locked, metadata)
      ON CONFLICT (id) DO NOTHING;
    END;
  `);
};
