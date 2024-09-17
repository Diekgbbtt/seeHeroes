
const marketplaceOffers = require('../models/marketplaceOffers');
const usersFigurines = require('../models/usersFigurines');
const users = require('../models/users');
const crypto = require('crypto');
const utils = require('../utils');


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


function checkIsOfferComplete(offer) {

    let check = true
    if((offer.buying.figurines.length === 0 && offer.buying.points === 0) || 
        (offer.selling.figurines.length === 0 && offer.selling.points === 0)) {
            check = false;
    }
    return check;
}

function checkAreSellingFigurinesDouble(sellingFigurines, userDoubleFigurines) {
    check = true
    sellingFigurines.forEach(figurine => {
        userDoubleFigurines.forEach(figurine_double => {
            if(figurine.user_figurine_id === figurine_double._id) {
                check = false;
            }
        });
    });
    return check;
}

function filterUserOffers(allOffers, username) {
    let userOffers = [];
    allOffers.forEach(offer => {
        if(offer.username === username) {
            userOffers.push(offer._id);
        }
    });
    return userOffers;
}

function checkAlreadySellingFigurines(offerSellingFigurines, user_offers) {
    let check = true;
    let sellingFigs = []
    offerSellingFigurines.forEach(sellingFigurine => {
        user_offers.forEach(offer => {
            offer.offering.figurines.forEach(offerFigurine => {
                if(sellingFigurine.figurine_id === offerFigurine.figurine_id) {
                    check = false;
                    sellingFigs.push(sellingFigurine.figurine_name);
                }
            });
        });
    });
    return {check, sellingFigs};
}

function checkUserHasBuyingOfferFigurine(offerRequestingFigurines, userFigurines) {
    let checkResult = true
    let userFigurinesId = []
    if(offerRequestingFigurines.length > 0) {
        if(userFigurines.length > 0) {
            offerRequestingFigurines.forEach(requestingFigurine => {
                userFigurines.forEach(figurine => {
                    if(requestingFigurine.figurine_name === figurine.name) {
                        console.log(colors.fg.green + "FOUND: " + figurine._id + colors.reset)
                        userFigurinesId.push(figurine._id);
                        offerRequestingFigurines.splice(offerRequestingFigurines.indexOf(requestingFigurine), 1);
                        return true;
                    }
                });
            });
        } else {
            checkResult = false;
            return {checkResult, userFigurinesId};
        }
    } else {
        checkResult = true;
        return {checkResult, userFigurinesId}; // offer has no requesting figurine, only points if there are no userFigurines will be handled later
    }
    console.log(colors.fg.yellow + "user figurines id: " + userFigurinesId + colors.reset)
    checkResult = offerRequestingFigurines.length === 0;
    return {checkResult, userFigurinesId};
}

function checkuserFigurinesInAnotherOffer(userFigurinesId, username) {
    let check = true;
    marketplaceOffers.find({username: username})
    .then((user_offers) => {
        user_offers.forEach((offer) => {
            offer.offering.figurines.forEach(offerFigurine => {
            userFigurinesId.forEach(figId => {
                if(offerFigurine.figurine_id === figId) {
                    console.log(colors.fg.yellow + "user figurine already in another offer" + figId + colors.reset)
                    check = false;
                }
            });
        });
    });
    })
    return check;
}
function exchangeData(offer, id_user) {
    let check = true;
    users.findOne({username: offer.username })
        .then((offer_user) => {
            if(offer.requesting.figurines.length > 0) {
                offer.requesting.figurines.forEach((requestingFigurine) => {
                    usersFigurines.findOneAndUpdate(
                        {id_figurine: requestingFigurine.figurine_id, id_user: id_user},
                        { $set: {id_user: offer_user._id} },
                        {new: true}
                    )
                    .then((updated_user_figurine) => {
                      //  console.log(colors.fg.red + "updated user figurine " + updated_user_figurine._id + " to " + updated_user_figurine.id_user + colors.reset)
                    })
                })
            }
            // check if current user has active exchange offers for the figurine he is selling(requestingFigurine)
            if(offer.requesting.points > 0) {
                users.findOneAndUpdate(
                    {_id: id_user},
                    { $inc: {points: -offer.requesting.points} },
                    {new: true}
                )
                .then((updated_user) => {
                    //console.log(colors.fg.green + "current user " + updated_user.username + " has " + updated_user.points + " points" + colors.reset)
                })
                users.findOneAndUpdate(
                    {_id: offer_user._id},
                    { $inc: {points: offer.requesting.points} },
                    {new: true}
                )
                .then((updated_user) => {
                    //console.log(colors.fg.yellow + "offer user " + updated_user.username + " has " + updated_user.points + " points" + colors.reset)
                })
            }
            if(offer.offering.figurines.length > 0) {
                offer.offering.figurines.forEach((sellingFigurine) => {
                    usersFigurines.findOneAndUpdate(
                        {_id: sellingFigurine.figurine_id},
                        { $set: {id_user: id_user} },
                        {new: true}
                    )
                    .then((updated_user_figurine) => {
                      //  console.log(colors.fg.red + "updated user figurine " + updated_user_figurine._id + " to " + updated_user_figurine.id_user + colors.reset)
                    })
                })
            }
            // check if current user has active exchange offers for the figurine he is selling(requestingFigurine)
            if(offer.offering.points > 0) {
                users.findOneAndUpdate(
                    {_id: id_user},
                    { $inc: {points: offer.offering.points} },
                    {new: true}
                )
                .then((updated_user) => {
                    //console.log(colors.fg.green + "current user " + updated_user.username + " has " + updated_user.points + " points" + colors.reset)
                })
                // for the user of the offer, selling points were deducted on offer creation to preserve credits
            }

        })
        .catch((error) => {
            check = false;
        })

    return check;
};

/**
 * @swagger
 * /marketplace:
 *   get:
 *     summary: Get marketplace offers
 *     description: >
 *       Retrieve all marketplace offers. If authenticated, it will also return the user's figurines and points.
 *     responses:
 *       200:
 *         description: Successful request; returns marketplace offers and user data (if authenticated).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: List of marketplace offers.
 *                 user_doublefigurines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: User's double figurines if authenticated.
 *                 user_points:
 *                   type: integer
 *                   description: Points available for the user if authenticated.
 *       401:
 *         description: Unauthorized, user is not authenticated.
 *       500:
 *         description: Internal server error.
 */

exports.getMarketplace = async (req, res) => {

    marketplaceOffers.find()
        .then((offers) => {
            if(req.isAuthenticated()) {
                users.findById(req.session.passport.user)
                    .then((user_profile) => {
                        usersFigurines.find( { id_user: user_profile.id } )
                        .then((user_figurines) => {
                            const { userDoubleFigurines } = utils.checkDoubleFigs(user_figurines)
                            const userOffers = filterUserOffers(offers, user_profile.username);
                            res.render('marketplace', {offers: offers, user_offers: userOffers || [], user: req.session.passport.user, user_doublefigurines: userDoubleFigurines || [], user_points: user_profile.points});
                        })
                        .catch((error) => {
                            utils.handleError('couldn\'t get user figurines \n error : ' + error, req, res);
                        });
                        
                    })
                    .catch((error) => {
                        utils.handleError('couldn\'t get user profile \n error : ' + error, req, res);
                    })
                
            } else {
                return res.render('marketplace', {offers: offers, user_doublefigurines: [], user_points: 0} );
            }

        })
        .catch((error) => {
            utils.handleError('couldn\'t load marketplace figurines \n error : ' + error, req, res);
        });
}

/**
 * @swagger
 * /marketplace/exchange/{exchange_offer_id}:
 *   post:
 *     summary: Exchange an offer
 *     description: Handles the exchange of offers based on user authentication and available resources.
 *     security:
 *         - SessionAuth: []
 *     parameters:
 *       - name: exchange_offer_id
 *         in: path
 *         required: true
 *         description: The ID of the exchange offer to process.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful exchange of the offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 errorMessage:
 *                   type: string
 *                   example: ''
 *       302:
 *         description: Unauthorized, user needs to be authenticated
 *       400:
 *         description: Not Found, resource could not be found
 */
exports.Exchange = (req, res) => {

    if(req.isAuthenticated()) { 
        const exchange_offer_id = req.params.exchange_offer_id;
        const id_user = req.session.passport.user;
        marketplaceOffers.findById(exchange_offer_id)
            .then((offer) => {
                users.findById(id_user)
                .then((user_profile) => {
                        if(offer.requesting.points > user_profile.points) {
                            res.json({success: false, errorMessage: 'you don\'t have enough points to accept this exchange'});
                            return;
                        }
                    usersFigurines.find( { id_user: id_user } )
                    .then((user_figurines) => {
                            const { checkResult, userFigurinesId } = checkUserHasBuyingOfferFigurine(offer.requesting.figurines, user_figurines)
                            if(checkResult) {
                                console.log('you have the figurines requested in the exchange offer');
                                if(!checkuserFigurinesInAnotherOffer(userFigurinesId, user_profile.username)) {
                                    res.status(400).json({success: false, errorMessage: 'the figurine requested in the exchange is already in another offer'});
                                    return;
                                }
                            } else {
                                res.status(400).json({success: false, errorMessage: 'you don\'t have the figurines requested in the exchange offer'});
                                return;
                            }
                            console.log('you have the figurines requested in the exchange offer \n\n exchanginData');
                            if(exchangeData(offer, id_user)) {
                                marketplaceOffers.findOneAndDelete({_id: exchange_offer_id})
                                .then((deletedOffer) => {
                                    console.log(colors.fg.cyan + 'deleted offer : ' + deletedOffer + '\n\n\n' +  colors.reset)
                                    res.statusCode = 200;
                                    res.json({success: true, errorMessage: ''});
                                })

                            } else {
                                res.json({success: false, errorMessage: 'error exchanging data'});
                            }
                        })
                        .catch((error) => {
                            utils.handleError('couldn\'t get user figurines \n error : ' + error, req, res);
                        });

                })
                .catch((error) => {
                    utils.handleError('couldn\'t get user profile \n error : ' + error, req, res);
                })
            })
            .catch((error) => {
                utils.handleError('couldn\'t get offer \n error : ' + error, req, res);
            })
    } else {
        utils.loginRedirect(req, res);
    }
}


/**
 * @swagger
 * /marketplace/newoffer/search/{search_term}:
 *   get:
 *     summary: Get pertinent Marvel heroes
 *     description: Retrieves Marvel heroes whose names start with the provided search term.
 *     security:
 *         - SessionAuth: []
 *     parameters:
 *       - name: search_term
 *         in: path
 *         required: true
 *         description: The search term to filter Marvel heroes by name.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of Marvel heroes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the Marvel hero
 *                   id:
 *                     type: integer
 *                     description: The ID of the Marvel hero
 *                   image_path:
 *                     type: string
 *                     description: URL of the hero's image
 *       302:
 *         description: Redirection due to unauthorized access, user needs to be authenticated
 *       400:
 *         description: Bad Request, invalid search term or Marvel API error
 */
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
                    return res.send(pertinentHeroes);
                }
                else {
                    return [];
                }
            })


    } else {
        utils.loginRedirect(req, res);
    }
}


/**
 * @swagger
 * /marketplace/newoffer/confirm:
 *   post:
 *     summary: Create a new marketplace offer
 *     description: Allows an authenticated user to post a new offer to the marketplace.
 *     security:
 *         - SessionAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buying:
 *                 type: object
 *                 properties:
 *                   points:
 *                     type: integer
 *                     description: Points requested for the exchange
 *                   figurines:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties: 
 *                         figurine_name:
 *                           type: string
 *                           description: Hero name
 *                         figurine_image_path:
 *                           type: string
 *                           description: Hero image URL
 *                         figurine_id:
 *                           type: string
 *                           description: ID that identifies the hero                       
 *                     description: List of figurines requested
 *               selling:
 *                 type: object
 *                 properties:
 *                   points:
 *                     type: integer
 *                     description: Points offered in exchange
 *                   figurines:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties: 
 *                         figurine_name:
 *                           type: string
 *                           description: Hero name
 *                         figurine_image_path:
 *                           type: string
 *                           description: Hero image URL
 *                         figurine_id:
 *                           type: string
 *                           description: ID that identifies the figurine        
 *                     description: List of figurines offered
 *             required:
 *               - buying
 *               - selling
 *     responses:
 *       200:
 *         description: Successful creation of the offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 errorMessage:
 *                   type: string
 *                   example: ''
 *       400:
 *         description: Bad Request, offer data is incomplete or invalid
 *       302:
 *         description: Unauthorized request, redirect to login page
 */
exports.postNewOffer = (req, res) => {
    if (req.isAuthenticated()) {
      if(checkIsOfferComplete(req.body)) {
        // check user has enough selling points included in the offer
        users.findOne({ _id: req.session.passport.user })
        .then((user_profile) => {
            if (req.body.selling.points <= user_profile.points) {
                users.findOneAndUpdate({ _id: req.session.passport.user},
                        { $inc: { points: -req.body.selling.points } },
                        { new: true }
                    )
                    .then((user_profile) => {
                        usersFigurines.find({
                            id_user: user_profile.id
                        })
                        .then((user_figurines) => {
                        const { userDoubleFigurines } = utils.checkDoubleFigs(user_figurines);
                        console.log(colors.fg.blue + req.body + colors.reset)
                        marketplaceOffers.find({
                            username: user_profile.username
                            })
                            .then((user_offers) => {
                                const {check, sellingFigs} =  checkAlreadySellingFigurines(req.body.selling.figurines, user_offers)
                                if (check) {
                                    if (checkAreSellingFigurinesDouble(req.body.selling.figurines, userDoubleFigurines)) {
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
                                        res.status(200).json({
                                        success: true,
                                        errorMessage: ""
                                        })
                                    } else {
                                        res.status(400).json({
                                            success: false,
                                            errorMessage: 'you aren\'t selling double figurines'
                                        })
                                    }
                                } else {
                                    let errorMessage = 'you are already selling these figurines : \n'
                                    sellingFigs.forEach((figurine) => {
                                        errorMessage += figurine + '\n'
                                    })
                                    res.status(400).json({
                                        success: false,
                                        errorMessage: errorMessage
                                    })
                                }
                            })
                            .catch((error) => {
                            console.log('couldn\'t find user of the offer offers \n error : ' + error)
                                res.status(400).json({
                                    success: false,
                                    errorMessage: 'couldn\'t load user figurines \n error : ' + error
                                })
                            })
                        })
                        .catch((error) => {
                            console.log('couldn\'t load user figurines \n error : ' + error)
                            res.status(400).json({
                                success: false,
                                errorMessage: 'couldn\'t load user figurines \n error : ' + error
                            })
                        })
                    })
                    .catch((error) => {
                        utils.handleError('error getting user profile \n error: ' + error, req, res)
                    })
        } else {
            res.status(400).json({
                success: false,
                errorMessage: 'you don\'t have enough points to create this exchange offer'
            })
        }
     })
        .catch((error) => {
            utils.handleError('error getting user profile \n error: ' + error, req, res)
        })  
    } else {
        console.log('offer isn\'t complete, there must be at least a figurine or point request in both buying and selling')
        res.status(400).json({
            success: false,
            errorMessage: 'offer isn\'t complete, there must be at least a figurine or point request in both buying and selling'
        })
    }
  } else {
      utils.loginRedirect(req, res);
  }
}

exports.removeOffer = (req, res) => {
    if(req.isAuthenticated()) {
        users.findById(req.session.passport.user)
        .then((user_profile) => {
            marketplaceOffers.findOneAndDelete({
                _id: req.body.offerId,
                username: user_profile.username
            })
            .then((deletedOffer) => {
                if(deletedOffer.offering.points > 0) {
                    users.findOneAndUpdate({_id: user_profile._id}, 
                        { $inc: { points: deletedOffer.offering.points } },
                        { new: true }
                    )
                    .then((user) => {
                        console.log(colors.fg.red + colors.bg.green + 'user updated' + colors.reset)  
                    })
                    .catch((error) => {
                        utils.handleError('couldn\'t update user points \n error: ' + error, req, res)
                    })
                }
                res.status(200).json({
                    success: true,
                    errorMessage: ''
                })
            })
            .catch((error) => {
                utils.handleError('bad request parameter or you don\'t own the offer \n error: ' + error, req, res)
            })
        })
        .catch((error) => {
            utils.handleError('error getting user profile \n error: ' + error, req, res)
        })
    } else {
        utils.loginRedirect(req, res);
    }
}

exports.getFilteredMarketplace = (req, res) => {
   
}



