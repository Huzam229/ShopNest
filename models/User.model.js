import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    role: {
        type: String, required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        url: {
            type: String,
            trim: true
        },
        public_id: {
            type: String,
            trim: true
        }
    },
    isEmailVerfied: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true })

// hook if password is changed
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//compare password

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users');

export default UserModel;