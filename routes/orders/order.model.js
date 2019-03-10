const mongoose = require('mongoose');

var OrderItemsSchema = new mongoose.Schema({
    menuItemId: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    status: {
        type: String,
        enum: ['InProgress', 'Complete']
    }
});

const OrderSchema = new mongoose.Schema({
    tableId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['InProgress', 'Completed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date
    },
    items: [
        OrderItemsSchema
    ]
});

// Define order object methods, abstracts away modification of a given order.
OrderSchema.method({
    /**
     * Mark the current order as completed.
     */
    complete() {
        this.status = 'Completed';
    }
});

OrderSchema.statics = {
    // Wrapper on find method uwill be used to return clearer errors.
    getById(id) {
        return this.findById(id)
            .exec()
            .then(order => {
                if (order) {
                    return order;
                }
                // TODO: return error status code within error.
                return Promise.reject(new Error('No order found'));
            });
    },

    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
    },

    getByStatus(orderStatus) {
        return this.find({status : orderStatus})
            .sort({createdAt: -1})
            .exec();
    }
};

module.exports = mongoose.model('Order', OrderSchema);
