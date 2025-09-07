class ErrorHandler {
    static handle() {
        return (error, req, res, next) => {
            console.error('Error capturado:', error);

            // Error de validación de Joi
            if (error.isJoi) {
                return res.status(400).json({
                    error: error.details[0].message,
                    code: 'VALIDATION_ERROR',
                    field: error.details[0].path[0]
                });
            }

            // Errores de dominio (reglas de negocio)
            if (error.message.includes('Ya existe un usuario') ||
                error.message.includes('Credenciales inválidas') ||
                error.message.includes('requerido') ||
                error.message.includes('debe tener') ||
                error.message.includes('no es válido')) {
                return res.status(400).json({
                    error: error.message,
                    code: 'BUSINESS_RULE_ERROR'
                });
            }

            // Errores de autenticación
            if (error.message.includes('Token') || 
                error.message.includes('No autorizado')) {
                return res.status(401).json({
                    error: error.message,
                    code: 'AUTHENTICATION_ERROR'
                });
            }

            // Errores de base de datos
            if (error.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({
                    error: 'Violación de restricción de base de datos',
                    code: 'DATABASE_CONSTRAINT_ERROR'
                });
            }

            // Error genérico del servidor
            res.status(500).json({
                error: process.env.NODE_ENV === 'production' 
                    ? 'Error interno del servidor' 
                    : error.message,
                code: 'INTERNAL_SERVER_ERROR',
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        };
    }

    static notFound() {
        return (req, res) => {
            res.status(404).json({
                error: `Ruta ${req.method} ${req.path} no encontrada`,
                code: 'ROUTE_NOT_FOUND'
            });
        };
    }

    static asyncWrapper(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
}

module.exports = ErrorHandler;

