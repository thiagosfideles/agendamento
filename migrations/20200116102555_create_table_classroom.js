exports.up = function(knex) {
    return knex.schema.createTable("classroom", table => {
      table.increments("id").primary();
      table.string("name").notNull();
      table.string("description").notNull();
      table
        .boolean("monday")
        .notNull()
        .defaultTo(false);
      table
        .boolean("tuesday")
        .notNull()
        .defaultTo(false);
      table
        .boolean("wednesday")
        .notNull()
        .defaultTo(false);
      table
        .boolean("thursday")
        .notNull()
        .defaultTo(false);
      table
        .boolean("friday")
        .notNull()
        .defaultTo(false);
      table
        .boolean("saturday")
        .notNull()
        .defaultTo(false);
      table
        .boolean("sunday")
        .notNull()
        .defaultTo(false);
    });
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable("classroom");
  };
  