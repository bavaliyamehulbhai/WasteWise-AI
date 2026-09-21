function PageHeader({ title, description, actions, className = "" }) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-[28px] font-semibold text-text-primary">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 text-sm lg:text-base text-text-muted">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
