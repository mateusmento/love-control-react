export function Tag({label, onClose = () => {}}) {
    return (
        <span className="tag">
            <span className="tag__label">{label}</span>
            <span className="tag__close" onClick={onClose}>x</span>
        </span>
    );
}
