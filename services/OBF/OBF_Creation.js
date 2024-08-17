const { Sequelize, QueryTypes } = require('sequelize');
const { Op } = require('sequelize');
const sequelize = require('../config/dbConn');
const { DataTypes } = require('sequelize');
const { json } = require('sequelize');
const JsonConvert = require('json-convert');
const { URL } = require('url');
const { stringify } = require('json');
const winston = require('winston');

// importing used models : 
const GetObfMasterParameters = require('../../models/Dashboard/ObfCreationParameters');
const SaveServiceParameteredit = require('../../models/Dashboard/')

/// message -> the models used here are not written in correct format so it is advised to check the under path 
/// -> models/Dashboard/ ..   to confirm the parametres. 


async function getObfDetailsForPpl(dhId) {
    const query = `
        SELECT dm.*, dh.dh_header_id, dh.domain_id 
        FROM dh_headers dh 
        JOIN dh_main dm ON dh.dh_id = dm.dh_id 
        WHERE dm.dh_id = :dhId 
        LIMIT 1
    `;

    try {
        const results = await sequelize.query(query, {
            replacements: { dhId },
            type: QueryTypes.SELECT
        });

        if (results.length > 0) {
            const result = results[0];
            const obfParameters = {
                _dh_project_name: result.dh_project_name,
                _dh_id: result.dh_id,
                _projecttype: result.domain_id,
                _dh_location: result.dh_location,
                _opportunity_id: result.opportunity_id,
                _customer_name: result.customer_name,
                _vertical_id: result.vertical_id
            };
            return obfParameters;
        } else {
            return null; // or handle the case when no record is found
        }
    } catch (error) {
        console.error('Error fetching OBF details:', error);
        throw error;
    }
}

/// 

async function ObfCreation(filter) {
    const _ObfCreationData = [];

    try {
        // Execute the stored procedure using Sequelize's raw query method
        const rows = await sequelize.query(
            'CALL sp_manage_dh_header(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            {
                replacements: [
                    filter._dh_id,
                    filter._dh_project_name.toUpperCase(),
                    filter._opportunity_id.toUpperCase(),
                    filter._dh_location.toUpperCase(),
                    filter._vertical_id,
                    filter._verticalhead_id,
                    filter._dh_desc,
                    filter._dh_phase_id,
                    filter._parent_dh_main_id,
                    filter._dh_header_id,
                    filter._total_revenue,
                    filter._total_cost,
                    filter._total_margin,
                    filter._total_project_life,
                    filter._irr_surplus_cash,
                    filter._ebt,
                    filter._capex,
                    filter._irr_borrowed_fund,
                    filter._is_loi_po_uploaded,
                    filter._assumptions_and_risks,
                    filter._fname,
                    filter._fpath,
                    filter._active,
                    filter._status,
                    filter._is_saved,
                    filter._is_submitted,
                    filter._created_by,
                    filter._service_category,
                    filter._payment_terms,
                    filter._mode,
                    filter._customer_name.toUpperCase(),
                    filter._loi_po_details,
                    filter._payment_term_desc,
                    filter._solution_category_id,
                    filter._projecttype
                ],
                type: QueryTypes.RAW
            }
        );

        // Processing rows returned from stored procedure
        for (let row of rows) {
            const _ObfCreationDetailsParameters = {
                Result: row.result
            };

            if (_ObfCreationDetailsParameters.Result !== 'success') {
                _ObfCreationData.push(_ObfCreationDetailsParameters);
                return _ObfCreationData;
            }

            _ObfCreationDetailsParameters.dh_id = row.dh_id;
            _ObfCreationDetailsParameters.dh_header_id = row.dh_header_id;

            filter._dh_header_id = parseInt(_ObfCreationDetailsParameters.dh_header_id);

            // Updating various parameters in filter object
            filter.Attachments.forEach(attachment => {
                attachment._dh_id = parseInt(row.dh_id);
                attachment._dh_header_id = parseInt(row.dh_header_id);
                attachment._created_by = filter._created_by;
            });

            filter.Services.forEach(service => {
                service._dh_header_id = parseInt(row.dh_header_id);
                service._created_by = filter._created_by;
            });

            filter._SubmitOBFParameters.forEach(submitOBF => {
                submitOBF._dh_id = parseInt(row.dh_id);
                submitOBF._dh_header_id = parseInt(row.dh_header_id);
                submitOBF._created_by = filter._created_by;
                submitOBF._is_submitted = filter._is_submitted;
                submitOBF._active = filter._active;
            });

            filter.sapio.forEach(SAPIO => {
                SAPIO._dh_id = parseInt(row.dh_id);
                SAPIO._dh_header_id = parseInt(row.dh_header_id);
                SAPIO._created_by = filter._created_by;
            });

            filter.sap_customer_code.forEach(SAPCODE => {
                SAPCODE._dh_id = parseInt(row.dh_id);
                SAPCODE._dh_header_id = parseInt(row.dh_header_id);
                SAPCODE._created_by = filter._created_by;
            });

            _ObfCreationData.push(_ObfCreationDetailsParameters);
        }

        // Save Attachments
        await SaveAttachments(filter.Attachments);

        if (filter.save_with_solution_sector === 'Y') {
            const SSP = {
                _dh_header_id: filter._dh_header_id,
                _Sector_Id: filter._Sector_Id,
                _SubSector_Id: filter._SubSector_Id,
                _created_by: filter._created_by
            };

            await SaveServices(filter.Services);
            await SaveSectorSubSector(SSP);
            await SaveCustomer_SAP_Customer_Code(filter.sap_customer_code, filter._dh_header_id, filter._created_by);
            await SaveCustomer_SAP_IO_Number(filter.sapio, filter._dh_header_id, filter._created_by);

            if (filter._dh_comment !== '') {
                const _SaveCommentsParameter = {
                    _dh_header_id: filter._dh_header_id,
                    _dh_comment: filter._dh_comment,
                    _created_by: filter._created_by
                };
                await SaveComments(_SaveCommentsParameter);
            }
        }

        if (filter._is_submitted === 1) {
            await submit_dh_headers(filter._SubmitOBFParameters[0]);
        }

        return _ObfCreationData;

    } catch (e) {
        console.error(`Error in ObfCreation: ${new Date()}\n${e}`);
        const _ObfCreationDetailsParameters = { Result: 'Failure' };
        _ObfCreationData.push(_ObfCreationDetailsParameters);
        return _ObfCreationData;
    }
}

async function editCustomerCodeAndIO(filter) {
    let _editCustomerCodeAndIO = [];
    let _editCustomerCodeAndIOStage1 = [];

    try {
        // Updating SAPIO parameters with provided filter values
        filter.sapio.forEach(SAPIO => {
            SAPIO._dh_id = parseInt(filter._dh_id);
            SAPIO._dh_header_id = parseInt(filter._dh_header_id);
            SAPIO._created_by = filter._created_by;
        });

        // Updating SAPCUSTCODE parameters with provided filter values
        filter.sap_customer_code.forEach(SAPCUSTCODE => {
            SAPCUSTCODE._dh_id = parseInt(filter._dh_id);
            SAPCUSTCODE._dh_header_id = parseInt(filter._dh_header_id);
            SAPCUSTCODE._created_by = filter._created_by;
        });

        // Call SaveCustomer_SAP_Customer_Code and check for success status
        _editCustomerCodeAndIOStage1 = await SaveCustomerSAPCustomerCode(filter.sap_customer_code, filter._dh_header_id, filter._created_by);

        for (let SA of _editCustomerCodeAndIOStage1) {
            if (SA.status !== "Success") {
                _editCustomerCodeAndIO.push(SA);
                return _editCustomerCodeAndIO;
            }
        }

        // Call SaveCustomerSAPIONumber and return the results
        _editCustomerCodeAndIO = await SaveCustomerSAPIONumber(filter.sapio, filter._dh_header_id, filter._created_by);
        return _editCustomerCodeAndIO;

    } catch (error) {
        console.error(`Error in editCustomerCodeAndIO: ${error.message}`);
        // Handle error and return a failure response
        _editCustomerCodeAndIO.push({ status: "Failure", error: error.message });
        return _editCustomerCodeAndIO;
    }
}


async function editCustomerCodeAndIOOld(filter) {
    let _editCustomerCodeAndIO = [];

    try {
        // Execute the stored procedure using Sequelize
        const results = await sequelize.query(
            'CALL sp_edit_sap_customer_code(:dh_header_id, :sap_customer_code, :created_by)',
            {
                replacements: {
                    dh_header_id: filter._dh_header_id,
                    sap_customer_code: filter._sap_customer_code,
                    created_by: filter._created_by
                },
                type: QueryTypes.RAW
            }
        );

        // Iterate over the results returned by the stored procedure
        for (let row of results) {
            let _ObfCreationDetailsParameters = {};

            _ObfCreationDetailsParameters.Result = row.status || "Failure";
            _ObfCreationDetailsParameters.dh_id = parseInt(filter._dh_id);
            _ObfCreationDetailsParameters.dh_header_id = parseInt(filter._dh_header_id);

            // Updating SAPIO parameters
            filter.sapio.forEach(SAPIO => {
                SAPIO._dh_id = parseInt(filter._dh_id);
                SAPIO._dh_header_id = parseInt(filter._dh_header_id);
                SAPIO._created_by = filter._created_by;
            });

            _editCustomerCodeAndIO.push(_ObfCreationDetailsParameters);
        }

        // Call SaveCustomer_SAP_IO_Number function
        await SaveCustomer_SAP_IO_Number(filter.sapio, filter._dh_header_id, filter._created_by);

        return _editCustomerCodeAndIO;

    } catch (e) {
        // Error handling
        const errordetails = `Error in editCustomerCodeAndIO: ${new Date().toString()}\n${e.toString()}`;
        writelogobfcreation(errordetails);

        let _ObfCreationDetailsParameters = {};
        _ObfCreationDetailsParameters.Result = "Failure";
        _editCustomerCodeAndIO.push(_ObfCreationDetailsParameters);

        return _editCustomerCodeAndIO;
    }
}

///// 

async function saveServiceSolutionSector(filter) {
    let _saveAttachmentDetailsParameters = [];

    try {
        // Update the fields for Services and sapio with the values from the filter
        filter.Services.forEach(service => {
            service._dh_id = filter._dh_id;
            service._dh_header_id = filter._dh_header_id;
            service._created_by = filter._created_by;
            service._fname = filter._fname;
            service._fpath = filter._fpath;
        });

        filter.sapio.forEach(csip => {
            csip._dh_id = filter._dh_id;
            csip._dh_header_id = filter._dh_header_id;
            csip._created_by = filter._created_by;
        });

        // Save Services and SectorSubSector, and handle the return values
        _saveAttachmentDetailsParameters = await saveServices(filter.Services);
        _saveAttachmentDetailsParameters = await saveSectorSubSector(filter);

        // Save SAP IO Numbers if they exist
        if (filter.sapio.length !== 0) {
            _saveAttachmentDetailsParameters = await saveCustomerSAPIONumber(filter.sapio, filter._dh_header_id, filter._created_by);
        }

        // Save Comments if they exist
        if (filter._dh_comment !== "") {
            const _saveCommentsParameter = {
                _dh_header_id: filter._dh_header_id,
                _dh_comment: filter._dh_comment,
                _created_by: filter._created_by
            };
            _saveAttachmentDetailsParameters = await saveComments(_saveCommentsParameter);
        }

        return _saveAttachmentDetailsParameters;
    } catch (error) {
        // Log the error
        console.error(`Error in saveServiceSolutionSector: ${error.message}`);

        // Return a failure response
        const _details = {
            status: "Failed",
            message: "Error in saving parameters"
        };
        _saveAttachmentDetailsParameters.push(_details);

        return _saveAttachmentDetailsParameters;
    }
}

/////// 
async function submitDhHeaders(filter) {
    let _saveAttachmentDetailsParameters = [];

    try {
        // Call the stored procedure with the provided parameters
        const results = await sequelize.query(
            'CALL sp_submit_dh_header(:_dh_header_id, :_dh_id, :_user_id, :_active, :_is_submitted)',
            {
                replacements: {
                    _dh_header_id: filter._dh_header_id,
                    _dh_id: filter._dh_id,
                    _user_id: filter._created_by,
                    _active: filter._active,
                    _is_submitted: filter._is_submitted
                },
                type: QueryTypes.RAW
            }
        );

        // Process the results from the stored procedure
        results.forEach(row => {
            const _details = {
                status: row.status || 'Unknown',
                message: row.message || 'No message',
                dh_header_id: filter._dh_header_id,
                dh_id: filter._dh_id
            };
            _saveAttachmentDetailsParameters.push(_details);
        });

        try {
            const o = {
                _dh_header_id: filter._dh_header_id,
                _created_by: filter._created_by,
                isapproved: 1,
                is_on_hold: 0
            };
            await emailSendingDetails(o); /// to be wriiten in email sending details  in another file of OBF 
        } catch (error) {
            // Handle any error that occurs during the email sending process
            console.error('Error sending email:', error);
        }

        return _saveAttachmentDetailsParameters;

    } catch (error) {
        console.error('Error in submitDhHeaders:', error);

        const _details = {
            status: 'Failed',
            message: 'Error in saving parameters'
        };
        _saveAttachmentDetailsParameters.push(_details);

        return _saveAttachmentDetailsParameters;
    }
}
/////

async function saveSectorSubSector(filter) {
    let _saveAttachmentDetailsParameters = [];

    try {
        // Execute the stored procedure with the provided parameters
        const results = await sequelize.query(
            'CALL sp_save_dh_sector_subsector(:_dh_header_id, :_Sector_Id, :_SubSector_Id, :_user_id)',
            {
                replacements: {
                    _dh_header_id: filter._dh_header_id,
                    _Sector_Id: filter._Sector_Id,
                    _SubSector_Id: filter._SubSector_Id,
                    _user_id: filter._created_by
                },
                type: QueryTypes.RAW
            }
        );

        // Process the results from the stored procedure
        results.forEach(row => {
            const _details = {
                status: row.status || 'Unknown',
                message: row.message || 'No message',
                dh_header_id: filter._dh_header_id,
                dh_id: filter._dh_id || null
            };
            _saveAttachmentDetailsParameters.push(_details);
        });

        return _saveAttachmentDetailsParameters;

    } catch (error) {
        console.error('Error in saveSectorSubSector:', error);

        const _details = {
            status: 'Failed',
            message: 'Error in saving parameters'
        };
        _saveAttachmentDetailsParameters.push(_details);

        return _saveAttachmentDetailsParameters;
    }
}

///// 

async function saveServices(filters) {
    const SaveAttachementDetailsParameters = [];

    try {
        for (const filter of filters) {
            for (const SL of filter.Serviceslist) {
                const [results] = await sequelize.query(
                    'CALL sp_save_dh_services(:_dh_header_id, :solution_id, :solutioncategory_id, :solution_Name, :_user_id)',
                    {
                        replacements: {
                            _dh_header_id: filter._dh_header_id,
                            solution_id: SL.value,
                            solutioncategory_id: filter.value,
                            solution_Name: SL.viewValue,
                            _user_id: filter._created_by
                        },
                        type: QueryTypes.RAW
                    }
                );

                for (const result of results) {
                    const Details = {
                        status: result.status || null,
                        message: result.message || null,
                        dh_header_id: filter._dh_header_id,
                        dh_id: filter._dh_id
                    };
                    SaveAttachementDetailsParameters.push(Details);
                }
            }
        }

        return SaveAttachementDetailsParameters;
    } catch (ex) {
        const errordetails = `error in save services ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);

        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
}

////// 

async function saveAttachments(filters) {
    const SaveAttachementDetailsParameters = [];

    try {
        for (const filter of filters) {
            const [results] = await sequelize.query(
                'CALL sp_save_dh_attachments(:_dh_id, :_dh_header_id, :_fname, :_fpath, :_description, :_user_id)',
                {
                    replacements: {
                        _dh_id: filter._dh_id,
                        _dh_header_id: filter._dh_header_id,
                        _fname: filter._fname,
                        _fpath: filter._fpath,
                        _description: filter._description,
                        _user_id: filter._created_by
                    },
                    type: QueryTypes.RAW
                }
            );

            for (const result of results) {
                const Details = {
                    status: result.status || null,
                    message: result.message || null
                };
                SaveAttachementDetailsParameters.push(Details);
            }
        }

        return SaveAttachementDetailsParameters;
    } catch (ex) {
        const errordetails = `error in save attachment ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);

        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
}

////// 

async function getMastersOBFCreation(model) { /// here in parametre call the OBF model. 
    try {
        const [results] = await sequelize.query(
            'CALL sp_get_master_list(:_user_id)',
            {
                replacements: { _user_id: model.userid },
                type: QueryTypes.RAW
            }
        );

        // Assuming `results` is the dataset returned by the stored procedure
        const jsonResult = JsonConvert.serializeObject(results, null, 2);

        return jsonResult;
    } catch (ex) {
        const errordetails = `error in getmasterobfcreation ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);
        return "error";
    }
}

//// 

async function getEditObf(filter) {
    let editobf = new EditObfParameters();
    editobf.Services = [];
    editobf.Attachments = [];
    editobf.sapio = [];
    editobf.sap_customer_code = [];

    try {
        const results = await sequelize.query(
            'CALL sp_getEditObfData(:dh_id, :dh_header_id, :user_code)',
            {
                replacements: {
                    dh_id: filter.dh_id,
                    dh_header_id: filter.dh_header_id,
                    user_code: filter.user_code
                },
                type: QueryTypes.SELECT
            }
        );

        const rds = results; // Assuming this is the dataset returned

        // Sap_IO_number Table
        if (rds.Sap_IO_number) {
            rds.Sap_IO_number.forEach(row => {
                const sap_io = new Customer_SAP_IO_Parameteredit();
                sap_io._Cust_SAP_IO_Number = row.cust_sap_io_number;
                editobf.sapio.push(sap_io);
            });
        }

        // sap_customer_code Table
        if (rds.sap_customer_code) {
            rds.sap_customer_code.forEach(row => {
                const sap_customer_code = new sap_customer_code_Parameteredit();
                sap_customer_code._sap_customer_code = row.sap_customer_code;
                editobf.sap_customer_code.push(sap_customer_code);
            });
        }

        // uploaddata Table
        if (rds.uploaddata) {
            rds.uploaddata.forEach(row => {
                editobf._dh_id = parseInt(row.dh_id);
                editobf._dh_header_id = parseInt(row.dh_header_id);
                editobf._fname = row.filename;
                editobf._fpath = row.filepath;
                editobf._created_by = row.created_by;
                editobf._dh_project_name = row.dh_project_name;
                editobf._projecttype = parseInt(row.domain_id || "0");
                editobf._opportunity_id = row.opportunity_id;
                editobf._dh_location = row.dh_location;
                editobf._parent_dh_main_id = parseInt(row.parent_dh_main_id || "0");
                editobf._vertical_id = parseInt(row.vertical_id);
                editobf._verticalhead_id = parseInt(row.verticalhead_id);
                editobf._dh_desc = row.dh_desc;
                editobf._total_revenue = parseFloat(row.total_revenue);
                editobf._total_cost = parseFloat(row.total_cost);
                editobf._total_margin = parseFloat(row.total_margin);
                editobf._total_project_life = row.total_project_life;
                editobf._irr_surplus_cash = parseFloat(row.irr_surplus_cash);
                editobf._ebt = parseFloat(row.ebt);
                editobf._capex = parseFloat(row.capex);
                editobf._irr_borrowed_fund = parseFloat(row.irr_borrowed_fund);
                editobf._is_loi_po_uploaded = row.is_loi_po_uploaded;
                editobf._assumptions_and_risks = row.assumptions_and_risks;
                editobf._payment_terms = parseInt(row.payment_terms);
                editobf._sap_customer_code = row.sap_customer_code;
                editobf._Sector_Id = parseInt(row.Sector_Id);
                editobf._SubSector_Id = parseInt(row.SubSector_Id);
                editobf._customer_name = row.customer_name;
                editobf._version_name = row.version_name;
                editobf._dh_comment = row.dh_comment;
                editobf._loi_po_details = row.loi_po_details;
                editobf._payment_term_desc = row.payment_term_desc;
                editobf._solution_category_id = parseInt(row.solution_category_id);
            });
        }

        // SolutionServices Table
        if (rds.SolutionServices) {
            const dt_distinctsolcategory = rds.SolutionServices.reduce((acc, curr) => {
                const exists = acc.some(item => item.solutioncategory_id === curr.solutioncategory_id);
                if (!exists) {
                    acc.push({
                        solutioncategory_id: curr.solutioncategory_id,
                        solutioncategory_name: curr.solutioncategory_name
                    });
                }
                return acc;
            }, []);

            dt_distinctsolcategory.forEach(row => {
                const sc = new SaveServiceParameteredit();
                sc.Serviceslist = [];
                sc.value = row.solutioncategory_id;
                sc.Solutioncategory = row.solutioncategory_name;

                const Row_Solutions_In_Category = rds.SolutionServices.filter(service => service.solutioncategory_id === sc.value);

                Row_Solutions_In_Category.forEach(dr => {
                    const servlist = { value: dr.solution_id, viewValue: dr.solution_name };
                    sc.Serviceslist.push(servlist);
                });
                editobf.Services.push(sc);
            });
        }

        // Attachments Table
        if (rds.Attachments) {
            rds.Attachments.forEach(dr => {
                const attachments = new SaveAttachmentParameter();
                attachments._dh_id = editobf._dh_id;
                attachments._dh_header_id = editobf._dh_header_id;
                attachments._created_by = editobf._created_by;
                attachments._fname = dr.filename;
                attachments._fpath = dr.filepath;
                attachments._description = dr.description;
                editobf.Attachments.push(attachments);
            });
        }

        return editobf;

    } catch (ex) {
        const errordetails = `error in getEditObf ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);
        return null;
    }
}

//// 
async function getPreviousVersion(filter) {
    let editobf = new previousversion();

    try {
        const results = await sequelize.query(
            'CALL sp_get_previous_ppl_obf(:dh_id, :dh_header_id)',
            {
                replacements: {
                    dh_id: filter.dh_id,
                    dh_header_id: filter.dh_header_id
                },
                type: QueryTypes.SELECT
            }
        );

        const rds = results; // Assuming this is the dataset returned

        // previousobfppl Table
        if (rds.previousobfppl) {
            rds.previousobfppl.forEach(row => {
                editobf._total_revenue = parseFloat(row.total_revenue);
                editobf._total_cost = parseFloat(row.total_cost);
                editobf._total_margin = parseFloat(row.total_margin);
                editobf._total_project_life = row.total_project_life;
                editobf._irr_surplus_cash = parseFloat(row.irr_surplus_cash);
                editobf._ebt = parseFloat(row.ebt);
                editobf._capex = parseFloat(row.capex);
                editobf._irr_borrowed_fund = parseFloat(row.irr_borrowed_fund);
                editobf._payment_terms = parseInt(row.payment_terms);
                editobf._version_name = row.version_name;
            });
        }

        return editobf;

    } catch (ex) {
        const errordetails = `error in getPreviousVersion ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);
        return null;
    }
}

////// 

async function getProjectTypeByID(domain_id) {
    let result = "";
    try {
        const query = `
            SELECT domain_name 
            FROM mst_domains 
            WHERE domain_id = :domain_id
        `;

        const ds = await sequelize.query(query, {
            replacements: { domain_id },
            type: QueryTypes.SELECT
        });

        if (ds && ds.length > 0) {
            result = ds[0].domain_name || "N/A";
        } else {
            result = "N/A";
        }

        return result;

    } catch (ex) {
        const errordetails = `error in getProjectTypeByID ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);
        result = "N/A";
        return result;
    }
}

///// 
async function getMasterSolutions(model) {
    let solutionCategories = [];
    try {
        const query = `CALL sp_get_master_solutions(:user_id);`;

        const rds = await sequelize.query(query, {
            replacements: { user_id: model.userid },
            type: QueryTypes.RAW
        });

        const dtSolutionCategory = rds[0].solutioncategory;  // Assuming first result set is solutioncategory
        const dtSolutions = rds[0].solutions;  // Assuming second result set is solutions

        dtSolutionCategory.forEach(row => {
            let sc = {
                value: row.value.toString(),
                viewValue: row.viewValue.toString(),
                Solutioncategory: row.viewValue.toString(),
                Solutionservices: []
            };

            let solutionCategoryId = parseInt(row.value);

            for (let i = 1; i <= solutionCategoryId; i++) {
                let serviceObj = {
                    Serviceslist: []
                };

                let solutionsInCategory = dtSolutions.filter(solution => parseInt(solution.Solutioncategory_Id) === i);

                if (solutionsInCategory.length > 0) {
                    serviceObj.Solutioncategory = solutionsInCategory[0].solutioncategory_name;
                    serviceObj.value = solutionsInCategory[0].Solutioncategory_Id.toString();

                    solutionsInCategory.forEach(solution => {
                        let sl = {
                            value: solution.value.toString(),
                            viewValue: solution.viewValue.toString()
                        };

                        serviceObj.Serviceslist.push(sl);
                    });

                    sc.Solutionservices.push(serviceObj);
                }
            }

            solutionCategories.push(sc);
        });

        return solutionCategories;

    } catch (ex) {
        const errordetails = `error in getMasterSolutions ${new Date().toISOString()}\n${ex.toString()}`;
        writelogobfcreation(errordetails);
        return null;
    }
}

///  keep in mind to write emailSender function in defferent file 
async function approveRejectObf(filters) {
    const commanmessgesList = [];

    try {
        // Call the stored procedure with parameter replacements
        const [results] = await sequelize.query(`
            CALL sp_dh_approve_reject(
                :dhheaderid,
                :_user_id,
                :isapproved,
                :rejectcomment,
                :rejectionto,
                :exceptionalcase_cfo,
                :exceptioncase_ceo,
                :is_on_hold,
                :_marginal_exception_requested,
                :_is_final_agg_validated
            )
        `, {
            replacements: {
                dhheaderid: filters._dh_header_id,
                _user_id: filters._created_by,
                isapproved: filters.isapproved,
                rejectcomment: filters.rejectcomment,
                rejectionto: filters.rejectionto,
                exceptionalcase_cfo: filters.exceptionalcase_cfo,
                exceptioncase_ceo: filters.exceptioncase_ceo,
                is_on_hold: filters.is_on_hold,
                _marginal_exception_requested: filters._marginal_exception_requested,
                _is_final_agg_validated: filters._is_final_agg_validated
            },
            type: Sequelize.QueryTypes.SELECT
        });

        // Process the results from the stored procedure
        results.forEach(row => {
            const details = {
                status: row.status || 'Unknown',
                message: row.message || 'No message'
            };
            commanmessgesList.push(details);
        });

        // Attempt to send an email
        try {
            await EmailSender_DAL.emailSendingDetails(filters);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        // Handle additional logic based on approval status
        try {
            await writelogobfcreation(`Is approved: ${filters.isapproved}`);
            if (filters.isapproved === 1 && filters._is_final_agg_validated === 1 && filters._dh_phase_id === 1) {
                const [rows] = await sequelize.query(`
                    CALL sp_getdhdataforOICFinalAggValidate(
                        :dhheaderid,
                        :_user_id
                    )
                `, {
                    replacements: {
                        dhheaderid: filters._dh_header_id,
                        _user_id: filters._created_by
                    },
                    type: Sequelize.QueryTypes.SELECT
                });

                if (rows.length > 0) {
                    const res = {
                        _oppid: rows[0].opportunity_id.toString(), // Convert to string safely
                        _userid: filters._created_by,
                        _param: 'FinalAgg Validate',
                        _obfid: ''
                    };
                    await getDHStatusFromOIC(res);
                }
            } else if (filters.isapproved === 1 && filters._dh_phase_id === 1) {
                const [rows] = await sequelize.query(`
                    CALL sp_getdhdataforOIC(
                        :dhheaderid,
                        :_user_id
                    )
                `, {
                    replacements: {
                        dhheaderid: filters._dh_header_id,
                        _user_id: filters._created_by
                    },
                    type: Sequelize.QueryTypes.SELECT
                });

                await writelogobfcreation(`Rows count: ${rows.length}`);
                if (rows.length > 0) {
                    await writelogobfcreation('Sending data to OIC for OBF approval');
                    const res = {
                        _oppid: rows[0].opportunity_id.toString(), // Convert to string safely
                        _userid: filters._created_by,
                        _param: 'OBF Approval',
                        _obfid: ''
                    };
                    await getDHStatusFromOIC(res);
                }
            }
        } catch (oicError) {
            await writelogobfcreation(`Error occurred in OIC trigger \n${oicError.toString()}`);
        }

        return commanmessgesList;
    } catch (error) {
        const errordetails = `error in Approve Reject Obf ${new Date().toString()}\n${error.toString()}`;
        await writelogobfcreation(errordetails);

        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
}

///// 
async function getDHStatusFromOIC(data) {
    writeLogObfCreation("oppid : " + data._oppid);
    writeLogObfCreation("user id : " + data._userid);
    writeLogObfCreation("param : " + data._param);
    writeLogObfCreation("obf id : " + data._obfid);

    const inputData = data._param.toString();
    const userId = data._userid.toString();

    writeLogObfCreation("input data : " + inputData);
    writeLogObfCreation("userid : " + userId);

    if (inputData === "" || inputData.trim() === "") {
        writeLogObfCreation("Empty string");
        // Handle the error response here as per your logic
        // For example, you can return a specific error response:
        // return res.status(400).json({ msgNo: HttpStatusCode.BadRequest, msgType: 'E', message: 'Incorrect data' });
    } else {
        // UAT
        writeLogObfCreation("In else");
        const url = Configuration.OICUATEndPointUrl; // Assuming this is how you fetch the config in Sequelize

        const jsonSerialize = JSON.stringify(data);

        const jsonHeader = "DHData";
        const firstContent = `{ "${jsonHeader}":[`;
        const lastContent = "]}";
        const jsonPass = firstContent + jsonSerialize + lastContent;

        writeLogObfCreation("jsonpass : " + jsonPass);
        await returnPostApproval(url, "POST", jsonPass); // Assuming this function is async
    }
}

///// 
function returnPostApproval(url, method, json) {
    const parsedUrl = new URL(url);

    const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(json),
        },
        auth: `${Configuration.OICusr}:${Configuration.OICpsw}`, // Assuming these are configured in Sequelize
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseText = '';

            res.on('data', (chunk) => {
                responseText += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 202) { // HTTP 202 Accepted
                    writeLogObfCreation("Request was accepted.");
                    resolve(responseText);
                } else {
                    writeLogObfCreation(`Request failed with status code: ${res.statusCode}`);
                    reject(new Error(`Request failed with status code: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            writeLogObfCreation(`Request encountered an error: ${error.message}`);
            reject(error);
        });

        req.write(json);
        req.end();
    });
}

//// 
async function saveCustomerSAPCustomerCode(filters, _dh_header_id, _created_by) {
    const _SaveAttachmentDetailsParameters = [];

    try {
        // If filters list is empty, add a default filter
        if (filters.length === 0) {
            const filter = {
                _dh_header_id,
                _created_by,
                _sap_customer_code: '', // Assuming you might need a default value
            };
            filters.push(filter);
        }

        let cnt = 0;

        // Iterate over each filter and perform the database operation
        for (const filter of filters) {
            cnt += 1;
            let deletedata = cnt === 1 ? "Y" : "N";

            const [results, metadata] = await sequelize.query(
                'CALL sp_save_dh_sap_customer_code(:_dh_header_id, :_sap_customer_code, :_user_id, :_deletedata)',
                {
                    replacements: {
                        _dh_header_id: filter._dh_header_id,
                        _sap_customer_code: filter._sap_customer_code || '',
                        _user_id: filter._created_by,
                        _deletedata: deletedata,
                    },
                    type: Sequelize.QueryTypes.RAW,
                }
            );

            // Process the results and add them to _SaveAttachmentDetailsParameters
            results.forEach((row) => {
                const _Details = {
                    status: row.status || null,
                    message: row.message || null,
                    dh_header_id: parseInt(filter._dh_header_id, 10),
                    dh_id: parseInt(filter._dh_id, 10),
                };
                _SaveAttachmentDetailsParameters.push(_Details);
            });
        }

        return _SaveAttachmentDetailsParameters;
    } catch (error) {
        // Handle errors
        const errordetails = `Error in Save Customer SAP Customer Code at ${new Date().toISOString()}\n${error.toString()}`;
        writeLogObfCreation(errordetails);

        // Add a default failed response
        const _Details = {
            status: "Failed",
            message: "Error in saving parameters",
        };
        _SaveAttachmentDetailsParameters.push(_Details);

        return _SaveAttachmentDetailsParameters;
    }
}
////// 
async function saveComments(filter) {
    const _SaveAttachmentDetailsParameters = [];

    try {
        // Execute the stored procedure to save comments
        const [results, metadata] = await sequelize.query(
            'CALL sp_add_dh_comments(:_dh_header_id, :_dh_comment, :_user_id)',
            {
                replacements: {
                    _dh_header_id: filter._dh_header_id,
                    _dh_comment: filter._dh_comment || '',
                    _user_id: filter._created_by,
                },
                type: Sequelize.QueryTypes.RAW,
            }
        );

        // Process the results and add them to _SaveAttachmentDetailsParameters
        results.forEach((row) => {
            const _Details = {
                status: row.status || null,
                message: row.message || null,
                dh_header_id: parseInt(filter._dh_header_id, 10),
                dh_id: parseInt(filter._dh_id, 10),
            };
            _SaveAttachmentDetailsParameters.push(_Details);
        });

        return _SaveAttachmentDetailsParameters;
    } catch (error) {
        // Handle errors
        const errordetails = `Error in Save comment at ${new Date().toISOString()}\n${error.toString()}`;
        writeLogObfCreation(errordetails);

        // Add a default failed response
        const _Details = {
            status: "Failed",
            message: "Error in saving comments",
        };
        _SaveAttachmentDetailsParameters.push(_Details);

        return _SaveAttachmentDetailsParameters;
    }
}
//////
async function saveAttachmentsOBFSummary(filters) {
    const _SaveAttachmentDetailsParameters = [];

    try {
        let i = 0;

        for (const filter of filters) {
            // Initialize a transaction for each filter
            const transaction = await sequelize.transaction();

            try {
                if (i === 0) {
                    // Execute the stored procedure sp_delete_attachment_descriptionwise
                    await sequelize.query(
                        'CALL sp_delete_attachment_descriptionwise(:_dh_header_id, :_description)',
                        {
                            replacements: {
                                _dh_header_id: filter._dh_header_id,
                                _description: filter._description,
                            },
                            transaction,
                        }
                    );
                    i++;
                }

                if (filter._fname !== "Remove all Details" && filter._fpath !== "Remove all Details") {
                    // Execute the stored procedure sp_save_dh_attachments
                    const [results] = await sequelize.query(
                        'CALL sp_save_dh_attachments(:_dh_id, :_dh_header_id, :_fname, :_fpath, :_description, :_user_id)',
                        {
                            replacements: {
                                _dh_id: filter._dh_id,
                                _dh_header_id: filter._dh_header_id,
                                _fname: filter._fname,
                                _fpath: filter._fpath,
                                _description: filter._description,
                                _user_id: filter._created_by,
                            },
                            transaction,
                        }
                    );

                    results.forEach((row) => {
                        const _Details = {
                            status: row.status || null,
                            message: row.message || null,
                        };
                        _SaveAttachmentDetailsParameters.push(_Details);
                    });

                    // Check for OIC Trigger Final Agreement Uploaded Status
                    if (filter._description === "FinalAgg") {
                        const [rows] = await sequelize.query(
                            'CALL sp_getdhattachmentdataforOIC(:dhheaderid, :dhid, :_user_id)',
                            {
                                replacements: {
                                    dhheaderid: filter._dh_header_id,
                                    dhid: filter._dh_id,
                                    _user_id: filter._created_by,
                                },
                                transaction,
                            }
                        );

                        if (rows.length > 0 && filter._dh_phase_id === 1) {
                            const res = {
                                _oppid: rows[0].opportunity_id,
                                _userid: filter._created_by,
                                _param: "FinalAgg Upload",
                                _obfid: "",
                            };
                            await getDHStatusFromOIC(res); // Assume this is an async function
                        }
                    }
                } else {
                    const _Details = {
                        status: "Success",
                        message: "Successful",
                    };
                    _SaveAttachmentDetailsParameters.push(_Details);
                }

                // Commit the transaction
                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }

        return _SaveAttachmentDetailsParameters;
    } catch (error) {
        // Error handling
        const errordetails = `Error in Save Attachment OBF Summary at ${new Date().toISOString()}\n${error.toString()}`;
        writeLogObfCreation(errordetails);

        const _Details = {
            status: "Failed",
            message: "Error in saving parameters",
        };
        _SaveAttachmentDetailsParameters.push(_Details);

        return _SaveAttachmentDetailsParameters;
    }
}
/////// 
async function getOBFSummaryDataVersionWise(model) {
    try {
        const query = `
            CALL sp_getOBFSummaryData_versionwise(:dh_id, :dh_header_id);
        `;

        // Execute the stored procedure
        const result = await sequelize.query(query, {
            replacements: {
                dh_id: model.dh_id,
                dh_header_id: model.dh_header_id
            },
            type: QueryTypes.RAW
        });

        // Assuming result is an array of datasets
        const rds = result[0]; // First element should contain the dataset

        // Return the JSON stringified version of the dataset
        return JSON.stringify(rds, null, 2);

    } catch (error) {
        const errordetails = `Error in Get OBF Summary Data Version-wise at ${new Date().toISOString()}\n${error.toString()}`;
        writeLogObfCreation(errordetails);
        return "error";
    }
}

////// 
async function getDHData() {
    try {
        const query = `
            CALL sp_getDHData(:user_id);
        `;

        // Execute the stored procedure
        const results = await sequelize.query(query, {
            replacements: { user_id: 12 }, // Assuming user_id is 12 as per the original code
            type: QueryTypes.RAW
        });

        const dhDataList = results[0].map((row) => ({
            obf: row.obf,
            action: row.action,
            approvalstatus: row.approvalstatus,
            assumptions_and_risks: row.assumptions_and_risks,
            capex: row.capex,
            comments: row.comments,
            createdby: row.createdby,
            createdon: row.createdon,
            CurrentStatus: row.CurrentStatus,
            customername: row.customername,
            LastActionDate: row.LastActionDate,
            ebt: row.ebt,
            grossmargin: row.grossmargin,
            irr_borrowed_fund: row.irr_borrowed_fund,
            irr_surplus_cash: row.irr_surplus_cash,
            LOIPO: row.LOIPO,
            opportunity_id: row.opportunity_id,
            paymenttermsindays: row.paymenttermsindays,
            paymenttermdesc: row.paymenttermdesc,
            projectbrief: row.projectbrief,
            projectname: row.projectname,
            primarylocation: row.primarylocation,
            projecttype: row.projecttype,
            sector: row.sector,
            solutioncategory: row.solutioncategory,
            subsector: row.subsector,
            total_cost: row.total_cost,
            total_margin: row.total_margin,
            total_project_life: row.total_project_life,
            total_revenue: row.total_revenue,
            TypeofService: row.TypeofService,
            vertical: row.vertical,
            Verticalname: row.Verticalname
        }));

        return dhDataList;

    } catch (error) {
        const errordetails = `Error in getting active users data at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        return null;
    }
}
////// 

async function getAttachmentDocument(model) {
    try {
        const query = `
            CALL sp_get_dh_attachments(:dh_id, :dh_header_id);
        `;

        // Execute the stored procedure
        const results = await sequelize.query(query, {
            replacements: {
                dh_id: model.dh_id,
                dh_header_id: model.dh_header_id
            },
            type: QueryTypes.RAW
        });

        // Assuming the procedure returns a DataSet-like structure and the first index contains the data
        const resultData = results[0]; // If the result is an array of objects, this would work
        // If `results` is already in the desired format, this step may not be necessary

        return JSON.stringify(resultData, null, 2); // Pretty-printing with 2-space indentation

    } catch (error) {
        const errordetails = `Error in GetAttachmentDocument at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        return "error";
    }
}


////// 
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, message }) => `${timestamp} - ${message}`)
    ),
    transports: [
        new winston.transports.File({ filename: config.logFilePath, level: 'info' }),
        new winston.transports.Console() // Optional: log to console as well
    ]
});

// Function to write log
function writelogobfcreation(errordetails) {
    logger.info(errordetails);
}

//Exports : 
module.exports = {
    getObfDetailsForPpl,
    ObfCreation,
    editCustomerCodeAndIO,
    editCustomerCodeAndIOOld,
    saveServiceSolutionSector,
    submitDhHeaders,
    saveSectorSubSector,
    saveServices,
    saveAttachments,
    getMastersOBFCreation,
    getEditObf,
    getPreviousVersion,
    getProjectTypeByID,
    getMasterSolutions,
    approveRejectObf,
    getDHStatusFromOIC,
    returnPostApproval,
    saveCustomerSAPCustomerCode,
    saveComments,
    saveAttachmentsOBFSummary,
    getOBFSummaryDataVersionWise,
    getDHData,
    getAttachmentDocument,
    writelogobfcreation,

};