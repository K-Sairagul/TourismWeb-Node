const Apperror = require('./../utils/appError');


exports.deleteOne=Model=>async(req, res) => {
    try {
  
    await Model.findByIdAndDelete(req.params.id)
      res.status(204).json({
      status: 'success',
      data: null,
      message:'The Id was deleted successfully'
    });
      
    } catch (error) {
  
      res.status(400).json({
        status:'fail',
        message:error,
       
       })
      
    }
  
  };


  exports.updateone =Model=> async(req, res) => {
    try {
  
      const doc= await Model.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
        });
  
        res.status(200).json({
          status: 'success',
          data: {
            data:doc
          }
        });
      } catch (error) {
      res.status(400).json({
        status:'fail',
        message:error
       })
    }
}; 


exports.CreateOne=Model=>async (req, res) => {

  try {
    const Doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      message:'The data was created successfully for`{model}`',
      data: {
        Data: Doc
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};



exports.Getall=Model=>async (req, res) => {
  try{
    const docs= await Model.find()
    res.status(200).json({
      status: 'success',
      message:'All the data fetched successfully',
      results: docs.length,
      data: {
        docs
      }
    });
  } catch(err){
     res.status(400).json({
      status:'fail',
      message:err,
      mess:"Error in getting all the data"
     })
  }
};


exports.getOne=(Model,popOptions)=>async (req, res) => {
  let query=Model.findById(req.params.id);
  if(popOptions) query=query.populate(popOptions);
  const doc= await query

  if(!doc){
    res.status(400).json({
      status:'fail',
      message:'Fail in handler factory while using get'
     })
};

res.status(200).json({
      status: 'success',
      data: {
       doc
      }
    });
  };
      
    
