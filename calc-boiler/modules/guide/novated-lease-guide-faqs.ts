// Shared FAQ copy for /novated-lease-guide/ — rendered by the page's accordion
// and turned into FAQPage JSON-LD in app/novated-lease-guide/page.tsx, so the
// structured data cannot drift from the page. FBT, EV-exemption and residual
// figures come from lib/constants/novated-lease.ts; brackets from lib/constants.

import { formatAUD, TAX_BRACKETS } from "@/lib/constants";
import { EV_EXEMPTION, FBT, minimumResidual, RESIDUAL_MINIMUM_PCT } from "@/lib/constants/novated-lease";
import type { FaqItem } from "@/lib/faq";

const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;
const LOW = TAX_BRACKETS[1];
const MID = TAX_BRACKETS[2];
const CALC = "/novated-lease-calculator/";
const RESIDUAL_EXAMPLE_PRICE = 40_000;

export const NOVATED_LEASE_GUIDE_FAQS: readonly FaqItem[] = [
  {
    q: "What is a novated lease in simple terms?",
    a: "A novated lease is a three-way arrangement between you, your employer and a finance company. Your employer takes the lease payments and the running-cost budget out of your pay, mostly from pre-tax salary, and sends them to the leasing company. This reduces your taxable income and lowers the total cost of running a vehicle compared to paying with after-tax dollars. The car is registered in your name, and you choose the vehicle, lease term, and running cost budget.",
  },
  {
    q: "What happens if I leave my job?",
    a: "The novation unwinds and the lease reverts to a finance agreement between you and the leasing company. You can novate it to a new employer that offers salary packaging, keep paying it from after-tax income, or pay it out.",
  },
  {
    q: "Are EVs eligible for novated leasing?",
    a: `Yes. A battery electric or hydrogen fuel cell car first held and used on or after ${EV_EXEMPTION.firstHeldAndUsedFrom}, on which luxury car tax has never been payable, is exempt from FBT — along with its registration, insurance, servicing and charging. Plug-in hybrids stopped qualifying on ${EV_EXEMPTION.phevExcludedFrom} and are only exempt under a binding arrangement that was already in place and in use before that date. An exempt car is still a reportable fringe benefit. The novated lease calculator carries the current luxury car tax threshold.`,
    links: { "novated lease calculator": CALC },
  },
  {
    q: "Does a novated lease reduce my super?",
    a: "It should not. Under Payday Super, qualifying earnings include salary sacrificed amounts that would otherwise be qualifying earnings, so your employer's super should still be worked out on your pre-sacrifice salary. Check the super line on the payslip after the first lease deduction, and ask payroll which figure they are using if it moved.",
  },
  {
    q: "Can I novate a used car?",
    a: "Yes, most leasing providers accept used vehicles that are under 7 years old at the end of the proposed lease term. The vehicle must have a clear title, current registration, and pass a mechanical inspection. Used car novated leases deliver smaller GST savings (no GST credit on private-sale used cars) but still provide income tax savings through pre-tax deductions.",
  },
  {
    q: "How much FBT do I pay on a novated lease?",
    a: `Under the employee contribution method you can take it to $0 by contributing the statutory taxable value from post-tax pay — ${pct(FBT.statutoryRate)} of the car's GST-inclusive base value for a full FBT year. Otherwise FBT is ${pct(FBT.rate)} of that value grossed up at ${FBT.grossUpType1}, funded from the same packaging budget. An FBT-exempt electric car needs no contribution at all. The calculator prices both methods on your car.`,
    links: { calculator: CALC },
  },
  {
    q: "What is the minimum salary for a novated lease?",
    a: `There is no legislated minimum, though providers set their own. What matters is the arithmetic: below ${formatAUD(LOW.max)} the marginal rate is ${LOW.rate * 100}c in the dollar plus the Medicare levy, so each pre-tax dollar saves little, while the post-tax employee contribution on a car that is not FBT-exempt is a fixed ${pct(FBT.statutoryRate)} of its price. Above ${formatAUD(LOW.max)} the ${MID.rate * 100}c rate applies and the picture changes. Test it on the novated lease calculator.`,
    links: { "novated lease calculator": CALC },
  },
  {
    q: "Are registration and insurance included?",
    a: "Yes. A fully maintained novated lease bundles registration, comprehensive insurance, fuel, scheduled servicing, tyres, and roadside assistance into the fortnightly or monthly budget. The leasing company pays these costs from the running cost pool deducted from your salary. Any surplus in the running cost account at lease end is refunded to the employee.",
  },
  {
    q: "Is a novated lease the same as salary packaging?",
    a: "A novated lease is a type of salary packaging, but not all salary packaging involves a novated lease. Salary packaging (also called salary sacrifice) covers any arrangement where pre-tax salary is exchanged for benefits including extra superannuation, laptops, work-related expenses, or a car. A novated lease is the specific salary packaging structure used for vehicles.",
  },
  {
    q: "What is the residual value and do I have to pay it?",
    a: `The residual is the amount left at the end of the lease, set as a minimum percentage of the original cost by ATO Taxation Determination TD 93/142 — ${pct(RESIDUAL_MINIMUM_PCT[5])} on a five-year lease, ${pct(RESIDUAL_MINIMUM_PCT[3])} on a three-year one. On a ${formatAUD(RESIDUAL_EXAMPLE_PRICE)} car over five years that is ${formatAUD(minimumResidual(RESIDUAL_EXAMPLE_PRICE, 5))}, paid from after-tax money to own the car outright, refinanced into a new lease, or covered by trading the car in. A lease can be written above the minimum, so read the residual off your quote.`,
  },
  {
    q: "Is there a kilometre limit on a novated lease?",
    a: "No. Unlike an operating lease or car subscription, a novated lease has no kilometre cap. The running cost budget is set based on estimated annual kilometres (typically 15,000 to 20,000 km), but exceeding the estimate does not incur penalties. Higher kilometres simply deplete the fuel and tyre budget faster, which is adjusted at the annual budget review.",
  },
  {
    q: "Does a novated lease reduce my HECS-HELP repayment?",
    a: "Not reliably, and it can raise it. Compulsory repayments are worked out on repayment income — taxable income plus your reportable fringe benefits amount. The lease cuts the first and adds to the second, and because the reported figure is grossed up it can more than replace the taxable income you removed. A full employee contribution takes the reported amount to nil; an FBT-exempt electric car still reports. The novated lease calculator shows both figures and the repayment, and the HECS-HELP calculator has the bands.",
    links: { "novated lease calculator": CALC, "HECS-HELP calculator": "/hecs-help-calculator/" },
  },
];
