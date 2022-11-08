# Things learned from this project

#### (personal note)

- Slug will be generated from package

- WE used email validator package

## Geocoder ==> https://geocoder.readthedocs.io/

- This feature is used to identify the user based on thier location, we have user address in our model,
  -To handle the location we have location model so that we find users distance to the job using the Geocoder library

## To create map we used https://developer.mapquest.com/

### you can use google map also can use this

## Aggregation Operations

### Aggregation operations process multiple documents and return computed results.

#### E.g $match: { $text: { $search: '"' + req.params.topic + '"' } },

- In the above aggregation, First: We have to match the texts that are being searched from the topic of our collection

# Global Error Handling

## Global Async Error Handler middleware

- This Error handler is used to wrap all our routes therefore it will throw an Error if one element is missing for e.g when we create a
- new job
- So we wrap the create route with the catcherror method
- So we dont have to write try catch and .then in every single request, we write it once and wrap the routes

#### First of all we need to create a class to hold the message and statusCode for each type of Error in the App

- The errorHandler class is a stand alone class inside the utils folder, Its used to Instantiate more errors out from it
- Everytime we instantiate from this class we will have a message and statuscode parameters to pass and use then.
- Therefore this class can be used to any kind of errors

### Error Handler middleware

- First we created a folder middlewares
- We create a file errors.js, This file will have All the errors we expect in the app, also the file will use ErrorHandler class to
- the messages and statusCode, if needed

### production vs Development Errors

### development Error,

- we show all ditailed error information to the developer such as as follows

  if (process.env.NODE_ENV === "development") {
  res.status(err.statusCode).json({
  success: false,
  error: err,
  errMessage: err.message,
  stack: err.stack,
  });

}

### production Error,

- we don't show all ditailed error informations to the users such as as follows

```if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });

}
```

### Unhandled promise rejection Errors

- To get this Error for example, go to config.env file and REMOVE "b"
- mongodb ==> from DB_LOCAL_URI=mongodb://127.0.0.1:27017/jobs
- Then you will find an error==> this is only for future error handling purpose makesure to return "b" back

### To handle this unhandeled Promise Rejection Error

    -Go to app.js and see down bellow in comment //Handle Unhandled....

## Handle Uncought Exception

- For Example if u go to app.js and below everything if you type
  console.log(jfhdjfhjdf);
- You will find error like below
  ReferenceError: jfhdjfhjdf is not defined

### In order to handle this

- Go to app.js above db connection ==> //Handle Uncought Exception error
  MAKE SURE THIS ERROR HANDLING IS ABOVE THE DB CONNECTION

## Unhandled Route

`This Error is for example If we type un existed endpoint ==> http://localhost:3000/api/v1/job `

- We got error message

#### Inorder to handle this error

`- Go to app.js and below ==> app.use("/api/v1", jobsRouter); //Handle unhandled route Error`

- Makesure that this Error handler is written below the route middleware

### Validation Mongodb Id and validation errors

- Show proper error messages in production mode, The implementation is inside ./middlewares/errors.js

  //Wrong Mongoose Obj Id Error
  // Handling Mongoose Validation Error ==> if we have multiple error messages at the same time, we use this error handler

# Advanced Filter Jobs

- First created a class called apiFilters inside utils then import it to jobs controller

#### Inside APIFilter class we have a method called filter() etc..., this method is basically doing all sort of filters in our app

//To do more queries/filter

`const queryCopy = { ...this.queryStr };`

-First we copy the query string(user search term)

### Advance filter using : lt, lte, gt, gte

- we have to convert the queryStr to string as it's in model,Otherwise we get "cast string error"
- once we have the string then replace/add dollar infront it with $${match} as the code shown below
- so that we get result like {"salary":{"$gt":"50000"}}

`let queryStr = JSON.stringify(queryCopy); queryStr = queryStr.replace( /\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}` );`

#### Use it in jobs controller like this

- const apiFilters = new APIFilters(Job.find({}), req.query);
  apiFilters.filter();
  OR
  `const apiFilters = new APIFilters(Job.find({}), req.query).filter();`
- Then In Postman or browser use this, http://localhost:3000/api/v1/jobs?jobType=Internship
- We make search query or filtering by their jobType w/c is Internship

## More Search filters ...

`{{DOMAIN}}/api/v1/jobs?salary[gt]=50000 -{{DOMAIN}}/api/v1/jobs?location.city=Espoo`

#### This Means our search is working as intended, we can filter/search by city, salary,jobeType etc

### Sort by Salary or type

- Sorting is also similar like filter
- Step1, create a sort method in the class APIFilters
- This method has a sorting feature also used to sort by multiple categories like salary, jobType etc..

### Limit the number of Feilds

- This is a technique that we limit the number of feilds to display

#### Steps to do the LimitFields

- Create the limitFields method in the class APIFilters and pass to the controller

### Display all related fields==> searchByQuery

- ,e.g if someone type {{DOMAIN}}/api/v1/jobs?q=java
- Then we'll display all jobs that has java in it

`const qu = this.queryStr.q.split("-").join(" "); //Replace - with " " this.query = this.query.find({ $text: { $search: '"' + qu + '"' } });`

#### Basically the above code first remove the dash then, search the text from query

-If the q is "java-developer" we removed the dash in b/n then become, "java developer"

## Pagination

- If we want to show only specific number of pages for some search result we use pagination, like 10 results
- We can also ask the users to specify the page numbers they want to see

## Authentication & Authorization USER

#### Nice blog article about JWT

      https://flaviocopes.com/jwt/

- First we created user model, name, email,password and role
- We don't have admin role in user model==> we don't want user to create admin from UI
- If we want admin we can create admin from db
- If user is not specified their role, then default role is, "user"

### create a user

    Steps

- First create the user create method/function in authController, also pass message for successfull registration
- Then import that controller in /routes/auth.js, In here we use the actuall post method and apply the controller function to create the user, also remeber to export this route
- Now, time to test in POSTMAN => {{DOMAIN}}/api/v1/register, remeber to insert in the body section the items we wanted to create(name,role,email,pass)

### Password Encryption

- First thing we don't want to show raw password in our db, rather password must be hashed, with package called bcryptjs
- To encrypt password before it saved in db use the following code inside user model

`userSchema.pre("save", async function (next) { this.password = await bcrypt.hash(this.password, 10); }); `

- The code hashs the password before it saved in db, 10 is the level of complexity, the higher number we use, the more complex to break, 10 is standard
- The password is hashed If we see it in the database or postman

# JWT-Json-Web-Token

### JSON Web Token (JWT)

- Is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

- This information can be verified and trusted because it is digitally signed.

- Inorder to use JWT first we need to create a jwt to verify user in the future

`userSchema.methods.getJwtToken = function () { return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME, }); };`

- Note the sign jwt method w/c is taking three 3 data parameters
- Id, our secret, expired time
- Then pass the token to the user that is being created w/c is in authController like

  ` const token = user.getJwtToken();`

# Login User

### Steps

- First create a login method in authController called => loginUser
- Make sure email & passw is entered also check if they are valid
- Check email is in db - Also check password is valid by compare method inbuilt in jwt
- Remember that we have password:{select:false}, in user model, means we dont show raw password in db, so how we check the password is correct or not if its not shown in db ?.
- There is a method called 'select' in mongoose, that selects password indirectly
  `const user = await User.findOne({ email }).select("+password");`
  in 'authController'
- The compare method from JWT, inside user model 'll help to check if the password is existed already
  `userSchema.methods.comparePassword = async function (enteredPassword) { return await bcrypt.compare(enteredPassword, this.password); };`
- What the above code does is, first pass the enterPassword by the user using the route, then compares with password in db(this.password) using compare method from bcrypt.Which returns true if its ok otherwise false if password is not equal.
- Next we check the password in the "authController" using the method we have created above, sth like this

  ` const isPasswordMatched = await user.comparePassword(password); if (!isPasswordMatched) { return next(new ErrorHandler("Invalid Email or Password"), 401); }`

- Finally Create JWT Token, to attach the token with the login crediantials and make a post request.

```//Create JWT Token
  const token = user.getJwtToken();

  res.status(200).json({
    success: false,
    token,
  });
```

# Saving token in cookie =>httpOnly cookie

- According to the article https://flaviocopes.com/jwt/, saving token in Local storage is not good Idea for security reason.
- Rather tokens shold be saved in HttpOnly cookies
- Because, An HttpOnly cookie is not accessible from JavaScript, and is automatically sent to the origin server upon every request,
  //so it perfect suits to our use case.
- The httpOnlt cookie is implementted in /utils/jwtToken
- W/c also reduces code rededency by creating tokens only from this file and send it to others, Then import it in authController
  ` sendToken(user, 200, res);`

## Testing the token is saved in httpOnly cookie

- In Postman run
  `{{DOMAIN}}/api/v1/login`
- Make sure the email and password is correct, Then open the response panel down in the Postman, and check the body
  shold be something like this

```{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNTQzMDBmYmZhNjI1ZTc3Y2JiN2EwMSIsImlhdCI6MTY2NjQ2MTgzOCwiZXhwIjoxNjY3MDY2NjM4fQ.PxCd3N_uZZQBOYBcwJSzE7CTEijjN1Ue6fz2H4ZqopM"
}
```

- Also check the cookies tab, where you will find name of token, value, expire date and the security status =>true/false, In our case its false , so we need to fix this to make it true so that Its more secured.some thing like this in jwtToken

```
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
```

# Protect Routes

### Protect Route means :

- only authorized user can access that route

## How to Authorize a user

Steps

1.  For example we need a user to be authorized to create a job post, check {{DOMAIN}}/api/v1/job/new in POSTMAN
2.  In the Header tab section make sure we have Authorization as key and "Bearer token" as a value, notice space between Bearer and token
3.  The "Bearer" text is a must.
4.  Create auth.js file in middlewares, In this file we will do the following

- Check if the user is authenticated or not, To check wether a user is authorized or not we do check if the token is existed or not, if there is token user is authorized otherwise not.We get the token by spliting from "Bearer" and save the second part with is the token into a variable
- If that token is existed then we have to verify with jwt.verify object
- The verify Object takes, token and the secret value
- If its verified then we get the user from ID and save it in req.user, so that we can access it from any where in the app.

## Using Authenticate middleware to authorize users

- In otherwords we are protecting routes
- Go to Jobs routes => /routes/jobs.js
- Import `const { isAuthenticatedUser } = require("../middlewares/auth");`
- Then update the create new job route like this
  `router.route("/job/new").post(isAuthenticatedUser, newJob);`
- Test by creating new job route from POSTMAN,while you do that first make sure you are loged in, then , copy the token from the logged in session then
- Move on to the createnew job route in POSTMAN,in header tab change the "token" text with the actual token you copied, and try to create a new job post, It must be SUCCESSFULL
- This indicates only a certain group of people[employer,admin] can create new job post

# Saving Token id in POSTMAN

- The reason why we save it is to avoid to copy and paste again and again in the header.

  Steps

- While you are in the login end point, open "Tests" tab and type the following script
  `pm.environment.set("token",pm.response.json().token)`
- pm=> postman and then save it
- To use it in create new job while you are in create/new job route
- Go to Authorization tab then select "Bearer token" option that is it

# Handling users roles

- Users in this app are [user,employer,admin]
- users are a default role and can register and login, to do more stuffs, they must have at least employer role.
- user with employer role can create , edit and delete job posts

### Authorize Roles

- Inside the auth.js middleware create a function as follows

```
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role(${req.user.role}) is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
```

- The function has all roles
- Checks that the roles are included in the user
- if the user has a predefined role, then its allowed to access the resources
- Otherwise, its denied or need to login

# Import the Authorize roles into Jobs routes

- First , import authorizeRoles into the jobs routes
- Then, add it to the routes such as, create,edit and delete operations

```
router
  .route("/job/new")
  .post(isAuthenticatedUser, authorizeRoles("employer", "admin"), newJob);

```

# Adding User in Jobs

- An authorized user have the access right to create a new job
- To get the creator of a job post, first we need to make a relationship b/n jobs and user model
- Add the following element in jobs model

```user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
```

- This relationship can be concidered as one to one or many to one

# Testing Roles

- Create a user with a role of employer
- Then, login
- Create a new job
- By now the job should have a user id included, This tell us the association, and this specific job was created by this specific user, so that we can check that we have the same user Id in user collection as well.

# Generate Password Reset Token for Forgot password

- In this section we willl recover a password if the user forgot it
- With the help of sending Email we will abale to send a link with reset option

Steps

1.  In the user model we generate Password Reset Token

    - We simply create a method called getResetPassordToken

2.  Also generate a crypto token, This crypto has a method called randomBytes which generates random 20 bytes and convert them into "hex"
3.  Next: We need to hash this generated token for security reason like the following

    ```
     this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    ```

- The above hashed token is only to save in the db, we don't send the hashed version via Email

4.  Set token expire time => 30m
5.  Finally We are returning the token itself,w/c was generated by crypto so we send this to the email,

# Sending resetToken with email

We are using Mailtrap, a simple Email test api based email client

Steps:

- Create a file called sendEmail in utils folder
- We are also using a nodemailer for transporting
- Make all settings based on Mailtrap requirment
- Finally export sendEmail function to authController

  - ### forgotPassword: Perform the following

- Create a function called "forgotPassword" in authController
- Check user email is in database
- Get reset token using a method "getResetPasswordToken", This method is defined in users model
- The method is created using a mongoose methods
  `userSchema.methods.getResetPasswordToken = function () {...`
- Create reset password url => this Url is the one we send it to the user in the email
- Its good Idea to put everything in Try Catch, Since the operation is goiing to be Promise
  Async await.
- Make sure to pass proper parameters to sendEmail method, as it defined
- If the Email is sent successfully get successful message
- If it failed to send the email then we will make the Token value and Expire time "Undefined" in the db

  `user.resetPasswordToken = undefined; user.resetPasswordExpire = undefined;`
  This is because we have to remove their values from database as well, Its best practice

# Reset Password

Once the password token is send via email to the user, the next task is to make the the sent url clickable and direct the user to reset the password.

    Steps:

1.  Create a method called resetPassword, in authController
2.  Hash url token
3.  Using crypro object apply the following methods

```
const resetPasswordToken = crypto
.createHash("sha256")
.update(req.params.token)
.digest("hex");
```

4.  createHash=> Creates and returns a Hash object that can be used to generate hash digests using the given algorithm.

5.  update => Updates the hash content with the given data

6.  digest=> Calculates the digest of all of the data passed to be hashed (using the hash.update() method).Or Compare this hash with the hash in db.

7.  Then find a user with that password token in db, Also make sure that that password token is not morethat 30min old

```
 const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
```

8.  If the resetPasswordToken is new and existed in db, then we update the password like this

```
 //Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

```

# Testing forgot and reset password via POSTMAN with mailtrap

We are Using a fake email third party package mailtrap, where we recieve our reset token, instead of our personal email client.Provided all the configuration is done above.

    Steps:

    1.Make a forgot password request

![alt text](forgot.png) 2. Check mailtrap, Received email message with a link to reset password
![alt text](mailtrap.png) 3. Copy the above link and past it in POSTMAN, so that the password is updated/changed
![alt text](reset.png) 4. Now can try to login with the new password...That is it

# Handling Wrong JWT Token & Expire JWT Error

Errors in production stage can happen due to various reasons

1. Wrong JWT token error
2. Expired JWT token error

We apply two methods in "errors.js" file from middlewares folder

# Logout

=> /api/v1/logout

- In authController file add the logout controller method
- Basically Logout means setting the cookie value to none
- Also the header to be none
- Also expire time to be immediately like => `expires: new Date(Date.now())`,
- We also need to set up the cookie to the logout, Copy cookie script from user login POSTMAN Tests to logout Test
- This is because we have to set the value of the tokena loogedIn user to none when we make a request to a logout endpoint.
- Once we are logout we are not allowing to login with same token, so that we have to set it none when we logout,
- When we login we generate a fresh login token=> security
- Logout is only working for logged In users, no other users should access it `router.route("/logout").get(isAuthenticatedUser, logout);`
- Finally make sure when logout the token has to be null also the cookie should be empty or Expire from POSTMAN

# Show user Profile

=> /api/v1/me

Displaying a logged In user profile is very essential tasks in Fullstack dev.

    Steps:

1.  Create a file called "userController.js" inside controllers
    - Import User model, error middlewares etc
    - Also create a function getUserProfile, This function will fetch the curent user from db.
2.  Create user route inside /routes
    - import the userController, and add isAuthenticatedUser, to secure the route, That only the loggedin user can access this route.
3.  To display the User profile first make sure the user is logged in, then while you are in /api/v1/me route in POSTMAN,get the Bearer Token set like below
    ![alt text](token.png)
4.  Make {{DOMAIN}}/api/v1/me get request, the user profile should be there

# Update current user Password

=> /api/v1/password/update

Currently logged In user can update its password

    Steps:

    1.  In userController, create a  new method updatePassword,
        - Since password is not displaied in our db, b/c its select:false, we have to find the users with password and Id, we have to select also the password like this:

`const user = await User.findById(req.user.id).select("+password");`

    2.  Check previous user password
        - The previous password can be checked using comparePassword , method from mongoose and pass the existing password to it.
        - NB. comparePassword is implemented in users model
    3.  If the old password is checked and confirmed, then we update with the new one like this.

` user.password = req.body.newPassword;`

    4.  Finally save it into db.

# Update User Data/Current User Data

Users can only update their name and email, nothing else

    Steps:
    1.  Create a method updateUser inside userController
    2.  The method will perform the following
        - creates the new data that the user wish to update with

```
   const newUserData = {
  name: req.body.name,
  email: req.body.email,
};
```

     3.  Then we search and update a user with id using a special method "findByIdAndUpdate", from mongoose.
    - The method takes three parameters,The user id which we want to change, the new data and other settings.
    4.  Finally create a route for It then done.

# Delete current user

If the user wants to delete its account we use the ff method

    Steps:
    1.  Create a method called deleteUser, in userControll
    2.  Use a special method "findByIdAndDelete" from mongoose, this method will search a user by id and delete it from db.
    3.  To complete the delete process we have to do also
        - change the token value to none
        - Token Expire time to be immediatley
        - httpOnly: true,
    4.  That is all

# Apply to Job with Resume
In this app only the "user" has the right to apply for the job, employers and admins are can't apply.

      Steps:
1.  As usual we create a jobController method called "applyJob".This method will perform the following:
  - First wrap the entire method inside catchAsyncErrors method.
  - Then , first   Search the job by Id, this job is the one being in applied, this search is also  based on applicantsApplied, this is from the jobs model.
  -   Check that if job last date has been passed or not, the last date is to apply to a job is 7days from date of published.
  -   Check if user has applied before, A user can be apply only once.
  - Check files, to make sure that the attached files/resume are there
  -  Check file type, only doc or pdf files are uploaded.
  -   Check doucument size, max doc size is 2mb
  -  Renaming resume, file name is renamed to user name and user id


2.   Store the file using express file uploads
    - Move the created file to public/uploads
    - Update, database using $push
    
```
- The $push
 operator appends a specified value to an array.

- The $push
 operator has the form:

{ $push: { <field1>: <value1>, ... } }
```
- Using $push Update the database by adding 
```
 $push: {
      //applicantsApplied => is coming from jobs model

          applicantsApplied: {
            id: req.user.id,
            resume: file.name,
          },
        },
```
- applicantsApplied is an element from jobs model,  Its an arraythen, 
- check db  of the job that is being applied by the user, should have a user ID and resume being updated inside applicantsApplied

# Display Virtual Property

### In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.

### This method is to show all the jobpublished by this user

   Steps

   - First inside user model create the following code.
```
 userSchema.virtual("jobPublished",{
  ref: "Job",
  localField: "_id",
  foreignField: "user",
  justOne: false 
 })

```
- We  initialize the virtual property
- Then add the following into the user model
```
{
toJSON : {virtuals : true } ,
toObject : { virtuals : true}  
}

```

##  Display title and postingDate from virtuals
- Once the above setting is done next we need to populate the user profile to show titles
and postingDate with other basic data
- Inside  userControll under getUserprofile method add this populate method
```
 .populate({
    path: "jobPublished",
    select: "title postingDate"
  })
```

###  Testing the virtuals data
- Go to Postman, user get userprofile endpoint make a request
- You should find the new data under JobPublished