import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});



userSchema.pre("findOneAndUpdate", async function () {

  const update = this.getUpdate();

  if (!update) return;

  let password = update.password || update.$set?.password;

  if (password) {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (update.password) update.password = hashedPassword;

    if (update.$set?.password) update.$set.password = hashedPassword;

    this.setUpdate(update);
  }

});


userSchema.methods.comparePassword = async function (password) {

  return bcrypt.compare(password, this.password);
};



const User = mongoose.model("User", userSchema);

export default User;