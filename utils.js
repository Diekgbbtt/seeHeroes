function loginRedirect() {
    req.flash('errors', { msg: "You are not logged in." });
    return res.status(302).render('login', { messages: {errors: [], redirectError: req.flash('errors') }});
  }


module.exports = {
    loginRedirect: loginRedirect
  };