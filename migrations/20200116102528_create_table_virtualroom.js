exports.up = function(knex) {
    return knex.schema.createTable("virtualroom", table => {
      table.increments("id").primary();
      table.string("name").notNull();
      table.integer("module").notNull();
      table
      .integer("course_id")
      .references("id")
      .inTable("courses")
      .notNull();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("virtualroom");
  };
  