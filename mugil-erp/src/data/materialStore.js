// materialStore.js
// -----------------------------------------------------------------------------
// Single in-memory "source of truth" for the whole Material Management module.
// No backend / no API calls — this is a lightweight pub/sub store so that every
// page (GRN, Stock, Cutting, Production, Scrap, Rejection, Movement History,
// Reports) reads and writes the SAME connected dataset instead of generating
// its own random dummy data.
// -----------------------------------------------------------------------------

import { useSyncExternalStore } from "react";

let idCounter = 1;
const nextId = (prefix) => `${prefix}-${idCounter++}`;

const todayMinus = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};
const todayPlus = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// -----------------------------------------------------------------------------
// MATERIAL MASTER — the catalogue every other record references
// -----------------------------------------------------------------------------
const materialMaster = [
  { id: "MAT-001", steelPlant: "SAIL Bhilai", grade: "IS 2062 E250", specification: "Hot Rolled Plate", thickness: 12, width: 2500, length: 6300, materialType: "MS Plate", weight: 1483.7 },
  { id: "MAT-002", steelPlant: "JSW Vijayanagar", grade: "IS 2062 E350", specification: "Hot Rolled Plate", thickness: 16, width: 2000, length: 8000, materialType: "MS Plate", weight: 2009.6 },
  { id: "MAT-003", steelPlant: "Tata Steel Jamshedpur", grade: "SA516 Gr.70", specification: "Boiler Quality Plate", thickness: 20, width: 2500, length: 6000, materialType: "Boiler Plate", weight: 2355.0 },
  { id: "MAT-004", steelPlant: "Jindal Stainless", grade: "SS 304", specification: "Cold Rolled Sheet", thickness: 3, width: 1250, length: 2500, materialType: "SS Sheet", weight: 73.6 },
  { id: "MAT-005", steelPlant: "SAIL Rourkela", grade: "IS 2062 E250", specification: "Hot Rolled Plate", thickness: 10, width: 1500, length: 6000, materialType: "MS Plate", weight: 706.5 },
  { id: "MAT-006", steelPlant: "ESSAR Hazira", grade: "API 5L X52", specification: "Pipeline Plate", thickness: 14, width: 2200, length: 7000, materialType: "MS Plate", weight: 1693.6 },
  { id: "MAT-007", steelPlant: "Tata Steel Jamshedpur", grade: "EN8", specification: "Round Bar", thickness: 50, width: 50, length: 6000, materialType: "MS Round Bar", weight: 92.5 },
  { id: "MAT-008", steelPlant: "JSW Dolvi", grade: "SA516 Gr.60", specification: "Boiler Quality Plate", thickness: 25, width: 2500, length: 6300, materialType: "Boiler Plate", weight: 3094.5 },
  { id: "MAT-009", steelPlant: "Jindal Stainless", grade: "SS 316L", specification: "Cold Rolled Sheet", thickness: 5, width: 1500, length: 3000, materialType: "SS Sheet", weight: 176.7 },
  { id: "MAT-010", steelPlant: "SAIL Bokaro", grade: "IS 2062 E350", specification: "Hot Rolled Plate", thickness: 8, width: 2500, length: 6300, materialType: "MS Plate", weight: 989.8 },
];

const findMaterial = (id) => materialMaster.find((m) => m.id === id);

// -----------------------------------------------------------------------------
// PURCHASE ORDERS (20 records — mix of Completed / Partial / Pending)
// PO-1004 is the "hero" record that is threaded through every downstream stage
// so the same PO Number / Heat Number / Plate Number appears end-to-end.
// -----------------------------------------------------------------------------
const suppliers = [
  "Shree Metaliks Pvt Ltd", "Bansal Steel Traders", "Ganpati Ispat", "Adani Steel Corp",
  "Kalyani Steels", "Sunrise Steel Suppliers", "Bhagwati Metal Works", "Vardhman Steel Co.",
  "Om Sai Steel Traders", "Universal Metal Corp",
];
const warehouses = ["WH-A (Raw Material)", "WH-B (Heavy Plates)", "WH-C (Sheets & Coils)"];

function poRow(num, matId, orderedQty, receivedQty, extra = {}) {
  const mat = findMaterial(matId);
  const pendingQty = orderedQty - receivedQty;
  const status = pendingQty === 0 ? "Completed" : receivedQty === 0 ? "Pending" : "Partial";
  return {
    poNumber: `PO-${num}`,
    supplier: suppliers[num % suppliers.length],
    materialId: matId,
    material: mat.materialType,
    grade: mat.grade,
    specification: mat.specification,
    thickness: mat.thickness,
    width: mat.width,
    length: mat.length,
    orderedQty,
    receivedQty,
    pendingQty,
    weight: mat.weight,
    warehouse: warehouses[num % warehouses.length],
    expectedDeliveryDate: todayPlus((num % 10) + 3),
    status,
    heatNumber: `HT-${2200 + num}`,
    plateNumber: `PL-${4500 + num}`,
    ...extra,
  };
}

const purchaseOrders = [
  poRow(1001, "MAT-001", 100, 100),
  poRow(1002, "MAT-002", 80, 50),
  poRow(1003, "MAT-003", 40, 0),
  poRow(1004, "MAT-001", 100, 60, { heatNumber: "HT-2291", plateNumber: "PL-4501" }), // hero chain
  poRow(1005, "MAT-004", 60, 60),
  poRow(1006, "MAT-005", 120, 0),
  poRow(1007, "MAT-006", 75, 75),
  poRow(1008, "MAT-007", 200, 140),
  poRow(1009, "MAT-008", 30, 0),
  poRow(1010, "MAT-009", 45, 45),
  poRow(1011, "MAT-010", 90, 30),
  poRow(1012, "MAT-001", 60, 60),
  poRow(1013, "MAT-002", 50, 0),
  poRow(1014, "MAT-003", 35, 20),
  poRow(1015, "MAT-004", 70, 70),
  poRow(1016, "MAT-005", 55, 0),
  poRow(1017, "MAT-006", 40, 40),
  poRow(1018, "MAT-007", 150, 90),
  poRow(1019, "MAT-008", 25, 25),
  poRow(1020, "MAT-009", 65, 0),
];

// -----------------------------------------------------------------------------
// MATERIAL STOCK — one lot per PO that has ANY received quantity.
// PO-1004 (hero) -> stock lot with 60 available, later drawn down by 40 when
// issued to cutting, leaving 20 available / 40 reserved-out.
// -----------------------------------------------------------------------------
function buildInitialStock() {
  return purchaseOrders
    .filter((po) => po.receivedQty > 0)
    .map((po) => {
      const mat = findMaterial(po.materialId);
      return {
        id: nextId("STK"),
        poNumber: po.poNumber,
        material: mat.materialType,
        grade: mat.grade,
        thickness: mat.thickness,
        width: mat.width,
        length: mat.length,
        heatNumber: po.heatNumber,
        plateNumber: po.plateNumber,
        availableQty: po.poNumber === "PO-1004" ? 20 : po.receivedQty, // hero already partly issued
        reservedQty: po.poNumber === "PO-1004" ? 0 : 0,
        warehouse: po.warehouse,
        weight: mat.weight,
        status: po.poNumber === "PO-1004" ? "Partially Issued" : "In Stock",
      };
    });
}

// -----------------------------------------------------------------------------
// CUTTING JOBS (Issue Material to Cutting)
// -----------------------------------------------------------------------------
const cuttingJobs = [
  {
    jobNumber: "CUT-2001",
    poNumber: "PO-1004",
    material: "MS Plate",
    grade: "IS 2062 E250",
    heatNumber: "HT-2291",
    plateNumber: "PL-4501",
    warehouse: "WH-A (Raw Material)",
    issuedQty: 40,
    issuedBy: "R. Kumar",
    issueDate: todayMinus(6),
    remarks: "Issued for bracket cutting - Line 2",
    status: "Received", // already processed through Receive From Cutting
  },
  {
    jobNumber: "CUT-2002",
    poNumber: "PO-1001",
    material: "MS Plate",
    grade: "IS 2062 E250",
    heatNumber: "HT-2201",
    plateNumber: "PL-4501".replace("4501", "4601"),
    warehouse: "WH-A (Raw Material)",
    issuedQty: 25,
    issuedBy: "S. Verma",
    issueDate: todayMinus(2),
    remarks: "Issued for flange cutting",
    status: "Open",
  },
];

// -----------------------------------------------------------------------------
// RECEIVE FROM CUTTING -> CUTTING BALANCE / SCRAP / REJECTION
// (already generated for CUT-2001 to demonstrate the full connected chain)
// -----------------------------------------------------------------------------
const cuttingBalanceStock = [
  {
    id: nextId("CBS"),
    jobNumber: "CUT-2001",
    parentPlate: "PL-4501",
    material: "MS Plate",
    grade: "IS 2062 E250",
    thickness: 12,
    width: 2500,
    originalLength: 6300,
    remainingLength: 1800,
    remainingWeight: 423.9,
    warehouse: "WH-A (Raw Material)",
    status: "Available",
  },
];

const scrapMaterials = [
  {
    id: nextId("SCR"),
    material: "MS Plate",
    grade: "IS 2062 E250",
    sourceJob: "CUT-2001",
    plateNumber: "PL-4501",
    weight: 38.2,
    quantity: 1,
    reason: "Trim waste from cutting",
    warehouse: "WH-A (Raw Material)",
    status: "Available",
  },
];

const rejectionMaterials = [
  {
    id: nextId("REJ"),
    material: "MS Plate",
    grade: "IS 2062 E250",
    sourceJob: "CUT-2001",
    plateNumber: "PL-4501",
    weight: 41.5,
    quantity: 1,
    reason: "Wrong Dimension",
    department: "Cutting",
    date: todayMinus(5),
  },
];

// -----------------------------------------------------------------------------
// ISSUE MATERIAL TO PRODUCTION
// -----------------------------------------------------------------------------
const productionIssues = [
  {
    id: nextId("PIS"),
    productionOrder: "PROD-9001",
    jobCard: "JC-7001",
    material: "MS Plate (Cut Pieces)",
    grade: "IS 2062 E250",
    sourceJob: "CUT-2001",
    availableQty: 35,
    issuedQty: 35,
    issueDate: todayMinus(4),
    department: "Assembly",
    issuedBy: "M. Iyer",
    remarks: "Issued for bracket assembly batch #14",
  },
];

// -----------------------------------------------------------------------------
// MOVEMENT HISTORY (audit trail) — seeded with the full hero chain
// -----------------------------------------------------------------------------
const movementHistory = [
  { id: nextId("MOV"), date: todayMinus(9), material: "MS Plate (PL-4501)", movementType: "Purchase Order Raised", from: "Shree Metaliks Pvt Ltd", to: "PO-1004", quantity: 100, user: "A. Sharma" },
  { id: nextId("MOV"), date: todayMinus(8), material: "MS Plate (PL-4501)", movementType: "GRN Receipt", from: "Supplier", to: "Material Stock (WH-A)", quantity: 60, user: "A. Sharma" },
  { id: nextId("MOV"), date: todayMinus(6), material: "MS Plate (PL-4501)", movementType: "Issue to Cutting", from: "Material Stock (WH-A)", to: "CUT-2001", quantity: 40, user: "R. Kumar" },
  { id: nextId("MOV"), date: todayMinus(5), material: "MS Plate (PL-4501)", movementType: "Receive from Cutting - Balance", from: "CUT-2001", to: "Cutting Balance Stock", quantity: 3, user: "R. Kumar" },
  { id: nextId("MOV"), date: todayMinus(5), material: "MS Plate (PL-4501)", movementType: "Receive from Cutting - Scrap", from: "CUT-2001", to: "Scrap Materials", quantity: 1, user: "R. Kumar" },
  { id: nextId("MOV"), date: todayMinus(5), material: "MS Plate (PL-4501)", movementType: "Receive from Cutting - Rejection", from: "CUT-2001", to: "Rejection Materials", quantity: 1, user: "R. Kumar" },
  { id: nextId("MOV"), date: todayMinus(4), material: "MS Plate (Cut Pieces)", movementType: "Issue to Production", from: "Cutting Output (CUT-2001)", to: "PROD-9001 / JC-7001", quantity: 35, user: "M. Iyer" },
];

// -----------------------------------------------------------------------------
// STORE (pub/sub) — no external dependency, just React's useSyncExternalStore
// -----------------------------------------------------------------------------
let state = {
  materialMaster,
  purchaseOrders,
  materialStock: buildInitialStock(),
  cuttingJobs,
  cuttingBalanceStock,
  scrapMaterials,
  rejectionMaterials,
  productionIssues,
  movementHistory,
};

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function setState(updater) {
  state = { ...state, ...updater(state) };
  emit();
}

function logMovement(entry) {
  return {
    id: nextId("MOV"),
    date: new Date().toISOString().slice(0, 10),
    user: "Current User",
    ...entry,
  };
}

// ---- Actions -----------------------------------------------------------------

export function receiveGRN(poNumber, qty, extra = {}) {
  setState((s) => {
    const purchaseOrders = s.purchaseOrders.map((po) => {
      if (po.poNumber !== poNumber) return po;
      const receivedQty = Math.min(po.orderedQty, po.receivedQty + qty);
      const pendingQty = po.orderedQty - receivedQty;
      const status = pendingQty === 0 ? "Completed" : "Partial";
      return { ...po, receivedQty, pendingQty, status };
    });

    const po = purchaseOrders.find((p) => p.poNumber === poNumber);
    const mat = findMaterial(po.materialId);

    const materialStock = [
      ...s.materialStock,
      {
        id: nextId("STK"),
        poNumber,
        material: mat.materialType,
        grade: mat.grade,
        thickness: mat.thickness,
        width: mat.width,
        length: mat.length,
        heatNumber: po.heatNumber,
        plateNumber: po.plateNumber,
        availableQty: qty,
        reservedQty: 0,
        warehouse: po.warehouse,
        weight: mat.weight,
        status: "In Stock",
        ...extra,
      },
    ];

    const movementHistory = [
      logMovement({ material: mat.materialType, movementType: "GRN Receipt", from: "Supplier", to: `Material Stock (${po.warehouse})`, quantity: qty }),
      ...s.movementHistory,
    ];

    return { purchaseOrders, materialStock, movementHistory };
  });
}

export function issueToCutting({ stockId, jobNumber, issuedQty, issuedBy, remarks }) {
  setState((s) => {
    const stockRow = s.materialStock.find((r) => r.id === stockId);
    const materialStock = s.materialStock.map((r) =>
      r.id === stockId
        ? { ...r, availableQty: r.availableQty - issuedQty, status: r.availableQty - issuedQty <= 0 ? "Fully Issued" : "Partially Issued" }
        : r
    );

    const cuttingJobs = [
      {
        jobNumber,
        poNumber: stockRow.poNumber,
        material: stockRow.material,
        grade: stockRow.grade,
        heatNumber: stockRow.heatNumber,
        plateNumber: stockRow.plateNumber,
        warehouse: stockRow.warehouse,
        issuedQty,
        issuedBy,
        issueDate: new Date().toISOString().slice(0, 10),
        remarks,
        status: "Open",
      },
      ...s.cuttingJobs,
    ];

    const movementHistory = [
      logMovement({ material: stockRow.material, movementType: "Issue to Cutting", from: `Material Stock (${stockRow.warehouse})`, to: jobNumber, quantity: issuedQty, user: issuedBy }),
      ...s.movementHistory,
    ];

    return { materialStock, cuttingJobs, movementHistory };
  });
}

export function receiveFromCutting({ jobNumber, finishedPieces, cuttingBalanceQty, scrapQty, rejectedQty, remarks }) {
  setState((s) => {
    const job = s.cuttingJobs.find((j) => j.jobNumber === jobNumber);

    const cuttingJobs = s.cuttingJobs.map((j) => (j.jobNumber === jobNumber ? { ...j, status: "Received" } : j));

    const cuttingBalanceStock = cuttingBalanceQty > 0
      ? [
          {
            id: nextId("CBS"),
            jobNumber,
            parentPlate: job.plateNumber,
            material: job.material,
            grade: job.grade,
            thickness: 12,
            width: 2500,
            originalLength: 6300,
            remainingLength: 1800,
            remainingWeight: Math.round(cuttingBalanceQty * 141.3 * 10) / 10,
            warehouse: job.warehouse,
            status: "Available",
          },
          ...s.cuttingBalanceStock,
        ]
      : s.cuttingBalanceStock;

    const scrapMaterials = scrapQty > 0
      ? [
          {
            id: nextId("SCR"),
            material: job.material,
            grade: job.grade,
            sourceJob: jobNumber,
            plateNumber: job.plateNumber,
            weight: Math.round(scrapQty * 38.2 * 10) / 10,
            quantity: scrapQty,
            reason: "Trim waste from cutting",
            warehouse: job.warehouse,
            status: "Available",
          },
          ...s.scrapMaterials,
        ]
      : s.scrapMaterials;

    const rejectionMaterials = rejectedQty > 0
      ? [
          {
            id: nextId("REJ"),
            material: job.material,
            grade: job.grade,
            sourceJob: jobNumber,
            plateNumber: job.plateNumber,
            weight: Math.round(rejectedQty * 41.5 * 10) / 10,
            quantity: rejectedQty,
            reason: "Quality Failure",
            department: "Cutting",
            date: new Date().toISOString().slice(0, 10),
          },
          ...s.rejectionMaterials,
        ]
      : s.rejectionMaterials;

    const movementHistory = [
      logMovement({ material: job.material, movementType: "Receive from Cutting - Finished", from: jobNumber, to: "Cutting Output", quantity: finishedPieces }),
      ...(cuttingBalanceQty > 0 ? [logMovement({ material: job.material, movementType: "Receive from Cutting - Balance", from: jobNumber, to: "Cutting Balance Stock", quantity: cuttingBalanceQty })] : []),
      ...(scrapQty > 0 ? [logMovement({ material: job.material, movementType: "Receive from Cutting - Scrap", from: jobNumber, to: "Scrap Materials", quantity: scrapQty })] : []),
      ...(rejectedQty > 0 ? [logMovement({ material: job.material, movementType: "Receive from Cutting - Rejection", from: jobNumber, to: "Rejection Materials", quantity: rejectedQty })] : []),
      ...s.movementHistory,
    ];

    return { cuttingJobs, cuttingBalanceStock, scrapMaterials, rejectionMaterials, movementHistory };
  });
}

export function issueToProduction({ balanceId, productionOrder, jobCard, issuedQty, department, issuedBy, remarks }) {
  setState((s) => {
    const balanceRow = s.cuttingBalanceStock.find((r) => r.id === balanceId);

    const cuttingBalanceStock = s.cuttingBalanceStock.map((r) =>
      r.id === balanceId ? { ...r, status: "Issued to Production" } : r
    );

    const productionIssues = [
      {
        id: nextId("PIS"),
        productionOrder,
        jobCard,
        material: balanceRow.material,
        grade: balanceRow.grade,
        sourceJob: balanceRow.jobNumber,
        availableQty: 1,
        issuedQty,
        issueDate: new Date().toISOString().slice(0, 10),
        department,
        issuedBy,
        remarks,
      },
      ...s.productionIssues,
    ];

    const movementHistory = [
      logMovement({ material: balanceRow.material, movementType: "Issue to Production", from: "Cutting Balance Stock", to: `${productionOrder} / ${jobCard}`, quantity: issuedQty, user: issuedBy }),
      ...s.movementHistory,
    ];

    return { cuttingBalanceStock, productionIssues, movementHistory };
  });
}

// ---- Hook ----------------------------------------------------------------

export function useMaterialStore() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}

export const statusOptions = {
  po: ["Pending", "Partial", "Completed"],
  scrap: ["Available", "Sold", "Disposed"],
  rejection: ["Wrong Dimension", "Bent", "Rust", "Quality Failure", "Damaged"],
};