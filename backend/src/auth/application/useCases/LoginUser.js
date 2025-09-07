const JwtService = require('../../infrastructure/services/JwtService');

class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.jwtService = new JwtService();
    }

    async execute(loginUserDto) {
        try {
            // Buscar usuario por email
            const user = await this.userRepository.findByEmail(loginUserDto.email);
            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            const isValidPassword = await this.userRepository.verifyPassword(user, loginUserDto.password);
            if (!isValidPassword) {
                throw new Error('Credenciales inválidas');
            }

            // Generar token JWT
            const token = this.jwtService.generateToken({
                id: user.id,
                email: user.getEmailValue(),
                name: user.name
            });

            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.getEmailValue()
                },
                token,
                message: 'Inicio de sesión exitoso'
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LoginUser;

