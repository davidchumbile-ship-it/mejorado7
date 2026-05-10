// Lógica de cliente
document.addEventListener('DOMContentLoaded', () => {
    
    // SignIn Form
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/signIn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    sessionStorage.setItem('token', data.token);
                    const payload = JSON.parse(atob(data.token.split('.')[1]));
                    if (payload.roles.includes('admin')) {
                        window.location.href = '/dashboard/admin';
                    } else {
                        window.location.href = '/dashboard/user';
                    }
                } else {
                    alert(data.message || 'Error al iniciar sesión');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
            }
        });
    }

    // SignUp Form
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = {
                name: document.getElementById('name').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                birthdate: document.getElementById('birthdate').value,
                address: document.getElementById('address').value,
                url_profile: document.getElementById('url_profile').value
            };

            try {
                const res = await fetch('/api/auth/signUp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Registro exitoso. Por favor, inicia sesión.');
                    window.location.href = '/signIn';
                } else {
                    alert(data.message || 'Error en el registro');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('token');
            window.location.href = '/signIn';
        });
    }
});

// Función global para proteger rutas en el lado del cliente
async function protectRoute(requiredRoles = [], cb) {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/signIn';
        return;
    }

    try {
        const res = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401) { 
            sessionStorage.removeItem('token');
            window.location.href = '/signIn';
            return;
        }

        if (res.ok) {
            const user = await res.json();
            if (requiredRoles.length > 0) {
                const hasRole = user.roles.some(r => requiredRoles.includes(r));
                if (!hasRole) {
                    window.location.href = '/403';
                    return;
                }
            }
            if (cb) cb(user);
        } else {
            window.location.href = '/signIn';
        }
    } catch (err) {
        window.location.href = '/signIn';
    }
}
