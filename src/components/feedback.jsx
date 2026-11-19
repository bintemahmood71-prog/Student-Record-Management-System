export default function Feedback({ message, onDismiss }) {
    if (!message) return null;
  
    return (
      <div
        className={`feedback feedback-${message.type}`}
        role={message.type === "error" ? "alert" : "status"}
      >
        <span>{message.text}</span>
        <button
          type="button"
          className="feedback-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      </div>
    );
  }