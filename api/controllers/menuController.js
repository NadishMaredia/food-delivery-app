const Menu = require('../models/menu');

const addMenu = async (req, res) => {

    const { name, description, price, restaurantId, type, rating } = req.body;

    const newMenu = new Menu({
        name,
        description,
        price,
        restaurantId,
        type,
        rating
    });

    try {

        const savedMenu = await newMenu.save();

        res.json({
            message: 'Menu Added!',
            savedMenu
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

const getAllMenu = async (req, res) => {

    try {
        // Pagination
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to limit 10

        // Sorting
        const sortField = req.query.sortField || 'name'; // Default to sorting by name
        const sortOrder = req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'desc' ? -1 : 1;

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || ''; // Default to empty string

        // Build the search criteria using regular expressions
        const searchCriteria = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }
            ],
        };

        // Query to get paginated and sorted restaurants
        const menus = await Menu.find(searchCriteria)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        // Count total number of restaurants
        const totalMenu = await Menu.countDocuments();

        res.json({
            message: 'Restaurants fetched successfully',
            menus,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMenu / limit),
                totalItems: totalMenu,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const getMenuById = async (req, res) => {

    const id = req.params.hotelId;

    try {

        const menu = await Menu.findById(id);

        if (!menu) {
            // If no restaurant is found with the given ID
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json({
            message: 'Menu fetch successfully',
            menu
        });
    } catch (error) {

        res.status(500).json({ message: 'Menu not found with this ' + id });

    }

}

const updateMenu = async (req, res) => {
    const id = req.params.menuId; // Correct parameter name

    try {
        const { name, description, price, type, image, rating } = req.body;

        // Find the restaurant by ID
        const menu = await Menu.findById(id);

        if (!menu) {
            // If no restaurant is found with the given ID
            return res.status(404).json({ error: 'Menu not found' });
        }

        // Update the restaurant fields
        menu.name = name || menu.name;
        menu.description = description || menu.description;
        menu.price = price || menu.price;
        menu.type = type || menu.type;
        menu.rating = rating || menu.ratings;
        menu.image = image || menu.image;

        // Save the updated restaurant to the database
        const updatedMenu = await menu.save();

        res.json({
            message: 'Menu updated successfully',
            restaurant: updatedMenu
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
            console.error('Error updating menu:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getMenuByRestaurantId = async (req, res) => {

    const restaurantId = req.params.hotelId;

    try {

        const menus = await Menu.find({ restaurantId });

        if (!menus) {
            res.status(404).json({
                message: 'Menu not found with this restaurantId ' + restaurantId
            })
        }

        res.json({
            message: 'Menus fetched successfully',
            menus
        });

    } catch (error) {

        console.error('Error fetching menus:', error);
        res.status(500).json({ message: 'Restaurant not found with this id: ' + restaurantId });

    }

}

const deleteMenu = async (req, res) => {

    const menuId = req.params.menuId;

    try {

        const deletedMenu = await Menu.findByIdAndRemove(menuId);

        if (!deletedMenu) {
            return res.status(404).json({ error: 'Menu not found' });
        }

        res.json({
            message: 'Menu deleted successfully',
            deletedMenu,
        });

    } catch (error) {

        console.error('Error deleting menu:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

const getMenuSorted = async (req, res) => {

    const restaurantId = req.params.hotelId;

    try {

        const sortBy = req.body.sortBy || 'rating';

        let sortCriteria;
        switch (sortBy) {
            case 'rating':
                sortCriteria = { rating: -1 };
                break;
            case 'lowestPrice':
                sortCriteria = { price: 1 };
                break;
            case 'highestPrice':
                sortCriteria = { price: -1 };
                break;
            case 'name':
                sortCriteria = { name: 1 };
                break;
            default:
                sortCriteria = { rating: -1 };
        }

        const menu = await Menu.find({ restaurantId })
            .sort(sortCriteria);

        res.json({
            message: 'Menus fetched successfully',
            menu
        });

    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

module.exports = {
    addMenu,
    getAllMenu,
    getMenuById,
    updateMenu,
    deleteMenu,
    getMenuByRestaurantId,
    getMenuSorted
}