
const marketplaceOffers = require('../models/marketplaceOffers');
const usersFigurines = require('../models/usersFigurines');
const users = require('../models/users');


function filterDobuleFigurines(userFigurines) {
    const userDoubleFigurines = [];

    userFigurines.forEach(figurine => {
        userFigurines.forEach(figurine_1 => {
            if(figurine._id !== figurine_1._id && figurine.id_figurine === figurine_1.id_figurine) {
                userFigurines.splice(userFigurines.indexOf(figurine_1), 1);
                userDoubleFigurines.push(figurine_1);
            }
        });
    });
    return userDoubleFigurines;
}

exports.getMarketplace = (req, res) => {
    /* rendering marketplace with values in db */

    /*  const all_offers;
        marketplaceOffers.find().limit(500)
        .then(offers => {
            while offers.lenght>0
                all_offers.push(offers)
                offers = await marketplaceOffers.find().limit(500).skip(all_offers.lenght)
            res.render('marketplace', {offers: all_offers});
        })
    */
 
    marketplaceOffers.find()
        .then((offers) => {
            if(req.isAuthenticated()) {
                users.findById(req.session.passport.user)
                    .then((user_profile) => {
                        usersFigurines.find( { id_user: user_profile.id } )
                        .then((user_figurines) => {
                            const user_doublefigurines = filterDobuleFigurines(user_figurines);
                            console.log(user_doublefigurines)
                            res.render('marketplace', {offers: offers, user_doublefigurines: user_doublefigurines, user_points: user_profile.points});
                        })
                        .catch((error) => {
                            console.log('couldn\'t get user figurines \n error : ' + error)
                            req.flash('errors', { msg: "couldn\'t get user figurines \n error : " + error });
                            return res.render('marketplace', { messages: { errors: req.flash('errors') } });
                        });
                        
                    })
                    .catch((error) => {
                        console.log('couldn\'t get user profile \n error : ' + error)
                        req.flash('errors', { msg: "couldn\'t get user profile \n error : " + error });
                        return res.render('marketplace', { messages: { errors: req.flash('errors') } });
                    })
                
            } else {
                return res.render('marketplace', {offers: offers, user_doublefigurines: [], user_points: 0} );
            }

        })
        .catch((error) => {
            console.log('couldn\'t load marketplace figurines \n error : ' + error)
            req.flash('errors', { msg: "couldn\'t load marketplace figurines \n error : " + error });
            return res.render('marketplace', { messages: { errors: req.flash('errors') } });
        });
}

exports.Exchange = (req, res) => {
   
}

exports.postNewOffer = (req, res) => {
   
}

exports.getFilteredMarketplace = (req, res) => {
   
}



