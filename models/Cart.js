const mongoose = require("mongoose");

const { Schema } = mongoose;

/* ---------- Cart Item Schema ---------- */ //Để tham khảo lưu trong cartSchema
const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    //
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

/* ---------- Cart Schema ---------- */
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      //   unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* ---------- Calculate total amount ---------- */
// cartSchema.pre("save", function (next) {
//   this.totalAmount = this.items.reduce((total, item) => {
//     return total + item.price * item.quantity;
//   }, 0);
//   next();
// });

/* ---------- Model ---------- */
module.exports = mongoose.model("Cart", cartSchema);