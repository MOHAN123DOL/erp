import { Link } from "react-router-dom";
import {
  PackagePlus,
  Boxes,
  PackageMinus,
  Undo2,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import "./Consumable.css";
import Header from "../../components/Header";

const consumableActions = [
  {
    code: "GRN",
    title: "GRN (Goods Receipt Note)",
    description: "Receive consumables from suppliers.",
    icon: PackagePlus,
  },
  {
    code: "STK",
    title: "Consumable Stock",
    description: "Display current consumable stock levels.",
    icon: Boxes,
  },
  {
    code: "ISS",
    title: "Issue Consumables",
    description: "Issue consumables to departments or production.",
    icon: PackageMinus,
  },
  {
    code: "RET",
    title: "Return Consumables",
    description: "Return unused consumables back to inventory.",
    icon: Undo2,
  },
  {
    code: "RPT",
    title: "Reports",
    description: "GRN, stock, issue, and consumption reports.",
    icon: BarChart3,
  },
];

export default function Consumable() {
  return (
     <>
          <Header />
    <div className="consumable-page">
      <Link to="/inventory" className="consumable-back">
        <ArrowLeft size={15} />
        Inventory
      </Link>

      <header className="consumable-header">
        <span className="consumable-eyebrow">Consumables</span>
        <h1 className="consumable-title">Consumable Inventory</h1>
        <p className="consumable-subtitle">Manage all production consumables.</p>
      </header>

      <div className="consumable-grid">
        {consumableActions.map((action) => {
          const Icon = action.icon;
          return (
            <div className="consumable-card" key={action.title}>
              <div className="consumable-card-top">
                <div className="consumable-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <span className="consumable-code">{action.code}</span>
              </div>
              <h3 className="consumable-card-title">{action.title}</h3>
              <p className="consumable-card-desc">{action.description}</p>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}