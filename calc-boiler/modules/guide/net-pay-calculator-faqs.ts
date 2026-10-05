import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Withholding follows the ATO
// PAYG Schedule 1 tables for 2026-27 (lib/constants/payg-withholding.ts).

export const NET_PAY_CALCULATOR_FAQS: Faq[] = [
  {
    q: "What is net pay?",
    a: "Net pay is the amount that is paid into your bank account after tax and every other deduction have been taken out of your gross pay. It is the 'net pay' line at the bottom of your payslip. Employer super is paid on top and is not part of either gross or net pay.",
  },
  {
    q: "How do I calculate net pay from my hourly rate?",
    a: "Multiply your hourly rate by the hours you are paid for to get gross pay, then subtract the tax withheld (PAYG withholding, which includes the Medicare levy), any HELP amount, and any after-tax deductions such as union fees. The calculator above does this using the ATO's 2026-27 weekly, fortnightly and monthly tax tables.",
  },
  {
    q: "What is the difference between net pay and take-home pay?",
    a: "On a payslip they mean the same thing: the money that reaches your account. 'Take-home pay' is more often used for the annual figure after tax in a salary calculator, while 'net pay' is the figure for one pay period. The two can differ slightly because withholding during the year is an estimate and your final tax is settled when you lodge your return.",
  },
  {
    q: "Why is my net pay lower than the calculator shows?",
    a: "The usual causes are: you did not claim the tax-free threshold or have a second job (so more tax is withheld), you have a HELP/HECS-HELP or other study loan, you have not given your employer a tax file number declaration (the withholding rate without one is 47% for residents), you salary sacrifice, or you have after-tax deductions such as union fees. Check each line on your payslip.",
  },
  {
    q: "Is net pay the same each pay?",
    a: "Not always. Net pay changes when your gross changes (hours, overtime, penalty rates, leave, a bonus) and when your tax changes. A pay containing a bonus or back pay is often withheld using a different ATO method, which can take proportionally more tax than a normal pay.",
  },
  {
    q: "How much of an hour's pay do I keep after tax?",
    a: "It depends on your income. On $40 an hour for 38 hours a week you keep about 80c in the dollar, or about $32 an hour; at $80 an hour you keep about 73c. The more you earn, the smaller the share, because higher bands are taxed at higher rates. The table on this page shows net pay per hour at common hourly rates.",
  },
  {
    q: "Does casual loading count as part of my gross pay?",
    a: "Yes. Casual loading, usually 25% on top of the base hourly rate, is part of your gross pay and is taxed like the rest of your wages. If your payslip hourly rate already includes the loading, enter that rate and leave the casual loading box unticked.",
  },
  {
    q: "Is super included in net pay?",
    a: "No. Your employer pays superannuation guarantee contributions to your super fund on top of your wages. It is shown on your payslip but is not deducted from your pay and is not part of net pay. If you choose to salary sacrifice extra into super, that comes out of your pay before tax and reduces your net pay.",
  },
  {
    q: "What if I want a specific net pay and need to know the gross?",
    a: "Use the gross pay calculator, which works backwards from the net amount you want to the gross pay that delivers it. This page works forward from your hourly rate and hours.",
  },
];
