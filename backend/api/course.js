module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const save = (req, res) => {
    const course = { ...req.body };
    if (req.params.id) course.id = req.params.id;

    try {
      existsOrError(course.name, "Nome não informado");
      existsOrError(course.workload, "Carga horaria não informado");
    } catch (msg) {
      res.status(400).send(msg);
    }

    if (course.id) {
      app
        .db("courses")
        .update(course)
        .where({ id: req.params.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("courses")
        .insert(course)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };

  const limit = 10;

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app
      .db("courses")
      .count("id")
      .first();
    const count = parseInt(result.count);

    app
      .db("courses")
      .select("id", "name", "workload")
      .limit(limit)
      .offset(page * limit - limit)
      .then(courses => res.json({ data: courses, count, limit }))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("courses")
      .where({ id: req.params.id })
      .first()
      .then(course => res.json(course))
      .catch(err => res.status(500).send(err));
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("courses")
        .where({ id: req.params.id })
        .del();
      try {
        existsOrError(rowsDeleted, "Curso não foi encontrado");
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
