import axios from "axios";
import { useState } from "react";
import { SERVER_URL } from "../../config/env";
import FormInput from "../../components/FormInput/FormInput";
import { useDispatch } from "react-redux";
import { setLoading } from "../../state/loaderSlice";
import Popup from "../../components/Popup/Popup";

function Dashboard() {
    const dispatch = useDispatch();
    const [fileData, setFileData] = useState({
        title: "",
        years: [],
        method: "",
        source: "",
    });

    const [fileInput, setFileInput] = useState(null);
    const [filenameInput, setFilenameInput] = useState("");
    const [error, setError] = useState("");

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!fileInput) {
                setError("Потрібно обрати файл");
                return;
            }

            if (!filenameInput) {
                setError("Потрібно обрати назву файла");
                return;
            }
            dispatch(setLoading(true));

            const formData = new FormData();
            formData.append("file", fileInput);
            formData.append("title", filenameInput);

            const response = await axios.post(
                `${SERVER_URL}/uploads/pdf`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.status == 201) {
                setFileData(response.data.file);
            }
        } catch (error) {
            if (error.response) {
                console.error(error.response);
                setError(error.response.data.message);
            } else {
                console.error(error);
            }
            console.log(error.response || error);
        }
        dispatch(setLoading(false));
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-6">
            {error && <Popup text={error} color="red" />}
            <div className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]">
                <form
                    onSubmit={handleFileSubmit}
                    className="w-full flex flex-col gap-2"
                >
                    <label htmlFor="file_input">
                        Оберіть файл звіту соціального дослідження (.pdf)
                    </label>
                    <input
                        className="
                        block cursor-pointer w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4 file:rounded-md
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-gray-300 file:text-black
                        file:cursor-pointer
                        file:transition-all file:duration-500 file:ease-out
                        hover:file:bg-gray-400
                        focus:outline-0
                        "
                        id="file_input"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFileInput(e.target.files[0])}
                    ></input>
                    <FormInput
                        title="Введіть назву файлу"
                        name="fileName"
                        onChange={(e) => setFilenameInput(e.target.value)}
                        type="text"
                    />
                    <button type="submit">Завантажити файл</button>
                </form>
            </div>
            {fileData && <div>{fileData.filename}</div>}
        </div>
    );
}

export default Dashboard;
