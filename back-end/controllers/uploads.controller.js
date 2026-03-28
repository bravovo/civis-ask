import File from "../models/file.model.js";

export const postUploadPdf = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Файлу для аналізу не надано",
            });
        }
        const pdfPath = req.file.path;

        if (!pdfPath) {
            throw new Error("Помилка збереження файлу");
        }

        const file = await File.create({
            filename: req.body.title,
            path: pdfPath,
            size: req.file.size,
            loadedBy: req.user.id,
        });

        await file.save();

        if (!file) {
            throw new Error("Помилка збереження файлу");
        }

        return res.status(201).json({
            success: true,
            message: "Файл збережено успішно",
            file: file,
        });
    } catch (error) {
        next(error);
    }
};
