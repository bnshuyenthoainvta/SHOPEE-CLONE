const Category = require("../models/Category");
const slugify = require("slugify");

const createdCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const {name, description, image, parent} = req.body;
        if(!name) return res.status(400).json({success: false, message: "Category name are required"});
        //Slug name
        const slug = slugify(name, {lower: true, strict: true});
        //Check this slug is existed or not?
        const existedCategory = await Category.findOne({slug});
        if(existedCategory) return res.status(400).json({success: false, message: "This category is existed"});

        //Verify level depend on parent
        let level = 0; //Default
        if(parent) {
            const parentCategory = await Category.findById(parent);
            if(!parentCategory) return res.status(400).json({success: false, message: "Parent category is not existed"});
            level = parentCategory.level + 1;
        }

        //Created new category
        const category = await Category.create({
            name,
            slug,
            description,
            image: `uploads/${req.file ? req.file.filename : ""}`,
            parent: parent || null,
            level
        });

        return res.status(200).json({success: false, message: "Create new category successfully", category});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const updateCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const id = req.params;
        const {name, description, image, parent, isActive} = req.body;
        
        const category = await Category.findById(id);
        if(!category) return res.status(404).json({success: false, message: "Category not found"});

        if(name) {
            category.name = name;
            category.slug = slugify(name, {lower: true, strict: true});
        }
        if(description !== undefined) category.description = description;
        if(image !== undefined) category.image = `uploads/${req.file ? req.file.filename : ""}`;
        if(parent !== undefined) {
            if(parent) {
                const parentCategory = await Category.findById(parent);
                if(!parentCategory) return res.status(400).json({success: false, message: "Parent category not found"});
                category.parent = parent;
                category.level = parentCategory.level + 1;
            } else {
                category.parent = null;
                category.level = 0;
            }
        }

        await category.save();
        return res.status(200).json({success: false, message: "Update category successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({level: 1, createdAt: -1}) //Sắp xếp theo cha trước con sau, sau đó mới sắp xếp category mới lên đầu
            .populate("parent", "name slug"); //Populate để hiện object thật thay vì chỉ có ID
        
        return res.json(categories);
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(400).json({success: false, message: "You have to log in first"});

        const id = req.params;
        const category = await Category.findById(id);
        if(!category) return res.status(404).json({success: false, message: "Category not found"});

        //Not allow for deleting category if it has child category
        const childCategories = await Category.find({parent: id});
        if(childCategories.length !== 0) return res.status(400).json({success: false, message: "Can not delete category that has child category"});

        await category.deleteOne();
        return res.status(200).json({success: false, message: "Delete category successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
}

module.exports = { createdCategory, updateCategory, getCategory, deleteCategory };