
import React from "react";
import { HeartPulse, Droplet, Activity } from "lucide-react";

const iconMap = {
  heart: HeartPulse,
  blood: Droplet,
  activity: Activity,
};

export default function HealthMetricCard({
  type = "heart",
  title,
  value,
  unit,
  color = "blue",
}) {
  const Icon = iconMap[type] || HeartPulse;

  return (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-icon">
        <Icon size={23} strokeWidth={1.8} />
      </div>

      <div className="metric-content">
        <span className="metric-title">{title}</span>
        <div className="metric-value-row">
          <strong>{value}</strong>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
