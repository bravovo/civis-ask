import mongoose from "mongoose";

const fileSchema = mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        loadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;
