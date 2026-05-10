import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
    const adminRole = await roleRepository.findByName('admin');
    if (!adminRole) return;

    const adminEmail = 'admin@admin.com';
    const existingAdmin = await userRepository.findByEmail(adminEmail);
    
    if (!existingAdmin) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash('Admin123@', saltRounds); 

        await userRepository.create({
            email: adminEmail,
            password: hashed,
            name: 'Super',
            lastName: 'Administrador',
            phoneNumber: '123456789',
            birthdate: new Date('1990-01-01'),
            url_profile: '',
            address: 'Av. Principal 123',
            roles: [adminRole._id]
        });
        console.log('Seeded initial admin user: admin@admin.com / Admin123@');
    }
}
