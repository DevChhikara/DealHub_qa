const { QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn');
const { DataTypes } = require('sequelize');

//// get req models here  : 

async function getMenus(filter) {
    const menus = [];

    try {
        // Define the stored procedure query
        const query = `
            CALL sp_menu_getmenus(:_user_code);
        `;

        // Execute the stored procedure
        const [results] = await sequelize.query(query, {
            replacements: { _user_code: filter._user_code },
            type: sequelize.QueryTypes.SELECT,
        });

        // Process the results
        results.forEach(row => {
            const menu = new MenuBindingDetailsParameter();
            menu.id = row.id || null; // Adjust this based on your field names and types
            menu.name = row.name || null;
            menu.iconClass = row.iconClass || null;
            menu.url = row.url || null;
            // You can handle the 'active' field similarly if needed
            // menu.active = row.active === 0 ? false : true;

            menus.push(menu);
        });

    } catch (error) {
        console.error('Error fetching menus:', error);
        return null; // Handle the error as appropriate
    }

    return menus;
}

module.exports = { getMenus };

