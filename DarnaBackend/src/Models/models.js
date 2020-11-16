import mongoose from 'mongoose';
const Schema = mongoose.Schema;
 export const DemandeSchema = new Schema({
     NomPrenom: {
         type:String,
         required: true
     },
    Email: {
        type:String,
        required: true
    },
    Tel: {
        type:Number
    },
    DateNaissance: {
        type:Date
    },
    Job: {
        type:String
    },
    Password: {
        type:String,
        required: true
    },
    Create_date: {
        type: Date,
        default:Date.now
    },
    photo: {
        type:String
    }
 }

 )
 export const usershema = new Schema({
    NomPrenom: {
        type:String,
        required: true
    },
   Email: {
       type:String,
       required: true
   },
   Tel: {
       type:Number
   },
   DateNaissance: {
       type:Date
   },
   Job: {
       type:String
   },
   Password: {
       type:String,
       required: true
   },
   Create_date: {
       type: Date,
       default:Date.now
   },
   role:{
    type:String
   },
   statut:{
    type:String
   },
   photo: {
    type:String
}
})