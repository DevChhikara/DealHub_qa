const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn');
const { DataTypes } = require('sequelize');


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



module.exports = {
    getObfDetailsForPpl,
    ObfCreation,
    editCustomerCodeAndIO,
    editCustomerCodeAndIOOld,
    saveServiceSolutionSector,
    submitDhHeaders,


};