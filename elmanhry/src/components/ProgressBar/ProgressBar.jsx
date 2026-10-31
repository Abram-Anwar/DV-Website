import "./ProgressBar.css";

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div
      className="progress-container"
      style={{ "--steps-count": steps.length }}
    >
      <div className="progress-line"></div>
      <div
        className="progress-line-active"
        style={{
          "--progress": steps.length > 1 ? currentStep / (steps.length - 1) : 0,
        }}
      ></div>
      {steps.map((step, index) => (
        <div className="progress-step" key={step.title}>
          <div
            className={`progress-circle ${index <= currentStep ? "active" : ""}`}
          >
            {index + 1}
          </div>

          <span
            className={`progress-title ${index <= currentStep ? "active" : ""}`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
