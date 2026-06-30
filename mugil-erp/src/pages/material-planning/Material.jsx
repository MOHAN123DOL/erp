import { Link } from "react-router-dom";
import {
  PackagePlus,
  Boxes,
  Layers,
  Scissors,
  Ban,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import "./Material.css";
import Header from "../../components/Header";

const materialActions = [
  {
    code: "GRN",
    title: "GRN (Goods Receipt Note)",
    description: "Receive new raw materials from suppliers.",
    icon: PackagePlus,
  },
  {
    code: "STK",
    title: "Material Stock",
    description: "Live stock levels across full inventory and cutting balances.",
    icon: Boxes,
    isStock: true,
    subSections: [
      {
        label: "Full Material Stock",
        description: "Complete on-hand quantities by item and location.",
        icon: Layers,
      },
      {
        label: "Cutting Balance Stock",
        description: "Remaining balances left over after cutting operations.",
        icon: Scissors,
      },
    ],
  },
  {
    code: "SCR",
    title: "Scrap Materials",
    description: "Store and manage scrap generated after cutting and fabrication.",
    icon: Scissors,
  },
  {
    code: "REJ",
    title: "Rejection Materials",
    description: "Store materials rejected for quality issues or damage.",
    icon: Ban,
  },
  {
    code: "RPT",
    title: "Reports",
    description: "Inventory, stock, GRN, scrap, and rejection reports.",
    icon: BarChart3,
  },
];

export default function Material() {
  return (
    <>
              <Header />
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

          if (action.isStock) {
            return (
              <div
                className="material-card material-card-wide"
                key={action.title}
              >
                <div className="material-card-top">
                  <div className="material-icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <span className="material-code">{action.code}</span>
                </div>
                <h3 className="material-card-title">{action.title}</h3>
                <p className="material-card-desc">{action.description}</p>

                <div className="material-subgrid">
                  {action.subSections.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <div className="material-subcard" key={sub.label}>
                        <div className="material-subcard-icon">
                          <SubIcon size={17} strokeWidth={1.8} />
                        </div>
                        <div>
                          <h4 className="material-subcard-title">{sub.label}</h4>
                          <p className="material-subcard-desc">{sub.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            );
          }

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
    </>
  );
}