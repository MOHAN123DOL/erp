import { Link } from "react-router-dom";
import { Layers, Wrench, ArrowRight } from "lucide-react";
import "./Inventory.css";
import Header from "../../components/Header";

const inventoryModules = [
  {
    id: "material",
    code: "MOD-01 / MAT",
    title: "Materials",
    description:
      "Manage all raw materials used in manufacturing — from structural steel to finished sheet stock.",
    icon: Layers,
    accent: "steel",
    path: "/inventory/material",
    examples: [
      "Plates",
      "Pipes",
      "Channels",
      "Angles",
      "Flats",
      "Beams",
      "Sheets",
      "Rods",
      "Structural Steel",
    ],
  },
  {
    id: "consumable",
    code: "MOD-02 / CON",
    title: "Consumables",
    description:
      "Manage consumables used during production — welding, grinding, fastening, and safety supplies.",
    icon: Wrench,
    accent: "amber",
    path: "/inventory/consumable",
    examples: [
      "Welding Rods",
      "Welding Wire",
      "Grinding Wheels",
      "Cutting Discs",
      "Paint",
      "Primer",
      "Gas Cylinders",
      "Bolts",
      "Nuts",
      "Washers",
      "Safety Items",
    ],
  },
];
export default function Inventory() {
  return (
    <>
      <Header />

      <div className="inventory-page">
        <header className="inventory-header">
          <span className="inventory-eyebrow">Inventory</span>
          <h1 className="inventory-title">Inventory Control Center</h1>
          <p className="inventory-subtitle">
            Choose a module to manage stock, movements, and records across the plant.
          </p>
        </header>

        <div className="inventory-grid">
          {inventoryModules.map((mod) => {
            const Icon = mod.icon;

            return (
              <Link
                to={mod.path}
                key={mod.id}
                className={`inventory-card inventory-card--${mod.accent}`}
              >
                <div className="inventory-card-top">
                  <div className={`inventory-icon inventory-icon--${mod.accent}`}>
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <span className="inventory-code">{mod.code}</span>
                </div>

                <h2 className="inventory-card-title">{mod.title}</h2>
                <p className="inventory-card-desc">{mod.description}</p>

                <div className="inventory-tags">
                  {mod.examples.map((example) => (
                    <span className="inventory-tag" key={example}>
                      {example}
                    </span>
                  ))}
                </div>

                <div className="inventory-card-footer">
                  <span>Open module</span>
                  <ArrowRight size={18} className="inventory-arrow" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}