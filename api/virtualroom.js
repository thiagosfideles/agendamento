module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const save = (req, res) => {
    const virtualroom = { ...req.body };
    if (req.params.id) virtualroom.id = req.params.id;

    try {
      existsOrError(virtualroom.name, "Nome não informado");
      existsOrError(virtualroom.module, "Modulo não informado");
      existsOrError(virtualroom.course_id, "Curso não informado");
    } catch (msg) {
      res.status(400).send(msg);
    }

    if (virtualroom.id) {
      app
        .db("virtualroom")
        .update(virtualroom)
        .where({ id: req.params.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("virtualroom")
        .insert(virtualroom)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };

  const limit = 10;

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app
      .db("virtualroom")
      .count("id")
      .first();
    const count = parseInt(result.count);

    app
      .db("virtualroom")
      .select("id", "name", "module", "course_id")
      .limit(limit)
      .offset(page * limit - limit)
      .then(virtualroom => res.json({ data: virtualroom, count, limit }))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("virtualroom")
      .where({ id: req.params.id })
      .first()
      .then(virtualroom => res.json(virtualroom))
      .catch(err => res.status(500).send(err));
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("virtualroom")
        .where({ id: req.params.id })
        .del();
      try {
        existsOrError(rowsDeleted, "Sala virtual não foi encontrado");
      } catch (msg) {
        return res.status(400).send(msg);
      }

      res.status(204).send();
    } catch (msg) {
      res.status(500).send(msg);
    }
  };

  return { save, get, getById, remove };
};
