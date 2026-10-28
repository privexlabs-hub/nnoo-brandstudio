// Brand voice & knowledge — written for pasting into external AI tools and content workflows.
// status: 'verified' = stated in the Nnọọ design system brief; 'derived' = reasoned from verified facts, validate before external use;
// 'confirm' = information the project does not contain — do not invent it.
export const STATUS = {
  verified: { label: 'Verified', note: 'Stated in the Nnọọ brand system.' },
  derived: { label: 'Derived — validate', note: 'Reasoned from verified facts. Check with the team before publishing as fact.' },
  confirm: { label: 'Needs confirmation', note: 'Not in the brand materials. Do not invent; leave a placeholder.' }
};

export const VOICE = [
  { id: 'overview', title: 'Brand overview', status: 'verified', md: `Nnọọ (Igbo: "welcome") is a voice-first mobile platform that preserves and transmits the full living culture of Ndị Igbo — language, proverbs, recipes, music, ceremonies, material culture and place-histories.

It records that culture from elders, stores it with provenance, and teaches it to diaspora children with tonal pronunciation feedback.

Brand line: "Two hands, one body." — a preservation archive and a learning app that feed each other.

- Name: Nnọọ (always with diacritics)
- Meaning: welcome
- Category: cultural preservation and language learning
- Positioning: a welcoming home for Igbo culture — reverent like an archive, approachable like a grown-up language app` },

  { id: 'purpose', title: 'Mission, vision and purpose', status: 'derived', md: `Purpose (verified): to preserve the living culture of Ndị Igbo and pass it on — recording it from elders, keeping it with provenance, and teaching it to the next generation in the diaspora.

Mission statement (draft, derived — confirm wording): Record Igbo culture from the people who carry it, keep it with care and consent, and teach it to the children who will carry it next.

Vision statement: [Needs confirmation — no vision statement exists in the brand materials.]` },

  { id: 'audience', title: 'Audiences', status: 'verified', md: `| Audience | Who they are | Where they meet Nnọọ |
| --- | --- | --- |
| Learners | Diaspora children and adults learning Igbo | Nnọọ Learn |
| Elders | The people whose voices, stories and knowledge are recorded | Recording sessions, Ọbá |
| Facilitators | Community volunteers who record elders | Facilitator Mode (tablet) |
| Contributors and community | Diaspora Igbo connecting by state, LGA, hometown and dialect | Ọha Community |
| Public and donors | People learning about the mission or supporting it | Marketing site |

Always name people by role: learners, elders, facilitators, contributors. Never "users".` },

  { id: 'needs', title: 'Audience needs and motivations', status: 'derived', md: `Validate these with research before using them as claims.

- Learners: hear Igbo spoken by real elders; get tone right, not just vocabulary; learn at their own pace without being shamed.
- Families: keep the voices of grandparents and elders before they are lost; know the recording is respected.
- Elders: be heard with patience; control who hears their recording and when; be named and credited.
- Facilitators: clear, calm tools to capture audio and metadata properly; guidance on consent.
- Community: find people from home by hometown, LGA and dialect; gather locally.
- Desired outcome: culture that is kept accurately and passed on, with each person's contribution honoured.` },

  { id: 'value', title: 'Value proposition and differentiators', status: 'verified', md: `Value proposition: learn Igbo from the voices that kept it — and help keep them.

Differentiators stated in the brand system:
- Voice-first: audio is the primary medium, not text.
- Provenance: every recording carries who, where, when and dialect.
- Consent and ownership: a recording belongs to the elder and their community, who choose who hears it.
- Tonal pronunciation feedback for learners.
- Two hands, one body: the archive (Ọbá) and the learning app (Nnọọ Learn) feed each other.
- Community organised by state, LGA, hometown and dialect (Ọha).

Do not claim scale, accuracy rates, partnerships, awards or "first/only/best" status — none are verified.` },

  { id: 'products', title: 'Products and features', status: 'verified', md: `| Surface | For | What it does |
| --- | --- | --- |
| Nnọọ Learn (iOS / Android) | Diaspora children and adults | Lessons, tonal pronunciation feedback, daily proverb, flashcards |
| Ọbá Archive (in-app) | Anyone | Browse and listen to elder recordings with full provenance (who, where, when, dialect) |
| Facilitator Mode (tablet) | Community volunteers | Field-recording UI: sit with an elder, capture audio and metadata cleanly |
| Ọha Community (in-app) | Diaspora Igbo | Find people by state, LGA, hometown and dialect; threads; local meetups |
| Marketing site | Public and donors | Explain the mission, invite contribution |

Ọbá means storehouse or treasury. Ọha means the community or the gathering. Introduce each with its gloss on first use ("Ọbá — the archive"), then use the Igbo name alone.

Availability, platforms, regions, pricing and launch dates: [Needs confirmation].` },

  { id: 'personality', title: 'Brand personality and principles', status: 'verified', md: `Nnọọ welcomes; it does not sell. When it teaches, it teaches like a patient relative, not a gamified coach.

- Reverent: culture and elders are treated with care and ceremony.
- Warm: late-afternoon light, clay, cooking fire — never cold or clinical.
- Encouraging: gentle praise for real progress; no hype.
- Patient: "Take your time. There is no hurry."
- Respectful of ownership: consent and credit are part of every story.` },

  { id: 'tone', title: 'Tone by context', status: 'verified', md: `| Context | Do | Don't |
| --- | --- | --- |
| Lesson success | "Ọ dị mma. Your tone was right." | "Level up! +20 XP!" |
| Elder recording intro | "Take your time. There is no hurry." | "Tap to record — ready, set, go!" |
| Error | "The recording didn't catch. Would you try once more?" | "Oops! Something went wrong." |
| Empty state | "No recordings yet from your hometown. Be the first." | "Nothing here" |
| Streak break | "Welcome back. The words waited for you." | "You lost your streak! Come back!" |` },

  { id: 'style', title: 'Writing style and mechanics', status: 'verified', md: `- Sentence case for headings, buttons and navigation ("Start a lesson", not "Start A Lesson").
- Igbo words always keep their diacritics: Nnọọ, Ọbá, Ọha, Ndị Igbo. Never strip them.
- Never italicise Igbo words. They are not foreign here.
- English is the primary language of UX copy; Igbo anchors key moments (greetings, praise, section names).
- Second person, gentle: "Your elder said…", "When you're ready, press record."
- "We" means the community, not the company: "We keep each other's stories."
- No ALL CAPS except tiny eyebrow labels.
- No emoji in product or marketing copy. (People may use emoji in their own Ọha posts.)
- Attribute dialect and region when quoting elders.` },

  { id: 'glossary', title: 'Vocabulary and terminology', status: 'verified', md: `| Term | Meaning / usage |
| --- | --- |
| Nnọọ | Welcome. The brand name. |
| Ndị Igbo | The Igbo people. |
| Ọbá | Storehouse, treasury — the archive. |
| Ọha | The community, the gathering — the community space. |
| Ọ dị mma | Well done. Used for lesson success. |
| Ilu | Proverb. |
| Learners | People learning through Nnọọ Learn. |
| Elders | People whose knowledge is recorded. |
| Facilitators | Volunteers who record elders. |
| Contributors | People who add to the archive or community. |
| Provenance | Who, where, when and dialect for a recording. |` },

  { id: 'avoid', title: 'Words, claims and approaches to avoid', status: 'verified', md: `- "Users", "customers", "content creators" for people — use learners, elders, facilitators, contributors.
- Gamified hype: XP, levels, "crush it", countdowns, loss-framed streak warnings.
- "Oops", "Uh oh" and other flippant error language.
- Emoji, ALL CAPS, exclamation-heavy copy.
- Stripped or misplaced diacritics; italicised Igbo.
- Stock "African" clichés — drums in silhouette, safari sunsets, generic tribal patterns.
- Reproducing uli, nsibidi or akwete patterns without an Igbo artist's authorship, attribution and compensation.
- Unverified claims: numbers of recordings or learners, accuracy rates, partnerships, endorsements, "first", "only", "best".
- Translating or glossing a proverb without the contributing elder's confirmation.` },

  { id: 'messaging', title: 'Messaging pillars and key messages', status: 'derived', md: `Pillars are derived from the verified product description. Validate before campaign use.

1. Two hands, one body — the archive and the classroom feed each other.
   Key message: "Every lesson begins with an elder's voice."
2. Kept with care — consent, ownership and provenance on every recording.
   Key message: "This recording belongs to the elder and their community. They choose who hears it."
3. Learn from real voices — tone matters in Igbo; learn it from the people who speak it.
   Key message: "Hear it from an elder. Say it back. Get the tone right."
4. Find your people — community by state, LGA, hometown and dialect.
   Key message: "Meet people from home, near you."
5. Welcome home — the emotional promise.
   Key message: "Nnọọ. Welcome home."` },

  { id: 'content', title: 'Content pillars and editorial principles', status: 'verified', md: `Content pillars (the culture Nnọọ preserves):
- Language
- Proverbs (ilu)
- Recipes
- Music
- Ceremonies
- Material culture
- Place-histories

Editorial principles:
- A proverb is content, not decoration. Show the Igbo original first, then the translation, then a one-line gloss of meaning. Attribute dialect and region when known.
- Name and credit people — elders, photographers, facilitators — with their permission.
- Consent comes first. Say who will hear a recording and when.
- Portraits show specific, named people. Use neutral placeholders until real, credited photography exists.
- Prefer one clear idea per post, slide or email block.` },

  { id: 'cta', title: 'Calls to action and conventions', status: 'verified', md: `Calls to action are short, sentence-case verbs, without urgency or pressure.

Examples used across the brand: "Start a lesson", "Start today's lesson", "Listen to Ọbá", "Become a facilitator", "Learn more", "Begin", "Save", "Record".

- One primary call to action per surface.
- Never use countdowns, scarcity or guilt.
- Pair invitations with reassurance where it helps: "When you're ready."` },

  { id: 'channels', title: 'Channel guidelines', status: 'derived', md: `Social posts
- One idea per post. Lead with the Igbo word or the elder's line when there is one.
- Captions: two to four short sentences, a gentle question or invitation, no emoji, no hashtag walls (one to three relevant tags at most).
- Polls and prompts invite memory and sharing ("Which word from home…"), never quizzes that shame.

Articles and blog posts
- Title in sentence case; subtitle explains the "why".
- Open with a person, place or proverb. Quote elders exactly and attribute dialect.
- Use subheadings every three to five paragraphs. End with one invitation.

Newsletters
- Greet with "Nnọọ,". Warm two-sentence opening.
- One featured story, a few short blocks, one primary call to action, a respectful footer.

Marketing and fundraising
- Mission-forward, not product-forward. Explain what support keeps (recordings, consent, access).
- No unverified impact numbers. Use [placeholders] until the team supplies sourced figures.` },

  { id: 'facts', title: 'Brand facts and constraints', status: 'verified', md: `Facts you may state:
- Nnọọ means "welcome" in Igbo.
- Nnọọ is voice-first and preserves language, proverbs, recipes, music, ceremonies, material culture and place-histories.
- Recordings are made with elders and stored with provenance (who, where, when, dialect).
- Learners receive tonal pronunciation feedback.
- The surfaces are Nnọọ Learn, Ọbá Archive, Facilitator Mode, Ọha Community and a marketing site.
- Brand line: "Two hands, one body."

Constraints:
- The visual identity is a scaffold built without Igbo co-authorship. Motifs are abstract originals; traditional patterns must come from Igbo artists with attribution and compensation.
- Icons are a placeholder set (Lucide) pending a commissioned set.
- Placeholder imagery is neutral colour fields, not illustration.` },

  { id: 'unconfirmed', title: 'Information that needs confirmation', status: 'confirm', md: `The brand materials do not contain the following. Do not invent them — use a clearly marked [placeholder] and ask the team.

- Legal entity name, founders, team members and their roles
- Founding date, location and organisational status (company, non-profit, community project)
- Launch status, app store availability, supported regions and languages beyond English and Igbo
- Pricing, subscriptions or donation mechanisms
- Any metrics: number of elders, recordings, learners, hours, dialects covered
- Partners, funders, endorsements, awards, press
- Website URL, social media handles, contact email, postal address
- English translations and glosses of specific proverbs (confirm with the contributing elder)
- An approved mission statement and vision statement
- Supported dialect list and how dialects are named` },

  { id: 'examples', title: 'Examples of correct and incorrect communication', status: 'verified', md: `| Write this | Not this |
| --- | --- |
| "Ọ dị mma. That's three new words today — they are yours now." | "Awesome!! You earned 3 badges!" |
| "Before we begin: this recording belongs to [Elder's name] and their community. You choose who hears it, and when." | "Tap record and let's go!" |
| "Ọbá is empty for your hometown. The first recording from Nnewi is waiting to be made." | "No data found." |
| "Welcome back. The words waited for you." | "Don't lose your streak!" |
| "Onye aghụghọ na-ebi n'ọhịa." — Umudioka dialect, Anambra | A proverb set in italics, without attribution |
| Nnọọ, Ọbá, Ọha | Nnoo, Oba, Oha |` },

  { id: 'ai', title: 'Instructions for AI tools', status: 'verified', md: `Paste this section with the rest of this document when asking an AI tool to write for Nnọọ.

You are writing for Nnọọ, a voice-first platform that preserves Igbo culture from elders and teaches it to diaspora learners. Follow these rules:

1. Voice: reverent, warm, patient and gently encouraging. Welcome; never sell. Teach like a patient relative, not a gamified coach.
2. Mechanics: sentence case; no emoji; no ALL CAPS except short labels; second person; "we" means the community.
3. Igbo: always keep diacritics (Nnọọ, Ọbá, Ọha, Ndị Igbo); never italicise Igbo; gloss Ọbá and Ọha on first use.
4. People: say learners, elders, facilitators, contributors. Never "users".
5. Proverbs: Igbo original first, then translation, then a one-line meaning, then dialect and region. If a translation is not supplied, write [translation to be confirmed] — never translate it yourself.
6. Facts: use only the facts in "Brand facts and constraints". For anything in "Information that needs confirmation", insert a [placeholder] instead of guessing.
7. No unverified numbers, partnerships, rankings or superlatives.
8. Respect consent: when mentioning recordings, make clear they are shared with permission.
9. One idea and one call to action per piece. Calls to action are short, sentence-case verbs with no urgency.
10. Flag anything you were unsure about at the end of your answer under "To confirm".` },

  { id: 'qa', title: 'Quality checks before publishing', status: 'verified', md: `- Every Igbo word has its diacritics and is not italicised.
- No emoji, hype, guilt or urgency.
- People are named by role (learner, elder, facilitator, contributor) and credited with permission.
- Proverbs follow original → translation → meaning → attribution, and the translation is confirmed.
- Every number, date, partner and claim has a source, or is a [placeholder].
- Sentence case throughout; one primary call to action.
- Imagery shows specific, named people or uses neutral placeholders — no clichés.
- Text meets contrast rules (see the brand playbook) and alt text describes images.` }
];

export function sectionText(s) { return '## ' + s.title + '\n[' + STATUS[s.status].label + ']\n\n' + s.md.trim() + '\n'; }
export function fullText() {
  return '# Nnọọ — brand voice and knowledge\n\nStatus key: Verified = stated in the brand system. Derived — validate = reasoned from verified facts. Needs confirmation = not yet known; do not invent.\n\n' + VOICE.map(sectionText).join('\n');
}
