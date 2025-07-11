const mongoose = require('mongoose');
const bcrypt = require('@node-rs/bcrypt');


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  points: { type: Number, required: true },
  createdAt: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') },
});

userSchema.pre('save', async function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    try {
      user.password = await bcrypt.hash(user.password, 10);
      next();
    } catch (err) {
      next(err);
    }
  });
  /* cheks if password filed has bee modified after an edit, in ase hash the new password */

userSchema.methods.comparePassword = async function comparePassword(candidatePassword, callaback) {
    try {
    callaback(null, await bcrypt.verify(candidatePassword, this.password));
    } catch (err) {
    callaback(err);
    }
  };


module.exports = mongoose.model('users', userSchema);