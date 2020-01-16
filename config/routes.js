module.exports = app => {
  app
    .route("/users")
    .get(app.api.user.get)
    .post(app.api.user.save);

  app
    .route("/users/:id")
    .get(app.api.user.getById)
    .put(app.api.user.save);

  app
    .route("/courses")
    .get(app.api.course.get)
    .post(app.api.course.save);

  app
    .route("/courses/:id")
    .get(app.api.course.getById)
    .put(app.api.course.save)
    .delete(app.api.course.remove);

  app
    .route("/virtualroom")
    .get(app.api.virtualroom.get)
    .post(app.api.virtualroom.save);

  app
    .route("/virtualroom/:id")
    .get(app.api.virtualroom.getById)
    .put(app.api.virtualroom.save)
    .delete(app.api.virtualroom.remove);

    app
    .route("/subjects")
    .get(app.api.subject.get)
    .post(app.api.subject.save);

  app
    .route("/subjects/:id")
    .get(app.api.subject.getById)
    .put(app.api.subject.save)
    .delete(app.api.subject.remove);

    app
    .route("/classroom")
    .get(app.api.classroom.get)
    .post(app.api.classroom.save);

  app
    .route("/classroom/:id")
    .get(app.api.classroom.getById)
    .put(app.api.classroom.save)
    .delete(app.api.classroom.remove);
};
