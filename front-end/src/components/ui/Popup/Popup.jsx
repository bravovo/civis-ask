import { useEffect, useState } from "react";
import "./Popup.css";

function Popup({ text, color, duration = 3000 }) {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActive(false);
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [duration]);

    return (
        <div className={`popup ${active ? "active" : "hidden"}`}>
            <div
                style={
                    color
                        ? { borderColor: color, boxShadow: `0 0 8px ${color}` }
                        : {}
                }
            >
                <h3>{text}</h3>
            </div>
        </div>
    );
}

export default Popup;
