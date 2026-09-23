// =============================================================================
// Teacher pay hub — the comparison rows and FAQ answers for
// /teacher-pay-australia/, built entirely from the eight state files.
//
// The hub used to carry its own rounded "approximate" figures typed by hand
// ($70,000–$78,000 starting, $104,000–$118,000 top of band). Those did not
// match any state's published scale, so they are gone: every number the hub
// shows now comes from the same verified rows the state pages render, and the
// FAQPage structured data is built from the same array as the visible answers.
// =============================================================================

import { formatAUD } from "@/lib/constants";
import {
  TEACHER_PAY_STATES,
  graduateSalary,
  teacherRatesYear,
  topOfClassroomScale,
  type TeacherPayFaq,
  type TeacherPayState,
} from "./index";

export interface TeacherHubRow {
  state: TeacherPayState;
  graduate: number;
  top: number;
}

/** States with a verified classroom scale, in the registry's order. */
export function teacherHubRows(): TeacherHubRow[] {
  return TEACHER_PAY_STATES.flatMap((state) => {
    const graduate = graduateSalary(state);
    const top = topOfClassroomScale(state);
    return graduate !== null && top !== null ? [{ state, graduate, top }] : [];
  });
}

function extreme(rows: TeacherHubRow[], key: "graduate" | "top", pick: "min" | "max"): TeacherHubRow {
  return rows.reduce((best, row) =>
    pick === "min" ? (row[key] < best[key] ? row : best) : row[key] > best[key] ? row : best,
  );
}

export function teacherHubSummary() {
  const rows = teacherHubRows();
  return {
    rows,
    lowestGraduate: extreme(rows, "graduate", "min"),
    highestGraduate: extreme(rows, "graduate", "max"),
    lowestTop: extreme(rows, "top", "min"),
    highestTop: extreme(rows, "top", "max"),
    year: rows.length > 0 ? teacherRatesYear(rows[0].state) : "",
  };
}

/** Visible FAQ and FAQPage markup share this array. */
export function teacherHubFaqs(): TeacherPayFaq[] {
  const { rows, lowestGraduate, highestGraduate, lowestTop, highestTop } = teacherHubSummary();
  const list = (key: "graduate" | "top") =>
    rows.map((r) => `${r.state.code} ${formatAUD(r[key])}`).join(", ");
  const vic = rows.find((r) => r.state.slug === "vic");
  const nsw = rows.find((r) => r.state.slug === "nsw");

  const faqs: TeacherPayFaq[] = [
    {
      q: "What is the starting salary for teachers in Australia?",
      a: `It depends on the state, because each one sets its own public school scale. A qualified graduate starts on ${list(
        "graduate",
      )} a year. The lowest is ${lowestGraduate.state.nameInSentence} at ${formatAUD(
        lowestGraduate.graduate,
      )} and the highest is ${highestGraduate.state.nameInSentence} at ${formatAUD(
        highestGraduate.graduate,
      )}. These are full-time base salaries before tax, with superannuation paid on top.`,
    },
    {
      q: "What is the most a classroom teacher earns?",
      a: `The top of the incremental classroom teacher scale is ${list("top")}. The highest is ${
        highestTop.state.nameInSentence
      } at ${formatAUD(highestTop.top)} and the lowest ${lowestTop.state.nameInSentence} at ${formatAUD(
        lowestTop.top,
      )}. Several states pay more again for roles reached by application or certification, such as Highly Accomplished and Lead Teacher, and leadership roles sit on separate scales.`,
    },
    {
      q: "Which state pays teachers the most?",
      a: `For a new graduate, ${highestGraduate.state.nameInSentence} (${formatAUD(
        highestGraduate.graduate,
      )}). At the top of the classroom scale, ${highestTop.state.nameInSentence} (${formatAUD(
        highestTop.top,
      )}). Rankings move whenever a state's agreement steps up, so check the date each state's rates took effect on its page.`,
    },
  ];

  if (vic) {
    faqs.push({
      q: "How much do teachers get paid in Victoria?",
      a: `A graduate Victorian government school teacher is paid ${formatAUD(
        vic.graduate,
      )} and the top of the classroom teacher scale is ${formatAUD(vic.top)}, under the ${
        vic.state.agreementName
      }, from ${vic.state.ratesEffectiveFrom}. ${vic.state.nextIncrease ? vic.state.nextIncrease.detail : ""}`.trim(),
    });
  }
  if (nsw) {
    faqs.push({
      q: "How much do teachers get paid in NSW?",
      a: `A NSW public school teacher starts at ${formatAUD(nsw.graduate)} and reaches ${formatAUD(
        nsw.top,
      )} at the top of the classroom scale, under the ${nsw.state.agreementName}, from ${
        nsw.state.ratesEffectiveFrom
      }.${nsw.state.nextIncrease ? ` Next increase: ${nsw.state.nextIncrease.date}. ${nsw.state.nextIncrease.detail}` : ""}`,
    });
  }

  faqs.push({
    q: "Do private and Catholic school teachers earn the same?",
    a: "Not necessarily. The scales on these pages are for government (public) schools only. Catholic systemic schools and independent schools are covered by their own enterprise agreements, and their rates are not reproduced here.",
  });

  return faqs;
}

const ORDINALS = ["highest", "2nd highest", "3rd highest", "4th highest", "5th highest", "6th highest", "7th highest", "8th highest"];

/**
 * The FAQ list a STATE page renders and marks up: the state's own verified
 * answers plus one cross-state comparison built from the same rows as the hub.
 * PAA source: "Which Australian state pays teachers the highest?" on the live
 * Google AU SERP for "teachers salary qld" (docs/seo/2026-09-24-paa-optimisation.md).
 * Both the accordion and the FAQPage JSON-LD read this, so they cannot drift.
 */
export function teacherStateFaqs(state: TeacherPayState): TeacherPayFaq[] {
  if (state.faqs.length === 0) return [];
  const { rows, highestGraduate, highestTop } = teacherHubSummary();
  const self = rows.find((r) => r.state.slug === state.slug);
  if (!self || rows.length < 2) return state.faqs;
  const rank = (key: "graduate" | "top") =>
    [...rows].sort((a, b) => b[key] - a[key]).findIndex((r) => r.state.slug === state.slug);
  const place = (i: number) => (i === rows.length - 1 ? "lowest" : ORDINALS[i]);
  const gradPlace = place(rank("graduate"));
  const topPlace = place(rank("top"));
  const name = state.nameInSentence.charAt(0).toUpperCase() + state.nameInSentence.slice(1);
  return [
    ...state.faqs,
    {
      q: "Which Australian state pays teachers the highest?",
      a: `For a new graduate, ${highestGraduate.state.nameInSentence} pays the most (${formatAUD(highestGraduate.graduate)}); at the top of the classroom scale, ${highestTop.state.nameInSentence} (${formatAUD(highestTop.top)}). ${name} pays ${formatAUD(self.graduate)} to a graduate, the ${gradPlace} of ${rows.length} states and territories, and ${formatAUD(self.top)} at the top of the scale, the ${topPlace}. Each state's rates took effect on different dates${state.nextIncrease ? `; ${state.nameInSentence}'s next change: ${state.nextIncrease.date}` : ""}.`,
    },
  ];
}
