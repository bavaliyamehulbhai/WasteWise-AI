export const getStatusLabel = (status) => {
  const labels = {
    recyclable: "Recyclable",
    "general-waste": "General Waste",
    compost: "Compost",
    "special-disposal": "Special Disposal",
    reuse: "Reuse",
    unknown: "Check Guidance",
  };

  return labels[status] || "Check Guidance";
};

export const getStatusColorClass = (status) => {
  const styles = {
    recyclable: "bg-success-bg text-success-text border-success-border",
    "general-waste": "bg-surface-hover text-text-secondary border-border-default",
    compost: "bg-[#fef9c3] text-[#ca8a04] border-[#fef08a]",
    "special-disposal": "bg-error-bg text-error-text border-error-border",
    reuse: "bg-info-bg text-info-text border-info-border",
    unknown: "bg-warning-bg text-warning-text border-warning-border",
  };

  return styles[status] || styles.unknown;
};

export const getCategoryLabel = (category) => {
  return category || "Other";
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (error) {
    return "Invalid Date";
  }
};
