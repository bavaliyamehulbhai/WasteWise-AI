import {
  ScanLine,
  ArrowLeft,
} from "lucide-react";

import Button from "../common/Button";

function DisposalActions({
  onScanAgain,
  onBackToResult,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">

      <Button
        className="w-full sm:flex-1"
        onClick={onScanAgain}
      >
        <ScanLine
          size={17}
          className="mr-2"
        />

        Scan Another Item
      </Button>

      <Button
        variant="secondary"
        className="w-full sm:flex-1"
        onClick={onBackToResult}
      >
        <ArrowLeft
          size={17}
          className="mr-2"
        />

        Back to Result
      </Button>

    </div>
  );
}

export default DisposalActions;
