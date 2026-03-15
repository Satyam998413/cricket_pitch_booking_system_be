import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String
},{timestamps:true});


// Hash password before saving (CREATE / SAVE)
userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Hash password before updating
userSchema.pre("findOneAndUpdate", async function (next) {

  try {

    const update = this.getUpdate();

    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }

    next();

  } catch (error) {
    next(error);
  }

});


// Compare password method (for login)
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;