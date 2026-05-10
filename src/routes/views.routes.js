import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.redirect('/signIn'));

router.get('/signIn', (req, res) => res.render('signIn', { title: 'Iniciar Sesión' }));
router.get('/signUp', (req, res) => res.render('signUp', { title: 'Registrarse' }));
router.get('/profile', (req, res) => res.render('profile', { title: 'Mi Perfil' }));
router.get('/dashboard/user', (req, res) => res.render('dashboardUser', { title: 'Dashboard Usuario' }));
router.get('/dashboard/admin', (req, res) => res.render('dashboardAdmin', { title: 'Dashboard Administrador' }));
router.get('/403', (req, res) => res.render('403', { title: 'Acceso Denegado' }));

export default router;
