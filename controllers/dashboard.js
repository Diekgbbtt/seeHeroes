const users = require('../models/users');


exports.getDashboard = async (req, res) => {
    /* middleware that evaluates if the request has SessionID and if it is correct */
    /* redirect a /dashboard se cookie ed è corretto */
    if(req.isAuthenticated()) {

        users.findById(req.session.passport.user)
            .then((user_profile) => {

                return res.render('dashboard', {user_profile: user_profile})

            })
            .catch((error) => {
                req.flash('errors', { msg: "error validating user" });
                return res.render('dashboard', { mesasges: { errors: req.flash('errors') } })

            });

        }

    
    }




exports.openPacket = (req, res) => {

}

exports.getProfileEdit = (req, res) => {
    
}

exports.postProfileEdit = (req, res) => {

}
