const DataTypes = require('sequelize');

const SFDataUpdation = sequelize.define('SFDataUpdation', {
    _sf_opportunity_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_opportunity_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_solutioncategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_type_of_service: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_vertical: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_sector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_subsector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_project_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_cust_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_project_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_project_primary_loc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_project_brief: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _sf_record_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});


const CommonResponseModel = sequelize.define('CommonResponseModel', {
    Status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    errormsg: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});



async function createSFDataUpdation(data) {
    try {
        const sfData = await SFDataUpdation.create(data);
        return sfData;
    } catch (error) {
        console.error('Error creating SFDataUpdation:', error);
        throw error;
    }
}

async function handleSFDataUpdationRequest(request) {
    try {
        const responses = [];
        for (const sfData of request.SFData) {
            const createdData = await createSFDataUpdation(sfData);
            responses.push({
                Status: 'Success',
                message: 'Data created successfully',
                errormsg: ''
            });
        }
        return responses;
    } catch (error) {
        console.error('Error handling SFDataUpdation request:', error);
        return [{
            Status: 'Error',
            message: 'Failed to create data',
            errormsg: error.message
        }];
    }
}

module.exports = {
    sequelize,
    SFDataUpdation,
    CommonResponseModel,
    createSFDataUpdation,
    handleSFDataUpdationRequest
};
