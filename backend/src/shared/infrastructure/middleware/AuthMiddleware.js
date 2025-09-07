const JwtService = require('../../../auth/infrastructure/services/JwtService');

class AuthMiddleware {
    constructor() {
        this.jwtService = new JwtService();
    }

    authenticate() {
        return (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                const token = this.jwtService.getTokenFromHeader(authHeader);

                if (!token) {
                    return res.status(401).json({
                        error: 'Token de acceso requerido',
                        code: 'MISSING_TOKEN'
                    });
                }

                const decoded = this.jwtService.verifyToken(token);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(401).json({
                    error: error.message,
                    code: 'INVALID_TOKEN'
                });
            }
        };
    }

    optional() {
        return (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                const token = this.jwtService.getTokenFromHeader(authHeader);

                if (token) {
                    const decoded = this.jwtService.verifyToken(token);
                    req.user = decoded;
                }
                
                next();
            } catch (error) {
                // En middleware opcional, continuamos sin usuario autenticado
                next();
            }
        };
    }
}

module.exports = new AuthMiddleware();

