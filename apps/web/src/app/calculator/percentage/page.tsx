"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";

type CalcTab = "percentage" | "gst" | "emi" | "unit" | "date" | "base" | "age";

// ─── Unit Converter data ───────────────────────────────────────────────────
const UNIT_CATEGORIES: Record<string, { label: string; units: { id: string; label: string; toBase: number | ((v: number) => number); fromBase: number | ((v: number) => number) }[] }> = {
  length: { label: "Length", units: [
    { id: "mm", label: "Millimeter", toBase: 0.001, fromBase: 1000 },
    { id: "cm", label: "Centimeter", toBase: 0.01, fromBase: 100 },
    { id: "m", label: "Meter", toBase: 1, fromBase: 1 },
    { id: "km", label: "Kilometer", toBase: 1000, fromBase: 0.001 },
    { id: "in", label: "Inch", toBase: 0.0254, fromBase: 39.3701 },
    { id: "ft", label: "Foot", toBase: 0.3048, fromBase: 3.28084 },
    { id: "yd", label: "Yard", toBase: 0.9144, fromBase: 1.09361 },
    { id: "mi", label: "Mile", toBase: 1609.34, fromBase: 0.000621371 },
  ]},
  weight: { label: "Weight/Mass", units: [
    { id: "mg", label: "Milligram", toBase: 0.000001, fromBase: 1000000 },
    { id: "g", label: "Gram", toBase: 0.001, fromBase: 1000 },
    { id: "kg", label: "Kilogram", toBase: 1, fromBase: 1 },
    { id: "t", label: "Metric Ton", toBase: 1000, fromBase: 0.001 },
    { id: "oz", label: "Ounce", toBase: 0.0283495, fromBase: 35.274 },
    { id: "lb", label: "Pound", toBase: 0.453592, fromBase: 2.20462 },
  ]},
  temperature: { label: "Temperature", units: [
    { id: "c", label: "Celsius", toBase: (v: number) => v, fromBase: (v: number) => v },
    { id: "f", label: "Fahrenheit", toBase: (v: number) => (v - 32) * 5 / 9, fromBase: (v: number) => v * 9 / 5 + 32 },
    { id: "k", label: "Kelvin", toBase: (v: number) => v - 273.15, fromBase: (v: number) => v + 273.15 },
  ]},
  area: { label: "Area", units: [
    { id: "m2", label: "m²", toBase: 1, fromBase: 1 },
    { id: "km2", label: "km²", toBase: 1e6, fromBase: 1e-6 },
    { id: "ft2", label: "ft²", toBase: 0.092903, fromBase: 10.7639 },
    { id: "acre", label: "Acre", toBase: 4046.86, fromBase: 0.000247105 },
    { id: "ha", label: "Hectare", toBase: 10000, fromBase: 0.0001 },
  ]},
  speed: { label: "Speed", units: [
    { id: "ms", label: "m/s", toBase: 1, fromBase: 1 },
    { id: "kmh", label: "km/h", toBase: 0.277778, fromBase: 3.6 },
    { id: "mph", label: "mph", toBase: 0.44704, fromBase: 2.23694 },
    { id: "knot", label: "Knot", toBase: 0.514444, fromBase: 1.94384 },
  ]},
};

function convertUnit(value: number, fromId: string, toId: string, catKey: string): number {
  const cat = UNIT_CATEGORIES[catKey];
  const from = cat.units.find(u => u.id === fromId);
  const to = cat.units.find(u => u.id === toId);
  if (!from || !to || isNaN(value)) return 0;

  const toBase = typeof from.toBase === "function" ? from.toBase(value) : value * from.toBase;
  const result = typeof to.fromBase === "function" ? to.fromBase(toBase) : toBase * to.fromBase;
  return Math.round(result * 1e10) / 1e10;
}

// ─── EMI calculation ───────────────────────────────────────────────────────
function calcEmi(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) return { emi: principal / months, total: principal, interest: 0 };
  const r = annualRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const total = emi * months;
  return { emi, total, interest: total - principal };
}

export default function CalculatorPage() {
  const [tab, setTab] = useState<CalcTab>("percentage");

  // Percentage
  const [pVal, setPVal] = useState(150);
  const [pOf, setPOf] = useState(200);

  // GST
  const [gstAmount, setGstAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [gstMode, setGstMode] = useState<"add" | "remove">("add");

  // EMI
  const [emiPrincipal, setEmiPrincipal] = useState(500000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(5);

  // Unit
  const [unitCat, setUnitCat] = useState("length");
  const [unitFrom, setUnitFrom] = useState("m");
  const [unitTo, setUnitTo] = useState("ft");
  const [unitValue, setUnitValue] = useState(1);

  // Date
  const [dateA, setDateA] = useState(new Date(Date.now() - 86400000 * 365).toISOString().slice(0, 10));
  const [dateB, setDateB] = useState(new Date().toISOString().slice(0, 10));

  // Base
  const [baseInput, setBaseInput] = useState("255");
  const [baseFrom, setBaseFrom] = useState<10 | 2 | 16 | 8>(10);

  // Age
  const [dob, setDob] = useState("2000-01-01");

  const TABS: { id: CalcTab; label: string; icon: string }[] = [
    { id: "percentage", label: "Percentage", icon: "%" },
    { id: "gst", label: "GST", icon: "🏷️" },
    { id: "emi", label: "EMI / Loan", icon: "💰" },
    { id: "unit", label: "Unit Convert", icon: "📏" },
    { id: "date", label: "Date Diff", icon: "📅" },
    { id: "base", label: "Number Base", icon: "🔢" },
    { id: "age", label: "Age", icon: "🎂" },
  ];

  const fmt = (v: number, decimals = 2) => v.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: decimals });

  return (
    <ToolShell title="Calculators" description="Percentage, GST, EMI, Unit Converter, Date Calculator, Number Base, and Age — all in one place.">
      <div className="space-y-5">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap border transition-colors ${tab === t.id ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >{t.icon} {t.label}</button>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          {/* PERCENTAGE */}
          {tab === "percentage" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">Percentage Calculator</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Value</label>
                  <input type="number" value={pVal} onChange={e => setPVal(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Of total</label>
                  <input type="number" value={pOf} onChange={e => setPOf(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Result label={`${pVal} is what % of ${pOf}`} value={`${fmt((pVal / pOf) * 100)}%`} />
                <Result label={`${pOf}'s ${pVal}% is`} value={fmt((pVal / 100) * pOf)} />
                <Result label={`${pVal}% more than ${pOf}`} value={fmt(pOf * (1 + pVal / 100))} />
                <Result label={`${pVal}% less than ${pOf}`} value={fmt(pOf * (1 - pVal / 100))} />
                <Result label={`Change from ${pOf} to ${pVal}`} value={`${fmt(((pVal - pOf) / pOf) * 100)}%`} />
              </div>
            </div>
          )}

          {/* GST */}
          {tab === "gst" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">GST Calculator</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Amount (₹)</label>
                  <input type="number" value={gstAmount} onChange={e => setGstAmount(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">GST %</label>
                  <select value={gstRate} onChange={e => setGstRate(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none">
                    {[5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                {(["add", "remove"] as const).map(m => (
                  <button key={m} onClick={() => setGstMode(m)}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm border transition-colors ${gstMode === m ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300"}`}
                  >{m === "add" ? "Add GST to amount" : "Remove GST from amount"}</button>
                ))}
              </div>
              {(() => {
                const gstVal = gstMode === "add"
                  ? gstAmount * gstRate / 100
                  : gstAmount - gstAmount / (1 + gstRate / 100);
                const pre = gstMode === "add" ? gstAmount : gstAmount / (1 + gstRate / 100);
                const post = gstMode === "add" ? gstAmount + gstVal : gstAmount;
                return (
                  <div className="grid grid-cols-3 gap-3">
                    <Result label="Pre-GST Amount" value={`₹${fmt(pre)}`} />
                    <Result label={`GST (${gstRate}%)`} value={`₹${fmt(gstVal)}`} />
                    <Result label="Total Amount" value={`₹${fmt(post)}`} highlight />
                  </div>
                );
              })()}
            </div>
          )}

          {/* EMI */}
          {tab === "emi" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">EMI / Loan Calculator</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Loan Amount (₹)", val: emiPrincipal, set: setEmiPrincipal, min: 1000 },
                  { label: "Annual Rate (%)", val: emiRate, set: setEmiRate, min: 0, step: 0.1 },
                  { label: "Tenure (years)", val: emiYears, set: setEmiYears, min: 1 },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                    <input type="number" value={f.val} min={f.min} step={(f as any).step} onChange={e => f.set(Number(e.target.value))}
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                  </div>
                ))}
              </div>
              {(() => {
                const { emi, total, interest } = calcEmi(emiPrincipal, emiRate, emiYears * 12);
                const ratio = emiPrincipal / total;
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <Result label="Monthly EMI" value={`₹${fmt(emi)}`} highlight />
                      <Result label="Total Payment" value={`₹${fmt(total)}`} />
                      <Result label="Total Interest" value={`₹${fmt(interest)}`} />
                    </div>
                    {/* Progress bar showing principal vs interest */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Principal ({fmt(ratio * 100)}%)</span>
                        <span>Interest ({fmt((1 - ratio) * 100)}%)</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="bg-blue-500 h-full" style={{ width: `${ratio * 100}%` }} />
                        <div className="bg-orange-500 h-full flex-1" />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* UNIT CONVERTER */}
          {tab === "unit" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">Unit Converter</h2>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(UNIT_CATEGORIES).map(k => (
                  <button key={k} onClick={() => {
                    setUnitCat(k);
                    setUnitFrom(UNIT_CATEGORIES[k].units[0].id);
                    setUnitTo(UNIT_CATEGORIES[k].units[1].id);
                  }}
                    className={`px-3 py-1.5 text-sm rounded-xl border capitalize transition-colors ${unitCat === k ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
                  >{UNIT_CATEGORIES[k].label}</button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">From</label>
                  <select value={unitFrom} onChange={e => setUnitFrom(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none">
                    {UNIT_CATEGORIES[unitCat].units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">To</label>
                  <select value={unitTo} onChange={e => setUnitTo(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none">
                    {UNIT_CATEGORIES[unitCat].units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Value</label>
                  <input type="number" value={unitValue} onChange={e => setUnitValue(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
              </div>
              <Result label={`${unitValue} ${unitFrom} =`} value={`${fmt(convertUnit(unitValue, unitFrom, unitTo, unitCat), 6)} ${unitTo}`} highlight />
              {/* All conversions */}
              <div className="space-y-2">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest">All {UNIT_CATEGORIES[unitCat].label} Conversions from {unitValue} {unitFrom}</h3>
                {UNIT_CATEGORIES[unitCat].units.filter(u => u.id !== unitFrom).map(u => (
                  <div key={u.id} className="flex justify-between text-sm py-1.5 border-b border-white/5">
                    <span className="text-gray-500">{u.label}</span>
                    <span className="text-gray-200 font-mono">{fmt(convertUnit(unitValue, unitFrom, u.id, unitCat), 6)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATE DIFF */}
          {tab === "date" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">Date Calculator</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                  <input type="date" value={dateA} onChange={e => setDateA(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">End Date</label>
                  <input type="date" value={dateB} onChange={e => setDateB(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
              </div>
              {(() => {
                const a = new Date(dateA), b = new Date(dateB);
                const diffMs = Math.abs(b.getTime() - a.getTime());
                const days = Math.floor(diffMs / 86400000);
                const weeks = Math.floor(days / 7);
                const months = Math.abs((b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth());
                const years = Math.abs(b.getFullYear() - a.getFullYear());
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <Result label="Days" value={fmt(days, 0)} />
                    <Result label="Weeks" value={fmt(weeks, 0)} />
                    <Result label="Months" value={fmt(months, 0)} />
                    <Result label="Years" value={fmt(years, 0)} />
                    <Result label="Hours" value={fmt(days * 24, 0)} />
                    <Result label="Minutes" value={fmt(days * 24 * 60, 0)} />
                  </div>
                );
              })()}
            </div>
          )}

          {/* BASE CONVERTER */}
          {tab === "base" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">Number Base Converter</h2>
              <div className="flex gap-2">
                {([10, 2, 16, 8] as const).map(b => (
                  <button key={b} onClick={() => setBaseFrom(b)}
                    className={`flex-1 px-3 py-2 text-sm rounded-xl border transition-colors ${baseFrom === b ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300"}`}
                  >{b === 10 ? "Decimal" : b === 2 ? "Binary" : b === 16 ? "Hex" : "Octal"}</button>
                ))}
              </div>
              <input value={baseInput} onChange={e => setBaseInput(e.target.value.toUpperCase())}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder={`Enter ${baseFrom === 10 ? "decimal" : baseFrom === 2 ? "binary" : baseFrom === 16 ? "hex" : "octal"} number...`} />
              {(() => {
                try {
                  const decimal = parseInt(baseInput, baseFrom);
                  if (isNaN(decimal)) return null;
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <Result label="Decimal (Base 10)" value={decimal.toString(10)} />
                      <Result label="Binary (Base 2)" value={decimal.toString(2)} />
                      <Result label="Hexadecimal (Base 16)" value={decimal.toString(16).toUpperCase()} />
                      <Result label="Octal (Base 8)" value={decimal.toString(8)} />
                    </div>
                  );
                } catch { return null; }
              })()}
            </div>
          )}

          {/* AGE CALCULATOR */}
          {tab === "age" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">Age Calculator</h2>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Date of Birth</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
              </div>
              {(() => {
                const birth = new Date(dob);
                const now = new Date();
                const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
                const years = now.getFullYear() - birth.getFullYear() - (
                  now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate()) ? 1 : 0
                );
                const months = Math.floor(totalDays / 30.44);
                const nextBirth = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
                if (nextBirth <= now) nextBirth.setFullYear(nextBirth.getFullYear() + 1);
                const daysToNextBirth = Math.ceil((nextBirth.getTime() - now.getTime()) / 86400000);
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <Result label="Age in Years" value={`${years} years`} highlight />
                    <Result label="Age in Months" value={`${months} months`} />
                    <Result label="Age in Days" value={fmt(totalDays, 0)} />
                    <Result label="Days to Next Birthday" value={`${daysToNextBirth} days`} />
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}

function Result({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5 border border-white/5"}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-bold font-mono ${highlight ? "text-blue-300" : "text-gray-200"}`}>{value}</div>
    </div>
  );
}
