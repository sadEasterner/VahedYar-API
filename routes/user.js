const Router = require('express');
const UserController = require('../controllers/UserController');
const {verifyRoles, ROLES_LIST} = require('../middleware/verifyRoles');
const router = Router();


router.route('/')
    .get(UserController.getListUser)
    .post(verifyRoles(ROLES_LIST.Admin), UserController.createUser)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.editUser)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),UserController.deleteUser);

// router.route('/:id')
//     .get(UserController.getUserById);


module.exports = router;