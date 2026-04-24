import mongoose from "mongoose";

import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return v.length >= 2 && v.length <= 15;
                },
                message: (props) =>
                    `Ім'я має бути довжиною від 2 до 15 символів`,
            },
        },
        lastName: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return v.length >= 2 && v.length <= 25;
                },
                message: (props) =>
                    `Прізвище має бути довжиною від 2 до 25 символів`,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Електронна пошта повинна мати правильний формат",
            ],
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["civis", "admin"],
            default: "civis",
        },
        age: {
            type: Number,
            min: [16, "Вік користувача має бути не менше 16 років"],
        },
        gender: {
            type: String,
            enum: ["male", "female"],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePasswords = function (pass) {
    return bcrypt.compare(pass, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
