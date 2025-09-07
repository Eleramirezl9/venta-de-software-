const GetProducts = require('../../application/useCases/GetProducts');
const SearchProducts = require('../../application/useCases/SearchProducts');
const { ProductFilterDto } = require('../../application/dtos/ProductDto');
const SqliteProductRepository = require('../repositories/SqliteProductRepository');
const ErrorHandler = require('../../../shared/infrastructure/middleware/ErrorHandler');

class ProductController {
    constructor() {
        this.productRepository = new SqliteProductRepository();
        this.getProducts = new GetProducts(this.productRepository);
        this.searchProducts = new SearchProducts(this.productRepository);
    }

    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Obtiene lista de productos con paginación
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Número de página
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 20
     *         description: Productos por página
     *     responses:
     *       200:
     *         description: Lista de productos obtenida exitosamente
     */
    getAll = ErrorHandler.asyncWrapper(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await this.getProducts.getAll(page, limit);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/products/search:
     *   get:
     *     summary: Busca productos por término o aplica filtros
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Término de búsqueda
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *         description: Filtrar por categoría
     *       - in: query
     *         name: minPrice
     *         schema:
     *           type: number
     *         description: Precio mínimo
     *       - in: query
     *         name: maxPrice
     *         schema:
     *           type: number
     *         description: Precio máximo
     *     responses:
     *       200:
     *         description: Resultados de búsqueda obtenidos exitosamente
     */
    search = ErrorHandler.asyncWrapper(async (req, res) => {
        const { q: searchTerm } = req.query;
        
        // Si hay filtros adicionales, usar búsqueda avanzada
        if (req.query.category || req.query.minPrice || req.query.maxPrice || 
            req.query.version || req.query.compatibility || req.query.isFree) {
            
            const filters = ProductFilterDto.fromQuery(req.query);
            const result = await this.searchProducts.executeAdvanced(filters);
            
            return res.status(200).json({
                success: true,
                data: result
            });
        }
        
        // Búsqueda simple por término
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await this.searchProducts.execute(searchTerm, page, limit);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/products/{id}:
     *   get:
     *     summary: Obtiene un producto por ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del producto
     *     responses:
     *       200:
     *         description: Producto encontrado exitosamente
     *       404:
     *         description: Producto no encontrado
     */
    getById = ErrorHandler.asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const result = await this.getProducts.getById(id);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/products/categories:
     *   get:
     *     summary: Obtiene todas las categorías disponibles
     *     tags: [Products]
     *     responses:
     *       200:
     *         description: Categorías obtenidas exitosamente
     */
    getCategories = ErrorHandler.asyncWrapper(async (req, res) => {
        const result = await this.getProducts.getCategories();
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/products/price-range:
     *   get:
     *     summary: Obtiene el rango de precios de todos los productos
     *     tags: [Products]
     *     responses:
     *       200:
     *         description: Rango de precios obtenido exitosamente
     */
    getPriceRange = ErrorHandler.asyncWrapper(async (req, res) => {
        const result = await this.getProducts.getPriceRange();
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    getByCategory = ErrorHandler.asyncWrapper(async (req, res) => {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await this.getProducts.getByCategory(category, page, limit);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    getFeatured = ErrorHandler.asyncWrapper(async (req, res) => {
        const limit = parseInt(req.query.limit) || 6;
        const result = await this.getProducts.getFeatured(limit);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    getRecommended = ErrorHandler.asyncWrapper(async (req, res) => {
        const limit = parseInt(req.query.limit) || 6;
        const userId = req.user ? req.user.id : null;
        
        const result = await this.getProducts.getRecommended(userId, limit);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });
}

module.exports = ProductController;

