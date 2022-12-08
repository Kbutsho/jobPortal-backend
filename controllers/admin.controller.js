const { getAllCandidateService, getCandidateById, getAllManagerService } = require("../services/admin.service")
const mongoose = require('mongoose');
const Candidate = require("../models/Candidate.model");

exports.getAllCandidate = async (req, res) => {
    try {
        const candidate = await getAllCandidateService()
        res.json({
            status: 200,
            message: `found candidate ${candidate.length}`,
            data: candidate
        })
    } catch (error) {
        res.json({
            status: 400,
            error: error.message
        })
    }
}
exports.getCandidateById = async (req, res) => {
    const { id } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (validId) {
        const candidate = await Candidate.findById(id).select('_id').lean();
        if(candidate){
            try {
                const data = await getCandidateById(id);
                res.json({
                    "status": 200,
                    "message": "found!",
                    "data": data
                })
            } catch (error) {
                 res.json({
                    "status": 400,
                    "message": "failed!",
                    error: (error.message)
                })
            }
        }else{
            res.json({
                "status": 400,
                "message": "candidate not found!",
                "error": `${id} is not a valid candidate id!`
            })
        }
    } else {
        res.json({
            "status": 400,
            "message": "candidate not found!",
            "error": `${id} is not a valid object id!`
        })
    }
}
exports.getAllManager= async (req, res) => {
    try {
        const data = await getAllManagerService()
        res.json({
            status: 200,
            message: `found Manager ${data.length}`,
            data: data
        })
    } catch (error) {
        res.json({
            status: 400,
            error: error.message
        })
    }
}