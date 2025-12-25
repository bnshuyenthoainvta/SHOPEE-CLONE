const Product = require("../models/Product");
const slugify = require("slugify");
const Category = require("../models/Category");

const createProduct = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const {
            name, 
            description, 
            category, 
            price, 
            originalPrice, 
            variants, 
            stock, 
            tags, 
            specifications
        } = req.body;

        if(!name || !description || !category || price === undefined || stock === undefined) 
            return res.status(400).json({success: false, message: "Information about name, description, category, price, stock are requied"});

        //Deal with slug name
        const slug = slugify(name, {lower: true, strict: true});

        //Deal with image
        const files = req.files;
        if(!files || files.length === 0) return res.status(400).json({success: false, message: "Image is required"});
        const imageUrls = files.map(file => `uploads/${file.filename}`);

        //Deal with data from form-data
        const parsedVariants = variants ? JSON.parse(variants) : [];
        const parsedTags = tags ? JSON.parse(tags) : [];
        const parsedSpecifications = specifications ? JSON.parse(specifications) : [];

        //Create new product
        const product = await Product.create({
            name,
            slug, 
            description, 
            category, 
            seller: userId,
            images: imageUrls,
            price, 
            originalPrice, 
            variants: parsedVariants,
            stock, 
            tags: parsedTags, 
            specifications: parsedSpecifications
        });

        return res.status(201).json({success: true, message: "Create new product successfully", product});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const updateProduct = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const { id } = req.params;

        const {
            name, 
            description, 
            category, 
            price, 
            originalPrice, 
            variants, 
            stock, 
            tags, 
            specifications
        } = req.body;

        const product = await Product.findById(id);
        if(!product) return res.status(404).json({success: false, message: "Product not found"});

        //Update product
        const files = req.files;
        if(files && files.length > 0) {
            product.images = file.map(file => `uploads/${file.filename}`);
        }
        if(name) {
            product.name = name;
            product.slug = slugify(name, {lower: true, strict: true});
        }
        if(description) product.description = description;
        if(category) product.category = category;
        if(price) product.price = price;
        if(originalPrice) product.originalPrice = originalPrice;
        if(stock) product.stock = stock;
        if(variants) product.variants = variants ? JSON.parse(variants) : [];
        if(tags) product.tags = tags ? JSON.parse(tags) : [];
        if(specifications) product.specifications = specifications ? JSON.parse(specifications) : [];

        await product.save();
        return res.status(200).json({success: true, message: "Update product successfully", product});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const getProduct = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const products = await Product.find().populate("category", "name");
        return res.status(200).json({success: true, message: "Get list product successfully", products});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const getProductById = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product) return res.status(404).json({success: false, message: "Product not found"});

        return res.status(200).json({success: true, message: "Get product successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const { id } = req.params;
        const product = await Product.findById(id);
        if(!product) return res.status(404).json({success: false, message: "Product not found"});

        await product.deleteOne();
        return res.status(200).json({success: false, message: "Get product successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

module.exports = {createProduct, updateProduct, getProduct, getProductById, deleteProduct};