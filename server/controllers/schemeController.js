const {  createSchemeProfile,
    getSchemeBySubject,
    updateSchemeProfile,
    deleteSchemeProfile
} = require("../services/schemeServices");


const createScheme = async(req, res)=>{
    const { term, academicYear, subjectId}= req.body;
    if(!term || !academicYear || !subjectId){
        const newError = new Error("Term, academic year and subject ID required");
        newError.status = 404;
        throw newError;
    };

    const { data, error }= await createSchemeProfile(term, academicYear, subjectId);
    if(error){
        throw error;
    };

    res.status(201).json({
        message: `Scheme of work for ${term} ${academicYear} created successfully`,
        data
    });
};

const getScheme = async(req, res)=>{
    const { subjectId } = req.params;
    const { data, error } = await getSchemeBySubject(subjectId);

    if(error){
        throw error;
    }

    if(!data){
        const newError = new Error("Unable to load schemes");
        newError.status = 500;
        throw newError;
    }

    res.status(200).json({
        message: "Scheme of work available",
        data,
    });
};

const updateScheme = async(req, res)=>{
    const { id } = req.params;
    const { term, academicYear } = req.body;

    if(!term || !academicYear){
        const newError = new Error("Term and academic year required");
        newError.status = 400;
        throw newError;
    }

    const { data, error } = await updateSchemeProfile(id, term, academicYear);
    if(error){
        throw error;
    }

    if(!data || data.length === 0){
        const newError = new Error("Scheme of work not found");
        newError.status = 404;
        throw newError;
    }

    res.status(200).json({
        message: "Scheme of work updated successfully",
        data
    });
};

const deleteScheme = async(req, res)=>{
    const { id } = req.params;
    const { data, error } = await deleteSchemeProfile(id);

    if(error){
        throw error;
    }

    res.status(200).json({
        message: "Scheme of work deleted successfully",
        data
    });
};

module.exports = {
    createScheme,
    getScheme,
    updateScheme,
    deleteScheme
};
   


