"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { GST_REGISTRATION_THRESHOLD, gigTax, gstRegistrationStatus, type GigWorkType } from "@/lib/constants/gig-tax";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Rideshare and delivery: tax on figures the reader types in. Arithmetic is in
// lib/constants/gig-tax.ts (tested). The calculator never suggests what anyone
// earns; the opening values are placeholders to be replaced.

const WORK_OPTIONS = [
  { value: "rideshare", label: "Rideshare (carrying passengers)" },
  { value: "delivery", label: "Delivery (food or groceries)" },
] as const;
const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export default function GigTaxCalculator() {
  const [work, setWork] = useState<GigWorkType>("rideshare");
  const [gross, setGross] = useState(40000);
  const [expenses, setExpenses] = useState(12000);
  const [exGst, setExGst] = useState<"yes" | "no">("yes");
  const [deliveryReg, setDeliveryReg] = useState<"yes" | "no">("no");
  const [other, setOther] = useState(0);
  const [help, setHelp] = useState<"yes" | "no">("no");
  const [cover, setCover] = useState<"yes" | "no">("yes");

  const status = gstRegistrationStatus(work, gross);
  const registered = work === "rideshare" ? true : status.mustRegister || deliveryReg === "yes";

  const r = useMemo(
    () =>
      gigTax({
        grossPayments: gross,
        expenses,
        expensesIncludeGst: exGst === "yes",
        gstRegistered: registered,
        otherIncome: other,
        hasHelpDebt: help === "yes",
        hasPrivateHealth: cover === "yes",
      }),
    [gross, expenses, exGst, registered, other, help, cover],
  );

  return (
    <Card className="shadow-md not-prose" id="gig-tax-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Rideshare &amp; Delivery Tax Calculator</h2>
        <p className="text-sm text-warmgray mb-6">
          Enter your own year&rsquo;s payments and expenses. The calculator shows GST, income tax and Medicare on the profit, and what to put aside. The starting numbers are placeholders, not typical earnings.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="gt-work" label="Type of work" value={work} onChange={setWork} options={WORK_OPTIONS} />
            </div>
            <div className="sm:col-span-2">
              <NumberField id="gt-gross" label="Payments for the year ($)" hint="Total paid to you by the platforms over the year, before your costs. Includes GST if you charge it." value={gross} onChange={setGross} step={500} />
            </div>
            <div className="sm:col-span-2">
              <NumberField id="gt-exp" label="Business expenses for the year ($)" hint="Only the part used for the work: fuel, servicing, registration share, phone share, insurance, platform fees if not already netted." value={expenses} onChange={setExpenses} step={500} />
            </div>
            {work === "delivery" && (
              <div className="sm:col-span-2">
                <SelectField
                  id="gt-reg"
                  label="Registered for GST?"
                  hint={status.mustRegister ? "Required at this level of payments." : "Optional below $75,000 GST turnover."}
                  value={status.mustRegister ? "yes" : deliveryReg}
                  onChange={setDeliveryReg}
                  options={YES_NO}
                />
              </div>
            )}
            {registered && (
              <div className="sm:col-span-2">
                <SelectField id="gt-gstx" label="Do the expenses include GST?" hint="Fuel, servicing and phone bills usually do. Claim the GST back as a credit." value={exGst} onChange={setExGst} options={YES_NO} />
              </div>
            )}
            <div className="sm:col-span-2">
              <NumberField id="gt-other" label="Other taxable income in the year ($)" hint="Wages from a job, for example. Leave 0 if this is your only income." value={other} onChange={setOther} step={1000} />
            </div>
            <SelectField id="gt-help" label="HELP/HECS debt?" value={help} onChange={setHelp} options={YES_NO} />
            <SelectField id="gt-cover" label="Private hospital cover?" value={cover} onChange={setCover} options={YES_NO} />
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Payments received" value={formatAUD(gross, 0)} muted />
              {registered && <ResultRow label="GST collected in those payments" value={`−${formatAUD(r.gstCollected, 0)}`} muted />}
              <ResultRow label="Income for income tax" value={formatAUD(r.assessableIncome, 0)} />
              <ResultRow label="Deductible expenses" value={`−${formatAUD(r.deductibleExpenses, 0)}`} muted />
              <ResultRow label="Profit (net business income)" value={formatAUD(r.netBusinessIncome, 0)} bold />
            </dl>
            <dl className={RESULT_LIST}>
              <ResultRow label="Income tax on the profit" value={formatAUD(r.extraIncomeTax, 0)} />
              <ResultRow label="Medicare levy on the profit" value={formatAUD(r.extraMedicare, 0)} />
              {help === "yes" && <ResultRow label="HELP repayment added" value={formatAUD(r.extraHelp, 0)} />}
              {registered && <ResultRow label="GST to pay the ATO (collected less credits)" value={formatAUD(r.gstPayable, 0)} />}
              <ResultRow label="Set aside for the ATO" value={formatAUD(r.setAside, 0)} bold />
              <ResultRow label="Share of every $100 received" value={`$${(r.setAsideShare * 100).toFixed(2)}`} muted />
              <ResultRow label="Left after expenses and tax" value={formatAUD(r.inPocketAfterTax, 0)} bold />
            </dl>

            <p className={registered ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
              {status.reason}
              {registered && work === "delivery" && deliveryReg === "yes" && !status.mustRegister ? " You have chosen to register, so you collect and pay GST on delivery income." : ""}
            </p>
            <p className="text-xs text-warmgray-light">
              2026-27 resident tax rates, the low income offset and the Medicare levy; no super is paid on a sole trader&rsquo;s own income. This is arithmetic on your numbers, not a forecast of earnings or your tax bill: deductions, offsets and PAYG instalments can change the real result. GST threshold: {formatAUD(GST_REGISTRATION_THRESHOLD, 0)} GST turnover (ATO).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
