import mongoose from 'mongoose';

const { Schema } = mongoose;

/* ---------- Order Item Schema ---------- */
const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    variant: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    }
});

/* ---------- Shipping Address Schema ---------- */
const shippingAddressSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    ward: {
        type: String,
        required: true,
    },
});

/* ---------- Order Schema ---------- */
const orderSchema = new Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        items: {
            type: orderItemSchema,
            required: true,
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['cod', 'card', 'e-wallet'],
            default: 'cod',
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
            index: true,
        },
        orderStatus: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'shipping',
                'delivered',
                'cancelled',
            ],
            default: 'pending',
            index: true,
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        note: {
            type: String,
        },
        cancelReason: {
            type: String,
        },
        paidAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

/* ---------- Generate Order Number ---------- */
// orderSchema.pre('save', function (next) {
//     if (!this.orderNumber) {
//         const timestamp = Date.now().toString(36).toUpperCase();
//         const random = Math.random()
//             .toString(36)
//             .substring(2, 6)
//             .toUpperCase();
//         this.orderNumber = `ORD-${timestamp}-${random}`;
//     }
//     next();
// });

/* ---------- Indexes ---------- */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });

/* ---------- Model ---------- */
const Order = mongoose.model('Order', orderSchema);

export default Order;