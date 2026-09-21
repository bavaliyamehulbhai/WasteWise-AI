import {
  createContext,
  useContext,
  useState,
  useRef,
} from "react";

import { classifyWasteImage } from "../services/scanService";
import { useAuth } from "./AuthContext";

export const ScanContext = createContext(null);

export function ScanProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  // Store the result ID immediately for navigation
  const scanResultIdRef = useRef(null);

  const startScan = async (imageFile) => {
    if (!imageFile) throw new Error("Please select an image.");
    if (!isAuthenticated) throw new Error("Please login to scan waste.");

    setIsAnalyzing(true);
    setScanError("");
    setScanResult(null);
    scanResultIdRef.current = null;

    try {
      const data = await classifyWasteImage(imageFile);

      if (!data?.scan) {
        throw new Error("Server returned no scan data.");
      }

      // Store ID in ref immediately (before state batching)
      scanResultIdRef.current = data.scan._id;

      setScanResult(data.scan);

      try {
        sessionStorage.setItem("latestScan", JSON.stringify(data.scan));
      } catch (_) {}

      return data.scan;
    } catch (error) {
      console.error("[ScanContext] Scan error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Waste classification failed. Please try again.";
      setScanError(message);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearScan = () => {
    setScanResult(null);
    setScanError("");
    setIsAnalyzing(false);
    scanResultIdRef.current = null;
    sessionStorage.removeItem("latestScan");
  };

  return (
    <ScanContext.Provider
      value={{
        isAnalyzing,
        scanResult,
        scanError,
        scanResultIdRef,
        startScan,
        clearScan,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) throw new Error("useScan must be used within a ScanProvider");
  return context;
}
