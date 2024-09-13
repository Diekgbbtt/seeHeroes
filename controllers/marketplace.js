
const marketplaceOffers = require('../models/marketplaceOffers');
const usersFigurines = require('../models/usersFigurines');
const users = require('../models/users');
const crypto = require('crypto');


const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m"
    },
    bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m"
    }
  };



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

function checkAreSellingFigurinesDouble(sellingFigurines, userDoubleFigurines) {
    let check = true;
    sellingFigurines.forEach(figurine => {
        userDoubleFigurines.forEach(figurine_double => {
            if(figurine.user_figurine_id === figurine_double._id) {
                check = false;
            }
        });
    });
    return check;
}


function checkAlreadySellingFigurines(offerSellingFigurines, SellingFigurines) {

}

function checkDoubleOffer(user_offers, user_new_offer) {

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

exports.getPertinentHeroes = (req, res) => {

    if(req.isAuthenticated()) { 
        const ts = new Date().toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
            }).replace(/[/,: ]/g, '-');
        const hash_data = `${ts}${process.env.MARVEL_PRIVATE_KEY}${process.env.MARVEL_PUBLIC_KEY}`;
        const hash = crypto.createHash('md5').update(hash_data).digest('hex');

        fetch('https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=' + req.params.search_term + '&apikey=de511cb926dc8e0b6caf71daa20b40be&ts=' + ts + '&hash=' + hash)
            .then((response) => response.json())
            /* if more instructions the .json() are wapped in the promise construct the first one to complete(return?) 
            will be the one considered by the following then()
            This happens because pertinentHeroes.json() returns a new promise, but you're not returning or awaiting it within the function. 
            As a result, the console.log(pertinentHeroes) will show the raw response object, not the parsed JSON data.
            */
            .then((response_json) => { 
                if(response_json.data.results.length > 0) {
                    const pertinentHeroes = []
                    response_json.data.results.forEach((hero) => {
                        const pertinentHero = {}
                        pertinentHero.name = hero.name
                        pertinentHero.id = hero.id
                        pertinentHero.image_path = hero.thumbnail.path
                        pertinentHeroes.push(pertinentHero)
                    })
                    // const PersistentHeroesNameDict = {
                    //     "pertinentHeroesName": pertinentHeroesName
                    // }
                    return res.send(pertinentHeroes);
                }
                else {
                    return [];
                }
            })


    } else {
        console.log('not authenticated')
    }
}
exports.postNewOffer = (req, res) => {
    if(req.isAuthenticated()) {
            users.findById(req.session.passport.user)
                .then((user_profile) => {
                    usersFigurines.find( { id_user: user_profile.id } )
                    .then((user_figurines) => {
                        const user_doublefigurines = filterDobuleFigurines(user_figurines);
                        console.log(colors.fg.blue + req.body + colors.reset)
                        // check user isn't  creating an offer equal to another of his own
                        marketplaceOffers.find({username: user_profile.username})
                        .then((user_offers) => {
                            if(checkDoubleOffer(user_offers, req.body)) {
                                if(checkAlreadySellingFigurines(req.body.selling.figurines, user_offers)) {
                                    if(checkAreSellingFigurinesDouble(req.body.selling.figurines, user_doublefigurines)) {
                                        const marketplaceOffer = new marketplaceOffers({
                                            username: user_profile.username,
                                            requesting: {
                                                figurines: [],
                                                points: req.body.buying.points
                                            },
                                            offering: {
                                                figurines: [],
                                                points: req.body.selling.points
                                            }
                                        })
                                        req.body.buying.figurines.forEach((figurine) => {
                                            marketplaceOffer.requesting.figurines.push(figurine)
                                        })
                                        req.body.selling.figurines.forEach((figurine) => {
                                            marketplaceOffer.offering.figurines.push(figurine)
                                        })
                                        console.log(colors.fg.red + marketplaceOffer + colors.reset)
                                        marketplaceOffer.save()
                                        res.statusCode = 200;
                                        res.json({ success: true, messages: [] })
                                    } else {
                                        console.log('user isn\'t selling double figurines')
                                        // return res.send()
                                    }
                                }
                            }                        
                        })
                        .catch((error) => {
                            console.log('couldn\'t find user offers \n error : ' + error)
                        })
                    })
                    .catch((error) => {
                        console.log('couldn\'t load user figurines \n error : ' + error)
                    })
                
                })
                .catch((error) => {
                    console.log('couldn\'t find the user \n error : ' + error)
                })

    }
   
}

exports.getFilteredMarketplace = (req, res) => {
   
}



