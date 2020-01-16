exports.up = function(knex) {
    return knex.schema.createTable("subjects", table => {
      table.increments("id").primary();
      table.string("name").notNull();
      table.string("module").notNull();
      table.integer("workload").notNull();
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .notNull();
      table
        .integer("virtualroom_id")
        .references("id")
        .inTable("virtualroom")
        .notNull();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("subjects");
  };
  