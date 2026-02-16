import { Router } from "express";
import multer from "multer";

import { postUploadPdf } from "../controllers/uploads.controller.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/pdf", upload.single("file"), postUploadPdf);

export default router;
