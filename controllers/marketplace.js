
const marketplaceOffers = require('../models/marketplaceOffers');

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
            console.log(offers) 
            return res.render('marketplace', {offers: offers} );
        })
        .catch((error) => {
            console.log('couldn\'t load marketplace figurines \n error : ' + error)
            req.flash('errors', { msg: "couldn\'t load marketplace figurines \n error : " + error });
            return res.render('marketplace', { messages: { errors: req.flash('errors') } });
        });
}


exports.postOffer = (req, res) => {
    /* creating a new offer */
}

exports.postProposal = (req, res) => {
    /* creating a new proposal */
}

exports.Exchange = (req, res) => {
   
}

exports.getNewOfferForm = (req, res) => {
   
}

exports.postNewOffer = (req, res) => {
   
}

exports.getFilteredMarketplace = (req, res) => {
   
}



