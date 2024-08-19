

exports.getHome = (req, res) => {
    const isAuthenticated = req.isAuthenticated();

    res.render('home', { isAuthenticated });
}



exports.getFAQ = (req, res) => {
    /* scroll to FAQ section*/
}