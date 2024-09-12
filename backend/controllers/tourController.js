const Tour = require('./../models/tourmodel');
const factoy=require('./handlerFactory');

exports.getTour = factoy.getOne(Tour,{path:'reviews'})
exports.updateTour = factoy.updateone(Tour);
exports.deleteTour = factoy.deleteOne(Tour);
exports.Getalltour = factoy.Getall(Tour);
exports.createTour = factoy.CreateOne(Tour);



// exports.updateTour = async(req, res) => {
//   try {

//     const tour= await Tour.findByIdAndUpdate(req.params.id, req.body,{
//       new:true,
//       runValidators:true
//       });

//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour
//         }
//       });
//     } catch (error) {
//     res.status(400).json({
//       status:'fail',
//       message:error
//      })
//   }
// };


// exports.deleteTour = async(req, res) => {
//   try {

//   await Tour.findByIdAndDelete(req.params.id)
//     res.status(204).json({
//     status: 'success',
//     data: null
//   });
    
//   } catch (error) {

//     res.status(400).json({
//       status:'fail',
//       message:error
//      })
    
//   }

// };
