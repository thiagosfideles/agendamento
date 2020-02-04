module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const save = (req, res) => {
    const event = { ...req.body };
    if (req.params.id) event.id = req.params.id;

    try {
      existsOrError(event.date, "Data não informada.");
      existsOrError(event.subject_id, "Disciplina não informada.");
      existsOrError(event.classroom_id, "Sala não informada.");
    } catch (msg) {
      res.status(400).send(msg);
    }
    if (event.id) {
      app
        .db("events")
        .update(event)
        .where({ id: event.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("events")
        .insert(event)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };

  const limit = 10;

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app
      .db("events")
      .count("id")
      .first();
    const count = parseInt(result.count);

    app
      .db("events")
      .select(
        "id",
        "date",
        "subject_id",
        "classroom_id",
        "observation"
      )
      .limit(limit)
      .offset(page * limit - limit)
      .then(event => res.json({ data: event, count, limit }))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("events")
      .where({ id: req.params.id })
      .first()
      .then(event => res.json(event))
      .catch(err => res.status(500).send(err));
  };
  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("events")
        .where({ id: req.params.id })
        .del();
      try {
        existsOrError(rowsDeleted, "Evento não foi encontrado");
      } catch (msg) {
        return res.status(400).send(msg);
      }

      res.status(204).send();
    } catch (msg) {
      res.status(500).send(msg);
    }
  };

  return { get, getById, remove, save };
};
