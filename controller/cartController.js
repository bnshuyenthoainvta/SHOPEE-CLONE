const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const { productId, quantity, variant } = req.body;
        if(!productId || !quantity || !variant) return res.status(400).json({success: false, message: "Can not add product to your cart"});

        const product = await Product.findById(productId);
        if(!product) return res.status(400).json({success: false, message: "Product not found"});

        const variantItem = product.variants.find(item => item.name === variant);
        if (!variantItem) return res.status(400).json({ success: false, message: "Biến thể sản phẩm không tồn tại" });
    
        const variantPrice = variantItem.price;
        const totalAmount = variantPrice * quantity;

        const cart = new Cart({
            user: userId,
            items: {
                product: productId,
                variant: variant,
                quantity: quantity,
                price: variantPrice,
            },
            totalAmount: totalAmount,
        });

        await newCart.save();

        return res.status(200).json({success: true,message: "Add product to your cart successfully", cart});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const updateCart = async (req, res) => {
    try {
        const {id} = req.params;

        const {productId, variant, quantity} = req.body;

        const cart = await Cart.findById(id);
        if(!cart) return res.status(404).json({success: false, message: "Cart not found"});

        const product = await Product.findById(productId);
        if(!product) return res.status(400).json({success: false, message: "Product not found"});

        const existVariant = product.variants.find(item => item.name === variant);
        if (!existVariant) return res.status(400).json({ success: false, message: "Biến thể sản phẩm không tồn tại" });

        cart.items.variant = variant;
        if(quantity) cart.items.quantity = quantity;

        cart.items.price = existVariant.price;
        cart.totalAmount = cart.items.price * quantity;

        await cart.save();

        return res.status(200).json({success: true, message: "Update cart successfully", cart});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const carts = await Cart.find({user: userId});

        return res.status(200).json({success: true, message: "Get your cart successfully", carts});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const deleteCart = async (req, res) => {
    try {
        const {id} = req.params;

        const cart = await Cart.findById(id);
        if(!cart) return res.status(404).json({success: false, message: "Cart not found"});

        return res.status(200).json({success: true, message: "Delete cart successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

module.exports = {addToCart, updateCart, getCart, deleteCart};