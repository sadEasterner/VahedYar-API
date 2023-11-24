
const Router = require('express');
const UserAuthController = require('../controllers/UserAuthController');
const {verifyRoles, ROLES_LIST} = require('../middleware/verifyRoles');
const router = Router();


router.route('/login').post(UserAuthController.login);
router.route('/signup').post(UserAuthController.signup);
router.route('/logout').get(UserAuthController.logout);


module.exports = router;