import { check } from "express-validator";

const validationRules = {
    login: [
        check('phoneNumber').not().isEmpty().withMessage(`Phone number is required.`)
        .bail().isLength({ min: 10, max: 12 }).withMessage('Please enter valid mobile number.'),
        // check('email').not().isEmpty().withMessage(`Email is required.`),
        check('password').not().isEmpty().withMessage(`Password is required.`)      
    ],
    loginNurseStation:[
        check('NSId').not().isEmpty().withMessage(`NSId is required.`),
        check('password').not().isEmpty().withMessage(`Password is required.`)            
    ],
    createUser:[
        check('phoneNumber').not().isEmpty().withMessage(`Phone number is required.`)
        .bail().isLength({ min: 10, max: 12 }).withMessage('Please enter valid mobile number.'),
        check('email').not().isEmpty().withMessage(`Email is required.`),
        check("name").not().isEmpty().withMessage(`Name is required.`),
        check("city").not().isEmpty().withMessage(`City is required.`),
        check("state").not().isEmpty().withMessage(`State is required.`),
        // check("country").not().isEmpty().withMessage(`Country is required.`),
        check("address1").not().isEmpty().withMessage(`Address1 is required.`),
        check("address2").not().isEmpty().withMessage(`Address2 is required.`),
        check("role").not().isEmpty().withMessage(`Role is required.`),
        check("pincode").not().isEmpty().withMessage(`Pincode is required.`),
        check("createdUserId").not().isEmpty().withMessage(`Create User Id is required.`),
        // check("coordinates").not().isEmpty().withMessage(`coordinates is required.`),
        check("age").not().isEmpty().withMessage(`age is required.`),
        check("weight").not().isEmpty().withMessage(`Weight is required.`),
        check("gender").not().isEmpty().withMessage(`Gender is required.`),
    ],
    updateUserDetails:[
        check('userId').not().isEmpty().withMessage(`User Id is required.`),
        check('phoneNumber').not().isEmpty().withMessage(`Phone number is required.`)
        .bail().isLength({ min: 10, max: 12 }).withMessage('Please enter valid mobile number.'),
        check('email').not().isEmpty().withMessage(`Email is required.`),
        check("name").not().isEmpty().withMessage(`Name is required.`),
        check("city").not().isEmpty().withMessage(`City is required.`),
        check("state").not().isEmpty().withMessage(`State is required.`),
        // check("country").not().isEmpty().withMessage(`Country is required.`),
        check("address1").not().isEmpty().withMessage(`Address1 is required.`),
        check("address2").not().isEmpty().withMessage(`Address2 is required.`),
        check("role").not().isEmpty().withMessage(`Role is required.`),
        check("pincode").not().isEmpty().withMessage(`Pincode is required.`),
        check("createdUserId").not().isEmpty().withMessage(`Create User Id is required.`),
        // check("coordinates").not().isEmpty().withMessage(`coordinates is required.`),
        check("age").not().isEmpty().withMessage(`age is required.`),
        check("weight").not().isEmpty().withMessage(`Weight is required.`),
        check("gender").not().isEmpty().withMessage(`Gender is required.`),
    ],
    deleteUser: [
        check('userId').not().isEmpty().withMessage(`User Id is required.`)
    ],
    getProfileData:[],
    resetUserPassword:[
        check('userId').not().isEmpty().withMessage(`User ID is required.`),
        check('password').not().isEmpty().withMessage(`Password is required.`)
                    
    ],
    showUserPassword:[
        check('userId').not().isEmpty().withMessage(`Id is required.`),
    ],
    getPerformanceDetails: [
    ]
  ,
  
    getAllUsers: [
        check("msg").not().isEmpty().withMessage(`msg field is required.`),
    ],
    generateAccessToken:[]
}
const validate = (method) => validationRules[method] || [];

export default validate;