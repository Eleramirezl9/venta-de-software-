const RegisterUser = require('../../application/useCases/RegisterUser');
const LoginUser = require('../../application/useCases/LoginUser');
const RecoverPassword = require('../../application/useCases/RecoverPassword');
const RegisterUserDto = require('../../application/dtos/RegisterUserDto');
const LoginUserDto = require('../../application/dtos/LoginUserDto');
const SqliteUserRepository = require('../repositories/SqliteUserRepository');
const ErrorHandler = require('../../../shared/infrastructure/middleware/ErrorHandler');

class AuthController {
    constructor() {
        this.userRepository = new SqliteUserRepository();
        this.registerUser = new RegisterUser(this.userRepository);
        this.loginUser = new LoginUser(this.userRepository);
        this.recoverPassword = new RecoverPassword(this.userRepository);
    }

    register = ErrorHandler.asyncWrapper(async (req, res) => {
        const registerDto = RegisterUserDto.fromRequest(req);
        const result = await this.registerUser.execute(registerDto);
        
        res.status(201).json({
            success: true,
            data: result
        });
    });

    login = ErrorHandler.asyncWrapper(async (req, res) => {
        const loginDto = LoginUserDto.fromRequest(req);
        const result = await this.loginUser.execute(loginDto);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    recover = ErrorHandler.asyncWrapper(async (req, res) => {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                error: 'El email es requerido',
                code: 'MISSING_EMAIL'
            });
        }

        const result = await this.recoverPassword.execute(email);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    resetPassword = ErrorHandler.asyncWrapper(async (req, res) => {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({
                error: 'Token y nueva contraseña son requeridos',
                code: 'MISSING_FIELDS'
            });
        }

        const result = await this.recoverPassword.resetPassword(token, newPassword);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    logout = ErrorHandler.asyncWrapper(async (req, res) => {
        // En JWT stateless, el logout se maneja en el cliente eliminando el token
        // Aquí podríamos implementar una blacklist de tokens si fuera necesario
        
        res.status(200).json({
            success: true,
            data: {
                message: 'Sesión cerrada exitosamente'
            }
        });
    });

    profile = ErrorHandler.asyncWrapper(async (req, res) => {
        // Obtener perfil del usuario autenticado
        const user = await this.userRepository.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                code: 'USER_NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: user.toJSON()
            }
        });
    });
}

module.exports = AuthController;

