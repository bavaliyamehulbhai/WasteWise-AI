import {
  Recycle,
  FileText,
  Wine,
  Cylinder,
  Leaf,
  Cpu,
  TriangleAlert,
  Trash2,
  CircleHelp,
} from "lucide-react";

export const wasteCategories = {
  plastic: {
    label: "Plastic",
    icon: Recycle,
    bg: "#E8F4EC",
    text: "#246D46",
    iconColor: "#2F8F5B",
  },

  paper: {
    label: "Paper",
    icon: FileText,
    bg: "#F1F5F2",
    text: "#50635A",
    iconColor: "#66756E",
  },

  glass: {
    label: "Glass",
    icon: Wine,
    bg: "#EDF6F5",
    text: "#286B67",
    iconColor: "#318A84",
  },

  metal: {
    label: "Metal",
    icon: Cylinder,
    bg: "#F1F3F4",
    text: "#4B5551",
    iconColor: "#66716C",
  },

  organic: {
    label: "Organic",
    icon: Leaf,
    bg: "#F2F6E8",
    text: "#65762D",
    iconColor: "#7E9235",
  },

  "e-waste": {
    label: "E-Waste",
    icon: Cpu,
    bg: "#EEF0FA",
    text: "#4C568B",
    iconColor: "#626DB0",
  },

  hazardous: {
    label: "Hazardous",
    icon: TriangleAlert,
    bg: "#FFF7F7",
    text: "#A53E3E",
    iconColor: "#C94F4F",
  },

  general: {
    label: "General",
    icon: Trash2,
    bg: "#F1F5F2",
    text: "#66756E",
    iconColor: "#7A8781",
  },

  unknown: {
    label: "Unknown",
    icon: CircleHelp,
    bg: "#F5F5F5",
    text: "#66756E",
    iconColor: "#94A39B",
  },
};
