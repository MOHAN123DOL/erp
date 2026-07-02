import { useState } from "react";
import { useMaterialStore, receiveFromCutting } from "../../data/materialStore";
import "./Receivefromcutting.css";
import { useNavigate } from "react-router-dom"; // If using React Router
const badgeClass = (status) => {
  switch (status) {
    case "Open":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "Received":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
};

let pieceRowId = 1;
const newPieceRow = () => ({
  rowId: pieceRowId++,
  pieceCode: "",
  drawingNumber: "",
  length: "",
  width: "",
  quantity: "",
  weight: "",
});

const emptyForm = () => ({
  pieces: [newPieceRow()],
  balanceExists: "no",
  remainingLength: "",
  remainingWidth: "",
  remainingWeight: "",
  scrapWeight: "",
  rejectedQty: "",
  remarks: "",
  receivedBy: "",
});

export default function ReceiveFromCutting() {
  const { cuttingJobs } = useMaterialStore();
  const openJobs = cuttingJobs.filter((j) => j.status === "Open");

  const [activeJob, setActiveJob] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  const openModal = (job) => {
    setActiveJob(job);
    setForm(emptyForm());
    setError("");
  };
  const closeModal = () => {
    setActiveJob(null);
    setError("");
  };

  const updatePiece = (rowId, field, value) => {
    setForm((f) => ({
      ...f,
      pieces: f.pieces.map((p) =>
        p.rowId === rowId ? { ...p, [field]: value } : p,
      ),
    }));
  };
  const addPieceRow = () =>
    setForm((f) => ({ ...f, pieces: [...f.pieces, newPieceRow()] }));
  const removePieceRow = (rowId) =>
    setForm((f) => ({
      ...f,
      pieces:
        f.pieces.length > 1
          ? f.pieces.filter((p) => p.rowId !== rowId)
          : f.pieces,
    }));

  const handleSave = () => {
    if (!activeJob) return;

    const validPieces = form.pieces.filter(
      (p) => p.pieceCode.trim() && Number(p.quantity) > 0,
    );
    if (validPieces.length === 0) {
      setError(
        "Add at least one finished piece with a Piece Code and Quantity.",
      );
      return;
    }
    if (!form.receivedBy.trim()) {
      setError("Please enter Received By.");
      return;
    }

    receiveFromCutting({
      jobNumber: activeJob.jobNumber,
      pieces: validPieces,
      balance:
        form.balanceExists === "yes"
          ? {
              exists: true,
              remainingLength: form.remainingLength,
              remainingWidth: form.remainingWidth,
              remainingWeight: form.remainingWeight,
            }
          : { exists: false },
      scrapWeight: form.scrapWeight,
      rejectedQty: form.rejectedQty,
      remarks: form.remarks,
      receivedBy: form.receivedBy,
    });

    closeModal();
  };

  const navigate = useNavigate();
  const handleBack = () => {
    // Navigate back - adjust the path according to your routing structure
    navigate("/inventory"); // or navigate(-1) for browser back
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Receive From Cutting
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Close open cutting jobs and record finished pieces, leftover
            balance, scrap and rejection.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-left">
              <th className="px-4 py-3 font-medium">Job Number</th>
              <th className="px-4 py-3 font-medium">PO Number</th>
              <th className="px-4 py-3 font-medium">Plate Number</th>
              <th className="px-4 py-3 font-medium">Heat Number</th>
              <th className="px-4 py-3 font-medium">Material</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Original Plate Size</th>
              <th className="px-4 py-3 font-medium">Issued Plate Qty</th>
              <th className="px-4 py-3 font-medium">Issue Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {openJobs.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No open cutting jobs. Every job has been received.
                </td>
              </tr>
            )}
            {openJobs.map((job) => (
              <tr key={job.jobNumber} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {job.jobNumber}
                </td>
                <td className="px-4 py-3 text-slate-600">{job.poNumber}</td>
                <td className="px-4 py-3 text-slate-600">{job.plateNumber}</td>
                <td className="px-4 py-3 text-slate-600">{job.heatNumber}</td>
                <td className="px-4 py-3 text-slate-600">{job.material}</td>
                <td className="px-4 py-3 text-slate-600">{job.grade}</td>
                <td className="px-4 py-3 text-slate-600">
                  {job.originalLength || "-"} x {job.originalWidth || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">{job.issuedQty}</td>
                <td className="px-4 py-3 text-slate-600">{job.issueDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass(job.status)}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openModal(job)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    Receive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeJob && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-slate-800">
                Receive From Cutting — {activeJob.jobNumber}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Readonly job details */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-4">
                <ReadonlyField label="Job Number" value={activeJob.jobNumber} />
                <ReadonlyField label="PO Number" value={activeJob.poNumber} />
                <ReadonlyField
                  label="Plate Number"
                  value={activeJob.plateNumber}
                />
                <ReadonlyField label="Material" value={activeJob.material} />
                <ReadonlyField label="Grade" value={activeJob.grade} />
                <ReadonlyField
                  label="Thickness"
                  value={
                    activeJob.thickness ? `${activeJob.thickness} mm` : "-"
                  }
                />
                <ReadonlyField
                  label="Original Length"
                  value={activeJob.originalLength || "-"}
                />
                <ReadonlyField
                  label="Original Width"
                  value={activeJob.originalWidth || "-"}
                />
                <ReadonlyField
                  label="Issued Plate Quantity"
                  value={activeJob.issuedQty}
                />
              </div>

              {/* Finished pieces */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Finished Pieces
                  </h3>
                  <button
                    onClick={addPieceRow}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    + Add Piece
                  </button>
                </div>
                <div className="space-y-3">
                  {form.pieces.map((piece, idx) => (
                    <div
                      key={piece.rowId}
                      className="grid grid-cols-12 gap-2 items-end bg-white ring-1 ring-slate-200 rounded-lg p-3"
                    >
                      <div className="col-span-12 text-xs font-medium text-slate-500">
                        Piece {idx + 1}
                      </div>
                      <FormField
                        className="col-span-3"
                        label="Piece Code"
                        value={piece.pieceCode}
                        onChange={(v) =>
                          updatePiece(piece.rowId, "pieceCode", v)
                        }
                      />
                      <FormField
                        className="col-span-3"
                        label="Drawing Number"
                        value={piece.drawingNumber}
                        onChange={(v) =>
                          updatePiece(piece.rowId, "drawingNumber", v)
                        }
                      />
                      <FormField
                        className="col-span-1"
                        label="Length"
                        type="number"
                        value={piece.length}
                        onChange={(v) => updatePiece(piece.rowId, "length", v)}
                      />
                      <FormField
                        className="col-span-1"
                        label="Width"
                        type="number"
                        value={piece.width}
                        onChange={(v) => updatePiece(piece.rowId, "width", v)}
                      />
                      <FormField
                        className="col-span-1"
                        label="Qty"
                        type="number"
                        value={piece.quantity}
                        onChange={(v) =>
                          updatePiece(piece.rowId, "quantity", v)
                        }
                      />
                      <FormField
                        className="col-span-2"
                        label="Weight (kg)"
                        type="number"
                        value={piece.weight}
                        onChange={(v) => updatePiece(piece.rowId, "weight", v)}
                      />
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removePieceRow(piece.rowId)}
                          disabled={form.pieces.length === 1}
                          className="text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                          title="Remove piece"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Balance plate */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Balance Plate Exists?
                </h3>
                <div className="flex gap-4 mb-3">
                  {["yes", "no"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="balanceExists"
                        checked={form.balanceExists === opt}
                        onChange={() =>
                          setForm((f) => ({ ...f, balanceExists: opt }))
                        }
                        className="accent-blue-600"
                      />
                      {opt === "yes" ? "Yes" : "No"}
                    </label>
                  ))}
                </div>
                {form.balanceExists === "yes" && (
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      label="Remaining Length"
                      type="number"
                      value={form.remainingLength}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, remainingLength: v }))
                      }
                    />
                    <FormField
                      label="Remaining Width"
                      type="number"
                      value={form.remainingWidth}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, remainingWidth: v }))
                      }
                    />
                    <FormField
                      label="Remaining Weight (kg)"
                      type="number"
                      value={form.remainingWeight}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, remainingWeight: v }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* Scrap / Rejection / Remarks */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Scrap Weight (kg)"
                  type="number"
                  value={form.scrapWeight}
                  onChange={(v) => setForm((f) => ({ ...f, scrapWeight: v }))}
                />
                <FormField
                  label="Rejected Quantity"
                  type="number"
                  value={form.rejectedQty}
                  onChange={(v) => setForm((f) => ({ ...f, rejectedQty: v }))}
                />
                <FormField
                  className="col-span-2"
                  label="Received By"
                  value={form.receivedBy}
                  onChange={(v) => setForm((f) => ({ ...f, receivedBy: v }))}
                />
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Remarks
                  </label>
                  <textarea
                    value={form.remarks}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, remarks: e.target.value }))
                    }
                    rows={2}
                    className="w-full rounded-lg ring-1 ring-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 ring-1 ring-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReadonlyField({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="text-sm text-slate-800 mt-0.5">{value}</div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-slate-500 mb-1 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg ring-1 ring-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
