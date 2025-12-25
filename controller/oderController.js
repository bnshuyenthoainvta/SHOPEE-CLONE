const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {items, shippingAddress, note} = req.body;
        if(!items || !shippingAddress) return res.status(400).json({success: false, message: "Item and shipping address are required"});

        //Kiểm tra xem hàng cần mua có tồn tại không
        const existedProduct = await Product.findById(items.product);
        if(!existedProduct) return res.status(404).json({success: false, message: "Product not found"});

        //Kiểm tra xem có mẫu cần mua không
        const matchVariant = existedProduct.variants.find(variant => variant === items.variant);
        if(!matchVariant) return res.status(400).json({success: false, message: "Variant not found"});

        //Kiểm tra số lượng hàng có đáp ứng không
        if(items.quantity > matchVariant.stock) return res.status(400).json({success: false, message: "Not enought amount of item"});

        //Cập nhập giá tiền
        const subtotal = items.quantity * matchVariant.price;
        const totalAmount = subtotal;

        //Cập nhập mã đơn hàng
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
        const orderNumber = `ORD-${timestamp}-${random}`;

        //Tạo đơn hàng
        const order = await Order.create({
            orderNumber,
            user: userId,
            items,
            shippingAddress,
            subtotal,
            totalAmount,
            note
        });

        return res.status(200).json({success: true, message: "Create order successfully", order});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const getOrder = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const deleteOrder = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

module.exports = {createOrder, updateOrder, getOrder, deleteOrder};