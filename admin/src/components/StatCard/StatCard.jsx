import "./statCard.css";

const StatCard = ({
  title,
  value,
  unit,
  des,
  icon,
  variant = "default", // default | primary | success | warning | error
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && <div className="stat-icon-wrapper">{icon}</div>}
      </div>

      <div className="stat-value-group">
        <span className="stat-value">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>

      {des && <p className="stat-description">{des}</p>}
    </div>
  );
};

export default StatCard;