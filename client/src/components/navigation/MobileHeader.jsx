import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

function MobileHeader({
  title,
  showBack = false,
  rightAction,
}) {
  const navigate = useNavigate();

  return (
    <header
      className="
        flex
        h-14
        items-center
        border-b
        border-[#EEF3F0]
        bg-surface-card
        px-5
        lg:hidden
      "
    >

      <div className="flex min-w-0 flex-1 items-center gap-3">

        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[10px]
              text-text-muted
              hover:bg-surface-page
            "
          >
            <ArrowLeft size={19} />
          </button>
        )}

        <h1 className="
          truncate
          text-base
          font-semibold
          text-text-primary
        ">
          {title}
        </h1>

      </div>

      {rightAction && (
        <div className="shrink-0">
          {rightAction}
        </div>
      )}

    </header>
  );
}

export default MobileHeader;
