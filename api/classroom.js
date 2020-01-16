module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const save = (req, res) => {
    const classroom = { ...req.body };
    if (req.params.id) classroom.id = req.params.id;

    try {
      existsOrError(classroom.name, "Nome/número não informado");
      existsOrError(classroom.description, "Descrição não informado");
    } catch (msg) {
      res.status(400).send(msg);
    }

    if (classroom.id) {
      app
        .db("classroom")
        .update(classroom)
        .where({ id: classroom.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("classroom")
        .insert(classroom)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };

  const limit = 10;

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app
      .db("classroom")
      .count("id")
      .first();
    const count = parseInt(result.count);

    app
      .db("classroom")
      .select(
        "id",
        "name",
        "description",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      )
      .limit(limit)
      .offset(page * limit - limit)
      .then(classroom => res.json({ data: classroom, count, limit }))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("classroom")
      .where({ id: req.params.id })
      .first()
      .then(classroom => res.json(classroom))
      .catch(err => res.status(500).send(err));
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("classroom")
        .where({ id: req.params.id })
        .del();
      try {
        existsOrError(rowsDeleted, "Sala não foi encontrado");
      } catch (msg) {
        return res.status(400).send(msg);
      }

      res.status(204).send();
    } catch (msg) {
      res.status(500).send(msg);
    }
  };
  return { save, getById, get, remove };
};
