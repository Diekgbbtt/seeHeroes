const users = require('../models/users');
const usersPackets = require('../models/packets');
const usersFigurines = require('../models/usersFigurines')
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


/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get user dashboard
 *     description: >
 *       Retrieves the dashboard for the authenticated user, including user profile, 
 *       packets, and figurines. Redirects to login page if not authenticated.
 *     security:
 *         - SessionAuth: []
 *     responses:
 *       200:
 *         description: Successful request; user dashboard is displayed.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       302:
 *         description: Redirects to login page if not authenticated.
 *       400:
 *         description: bad request parameter or other server errors fetching user data; redirect to home page
 */
exports.getDashboard = async (req, res) => {
    /* middleware that evaluates if the request has SessionID and if it is correct */
    /* redirect a /dashboard se cookie ed è corretto */
    if(req.isAuthenticated()) {
        users.findById(req.session.passport.user)
            .then((user_profile) => {
                usersPackets.find( { id_user: user_profile.id } )
                    .then((user_packets) => {
                        usersFigurines.find( { id_user: user_profile.id } )
                            .then((user_figurines) => {
                                console.log(user_figurines)
                                const { userFigurines, userDoubleFigurines } = utils.checkDoubleFigs(user_figurines)
                                console.log(colors.fg.black + colors.bg.red + "list of user figurine : \n" + userFigurines + colors.reset)
                                console.log(colors.fg.black + colors.bg.yellow + "list of user double figurine : \n" + userDoubleFigurines + colors.reset)
                                return res.render('dashboard', {user_profile: user_profile, user_packets: user_packets, user_figurines: userFigurines, user_doublefigurines: userDoubleFigurines } );
                            })
                            .catch((error) => {
                                utils.handleError('couldn\'t find user figurines \n error : ' + error, req, res);
                            })
                    })
                    .catch((error) => {
                        utils.handleError('couldn\'t find user packets \n error : ' + error, req, res);
                    })                
            })
            .catch((error) => {
                utils.handleError('couldn\'t find user \n error : ' + error, req, res);
            });
        } else {
            utils.loginRedirect(req, res);
        }
}

/**
 * @swagger
 *  /dashboard/buypoints/confirm:
 *   post:
 *     summary: Buy points for the user
 *     description: >
 *       Allows the authenticated user to buy points by updating their profile.
 *       If not authenticated, redirects to login page.
 *     security:
 *         - SessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pointsAmount:
 *                 type: integer
 *                 description: The number of points to be purchased.
 *     responses:
 *       200:
 *         description: Successful request; points added to user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       302:
 *         description: Redirects to login page if not authenticated.
 *       400:
 *         description: bad request parameter or other server errors fetching user data; redirect to home page
 */
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
                utils.handleError('couldn\'t find user and update points \n error : ' + error, req, res,);
            });
        } else {
            utils.loginRedirect(req, res);
    }
}

/**
 * @swagger
 * /dashboard/buypackets:
 *   get:
 *     summary: Get packet purchase page
 *     description: >
 *       Renders the packet purchase page for authenticated users. Redirects to login 
 *       if not authenticated.
 *     security:
 *         - SessionAuth: []
 *     responses:
 *       200:
 *         description: Successful request; packet purchase page is displayed.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       302:
 *         description: Redirects to login page if not authenticated.
 */
exports.getPacketPage = async (req, res) => {
    if(req.isAuthenticated()) {
        return res.render('packetspurchase')
    } else {
        utils.loginRedirect(req, res);
    }

}

/**
 * @swagger
 * /dashboard/buypackets/confirm:
 *   post:
 *     summary: Purchase packets
 *     description: >
 *       Allows the authenticated user to purchase packets using points.
 *       If the user has enough points, packets are added to their account. Otherwise, 
 *       an error is displayed.
 *     security:
 *         - SessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: The number of packets to be purchased.
 *     responses:
 *       200:
 *         description: Successful request; packets purchased.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       400:
 *         description: Insufficient points for the purchase; or other server errors fetching user data
 *       302:
 *         description: Redirects to login page if not authenticated.
 */
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
                                        utils.handleError('error saving packet \n error: ' + error, req, res);
                                    });
                                }
                                return res.redirect('/account/dashboard');
                        })
                        .catch((error) => {
                            utils.handleError('error getting user and decreasing points. \n Error: ' + error, req, res);
                        });
                } else {
                    utils.handleError('user hasn\'t enough points', req, res);
                }
            })
            .catch((error) => {
                utils.handleError('errors getting user profile' + error, req, res);
            });


    } else {
        utils.loginRedirect(req, res);
    }
}



/**
 * @swagger
 * /dashboard/packets/{packet_id}:
 *   post:
 *     summary: Open a packet
 *     description: >
 *       Opens a packet by removing it from the user's account and fetching the figurines 
 *       included in the packet. Displays all the figurines obtained.
 *     security:
 *         - SessionAuth: []
 *     parameters:
 *       - in: path
 *         name: packet_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the packet to be opened.
 *     responses:
 *       200:
 *         description: Packet opened successfully; figurines are returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Figurine'
 *       302:
 *         description: Redirects to login page if not authenticated.
 *       400:
 *         description: bad request parameter or other server errors fetching user data; redirect to home page
 */
exports.openPacket = (req, res) => {

    if(req.isAuthenticated()){
        usersPackets.findOneAndDelete( { _id: req.params.packet_id } )
        .then((packet) => {
            const packetFigAmounts = {
                'basic': 5,
                'rare': 10,
                'legendary': 15
            };
            console.log(packet.type)
            figsAmount = packetFigAmounts[packet.type] || 0
            const figs = []
            let fetchCount = 0;
            
            const fetchFigure = () => {
                const random = Math.floor(Math.random() * (1563));
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
                console.log( colors.fg.black + colors.bg.green + 'random value : \n' + random + colors.reset)
                
                fetch('https://gateway.marvel.com:443/v1/public/characters?limit=1&offset=' + random + '&apikey=de511cb926dc8e0b6caf71daa20b40be&ts=' + ts + '&hash=' + hash)
                    .then((response) => response.json())
                    .then((response_json) => {
                        console.log(response_json)
                        console.log(response_json.data.results[0])
                        const new_fig = new usersFigurines({
                            id_user: req.session.passport.user,
                            id_figurine: response_json.data.results[0].id,
                            name: response_json.data.results[0].name, 
                            image_path: response_json.data.results[0].thumbnail.path,
                            ext: response_json.data.results[0].thumbnail.ext || 'jpg',
                            description: response_json.data.results[0].description,
                            appearances: [response_json.data.results[0].comics.available,
                                            response_json.data.results[0].series.available,  
                                            response_json.data.results[0].stories.available,
                                            response_json.data.results[0].events.available
                                        ]
                        });
                        return new_fig.save();
                    })
                    .then((fig) => {
                        console.log(fig)
                        figs.push(fig)
                        fetchCount++;
                        if(fetchCount === figsAmount) {
                            console.log('All figurines fetched')
                            return res.send(figs)
                        } else {
                            fetchFigure();
                        }
                    })
                    .catch((error) => {
                        console.log('Error fetching or saving figure: ' + error)
                        req.flash('errors', { msg: "Error fetching or saving figure: " + error });
                        if(fetchCount === figsAmount) {
                            return res.render('dashboard', { messages: { errors: req.flash('errors') } })
                        } else {
                            fetchFigure();
                        }
                    });
            }
    
            fetchFigure(); // Start the fetching process
        })
        .catch((error) => {
            utils.handleError('couldn\'t find and delete packet. \n error : ' + error, req, res);
        })
    } else {
        utils.loginRedirect(req, res);
    }
}

/**
 * @swagger
 * /dashboard/fig/{fig_id}:
 *   get:
 *     summary: Get character details
 *     description: >
 *       Fetches the details of a figurine by its ID for the authenticated user.
 *     parameters:
 *       - in: path
 *         name: fig_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the figurine.
 *     security:
 *         - SessionAuth: []
 *     responses:
 *       200:
 *         description: Figurine details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_user:
 *                  type: string
 *                 id_figurine:
 *                   type: integer
 *                   example: 1001
 *                 name:
 *                   type: string
 *                   example: Iron Man
 *                 image_path:
 *                   type: string
 *                   example: http://image.url/path
 *                 ext:
 *                   type: string
 *                   example: jpg
 *                 description:
 *                   type: string
 *                 appearances:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Array of appearances in comics, series, stories, and events.
 *       302:
 *         description: Redirects to login page if not authenticated and shows not logged in alert
 *       400:
 *         description: bad request parameter or other server errors fetching user data; redirect to home page
 */
exports.getCharacter = (req, res) => {

    if(req.isAuthenticated()) {
        usersFigurines.findOne({ id_figurine: req.params.fig_id, id_user: req.session.passport.user})
            .then((figurine) =>  {
                    console.log(figurine)
                    res.send(figurine)
            })
            .catch((error) => {
                utils.handleError('Error fetching API: ' + error, req, res);
            })
    } else {
        utils.loginRedirect(req, res);
    }
}

exports.getProfileEdit = (req, res) => {
    
}

exports.postProfileEdit = (req, res) => {

}
