
exports.loginRedirect = (req, res) => {
    req.flash('errors', { msg: "You are not logged in." });
    return res.status(302).render('login', { messages: {errors: [], redirectErrors: req.flash('errors') }});
  }

exports.checkDoubleFigs = (userFigurines) => {

    const userDoubleFigurines = [];

    userFigurines.forEach(figurine => {
        userFigurines.forEach(figurine_1 => {
            if(figurine._id !== figurine_1._id && figurine.id_figurine === figurine_1.id_figurine) {
                userFigurines.splice(userFigurines.indexOf(figurine_1), 1);
                userDoubleFigurines.push(figurine_1);
            }
        });
    });
    
    return {userFigurines, userDoubleFigurines};
  }

exports.handleError = (errorMsg, req, res, page = 'home') => {
    req.flash('errors', { msg: errorMsg });
    return res.status(400).render(page, { isAuthenticated: true, messages: {errors: req.flash('errors') }});
}