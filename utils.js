function loginRedirect(req, res) {
    req.flash('errors', { msg: "You are not logged in." });
    return res.status(302).render('login', { messages: {errors: [], redirectErrors: req.flash('errors') }});
  }

function checkDoubleFigs(userFigurines) {

    const userDoubleFigurines = [];

    userFigurines.forEach(figurine => {
        userFigurines.forEach(figurine_1 => {
            if(figurine._id !== figurine_1._id && figurine.id_figurine === figurine_1.id_figurine) {
                userFigurines.splice(userFigurines.indexOf(figurine_1), 1);
                userDoubleFigurines.push(figurine_1);
                console.log(userDoubleFigurines)
            }
        });
    });
    
    return {userFigurines, userDoubleFigurines};
  }


function handleError(errorMsg, req, res, page = 'home') {
    req.flash('errors', { msg: errorMsg });
    return res.status(400).render(page, { isAuthenticated: true, messages: {errors: req.flash('errors') }});
}

module.exports.loginRedirect = loginRedirect;
module.exports.checkDoubleFigs = checkDoubleFigs;
module.exports.handleError = handleError;