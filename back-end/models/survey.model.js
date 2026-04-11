import mongoose from "mongoose";

const surveySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return v.length >= 2 && v.length <= 100;
                },
                message: (props) =>
                    `Назва опитування має бути довжиною від 2 до 100 символів`,
            },
        },
        description: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return v.length < 500;
                },
                message: (props) =>
                    `Опис опитування не може бути більше 500 символів`,
            },
        },
        questions: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                    validate: {
                        validator: function (v) {
                            return v.length >= 2 && v.length <= 100;
                        },
                        message: (props) =>
                            `Назва питання має бути довжиною від 2 до 100 символів`,
                    },
                },
                required: { type: Boolean, default: true },
                type: {
                    type: String,
                    enum: ["radio", "check"],
                    default: "text",
                },
                options: [
                    {
                        value: {
                            type: String,
                            required: true,
                            trim: true,
                        },
                    },
                ],
            },
        ],
        verified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;
