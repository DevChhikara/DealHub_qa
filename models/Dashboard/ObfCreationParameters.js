const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CommonParameters = sequelize.define('CommonParameters', {
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'CommonParameters'
    });

    const ObfCreationParameters = sequelize.define('ObfCreationParameters', {
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        _dh_project_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'project name is mandatory'
                },
                is: {
                    args: /^[\-–a-zA-Z0-9@#$&/;|,.?_()% \s\n]+$/,
                    msg: 'Special characters are not allowed in Project name'
                }
            }
        },
        _opportunity_id: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'opportunity id is mandatory'
                },
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in opportunity id'
                }
            }
        },
        _dh_location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'project location is mandatory'
                },
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in project location'
                }
            }
        },
        _vertical_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'vertical is mandatory'
                }
            }
        },
        _verticalhead_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'vertical head is mandatory'
                }
            }
        },
        _dh_desc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'project Description is mandatory'
                }
            }
        },
        _dh_phase_id: {
            type: DataTypes.INTEGER
        },
        _parent_dh_main_id: {
            type: DataTypes.INTEGER
        },
        _total_revenue: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'total revenue is mandatory'
                }
            }
        },
        _total_cost: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'total cost is mandatory'
                }
            }
        },
        _total_margin: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'total margin is mandatory'
                }
            }
        },
        _total_project_life: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'total project life is mandatory'
                }
            }
        },
        _irr_surplus_cash: {
            type: DataTypes.DECIMAL
        },
        _ebt: {
            type: DataTypes.DECIMAL
        },
        _capex: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'total project life is mandatory'
                }
            }
        },
        _irr_borrowed_fund: {
            type: DataTypes.DECIMAL
        },
        _is_loi_po_uploaded: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in LOI PO Uploaded'
                }
            }
        },
        _assumptions_and_risks: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'assumption and risks is mandatory'
                }
            }
        },
        _active: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in Active'
                }
            }
        },
        _status: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in Status'
                }
            }
        },
        _is_saved: {
            type: DataTypes.INTEGER
        },
        _is_submitted: {
            type: DataTypes.INTEGER
        },
        _service_category: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in LOI PO Uploaded'
                }
            }
        },
        _payment_terms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'payment terms is mandatory'
                }
            }
        },
        _mode: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in Mode Uploaded'
                }
            }
        },
        Attachments: {
            type: DataTypes.JSON
        },
        Services: {
            type: DataTypes.JSON
        },
        sapio: {
            type: DataTypes.JSON
        },
        _sap_customer_code: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.?-_ \s\n]+$/,
                    msg: ' Special characters are not allowed in Sap Customer Code'
                }
            }
        },
        _Sector_Id: {
            type: DataTypes.INTEGER
        },
        _SubSector_Id: {
            type: DataTypes.INTEGER
        },
        save_with_solution_sector: {
            type: DataTypes.STRING
        },
        _SubmitOBFParameters: {
            type: DataTypes.JSON
        },
        _customer_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'customer name is mandatory'
                },
                is: {
                    args: /^[a-zA-Z0-9@#$&;|,.()?-_ \s\n]+$/,
                    msg: 'Special characters are not allowed in Customer Name'
                }
            }
        },
        _dh_comment: {
            type: DataTypes.STRING
        },
        _loi_po_details: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'loi/po is mandatory'
                }
            }
        },
        _payment_term_desc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'payment terms is mandatory'
                }
            }
        },
        _solution_category_id: {
            type: DataTypes.INTEGER
        },
        _projecttype: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'project type is mandatory'
                }
            }
        },
        sap_customer_code: {
            type: DataTypes.JSON
        }
    }, {
        timestamps: false,
        tableName: 'ObfCreationParameters'
    });


    return {
        CommonParameters,
        ObfCreationParameters,
    };
};
