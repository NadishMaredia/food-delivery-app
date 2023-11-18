const Restaurant = require('../models/restaurant');

const addRestaurant = async (req, res) => {

    const { name, description, address, postalcode } = req.body;

    const newRestaurant = new Restaurant({
        name,
        description,
        address,
        postalcode
    });

    try {

        const savedRestaurant = await newRestaurant.save();

        res.json({
            message: 'Restaurant Added!',
            savedRestaurant
        });

    } catch (error) {

        if (error.name === 'ValidationError') {

            const validationErrors = {};
            for (const key in error.errors) {
                validationErrors[key] = error.errors[key].message;
            }

            console.error('Validation errors:', validationErrors);
            res.status(400).json({ errors: validationErrors });
        } else {

            console.error('Error saving restaurant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }

}

const getAllRestaurant = async (req, res) => {

    try {
        const restaurantList = await Restaurant.find();

        res.json({
            message: 'Restaurant list fetch successfully',
            restaurantList
        })
    } catch (error) {

        res.json({
            message: 'Some issue fetching restaurant list'
        })

    }

}

const getRestaurantById = async (req, res) => {

    const id = req.params.hotelId;

    try {

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            // If no restaurant is found with the given ID
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json({
            message: 'Restaurant fetch successfully',
            restaurant
        });
    } catch(error) {

        res.status(500).json({ message: 'Restaurant not found with this ' +id });

    }

}

const updateRestaurant = async (req, res) => {
    const id = req.params.hotelId; // Correct parameter name

    try {
        const { name, description, address, postalcode, ratings, image } = req.body;

        // Find the restaurant by ID
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            // If no restaurant is found with the given ID
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Update the restaurant fields
        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        restaurant.address = address || restaurant.address;
        restaurant.postalcode = postalcode || restaurant.postalcode;
        restaurant.ratings = ratings || restaurant.ratings;
        restaurant.image = image || restaurant.image;

        // Save the updated restaurant to the database
        const updatedRestaurant = await restaurant.save();

        res.json({
            message: 'Restaurant updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (const key in error.errors) {
                validationErrors[key] = error.errors[key].message;
            }

            console.error('Validation errors:', validationErrors);
            res.status(400).json({ errors: validationErrors });
        } else {
            console.error('Error updating restaurant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = {
    addRestaurant,
    getAllRestaurant,
    getRestaurantById,
    updateRestaurant
}