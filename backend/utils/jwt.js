const sendToken = (user, statusCode, res) => {

    //Creating JWT Token..
    const token = user.getJwtToken();

    //Setting cookies..
    const options = {
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 1000   
            ),  // (* 24 * 60 * 1000) this adds 7 days of expiring date for cookies...
        httpOnly : true   //for not giving access to javascript (to secure from hackers..)
              
    }

    res.status(statusCode)
    .cookie('token', token, options)  //handle cookiess...
    .json({
        success : true,
        token,
        user
    })
}

module.exports = sendToken;