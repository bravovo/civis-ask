import "./Loader.css";
import { Oval } from "react-loader-spinner";

function Loader() {
    return (
        <div className="loader-overlay">
            <Oval
                visible={true}
                height="100"
                width="100"
                color="#000"
                secondaryColor="gray"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
}

export default Loader;
