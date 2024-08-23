const users = require('../models/users');
const usersPackets = require('../models/packets');
const usersFigurines = require('../models/usersFigurines')
const usersNotifications = require('../models/notifications')


exports.getDashboard = async (req, res) => {
    /* middleware that evaluates if the request has SessionID and if it is correct */
    /* redirect a /dashboard se cookie ed è corretto */
    if(req.isAuthenticated()) {

        users.findById(req.session.passport.user)
            .then((user_profile) => {
                console.log(user_profile)
                usersPackets.find( { id_user: user_profile.id } )
                    .then((user_packets) => {
                        user_packets.forEach(packet => {
                            console.log(packet)
                        });
                        return res.render('dashboard', {user_profile: user_profile, user_packets: user_packets} );
                    })
                    .catch((error) => {
                        console.log('couldn\'t find user \n error : ' + error)
                        req.flash('errors', { msg: "couldn\'t find user \n error : " + error });
                        return res.render('dashboard', { mesasges: { errors: req.flash('errors') } });
                    })

                
            })
            .catch((error) => {
                console.log(error);
                req.flash('errors', { msg: "error validating user" });
                return res.render('dashboard', { mesasges: { errors: req.flash('errors') } });

            });
        }
}


exports.postBuyPoints =  async (req, res) => {
    if(req.isAuthenticated()) {

        console.log(req.session.passport.user);
        users.findOneAndUpdate( {_id: req.session.passport.user }, { $inc: { points: req.body.pointsAmount } }, { new: true })
            .then((result) => {
                console.log(result);
                console.log(result.points);
                res.json({ success: true })
            })
            .catch((error) => {
                console.log('errors' + error);
                req.flash('errors', { msg: "error validating user" });
                // return res.render('dashboard', { mesasges: { errors: req.flash('errors') } })
            
            });
        } else {
        
        alert("you must be logged in to access this page")
        res.redirect('/')
    }
}


exports.getPacketPage = async (req, res) => {
    if(req.isAuthenticated()) {
        
        return res.render('packetspurchase')
    } else {
        
        alert("you must be logged in to access this page")
        res.redirect('/')
    }

}


exports.postBuyPackets = async (req, res) => {
    console.log(req.body.amount);
    if(req.isAuthenticated()) {
        users.findById( {_id: req.session.passport.user})
            .then((user) => {
                console.log(user.points);
                console.log(user._id);
                console.log(user.id);
                if(user.points >= req.body.amount) {
                    users.findOneAndUpdate( { _id: user._id }, { $inc: {points: -req.body.amount } })
                        .then(() => {
                            for (let i = 0; i < req.body.amount; i++) {
                                const packet = new usersPackets({
                                    id_user: req.session.passport.user,
                                    type: 'basic'
                                })
                                packet.save()
                                    .then((packet) => {
                                        console.log("user " + req.session.passport.user + " created successfully" + " packet " + packet._id)
                                    })
                                    .catch((error) => {
                                        console.log('error saving packet \n error: ${error}');
                                        req.flash('errors', { msg: "error saving packet \n error: ${error}" });
                                        return res.render('packetspurchase', { messages: { errors: req.flash('errors') } });
                                    });
                                }
                                return res.redirect('/account/dashboard');
                        })
                        .catch((error) => {
                            console.log('error getting user and decreasing points. \n Error: ', error);
                            req.flash('errors', { msg: "error getting user and decreasing points. Error: ${error}" });
                            return res.render('packetspurchase', { messages: { errors: req.flash('errors') } });

                        });
                } else {
                    console.log('user hasn\'t enough points');
                    req.flash('errors', { msg: "you don't have enough points" });
                    return res.render('packetspurchase', { messages: { errors: req.flash('errors') } });
                }
            })
            .catch((error) => {
                console.log('errors' + error);
                req.flash('errors', { msg: "error validating user" });
            });


    } else {
        
        alert("you must be logged in to access this page")
        res.redirect('/')
    }
}




exports.openPacket = (req, res) => {
    if(req.isAuthenticated()){
        usersPackets.findByIdAndDelete( { _id: req.params.id } )

        
    }

}

exports.getProfileEdit = (req, res) => {
    
}

exports.postProfileEdit = (req, res) => {

}
