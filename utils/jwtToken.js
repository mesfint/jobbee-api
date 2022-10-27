//create and send token and save in cookie

const sendToken = (user, statusCode, res) => {
  //create JWT Token
  const token = user.getJwtToken();

  //An HttpOnly cookie is not accessible from JavaScript, and is automatically sent to the origin server upon every request,
  //so it perfectly suits the use case.
  //for more: https://flaviocopes.com/jwt/

  //Option for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPRESS_TIME * 24 * 60 * 60 * 1000
    ), //The cookie will expires after 7days
    httpOnly: true,
  };
  //To make the token cookie more secured, see in in Postman true/false

  /*if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }*/

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = sendToken;
