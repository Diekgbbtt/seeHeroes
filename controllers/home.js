
/**
 * @swagger
 * /:  
 *    get:
 *      summary: load home page
 *      description: >
 *       Home page of the application. The client gets redirected here when trying 
 *       to access pages for only logged-in users. If the client is authenticated, 
 *       this dashboard is accessible from here; otherwise, they get redirected 
 *       to the login page.
 *      responses:
 *          200:
*               description: succesfull request home page is rendered
*               content:
*                   text/html:
*                     schema: 
*                       type: string
*/

exports.getHome = (req, res) => {
    const isAuthenticated = req.isAuthenticated();

    res.render('home', { isAuthenticated });
}



exports.getFAQ = (req, res) => {
    /* scroll to FAQ section*/
}