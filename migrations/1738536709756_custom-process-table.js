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
  pgm.addColumns('process', {
    taskId: {
      type: 'varchar(9)',
      notNull: true
    },
    clusterArn: {
      type: 'varchar(255)',
      notNull: true
    },
  })

  pgm.createIndex('process', 'taskId', {
    name: 'process_task_id_index'
  })

  pgm.createIndex('process', 'clusterArn', {
    name: 'process_cluster_arn_index'
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumns('process', ['taskId', 'clusterArn'])
  pgm.dropIndex('process', 'process_task_id_index')
  pgm.dropIndex('process', 'process_cluster_arn_index')
};
