const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn'); 
const DashBoardDetailsParameters = require('../../models/Dashboard/DashBoardDetailsParametres');
const DashBoardDetailsCountParameters = require('../../models/Dashboard/DashBoardDetailsCountParameters');
const TimelineHistory =  require('../../models/Dashboard/TimelineHistory');


const getDashBoardData = async(filter) => {
    try {
        const results  = await sequelize.query(
            'CALL sp_getdashboardgriddata(:_user_code)',
        {
            replacements:{_user_code:filter._user_code},
            type:QueryTypes.RAW
        }
    );


    const Dashboard = results.map(row => {
        const _DashBoardDetailsParameters = new DashBoardDetailsParameters({
            dh_id: row.dh_id,
            dh_header_id: row.dh_header_id,
            Current_Status: row.CurrentStatus,
            Project_Name: row.dh_project_name,
            Code: row.dh_code,
            Opp_Id: row.opportunity_id,
            Created_On: row.createdon,
            Created_By: row.createdby,
            Total_Cost: row.total_cost,
            Total_Revenue: row.total_revenue,
            Gross_Margin: row.total_margin,
            mainobf: row.mainobf,
            version_name: row.version_name,
            shortcurrentstatus: row.shortcurrentstatus,
            phase_code: row.phase_code,
            ppl_init: row.ppl_init,
            ppl_status: row.ppl_status,
            customer_name: row.customer_name,
            dh_location: row.dh_location,
            Vertical_Name: row.Vertical_name,
            sap_customer_code: row.sap_customer_code,
            sector_name: row.sector_name,
            subsector_name: row.subsector_name,
            solutioncategory_name: row.solutioncategory_name,
            currentstatus_search: row.currentstatus_search,
            is_submitted: row.is_submitted,
            Project_Type: row.project_type,
            progresspercentage: row.progresspercentage,
            IsFinalAggUpload: row.IsFinalAggUpload,
            is_on_hold: row.is_on_hold,
            onholdcomment: row.onholdcomment,
            onhold_datetime: row.onhold_datetime,
            onhold_commentedby: row.onhold_commentedby,
            sap_io_numbers: row.sap_io_numbers ? row.sap_io_numbers.split(',') : [],
            sap_customer_codes: row.sap_customer_code ? row.sap_customer_code.split(',') : []

    });

    return _DashBoardDetailsParameters;
    });

    return Dashboard;
    }
    catch(error){
        const errordetails = `Error in getDashBoardData at ${new Date().toISOString()}\n ${error.toString()}`;
        console.error(errordetails);
        return null;
    }


}


const getDashBoardCount = async (filter) => {
    try{
        const results = await sequelize.query(
            'CALL so_getdashboardcount(:_user_code)',
            {
                replacements:{_user_code:filter._user_code},
                type:QueryTypes.SELECT
            }
        );


        const dashBoardDataCount=results.map(row => {
            const _DashBoardDetailsCountParameters = new DashBoardDetailsCountParameters({
                _draft_obf: row._draft_obf,
                _draft_ppl: row._draft_ppl,
                _draft: row._draft_obf + row._draft_ppl,
                _submitted_obf: row._submitted_obf,
                _submitted_ppl: row._submitted_ppl,
                _submitted: row._submitted_obf + row._submitted_ppl,
                _rejected_obf: row._rejected_obf,
                _rejected_ppl: row._rejected_ppl,
                _rejected: row._rejected_obf + row._rejected_ppl,
                _approved_obf: row._approved_obf,
                _approved_ppl: row._approved_ppl,
                _approved: row._approved_obf + row._approved_ppl,
                _pendingobf: (row._submitted_obf - (row._approved_obf + row._rejected_obf)) < 0 ? 0 : (row._submitted_obf - (row._approved_obf + row._rejected_obf)),
                _pendingppl: (row._submitted_ppl - (row._approved_ppl + row._rejected_ppl)) < 0 ? 0 : (row._submitted_ppl - (row._approved_ppl + row._rejected_ppl)),
                _TotalPending: ((row._submitted_obf - (row._approved_obf + row._rejected_obf)) + (row._submitted_ppl - (row._approved_ppl + row._rejected_ppl))) < 0 ? 0 : ((row._submitted_obf - (row._approved_obf + row._rejected_obf)) + (row._submitted_ppl - (row._approved_ppl + row._rejected_ppl))),
                _totalapprovedppl: row._totalapprovedppl,
                _totalapprovedobf: row._totalapprovedobf
            });

            return _DashBoardDetailsCountParameters;
        })

        return dashBoardDataCount;

    }
    catch (error) {
        const errordetails = `Error in getDashBoardDataCount at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        return null;
    }
}

const getOBFSummaryDetails = async (dh_id) => {
    try {
        const result = await sequelize.query(
            'CALL sp_getOBFSummaryData(:dh_id)',
            {
                replacements: { dh_id },
                type: QueryTypes.SELECT
            }
        );
        return JSON.stringify(result, null, 2);
    } catch (error) {
        const errordetails = `Error in getOBFSummaryDetails at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        writelogdashboard(errordetails);
        return 'error';
    }
};


const getDetailTimelineHistory = async (dh_id, dh_header_id) => {
    try {
        const results = await sequelize.query(
            'CALL sp_dh_get_detailedtimeline(:_dh_id, :_dh_header_id)',
            {
                replacements: { _dh_id: dh_id, _dh_header_id: dh_header_id },
                type: QueryTypes.SELECT
            }
        );

        const timelineData = results.map(row => {
            return new TimelineHistory({
                dh_id: row.dh_id,
                dh_header_id: row.dh_header_id,
                username: row.username,
                currentstatus: row.currentstatus,
                comments: row.comments,
                TimeLine: row.TimeLine,
                actions: row.actions
            });
        });

        return timelineData;
    } catch (error) {
        const errordetails = `Error in getDetailTimelineHistory at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        writelogdashboard(errordetails);
        throw error;
    }
};

const getOBFSummaryDetailsVersion = async (dh_id, dh_header_id) => {
    try {
        const result = await sequelize.query(
            'CALL sp_getOBFSummaryData_versionwise(:dh_id, :dh_header_id)',
            {
                replacements: { dh_id, dh_header_id },
                type: QueryTypes.SELECT
            }
        );

        return JSON.stringify(result, null, 2); // Pretty print the JSON
    } catch (error) {
        const errordetails = `Error in getOBFSummaryDetailsVersion at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        writelogdashboard(errordetails);
        throw error;
    }
};


const getDashboardProgress = async (dh_id) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_dashboard_progress(:dh_id)',
            {
                replacements: { dh_id },
                type: QueryTypes.SELECT
            }
        );

        return JSON.stringify(result, null, 2);
    } catch (error) {
        const errordetails = `Error in getDashboardProgress at ${new Date().toISOString()}\n${error.toString()}`;
        console.error(errordetails);
        writelogdashboard(errordetails);
        throw error;
    }
};

module.exports = {
    getDashboardProgress
};


const writelogdashboard = (errordetails) => {
    return errordetails;
}
module.exports={
    getDashBoardData,
    getDashBoardCount,
    getOBFSummaryDetails,
    getDetailTimelineHistory,
    getOBFSummaryDetailsVersion,
    getDashboardProgress
}