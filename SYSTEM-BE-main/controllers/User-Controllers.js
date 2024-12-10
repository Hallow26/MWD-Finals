const User = require("../models/User-Model.js");
const Enroll = require("../models/Enrollment-Model.js");
const bcryptjs = require("bcryptjs");
const auth = require("../auth.js");

module.exports.registerUser = (req, res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        password: bcryptjs.hashSync(req.body.password, 10)
    })

    return newUser.save()
    .then(result => {
        res.send({
            code: "REGISTRATION-SUCCESS",
            message: "You are now registered!",
            result: result
        })
    })
    .catch(error => {
        res.send({
            code: "REGISTRATION-FAILED",
            message: "We've encountered an error during the registration. Please try again!",
            result: error
        })
    })
}

// User Login
module.exports.loginUser = (req, res) => {
    let {email, password} = req.body;
    return User.findOne({email: email}).then(result => {
        if(result == null){
            return res.send({
                code: "USER-NOT-REGISTERED",
                message: "Please register to login."
            })
        } else {
            const isPasswordCorrect = bcryptjs.compareSync(password, result.password);

            if(isPasswordCorrect) {
                return res.send({
                    code: "USER-LOGIN-SUCCESS",
                    token: auth.createAccessToken(result)
                })
            } else {
                return res.send({
                    code: "PASSWORD-INCORRECT",
                    message: "Password is not correct. Please try again."
                })
            }
        }
    })
}

// Check email if existing
module.exports.checkEmail = (req, res) => {
    let {email} = req.body;
    return User.find({email: email}).then(result => {
        if(result.length > 0){
            return res.send({
                code: "EMAIL-EXISTS",
                message: "The user is registered."
            })
        } else {
            return res.send({
                code: "EMAIL-NOT-EXISTING",
                message: "The user is not registered."
            }) 
        }
    })
}

// Retrieve profile details
module.exports.getProfile = (req, res) => {
    const {id} = req.user; 
    return User.findById(id).then(result => {
        if(result == null) {
            return res.send({
                code: "USER-NOT-FOUND",
                message: "Cannot find user with the provided ID."
            })
        } else {
            result.password = "*****"; 

            return res.send({
                code: "USER-FOUND",
                message: "A user was found.",
                result: result 
            })
        }
    }).catch(err => {
        return res.send({
            code: "USER-ERROR",
            message: "There was an error retrieving user details.",
            error: err
        })
    })
}

// Enroll a user
module.exports.enroll = (req, res) => {
    const {id} = req.user;
    
    let newEnrollment = new Enroll({
        userId: id,
        enrolledCourse: req.body.enrolledCourse,
        totalPrice: req.body.totalPrice
    })

    return newEnrollment.save().then((result, err) => {
        if(err){
            res.send({
                code: "ENROLLMENT-FAILED",
                message: "There is a problem during your enrollment, please try again!",
                error: err
            })
        } else {
            res.send({
                code: "ENROLLMENT-SUCCESSFUL",
                message: "Congratulations, you are now enrolled!",
                result: result
            })
        }
    })
}

// Update password
module.exports.updatePassword = (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
        return res.send({
            code: "PASSWORD-MISMATCH",
            message: "The new password and confirmation password do not match."
        });
    }

  
    const { id } = req.user;

    console.log("User ID:", id); 

    // Hash the new password
    bcryptjs.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err); 
            return res.send({
                code: "PASSWORD-UPDATE-FAILED",
                message: "An error occurred while hashing the new password.",
                error: err
            });
        }

        console.log("Hashed password:", hashedPassword); 

        // Update the users password in the database
        User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
            .then(result => {
                if (!result) {
                    console.error("User not found"); 
                    return res.send({
                        code: "USER-NOT-FOUND",
                        message: "User not found."
                    });
                }

                return res.send({
                    code: "PASSWORD-UPDATE-SUCCESS",
                    message: "Your password has been updated successfully."
                });
            })
            .catch(error => {
                console.error("Error updating password:", error); 
                res.send({
                    code: "PASSWORD-UPDATE-FAILED",
                    message: "An error occurred while updating the password.",
                    error: error
                });
            });
    });
};