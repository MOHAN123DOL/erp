import { Link } from "react-router-dom";
import {
  Database,
  PackagePlus,
  PackageMinus,
  Boxes,
  AlertTriangle,
  ArrowLeftRight,
  ShoppingCart,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import "./Consumable.css";

const consumableActions = [
  {
    code: "CM",
    title: "Consumable Master",
    description: "Maintain master records for all consumable items.",
    icon: Database,
  },
  {
    code: "GRN",
    title: "Receive Consumables",
    description: "Record incoming consumables against purchase orders.",
    icon: PackagePlus,
  },
  {
    code: "ISS",
    title: "Issue Consumables",
    description: "Issue consumables to production lines and the shop floor.",
    icon: PackageMinus,
  },
  {
    code: "STK",
    title: "Current Stock",
    description: "View live stock levels for all consumable items.",
    icon: Boxes,
  },
  {
    code: "MSA",
    title: "Minimum Stock Alert",
    description: "Track items that have fallen below reorder level.",
    icon: AlertTriangle,
  },
  {
    code: "STN",
    title: "Stock Transfer",
    description: "Transfer consumable stock between stores and locations.",
    icon: ArrowLeftRight,
  },
  {
    code: "PR",
    title: "Purchase Request",
    description: "Raise purchase requests for consumables running low.",
    icon: ShoppingCart,
  },
  {
    code: "RPT",
    title: "Reports",
    description: "Generate usage, stock, and purchase reports.",
    icon: BarChart3,
  },
];

export default function Consumable() {
  return (
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
  );
}