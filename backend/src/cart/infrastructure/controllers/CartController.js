const ManageCart = require('../../application/useCases/ManageCart');
const SqliteCartRepository = require('../repositories/SqliteCartRepository');
const SqliteProductRepository = require('../../../products/infrastructure/repositories/SqliteProductRepository');
const ErrorHandler = require('../../../shared/infrastructure/middleware/ErrorHandler');

class CartController {
    constructor() {
        this.cartRepository = new SqliteCartRepository();
        this.productRepository = new SqliteProductRepository();
        this.manageCart = new ManageCart(this.cartRepository, this.productRepository);
    }

    /**
     * @swagger
     * /api/cart:
     *   get:
     *     summary: Obtiene el carrito del usuario autenticado
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Carrito obtenido exitosamente
     *       401:
     *         description: No autorizado
     */
    getCart = ErrorHandler.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const result = await this.manageCart.getCart(userId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/cart/items:
     *   post:
     *     summary: Agrega un producto al carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - productId
     *             properties:
     *               productId:
     *                 type: integer
     *                 description: ID del producto a agregar
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *                 maximum: 99
     *                 default: 1
     *                 description: Cantidad del producto
     *     responses:
     *       201:
     *         description: Producto agregado al carrito exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Producto no encontrado
     */
    addItem = ErrorHandler.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                error: 'El ID del producto es requerido',
                code: 'MISSING_PRODUCT_ID'
            });
        }

        const result = await this.manageCart.addItem(userId, parseInt(productId), parseInt(quantity));
        
        res.status(201).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/cart/items/{id}:
     *   put:
     *     summary: Actualiza la cantidad de un item en el carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del item en el carrito
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - quantity
     *             properties:
     *               quantity:
     *                 type: integer
     *                 minimum: 1
     *                 maximum: 99
     *                 description: Nueva cantidad
     *     responses:
     *       200:
     *         description: Cantidad actualizada exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Item no encontrado
     */
    updateItem = ErrorHandler.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;
        const { quantity } = req.body;
        
        if (!quantity) {
            return res.status(400).json({
                error: 'La cantidad es requerida',
                code: 'MISSING_QUANTITY'
            });
        }

        const result = await this.manageCart.updateItemQuantity(userId, parseInt(id), parseInt(quantity));
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/cart/items/{id}:
     *   delete:
     *     summary: Elimina un item del carrito
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del item en el carrito
     *     responses:
     *       200:
     *         description: Item eliminado exitosamente
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Item no encontrado
     */
    removeItem = ErrorHandler.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;
        
        const result = await this.manageCart.removeItem(userId, parseInt(id));
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @swagger
     * /api/cart:
     *   delete:
     *     summary: Vacía completamente el carrito del usuario
     *     tags: [Cart]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Carrito vaciado exitosamente
     *       401:
     *         description: No autorizado
     */
    clearCart = ErrorHandler.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const result = await this.manageCart.clearCart(userId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });

    getTotalItems = ErrorHandler.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const result = await this.manageCart.getTotalItems(userId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    });
}

module.exports = CartController;

