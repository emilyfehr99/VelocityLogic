export default function Card({ children, className, ...props }) {
    return (
        <div
            className={`glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
}
