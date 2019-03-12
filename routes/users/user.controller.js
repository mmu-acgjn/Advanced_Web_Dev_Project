const User = require('./user.model');

/**
 * Return a paged list of orders.
 * @param {*} req The express request object.
 * @param {*} res The express result object.
 * @param {*} next Next match route handler.
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;

    User.list({ limit, skip })
        .then(data => res.json(data))
        .catch(e => next(e));
}

function login(req, res, next) {
    const { pin = null } = req.body;

    if (pin == null) {
        next(new Error('No pin entered.'));
        return;
    }

    User.getByPin(pin)
        .then(user => res.json({ user: user }))
        .catch(e => next(e));
}

/**
 * Create a new user with the posted body data.
 * @param {*} req The express request object.
 * @param {*} res The express result object.
 * @param {*} next Next match route handler.
 */
function create(req, res, next) {
    var newUser = req.body.user;
    User.findOne({ pin: newUser.pin })
        .then(user => {
            if (user != null) {
                return Promise.reject(new Error('User exists with that pin.'));
            }

            return User.create(newUser);
        })
        .then(createdUser => res.json({ user: createdUser }))
        .catch(e => next(e));
}

/**
 * Update an existing user.
 * @param {*} req The express request object.
 * @param {*} res The express result object.
 * @param {*} next Next match route handler.
 */
function update(req, res, next) {
    var userId = req.params.id;
    var updatedUser = req.body.user;

    return User.getById(userId)
        .then(user => {
            user.name = updatedUser.name;
            user.type = updatedUser.type;
            user.type = updatedUser.type;
            return user.save();
        })
}

module.exports = {
    list,
    login,
    create,
    update
};
