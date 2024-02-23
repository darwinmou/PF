const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { passportCall, authorization } = require('../utils.js/auth');

router.get('/', viewController.login);
router.get('/login', viewController.login);
router.post('/login', viewController.loginUser);
router.get('/logout', viewController.logout);
router.get('/register', viewController.register);
router.post('/register', viewController.registerUser);
// router.get('/products', viewController.products, passportCall('jwt', { session: false }), authorization('user'));
router.get('/admin/dashboard', viewController.adminDashboard);
router.get('/admin/users/:id/edit', viewController.editUser);
router.get('/admin/users/:id/delete', viewController.confirmDeleteUser);

module.exports = router;
