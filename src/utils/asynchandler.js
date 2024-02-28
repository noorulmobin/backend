const asynchandler =(requestHandler)=>{
  return  (req, res, next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err));
}

}


export {asynchandler}


// const asyncHandler =(fn)=> async(req,res,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 5000).json({
//             success:false,
//             message:error.message
//     })
// }