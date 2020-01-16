exports.up = function(knex) {
    return knex.schema.createTable("class", table => {
      table.increments("id").primary();
      table.timestamp("date").notNull();
      table
        .integer("course_id")
        .references("id")
        .inTable("courses");
      table
        .integer("classroom_id")
        .references("id")
        .inTable("classroom");
      table
        .integer("virtualroom_id")
        .references("id")
        .inTable("virtualroom");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("class");
  };
  