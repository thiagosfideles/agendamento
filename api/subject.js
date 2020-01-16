module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const save = (req, res) => {
    const subject = { ...req.body };

    if (!req.params.id) subject.id = req.params.id;

    try {
      existsOrError(subject.name, "Nome não informado");
      existsOrError(subject.module, "Modulo não informado");
      existsOrError(subject.workload, "Carga horaria não informado");
      existsOrError(subject.user_id, "Professor não informado");
      existsOrError(subject.virtualroom_id, "Sala virtual não informado");
    } catch (msg) {
      res.status(400).send(msg);
    }

    if (subject.id) {
      app
        .db("subjects")
        .update(subject)
        .where({ id: subject.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    } else {
      app
        .db("subjects")
        .insert(subject)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }
  };

  const limit = 10;

  const get = async (req, res) => {
    const page = req.query.page || 1;
    const result = await app
      .db("subjects")
      .count("id")
      .first();
    const count = parseInt(result.count);

    app
      .db("subjects")
      .select("id", "name", "module", "workload", "user_id", "virtualroom_id")
      .limit(limit)
      .offset(page * limit - limit)
      .then(subjects => res.json({ data: subjects, count, limit }))
      .catch(err => res.status(500).send(err));
  };

  const getById = (req, res) => {
    app
      .db("subjects")
      .where({ id: req.params.id })
      .first()
      .then(subjects => res.json(subjects))
      .catch(err => res.status(500).send(err));
  };

  const remove = async (req, res) => {
    try {
      const rowsDeleted = await app
        .db("subjects")
        .where({ id: req.params.id })
        .del();
      try {
        existsOrError(rowsDeleted, "Disciplina não foi encontrado");
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
