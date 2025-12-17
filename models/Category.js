const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });

module.exports = mongoose.model("Category", categorySchema);