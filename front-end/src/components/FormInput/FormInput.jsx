function FormInput({ onChange, title, name, type }) {
    return (
        <label
            htmlFor={name}
            className="w-full flex flex-col gap-1 justify-start m-0"
        >
            {title}
            <input
                type={type}
                required
                name={name}
                onChange={onChange}
                className="border-[1px] rounded-[4px] border-zinc-400 py-1.5 px-3"
            />
        </label>
    );
}
export default FormInput;
