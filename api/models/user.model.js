import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required:true,
    unique: true,
  } ,
  email: {
    type: String,
    required:true,
    unique: true,
  }, 
  password: {
    type: String,
    required:true,
  },
  profilePicture: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mR6HLZ_qurbUpkxxpzC8fqSpMrVmb8GGaqGrlqRqN-AX8rRokDXPxUvqOWTz6rk7y-g&usqp=CAU',
  },
  isAdmin: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true,
  versionKey: false,
}) 

const User = model('User', userSchema)

export default User