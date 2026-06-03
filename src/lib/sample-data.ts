export type Severity = "HIGH" | "MEDIUM" | "LOW";

export interface ClauseSample {
  id: string;
  severity: Severity;
  type: string;
  summary: string;
  legal: { section: string; act: string; body: string };
  judicial: { cases: { name: string; year: string; court: string }[]; body: string };
  plain: string;
  quote: string;
}

export const sampleClauses: ClauseSample[] = [
  {
    id: "bond",
    severity: "HIGH",
    type: "Training Bond",
    summary:
      "You're required to pay ₹2,00,000 if you leave within 2 years. The amount isn't tied to actual training costs.",
    legal: {
      section: "S.74",
      act: "Indian Contract Act 1872",
      body: "Penalty clauses are only enforceable to the extent of reasonable compensation for actual loss suffered. Liquidated damages disproportionate to actual training cost are reduced by courts.",
    },
    judicial: {
      cases: [
        { name: "Sicpa India v Manas Pratim Deb", year: "2011", court: "Delhi HC" },
        { name: "Toshnial Brothers v Eswarprasad", year: "1996", court: "SC" },
      ],
      body: "Courts consistently reduce bond amounts to documented training expenditure. A flat ₹2L figure with no breakdown is treated as a penalty, not compensation.",
    },
    plain:
      "Your employer can probably only recover what they actually spent training you — not the full ₹2L. Ask for a written cost breakdown. Without one, this amount is unlikely to hold up in court.",
    quote:
      "The Employee shall pay a sum of Rupees Two Lakhs Only (₹2,00,000/-) as liquidated damages to the Company in the event of resignation or termination for cause before the completion of twenty-four (24) months from the date of joining.",
  },
  {
    id: "noncompete",
    severity: "HIGH",
    type: "Post-Employment Non-Compete",
    summary:
      "You cannot work for any competing company for 12 months after leaving. This restraint applies across India.",
    legal: {
      section: "S.27",
      act: "Indian Contract Act 1872",
      body: "Every agreement by which any one is restrained from exercising a lawful profession, trade, or business is to that extent void. The only statutory exception covers sale of goodwill.",
    },
    judicial: {
      cases: [
        { name: "Superintendence Co v Krishan Murgai", year: "1981", court: "SC" },
        { name: "Percept D'Mark v Zaheer Khan", year: "2006", court: "SC" },
      ],
      body: "The Supreme Court has held post-employment restraints void as a settled rule, regardless of reasonableness. Only restraints during employment are permitted.",
    },
    plain:
      "This clause cannot legally stop you from joining a competitor after you leave. It's included as a scare tactic. You are not bound by it under Indian law.",
    quote:
      "Upon cessation of employment, the Employee shall not, for a period of twelve (12) months, directly or indirectly engage with, be employed by, or render services to any business that competes with the Company within the territory of India.",
  },
  {
    id: "ip",
    severity: "MEDIUM",
    type: "IP Assignment",
    summary:
      "All intellectual property you create — including work done outside office hours — is assigned to the company.",
    legal: {
      section: "S.17",
      act: "Copyright Act 1957",
      body: "Work created in the course of employment vests with the employer by default. Assignment of work created outside employment scope requires specific, narrowly drafted consideration.",
    },
    judicial: {
      cases: [{ name: "Indian Performing Right Society v EIMPP", year: "1977", court: "SC" }],
      body: "Courts read broad IP assignment clauses narrowly. Inventions unrelated to the employer's business and developed on personal time are generally protectable.",
    },
    plain:
      "Work you do for the company belongs to the company — that's normal. The 'outside office hours' part is overreach. You should ask to carve out personal projects unrelated to the employer's business.",
    quote:
      "All inventions, works of authorship, designs, and other intellectual property conceived, developed, or reduced to practice by the Employee, whether during or outside working hours, shall be the sole and exclusive property of the Company.",
  },
];

export const sampleSummary =
  "This is an offer letter for a software engineer role at an Indian IT services company. The CTC is ₹8.5L per annum with a 90-day notice period. The contract contains a ₹2,00,000 training bond enforceable for 24 months, a 12-month post-employment non-compete covering all of India, and a broad IP assignment clause covering work done outside office hours. Standard confidentiality and arbitration provisions apply. Three clauses warrant careful review before signing.";

export const sampleQuestions = [
  { q: "Is my bond amount enforceable?", a: "Likely only partially. Courts reduce bond amounts to documented training cost. The contract states ₹2,00,000 flat without a cost breakdown (Section 4.2). Without supporting documentation, this figure is treated as a penalty under Section 74 of the Indian Contract Act and is typically reduced." },
  { q: "What is my actual notice period?", a: "Section 7.1 of your contract specifies 90 days. There is no salary-in-lieu option written in. You would be required to serve the full period unless mutually waived." },
  { q: "Can I join a competitor after leaving?", a: "Yes. The non-compete in Section 9.3 is void under Section 27 of the Indian Contract Act. Indian courts have consistently struck down post-employment restraints. This clause cannot be enforced against you." },
];

export const lawCategories = [
  "All",
  "Contracts & Bonds",
  "Non-Compete & Restraint",
  "Compensation & Wages",
  "Termination & Notice",
  "Intellectual Property",
  "Arbitration",
] as const;

export interface LawArticle {
  id: string;
  category: (typeof lawCategories)[number];
  section: string;
  question: string;
  teaser: string;
  shortAnswer: string;
  whatLawSays: string;
  cases: { name: string; year: string; court: string; facts: string; held: string; matters: string }[];
  inPractice: string;
  actions: string[];
}

export const lawArticles: LawArticle[] = [
  {
    id: "noncompete",
    category: "Non-Compete & Restraint",
    section: "S.27 · INDIAN CONTRACT ACT 1872",
    question: "Is my post-employment non-compete actually enforceable?",
    teaser: "Almost always no. Indian law treats restraints on a person's right to earn a living as void — and the Supreme Court has held the line on this for decades.",
    shortAnswer: "Post-employment non-competes in India are generally void and unenforceable, regardless of duration or geography.",
    whatLawSays: "Section 27 of the Indian Contract Act states that any agreement restraining a person from exercising a lawful profession, trade, or business is void to that extent. The only statutory exception is the sale of goodwill of a business.",
    cases: [
      { name: "Superintendence Co v Krishan Murgai", year: "1981", court: "Supreme Court", facts: "An employee left and joined a competing firm within the restricted period.", held: "The Supreme Court held the post-employment non-compete void under Section 27.", matters: "This remains the leading authority. Courts cite it to strike down similar clauses today." },
      { name: "Percept D'Mark v Zaheer Khan", year: "2006", court: "Supreme Court", facts: "A management company sought to enforce a right-of-first-refusal post-contract.", held: "The Court refused enforcement, reaffirming that restraints after a contract ends are void.", matters: "Confirms the rule extends beyond traditional employment to service contracts." },
    ],
    inPractice: "If you have a job offer from a competitor of your current employer, the non-compete in your contract does not legally prevent you from accepting it. Your employer may send a legal notice; this is a pressure tactic. Pre-employment restraints (during the term of employment) are different and may be enforceable.",
    actions: [
      "Keep written records of your resignation and any communication with HR.",
      "Do not take confidential documents or client lists — that is a separate, enforceable issue.",
      "If you receive a cease-and-desist letter, consult an employment lawyer before responding.",
      "Negotiate non-compete removal at offer stage where possible — many companies will remove it on request.",
    ],
  },
  {
    id: "bond",
    category: "Contracts & Bonds",
    section: "S.74 · INDIAN CONTRACT ACT 1872",
    question: "Can my company sue me for breaking a training bond?",
    teaser: "Yes — but only to recover the actual cost of training, not the flat penalty figure written in the bond. The 25% rule is a useful rule of thumb.",
    shortAnswer: "Bonds are enforceable up to documented training expenses. Penalty figures unrelated to actual cost are reduced by courts.",
    whatLawSays: "Section 74 limits damages for breach of contract to reasonable compensation — not exceeding the amount named in the contract. Courts examine whether the figure represents genuine pre-estimated loss or a penalty.",
    cases: [
      { name: "Sicpa India v Manas Pratim Deb", year: "2011", court: "Delhi High Court", facts: "Employer sought ₹2L bond enforcement for early resignation.", held: "Court reduced recovery to documented training costs only.", matters: "Sets the template for how Indian courts treat IT-services training bonds." },
      { name: "Toshnial Brothers v Eswarprasad", year: "1996", court: "Supreme Court", facts: "Dispute over liquidated damages in a service contract.", held: "Damages must reflect actual loss, not function as a penalty.", matters: "Foundational authority for Section 74 in employment contexts." },
    ],
    inPractice: "If your bond is ₹2L and the company spent ₹40,000 actually training you, your liability is closer to ₹40,000. Request a written breakdown of training costs before signing — and again if you ever decide to leave.",
    actions: [
      "Ask for an itemized training cost statement in writing.",
      "If asked to pay the full bond, request documentation of actual expenses.",
      "Pay only what is genuinely documented; dispute the remainder.",
      "Send all responses in writing — never agree to a number verbally.",
    ],
  },
  {
    id: "gratuity",
    category: "Compensation & Wages",
    section: "PAYMENT OF GRATUITY ACT 1972",
    question: "What happens to my gratuity if I resign before 5 years?",
    teaser: "Under standard rules you lose it — but a 2018 Madras High Court ruling changed how 4 years and 240 days is calculated. The threshold is closer than most people think.",
    shortAnswer: "Gratuity vests after 4 years and 240 continuous days of service in the fifth year — not strictly 5 calendar years.",
    whatLawSays: "Section 4 of the Payment of Gratuity Act requires 5 years of continuous service. 'Continuous service' has been judicially interpreted to include the fifth year if 240 days are worked.",
    cases: [
      { name: "Mettur Beardsell v Regional Labour Commissioner", year: "1998", court: "Madras HC", facts: "Employee resigned after 4 years and 10 months of continuous service.", held: "Held entitled to gratuity — 240 days in the fifth year satisfies continuous service.", matters: "Reduces the practical threshold from 5 calendar years to roughly 4 years 8 months." },
    ],
    inPractice: "If you're approaching the 5-year mark, calculate your actual completed days carefully. Resigning a few months early may cost you a substantial sum. Gratuity is calculated as (last drawn basic + DA) × 15/26 × years of service.",
    actions: [
      "Request your service record from HR before resigning.",
      "Calculate your gratuity amount using your basic salary, not CTC.",
      "If denied gratuity wrongfully, file Form N with the controlling authority.",
      "Gratuity claims must be made within 30 days of becoming payable.",
    ],
  },
  {
    id: "notice",
    category: "Termination & Notice",
    section: "INDUSTRIAL EMPLOYMENT ACT · CONTRACT TERMS",
    question: "Can my employer force me to serve a 90-day notice period?",
    teaser: "Notice periods are contractual, not statutory for most white-collar roles. Specific performance of personal service contracts is barred — courts cannot compel you to work.",
    shortAnswer: "Your employer cannot legally force you to physically work the notice period. They can claim salary-in-lieu, withhold relieving documents, or sue for damages.",
    whatLawSays: "Section 14 of the Specific Relief Act prohibits courts from enforcing contracts dependent on personal qualifications. Employment is treated as such a contract.",
    cases: [
      { name: "Nandganj Sihori Sugar v Badri Nath", year: "1991", court: "Supreme Court", facts: "Employer sought injunction against an employee leaving without notice.", held: "Injunction refused — courts will not order specific performance of personal service.", matters: "Establishes that you cannot be physically compelled to serve notice." },
    ],
    inPractice: "You can leave without serving notice. Practical consequences: the employer may withhold your relieving letter (which the next employer asks for), claim salary-in-lieu equal to the notice period, or sue for damages. Most disputes settle with the employee paying the equivalent salary.",
    actions: [
      "Negotiate notice buyout in writing before leaving.",
      "Request relieving letter as part of the buyout settlement.",
      "Keep evidence of all handover work completed.",
      "Confirm the next employer will accept payslip + offer letter if relieving is withheld.",
    ],
  },
  {
    id: "ip",
    category: "Intellectual Property",
    section: "S.17 · COPYRIGHT ACT 1957",
    question: "Can my employer own things I build on my own time?",
    teaser: "Work in the course of employment defaults to the employer. Personal projects unrelated to the employer's business are a different matter — but contracts often try to claim them.",
    shortAnswer: "Work done in the course of employment belongs to the employer by default. Broad IP clauses covering personal work are read down by courts.",
    whatLawSays: "Section 17 of the Copyright Act vests authorship of employment work with the employer. Section 14 of the Specific Relief Act prevents over-broad enforcement.",
    cases: [
      { name: "Indian Performing Right Society v EIMPP", year: "1977", court: "Supreme Court", facts: "Dispute over ownership of musical compositions created during employment.", held: "Course-of-employment work vests with the employer; outside work does not.", matters: "Establishes the scope limit on default IP assignment." },
    ],
    inPractice: "If your contract says 'all inventions whenever made are the company's' and you build a personal side project unrelated to their business on weekends, the clause is unlikely to be enforced in full. But document timestamps and use personal hardware and accounts.",
    actions: [
      "Maintain clear separation between work and personal projects (devices, accounts, time).",
      "Document personal project timelines independently.",
      "Request a written carve-out for existing or unrelated projects at offer stage.",
      "Avoid using any employer infrastructure for personal IP.",
    ],
  },
  {
    id: "arbitration",
    category: "Arbitration",
    section: "ARBITRATION & CONCILIATION ACT 1996",
    question: "What does the arbitration clause in my contract actually mean?",
    teaser: "It usually means you give up your right to go to a regular court. The seat, language, and arbitrator-appointment process matter more than most people realise.",
    shortAnswer: "Arbitration clauses are generally enforceable. They move disputes out of the public court system into private arbitration — usually faster, often more expensive for individuals.",
    whatLawSays: "Section 7 of the Arbitration & Conciliation Act recognises written arbitration agreements as binding. Courts will refer disputes to arbitration unless the clause is null or inoperable.",
    cases: [
      { name: "Vidya Drolia v Durga Trading", year: "2020", court: "Supreme Court", facts: "Question of which disputes are arbitrable.", held: "Established the four-fold test for arbitrability.", matters: "Employer-employee disputes generally arbitrable unless they involve statutory employment protections." },
    ],
    inPractice: "Read three things in any arbitration clause: the seat (which city's courts supervise), the appointing authority (who picks the arbitrator), and who pays. A Mumbai-seat clause with employer-appointed arbitrator and split costs is far less favourable to you than a neutral institutional arbitration.",
    actions: [
      "Check the seat — travel costs to attend can dwarf the dispute amount.",
      "Confirm the appointing process — sole employer appointment is unfavourable.",
      "Ask whether the employer covers arbitration fees in employment disputes.",
      "Statutory claims (gratuity, harassment) may bypass arbitration.",
    ],
  },
];

export const featuredLaws = [
  { n: "01", title: "Section 27 ICA", desc: "Non-competes are usually void." },
  { n: "02", title: "Bond Enforceability", desc: "The 25% rule on training cost recovery." },
  { n: "03", title: "Gratuity After 5 Years", desc: "Your unconditional right — and the 4y 240d exception." },
  { n: "04", title: "The Wage Code", desc: "What CTC vs take-home actually means." },
  { n: "05", title: "Notice Period Reality", desc: "What's enforceable and what's a bluff." },
  { n: "06", title: "PF Deductions", desc: "Your rights to your own contributions." },
  { n: "07", title: "POSH Act", desc: "Sexual harassment protections at work." },
  { n: "08", title: "Wrongful Termination", desc: "What actually counts under Indian law." },
  { n: "09", title: "IP Assignment Limits", desc: "What employers can and cannot own." },
  { n: "10", title: "Forced Arbitration", desc: "When it binds you and when it doesn't." },
];
