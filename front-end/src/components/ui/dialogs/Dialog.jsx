import closeIcon from "../../../assets/icons/close-x.svg";

function Dialog({ title, children, open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="overflow-hidden fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-2 md:p-0"
      onClick={onClose}
    >
      <div
        className="w-lg bg-white p-3 rounded-lg relative border-[1px] border-zinc-400 flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <h4>{title}</h4>
        <hr className="mt-2 border-zinc-400" />
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-[24px] h-[24px] p-0! border-none! bg-transparent! hover:transform-none! hover:shadow-none! flex items-center justify-center"
        >
          <img
            src={closeIcon}
            alt="Close"
            className="w-full h-full hover:border-zinc-400"
          />
        </button>
      </div>
    </div>
  );
}
export default Dialog;
