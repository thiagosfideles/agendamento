exports.up = function(knex) {
  return knex.schema.createTable("events", table => {
    table.increments("id").primary();
    table.timestamp("date").notNull();
    table
      .integer("subject_id")
      .references("id")
      .inTable("subjects")
      .notNull();
    table
      .integer("classroom_id")
      .references("id")
      .inTable("classroom")
      .notNull();
    table.string("observation");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("events");
};
