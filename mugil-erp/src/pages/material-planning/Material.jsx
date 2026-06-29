import { Link } from "react-router-dom";
import {
  Database,
  PackagePlus,
  Boxes,
  PackageMinus,
  Undo2,
  ArrowLeftRight,
  Search,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import "./Material.css";

const materialActions = [
  {
    code: "MM",
    title: "Material Master",
    description: "Maintain master records for grades, specs, and units of measure.",
    icon: Database,
  },
  {
    code: "GRN",
    title: "Receive Material (GRN)",
    description: "Record incoming raw material against purchase orders.",
    icon: PackagePlus,
  },
  {
    code: "STK",
    title: "Material Stock",
    description: "View live stock levels across all warehouse locations.",
    icon: Boxes,
  },
  {
    code: "ISS",
    title: "Issue Material",
    description: "Issue raw material to production and work orders.",
    icon: PackageMinus,
  },
  {
    code: "RET",
    title: "Return Material",
    description: "Process returns of unused or rejected material to stock.",
    icon: Undo2,
  },
  {
    code: "STN",
    title: "Stock Transfer",
    description: "Transfer material stock between stores and locations.",
    icon: ArrowLeftRight,
  },
  {
    code: "SRCH",
    title: "Search Material",
    description: "Search and filter materials by code, grade, or dimension.",
    icon: Search,
  },
  {
    code: "RPT",
    title: "Material Reports",
    description: "Generate consumption, stock, and movement reports.",
    icon: BarChart3,
  },
];

export default function Material() {
  return (
    <div className="material-page">
      <Link to="/inventory" className="material-back">
        <ArrowLeft size={15} />
        Inventory
      </Link>

      <header className="material-header">
        <span className="material-eyebrow">Materials</span>
        <h1 className="material-title">Material Inventory</h1>
        <p className="material-subtitle">Manage all raw materials used in production.</p>
      </header>

      <div className="material-grid">
        {materialActions.map((action) => {
          const Icon = action.icon;
          return (
            <div className="material-card" key={action.title}>
              <div className="material-card-top">
                <div className="material-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <span className="material-code">{action.code}</span>
              </div>
              <h3 className="material-card-title">{action.title}</h3>
              <p className="material-card-desc">{action.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}