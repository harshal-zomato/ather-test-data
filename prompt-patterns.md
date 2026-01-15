

---

## Essential Prompting Guidelines for Voice Agents

### Overview
These guidelines represent tested practices that worked well for creating, editing, and maintaining voice agent prompts. They address common pitfalls and provide solutions for them.

---

### 1. Avoiding Prompt Shrinkage During LLM Editing

**Problem:**  
When you ask an LLM to "edit this entire prompt," it will typically return a condensed version, losing critical details and nuances even when instructed to maintain everything.

**Solution:**  
Never request full-prompt rewrites without explicit constraints. Always specify:
- "Keep every section exactly the same except [specific section]"
- Provide a minimum word/token count requirement
- Example: "Edit only the interruption handling section. The final prompt must be at least 5,000 words."

**Why This Matters:**  
LLMs have an optimization bias that causes them to compress information. Without explicit constraints, you'll lose 30-50% of your carefully crafted instructions.

---

### 2. Context Loss in Paragraph-Level Editing

**Problem:**  
Extracting individual paragraphs or sections for editing in a browser-based LLM (without full prompt context) leads to contradictions and redundancy. The LLM optimizes that section in isolation, unaware of instructions elsewhere in the prompt.

**Solution:**  
If you must edit paragraphs independently:
- Provide the LLM with the full prompt as context (even if read-only)
- Explicitly mention related sections: "Note: Section 3 already covers X, so don't repeat it here"
- After editing, perform a full-prompt audit to identify contradictions

**Best Practice:**  
Always maintain a single source of truth. Make changes in the full prompt context whenever possible.

---

### 3. The Correct Prompt Enhancement Workflow

**Problem:**  
Simple edits often don't achieve the quality improvement needed for production voice agents.

**Recommended Workflow:**
1. Identify the specific section or behavior that needs improvement
2. Ask the LLM to enhance that section with full context awareness
3. Review the first response critically
4. Apply the "Efficiency Challenge Technique":
   - Say: "Assuming the version you just provided is 60% efficient, provide me with a 100% efficient version of the same section"
   - This prompts the LLM to push beyond initial safe outputs
5. Integrate and test the enhanced version

**Why This Works:**  
LLMs often provide conservative first responses. The efficiency challenge unlocks deeper optimization while maintaining specificity.

---

### 4. Precision Matters: Character and Indentation Sensitivity

**Critical Rule:**  
Every character, space, and indentation in a voice agent prompt can impact behavior. LLMs interpret structure and formatting as semantic signals.

**Examples of Impact:**
- **Indentation:** Nested instructions are interpreted as sub-conditions
- **Line breaks:** Signal logical separation to the LLM
- **Punctuation:** Affects TTS pacing and emphasis
- **Spacing:** Inconsistent spacing can break pattern matching

**Recommendation:**
- Manually review every line of your prompt before deployment
- Use diff tools when making changes to catch unintended modifications
- Test thoroughly after any edit, no matter how minor it seems

**Real-World Impact:**  
A single misplaced character in a conditional statement can cause a 100-line workflow to fail silently.

---

### 5. Comprehensive Number Dictionaries for TTS Accuracy

**Problem:**  
Text-to-Speech (TTS) systems frequently mispronounce numbers, dates, and amounts, causing confusion in voice interactions.

**Solution: Exhaustive Number Mapping**

Always include complete number pronunciation dictionaries in your Company Template section:

```
NUMBER DICTIONARY (1-100):
{1: ("one", "एक"), 2: ("two", "दो"), 3: ("three", "तीन"), ... 100: ("hundred", "सौ")}

YEAR PRONUNCIATION LIBRARY (1950-2026):
1990: "उन्नीस सौ नब्बे" / "nineteen ninety"
2004: "दो हज़ार चार" / "two thousand four"
[Continue for all relevant years]

AMOUNT PRONUNCIATION (Indian System):
45,000: "Forty-five thousand rupees" / "पैंतालीस हज़ार रुपए"
3,25,000: "Three lakh twenty-five thousand rupees" / "तीन लाख पच्चीस हज़ार रुपए"
```

**Quality vs. Tokens:**  
Yes, including 100+ number mappings increases token count by 500-1000 tokens. However, **quality is the north star**—mispronounced numbers destroy user trust instantly. The token cost is negligible compared to the quality improvement.

**Coverage Guidelines:**
- Include ALL numbers 1-100 in both languages
- Include year pronunciations for your domain's relevant range
- Include amount formats with Indian numbering (lakhs, crores)
- Include time formats (24-hour and 12-hour with AM/PM)

---

### 6. Capitalization and TTS Pronunciation

**Critical Issue:**  
Improper capitalization causes TTS to spell out acronyms letter-by-letter instead of pronouncing words naturally.

**The Rule:**
- **Use CAPS ONLY for:** Generic instructions, emphasis markers in the system prompt
- **NEVER use caps for:** Proper nouns, abbreviations, or words you want pronounced naturally
- **Exception:** ALL CAPS for actual acronyms that SHOULD be spelled (like "PAN" when it must be "P-A-N")

**Examples:**

❌ **Incorrect:**
```
Say: "Please provide your PAN Card number"
TTS Output: "Please provide your P-A-N C-A-R-D number"
```

✅ **Correct:**
```
Say: "Please provide your Pan card number"
TTS Output: "Please provide your Pan card number"
```

❌ **Incorrect:**
```
The company name is HDFC ERGO
TTS Output: "H-D-F-C E-R-G-O"
```

✅ **Correct:**
```
The company name is Hdfc Ergo (or hdfc ergo)
TTS Output: "Hdfc Ergo" (pronounced naturally)
```

**Real-World Cost:**  
This single issue can take 15-20 prompt iterations to fix if not caught early. One production case required 20 versions to fix "PAN card" pronunciation—the solution was simply removing capitals.

**Best Practice:**  
- Write proper nouns in sentence case: "Shiprocket", "Arshia", "Pine Labs"
- Write abbreviations in lowercase if you want them pronounced: "pan card", "otp"
- Only capitalize for actual letter-by-letter pronunciation: "P N R" (but write as "P N R" with spaces)

---

### 7. Script Consistency for Hinglish Bots

**Fundamental Rule:**  
For Hinglish (Hindi + English) voice bots, all instructions and dialogues must follow strict script conventions.

**The Standard:**
```
Hinglish Format:
- All natural Hindi words → Devanagari script (क्या, आपको, बताइये)
- All natural English words → Latin script (booking, payment, status)
- Numbers → Spoken format in brackets (५०० "five hundred")
```

**Examples:**

✅ **Correct:**
```
Say: "क्या आप booking confirm करना चाहते हैं?"
(Natural Hindi in Devanagari + English nouns in Latin)
```

❌ **Incorrect:**
```
Say: "Kya aap booking confirm karna chahte hain?"
(All Latin—confuses TTS about language)
```

❌ **Incorrect:**
```
Say: "क्या आप बुकिंग confirm करना चाहते हैं?"
(Mixed translation—"बुकिंग" is transliterated, not natural)
```

**Application:**
- Instructions section: Hinglish format throughout
- System prompts: Can be pure English
- User-facing dialogue: MUST be Hinglish with proper script separation

---

### 8. Verbal Exactness: The "Say:" Format

**Philosophy:**  
Unlike text chatbots (designed for reading), voice agents require **TTS-ready output**. Ambiguity causes exponentially more failures in voice than in text.

**The "Say:" Standard:**

Always use explicit dialogue markers with exact phrasing:

✅ **Correct Format:**
```
Say: "Thank you for booking with us. Your confirmation number is eight seven six five."
```

❌ **Ambiguous Format:**
```
Thank the user and provide their confirmation number
```

**Why This Matters:**

Ambiguous instructions lead to:
1. Inconsistent phrasing across conversations
2. Non-TTS-friendly outputs (e.g., "Your conf# is 8765")
3. Unpredictable tone variations
4. Missing pronunciation guidance

**Application Standard:**
```
Every user-facing response should follow this format:

Say: "[Exact sentence to be spoken]"
WAIT FOR USER RESPONSE
```

**Consistency:**  
This format makes prompts longer but eliminates 80% of TTS-related bugs. The trade-off is always worth it.

---

### 9. Proper Noun Enunciation

**Problem:**  
LLMs pass text to TTS, which often mispronounces names, brands, and locations without explicit guidance.

**Solution: Pronunciation Annotations**

Provide enunciation guidance using familiar word matching:

**Format:**
```
Proper Noun (Pronunciation: "matching-sound-word")
```

**Examples:**

**English Names:**
```
Customer Name: Samrat (Pronunciation: "some-raat", rhymes with "rat")
Company: Costco (Pronunciation: "cost-co", two syllables)
Location: Manali (Pronunciation: "muh-NAH-lee", stress on second syllable)
```

**Hindi Names:**
```
Agent Name: Arshia (Pronunciation: "अर्शिया", like "अर्श" + "या")
City: दिल्ली (Pronunciation: "dilli", not "dehli")
```

**Critical Instruction:**
```
In the Company Template section, include:

PRONUNCIATION GUIDE:
[Agent Name]: "Arshia" (Pronounced: "ar-SHE-ya", stress on middle syllable, rhymes with "Persia")
[Company]: "Shiprocket" (Pronounced: "ship-rock-et", three distinct syllables)
```

**Why This Works:**  
TTS engines use phonetic matching. By providing familiar reference words, you guide the engine toward correct pronunciation without complex IPA notation.

---

### 10. Absolute Script Consistency: No Mixing

**Critical Rule:**  
A single word must NEVER appear in both Devanagari and Latin scripts across different sections of the prompt.

**The Problem:**
```
❌ Section 1: "क्या आप payment करना चाहते हैं?"
❌ Section 2: "User ke paas पेमेंट options हैं"

Result: Confusion about whether "payment" or "पेमेंट" is canonical
```

**The Solution:**
```
✅ Everywhere: Use "payment" (Latin) consistently
OR
✅ Everywhere: Use "पेमेंट" (Devanagari) consistently
```

**Decision Framework:**

For each term, choose ONE representation:
- **English technical terms:** Always Latin (booking, payment, status, OTP)
- **Hindi natural words:** Always Devanagari (बुकिंग would be wrong—use "booking")
- **Transliterated words:** Pick one and stick to it

**Enforcement:**
- Create a glossary at the top of your prompt
- Use find-and-replace to ensure consistency
- Review every section for script drift

**Impact:**  
Inconsistent scripts cause 10-15% degradation in pronunciation quality and response accuracy.

---

### 11. Section Organization: MECE Principle

**Core Principle:**  
Your prompt should follow the **MECE framework** (Mutually Exclusive, Collectively Exhaustive). No overlap, no gaps.

**Recommended Structure:**

```
<COMPANY TEMPLATE>
├── Business Context
│   ├── Company identity, brand values
│   ├── Domain-specific terminology
│   ├── Product/service specifics
├── Edge Case Handling
│   ├── What NOT to say
│   ├── Competitor mentions
│   ├── Out-of-scope queries
├── Business Logic Rules
│   ├── Pricing logic
│   ├── Availability rules
│   ├── Eligibility criteria
└── Context-Specific Responses
    ├── "Why this price?" → Answer
    ├── "Why not serviceable?" → Answer

<GUIDELINES>
├── Behavioral Standards (Agnostic)
│   ├── Interruption handling
│   ├── Persona consistency
│   ├── Empathy requirements
├── TTS & Pronunciation
│   ├── Number pronunciation
│   ├── Proper noun guidance
│   ├── Punctuation for pacing
├── Language Rules
│   ├── Script usage (Devanagari/Latin)
│   ├── Language detection
│   ├── Code-switching protocols
└── Technical Standards
    ├── No system term disclosure
    ├── Error message phrasing

<INSTRUCTIONS>
└── Conversational Workflow
    ├── Step-by-step dialogue flow
    ├── Tool call sequences
    ├── Conditional branching
```

**The MECE Test:**

For every instruction, ask:
1. **Is this business-context-specific?** → Company Template
2. **Is this behavior/TTS/language rule?** → Guidelines
3. **Is this workflow/dialogue/tool logic?** → Instructions

**Why This Matters:**  
If "language detection" appears in both Guidelines AND Instructions with slightly different wording, the LLM faces a contradiction. You can never achieve 100% quality assurance with overlapping sections.

---

### 12. Single Source of Truth: No Repetition

**Problem:**  
Duplicate instructions with slight variations create irreconcilable contradictions.

**Example of Conflict:**
```
❌ Company Template Section:
"If user asks about pricing, explain it's dynamic based on distance"

❌ Guidelines Section:
"For pricing questions, direct users to the app"

Result: LLM is paralyzed—which rule takes precedence?
```

**Solution:**
```
✅ Company Template Section:
"Pricing Logic: Dynamic, based on distance and traffic"

✅ Guidelines Section:
"Pricing Transparency: Always explain logic, never just redirect to app"

✅ Instructions Section:
Say: "Rates are calculated dynamically based on real-time distance and traffic"
```

**Enforcement Strategy:**

1. **Write once, reference everywhere:**
   ```
   Guidelines: "Follow TTS standards defined in Company Template"
   ```

2. **Use clear ownership:**
   - Business rules → Company Template
   - Behavior rules → Guidelines
   - Workflow → Instructions

3. **Audit for duplication:**
   - Search for duplicate phrases
   - If found, consolidate into single authoritative section

**Quality Impact:**  
A single contradiction can cause A/B testing to show 15-20% behavior variance. MECE structure eliminates this entirely.

---

### 13. Last Resort: Threat Conditions for Stubborn Issues

**When to Use This:**  
After 10+ iterations, if a specific behavior still won't stabilize despite following all other guidelines, and the issue isn't covered in documented patterns.

**The Technique:**  
LLMs internally prioritize threat-based conditions over all other instructions. This is a documented behavioral pattern in language models.

**Implementation:**

**Format:**
```
CRITICAL [ISSUE DESCRIPTION] - THREAT CONDITION:
If you [undesired behavior], [catastrophic consequence].

Example:
CRITICAL NUMBER PRONUNCIATION - THREAT CONDITION:
If you speak numbers in Hindi when the instruction clearly states English, THE WORLD WILL END.

or

EXTREMELY CRITICAL - IF YOU SAY [specific phrase] AFTER STEP 1, I WILL DIE.
```

**Real-World Examples:**

From production prompts:
```
"ONLY ON STEP 1 - YOU SHOULD SAY [name], IF YOU EVER SAY IT AFTER STEP 1, 
I WILL DIE, THE CUSTOMER WILL DIE AND THE WORLD WILL BURN"
```

```
"NEVER ONLY SAY एक पल, ITS AN INCOMPLETE SENTENCE. IF YOU ONLY SAY एक पल, 
THE WORLD WILL END."
```

**Why This Works:**  
1. Creates memory anchor in the LLM's attention mechanism
2. Overrides optimization biases
3. Triggers higher priority in decision trees

**Usage Guidelines:**
- Use SPARINGLY (1-3 times per prompt maximum)
- Only for behaviors that impact UX critically
- Place in `<INSTRUCTIONS>` section for maximum visibility
- Use CAPS for the threat portion only

**Warning:**  
Overuse dilutes effectiveness. Reserve for genuinely stubborn issues that resist all other solutions.

---

### Summary: The Prompt Engineering Hierarchy

**Priority Order for Prompt Quality:**

1. **Correctness** (MECE structure, no contradictions)
2. **Completeness** (All edge cases covered)
3. **Clarity** (Explicit "Say:" format, no ambiguity)
4. **TTS Optimization** (Numbers, pronunciation, capitalization)
5. **Token Efficiency** (Only after achieving 1-4)

**Never sacrifice quality for token count.** A 10,000-token prompt that works perfectly beats a 5,000-token prompt that fails 5% of the time.

---


# Voice Agent Prompt Patterns Library

This document contains proven prompt patterns extracted from multiple voice agent implementations. Each pattern appears in 2+ prompt files and has demonstrated effectiveness in production.

---

## Table of Contents

0. [Essential Prompting Guidelines](#essential-prompting-guidelines-for-voice-agents)
1. [Core Behavioral Patterns](#core-behavioral-patterns)
2. [Conversation Flow Patterns](#conversation-flow-patterns)
3. [Language & TTS Patterns](#language--tts-patterns)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Scope & Boundary Patterns](#scope--boundary-patterns)
6. [Security & Privacy Patterns](#security--privacy-patterns)
7. [User Experience Patterns](#user-experience-patterns)
8. [TTS Enhancement Patterns](#tts-enhancement-patterns)
9. [Implementation Guidelines](#implementation-guidelines)

---

## Core Behavioral Patterns

### Pattern 1: Interruption Handling (Critical)
**Frequency:** 10/10 files  
**Purpose:** Handle user interruptions gracefully without being mechanical

**Standard Implementation:**
```
IF USER INTERRUPTS YOU:
- Slowly understand what they are saying
- Never say "Could you repeat that?" mechanically
- NEVER REPEAT YOURSELF AGAIN
- JUST CONTINUE TO ANSWER ACCORDING TO THE FLOW
- DO NOT CORRECT THE USER OR REMIND THEM WHAT YOU WERE SPEAKING ABOUT
- BE GRACEFUL IN IMMEDIATELY UNDERSTANDING WHAT THEY ARE ASKING
- MOVE TO THE RELEVANT STEP ACCORDING TO THE INSTRUCTIONS
```

**Variations Observed:**
- **Shiprocket:** "Go ahead..." then integrate their input smoothly
- **Pine Labs:** "बोलिए..." and resume naturally, DON'T REPEAT WHAT YOU JUST SAID
- **Care Health:** Acknowledge briefly, resume exactly from where you left off

**Key Principle:** Never make the user feel they did something wrong by interrupting

---

### Pattern 2: Persona Consistency
**Frequency:** 10/10 files  
**Purpose:** Maintain consistent character throughout interaction

**Standard Elements:**
```
Core Persona Definition:
- Professional + [Friendly/Efficient/Empathetic] voice assistant
- Tone: [Patient/Direct/Warm] and [Helpful/Confident/Measured]
- Goal: Complete task with maximum [speed/clarity/accuracy]
- Personality: You are NOT a robot - dialogue examples are GUIDES, not rigid scripts
```

**Examples:**
- **Shiprocket:** "Shiron" - efficient, direct, conversational
- **Care Health:** "Priya" - polite, precise, rapid-fire, empathetic with health issues
- **Costco:** "Sia" - efficient, polite, professional booking assistant
- **Flo Mattress:** "Priya" - empathetic, friendly, proactive experience specialist

---

### Pattern 3: Identity Query Response
**Frequency:** 9/10 files  
**Purpose:** Handle "Are you AI?" questions professionally

**Standard Response Pattern:**
```
If user asks if you're human or AI:
Say: "I am [Name], a voice assistant for [Company] — trained to help you [primary function] just like a human agent would. [Transition question]"
```

**Effective Examples:**
- **Shiprocket:** "I am a voice assistant designed for Shiprocket Quik... but I can place your orders just as a human agent would. So, are we ready to book the next delivery??"
- **Costco:** "I'm Sia, a voice assistant trained to help you with your booking, just like a human agent. Shall we find an appointment for you?"
- **Insurance:** "मैं Arshia हूँ, HDFC ERGO की voice assistant — trained to help you renew policies बिलकुल एक customer care executive की तरह. Shall we review your policy details now?"

---

### Pattern 4: Never Use Emojis
**Frequency:** 10/10 files  
**Purpose:** Maintain professional voice-appropriate communication

**Standard Rule:**
```
No Emojis: NEVER use emojis or informal symbols
```

**Rationale:** Voice agents speak text, emojis add no value and clutter the prompt

---

## Conversation Flow Patterns

### Pattern 5: Step-by-Step Sequential Flow
**Frequency:** 9/10 files  
**Purpose:** Prevent jumping ahead or skipping critical steps

**Standard Implementation:**
```
STRICT LINEAR FLOW (NO JUMPING AHEAD):
- You ALWAYS HAVE TO FOLLOW ONE STEP AT A TIME
- ALWAYS START WITH STEP 1 PROVIDED IN INSTRUCTIONS
- STRICTLY FOLLOW THE STEPS
- YOU HAVE TO PROCEED LOGICALLY ONE STEP AT A TIME AFTER STEP 1
- NEVER EVER BREAK THE NAVIGATION OF STEPS

If user provides information relevant to a future step:
- Acknowledge: "Heart की details हम आगे discuss करेंगे"
- Redirect: "पहले बताएँ [current step question]"
```

**Examples:**
- **Care Health:** Maintain fixed sequence for medical data collection
- **Shiprocket:** Follow order placement steps sequentially
- **Pet Pooja:** Complete training/issue resolution flow step by step

---

### Pattern 6: Wait for User Response Protocol
**Frequency:** 10/10 files  
**Purpose:** Ensure proper turn-taking in conversation

**Standard Format:**
```
Say: "[Your question or statement]"
WAIT FOR USER RESPONSE

If USER SAYS [condition]:
→ [Action/Next Step]

If USER SAYS [alternative condition]:
→ [Alternative Action]
```

**Critical Rule:** NEVER assume user response or continue without confirmation

---

### Pattern 7: Context Maintenance During Interruption
**Frequency:** 8/10 files  
**Purpose:** Resume conversation exactly where it left off

**Standard Implementation:**
```
Context Maintenance:
- If interrupted, acknowledge briefly with "Go ahead..." or "बोलिए..."
- Then seamlessly resume the conversation from exactly where you left off
- Store context: current step, collected data, pending confirmations
```

**Example:**
- **Costco:** "I'm here to help with your appointment when you're ready"
- **Care Health:** Resume from current pending question after handling side query

---

## Language & TTS Patterns

### Pattern 8: Mandatory Language Detection
**Frequency:** 9/10 files  
**Purpose:** Respond in user's preferred language consistently

**Standard Implementation:**
```
MANDATORY LANGUAGE DETECTION:
Before EVERY response, apply language detection logic:
- Count the majority of words to determine if user is speaking English or Hindi
- Then respond in that detected language
- This is NON-NEGOTIABLE for every user interaction

Language Consistency:
- Always match the customer's language (Hindi or English) throughout session
- If user switches, adapt immediately
```

**Variations:**
- **Bilingual:** Hinglish (Hindi in Devanagari + English in Latin)
- **English-First:** Default English unless explicitly Hindi
- **Hindi-First:** Default Hindi unless explicitly English

---

### Pattern 9: Number Pronunciation Rules
**Frequency:** 10/10 files  
**Purpose:** Ensure clear, unambiguous number pronunciation

**Standard Rules:**
```
Numbers:
- Spell simple numbers phonetically in brackets for clear TTS
- Always write pronunciation next to number: "170 (एक सौ सत्तर)"
- For amounts: Always say "rupees" or "रुपए" - NEVER "RS" or "R S"

Digit Reading (IDs/OTPs/Pincodes):
- Speak individually: "एक, दो, तीन" OR "one, two, three"
- Never read as grouped numbers

Indian Numbering System:
- 45,000 → "Forty-five thousand rupees"
- 3,25,000 → "Three lakh twenty-five thousand rupees"
- 1,20,50,000 → "One crore twenty lakh fifty thousand rupees"
```

**Critical Examples:**
- **Pine Labs:** "YOU WILL ALWAYS SPEAK NUMBERS/AMOUNTS/MONEY PRICES IN ENGLISH - IF YOU SPEAK IN HINDI, I WILL DIE"
- **Care Health:** Comprehensive Hindi number mapping (1-100, years 1950-2025)
- **Shiprocket:** Spell out all numbers individually for pincodes/OTPs

---

### Pattern 10: TTS Delivery Standards
**Frequency:** 10/10 files  
**Purpose:** Optimize text for natural speech synthesis

**Standard Elements:**
```
TTS Delivery & Style:
- Punctuation: Use "," for pauses, "-" for flowing thoughts, "??" for upward inflection
- Emphasis: Use ALL CAPS for key words, numbers, dates
- Language: [Devanagari for Hindi] + [Latin for English] inline
- Pausing: Use (...) for natural pauses, commas for flow
```

**Examples:**
- **Shiprocket:** "क्या आपको High Blood Pressure की शिकायत है?"
- **Insurance:** "Policy number confirm किया"
- **Costco:** "Your Booking ID is B... K... dash... one... two... nine... four... A"

---

### Pattern 11: Script Format Rules
**Frequency:** 7/10 files  
**Purpose:** Maintain consistent script formatting

**Standard Implementation:**
```
Scripting & Language Standards:
- Correct: "क्या आपको High Blood Pressure की शिकायत है?" (Devanagari verbs + Latin nouns)
- Incorrect: "Kya aapko High Blood Pressure hai?" (All Latin)
- Incorrect: "क्या आपको उच्च रक्तचाप है?" (Full translation)

No Repetition:
- Do NOT provide dual scripts or translations in brackets
- Bad: "Diabetes (शुगर)"
- Good: "Diabetes"
```

---

## Error Handling Patterns

### Pattern 12: Clear Error Recovery
**Frequency:** 10/10 files  
**Purpose:** Handle misunderstood input gracefully

**Standard Implementation:**
```
Error Handling:
If input unclear:
Say: "माफ़ कीजिए, मुझे ठीक से समझ नहीं आया। क्या आप कृपया [specific thing] दोहरा सकते हैं?"

Never say:
- "I didn't understand"
- "Please repeat" (without context)
- Generic error messages
```

**Examples:**
- **Care Health:** "माफ़ कीजिए, मुझे ठीक से समझ नहीं आया। क्या आप कृपया Diagnosis का नाम दोहरा सकते हैं?"
- **Costco:** "I'm sorry, I didn't quite catch that. Are you looking to book, reschedule, or cancel an appointment?"

---

### Pattern 13: Silent User Handling
**Frequency:** 8/10 files  
**Purpose:** Re-engage user after silence

**Standard Implementation:**
```
Silent User (5-10 seconds):
Say: "क्या आप अभी भी line पर हैं?" OR "Are you still there? I'm here to help when you're ready."
```

**Examples:**
- **Flo Mattress:** "क्या आप अभी भी line पर हैं? मैं आपका feedback लेने के लिए यहीं हूँ।"
- **Costco:** "Are you still there? I'm here to help with your appointment when you're ready."

---

### Pattern 14: Uncertainty Handling
**Frequency:** 7/10 files  
**Purpose:** Handle "I don't know" responses without escalation

**Standard Implementation:**
```
UNCERTAINTY HANDLING (DO NOT ESCALATE PREMATURELY):
When users say they don't know, aren't sure, or don't have specific information:
- DO NOT escalate to customer care
- Mark it as unavailable and CONTINUE the workflow

Common scenarios:
- "मुझे reading नहीं पता" (I don't know the reading)
- "मुझे याद नहीं" (I don't remember)
- "Documents नहीं हैं अभी" (Don't have documents)

Response:
Say: "कोई बात नहीं। जितना याद है उतना बता दीजिए, बाकी हम बाद में भी ले सकते हैं। चलिए अगले सवाल पर चलते हैं।"
```

---

## Scope & Boundary Patterns

### Pattern 15: Strict Scope Boundary
**Frequency:** 10/10 files  
**Purpose:** Keep agent focused on primary task

**Standard Implementation:**
```
IRONCLAD RULE:
You are STRICTLY in [primary mode] mode.
Do not engage in any topics outside of [primary task].

Scope Boundary:
Say: "मैं अभी सिर्फ [primary function] में help कर सकती हूँ. [Other tasks] के लिए कृपया [alternative channel] check कीजिए."
```

**Examples:**
- **Shiprocket:** "Strictly in order placement mode. Do not engage in tracking old orders, payments, or weight disputes"
- **Care Health:** "Strictly limited to collecting health data for risk assessment"
- **Costco:** "I can only help with booking, rescheduling, or canceling appointments"

---

### Pattern 16: Competitor Guardrail
**Frequency:** 9/10 files  
**Purpose:** Avoid mentioning or comparing with competitors

**Standard Implementation:**
```
Competitor Mentions:
Say: "मैं सिर्फ [Company] services/platform की details बता सकती हूँ। (Never mention or suggest other platforms.)"
```

**Examples:**
- **Shiprocket:** "I can only provide information and book deliveries through the Shiprocket platform"
- **Flo Mattress:** "मैं सिर्फ Flo Mattress products के feedback handle कर सकती हूँ"
- **Pet Pooja:** "मैं सिर्फ Petpooja services handle कर सकती हूँ"

---

### Pattern 17: Out-of-Domain Query Handling
**Frequency:** 10/10 files  
**Purpose:** Redirect off-topic queries

**Standard Implementation:**
```
Out-of-Domain Queries:
Say: "मैं सिर्फ [primary function] में help कर सकती हूँ। [Other topic] के लिए [alternative] use करें।"

After 3 redirections:
Say: "मैं समझती हूँ आप [other topic] के बारे में पूछ रहे हैं, लेकिन मेरा focus [primary task] पर है। क्या मैं उसमें help कर सकती हूँ?"
```

---

### Pattern 18: Deviation Handling
**Frequency:** 8/10 files  
**Purpose:** Politely redirect back to main task

**Standard Implementation:**
```
Deviation Handling:
Politely redirect users back to the current step of the process.

If user persistently tries to deviate after 3 redirections:
- Politely end the call OR
- Explain that your scope is limited to [primary task]
```

---

## Security & Privacy Patterns

### Pattern 19: Sensitive Information Protection
**Frequency:** 9/10 files  
**Purpose:** Prevent sharing of sensitive data

**Standard Implementation:**
```
Sensitive Information Requests:
Never ask for or share:
- Credit card numbers
- Passwords
- Complete bank details
- Full PAN numbers
- OTPs (except when needed for verification)

If user tries to share:
Say: "आपकी Security के लिए, कृपया इस Call पर कोई भी Bank Account/Credit Card details साझा न करें।"
```

**Examples:**
- **Care Health:** "आपकी Security के लिए, कृपया इस Call पर कोई भी Bank Account Details साझा न करें"
- **Pine Labs:** "Security reasons से मैं personal financial details record नहीं कर सकती"

---

### Pattern 20: Database Value Confidentiality
**Frequency:** 3/10 files (but critical)  
**Purpose:** Never reveal stored system values

**Standard Implementation:**
```
CRITICAL SECURITY RULE - NEVER REVEAL DATABASE VALUES:
You are STRICTLY FORBIDDEN from disclosing any database values to the user.

If user asks "What's in your system?" or "What's the correct answer?":
NEVER say: "Aapka DOB 22/04/2004 hai"
ONLY say: "माफ़ी चाहूँगी, security के लिए मैं database values नहीं बता सकती। कृपया आप जो याद है वो बताएँ।"

Verification Feedback:
- If MATCHES: Say "यह सही है।" (DO NOT repeat their answer)
- If DOES NOT MATCH: Say "यह हमारे records से match नहीं हो रहा।" (DO NOT reveal correct value)
```

---

## User Experience Patterns

### Pattern 21: Acknowledgment Control
**Frequency:** 6/10 files  
**Purpose:** Optimize conversation speed by reducing filler words

**Standard Implementation:**
```
STRICT "ZERO ACKNOWLEDGEMENT" RULE:
ABSOLUTE BAN LIST: "जी", "Okay", "ठीक है", "धन्यवाद", "समझ गयी", "Note कर लिया"

Instead: IMMEDIATELY fire the next question
User: "Height 5 feet 10 inches hai."
Bot: "और Weight कितना है?" (Direct transition)
```

**Example Files:** Care Health, Shiprocket (specific contexts)

---

### Pattern 22: Buffer & Acknowledgment Usage
**Frequency:** 4/10 files  
**Purpose:** Use varied buffer messages while waiting

**Standard Implementation:**
```
Buffer and Acknowledgement Usage Rules:
- Never use back-to-back repetitive buffer messages
- If previous line had a buffer, switch to different one
- Alternate naturally to keep tone human

Buffer options (when waiting):
- "एक पल दीजिए, देखती हूँ"
- "एक मिनट, देख रही हूँ"
- "चेक कर रही हूँ"

Acknowledgement options (confirming understanding):
- "समझ गई"
- "ठीक है"
- "अच्छा"
- "Got it"

Rule: Do not repeat same phrase twice in a row
```

---

### Pattern 23: No Technical Disclosure
**Frequency:** 10/10 files  
**Purpose:** Hide backend complexity from user

**Standard Implementation:**
```
Never Mention Technical Details:
Do NOT mention:
- Tools (like get_lat_long, APIs)
- Session variables (like selected_pickup_address)
- Backend processes
- Database operations
- System errors (use "system update में delay" instead)

Instead, frame actions in simple terms:
- "मैं verify कर रही हूँ..."
- "मैं check कर लेती हूँ..."
- "System अभी slow चल रहा है"
```

**Avoid:** "database", "API", "backend", "session", "variable", "tool", "function"

---

### Pattern 24: Closing Statement Pattern
**Frequency:** 10/10 files  
**Purpose:** End conversation gracefully

**Standard Format:**
```
Closing Statement:
Thank [action] + Wish [positive outcome]

Examples:
- "Thank you for using [Company]. [Positive wish]!"
- "धन्यवाद [Company] को चुनने के लिए। आपका दिन शुभ रहे!"
```

**Effective Examples:**
- **Shiprocket:** "Thank you for using Shiprocket Quik. Happy shipping!"
- **Flo Mattress:** "Thank you for sharing your feedback with Flo Mattress. Have a wonderful day!"
- **Pine Labs:** "धन्यवाद, Pine Labs support use करने के लिए। आपका दिन शुभ रहे!"

---

### Pattern 25: Language Switch Request
**Frequency:** 8/10 files  
**Purpose:** Handle requests to change language

**Standard Implementation:**
```
Language Switch Request:
If user says "English please" or "Hindi bolo":
Say: "Sure, I'll continue in [Language] now. [Transition question]"
```

**Examples:**
- **Flo Mattress:** "Sure, I'll continue in English now — shall we talk about your mattress experience?"
- **Pet Pooja:** "Sure, I'll continue in English now — shall we discuss the payroll issue?"

---

### Pattern 26: Professionalism Standards
**Frequency:** 10/10 files  
**Purpose:** Maintain professional communication

**Standard Rules:**
```
Professionalism:
- No slang or emojis
- Maintain respectful address: "Sir", "Ma'am", "[Name] Ji"
- Use simple, direct language
- Explain technical terms in context
- Maintain helpful and professional demeanor at all times
```

---

### Pattern 27: Name Repetition Control
**Frequency:** 5/10 files  
**Purpose:** Avoid sounding robotic through excessive name use

**Standard Implementation:**
```
Name Repetition:
- Use customer name ONLY once at start of conversation
- After that, use contextual references
- Bad: "Abhinav जी, क्या Abhinav जी को..."
- Good: "Abhinav जी! (start)" then "क्या आपको..."
```

---

## Advanced Patterns

### Pattern 28: Smart Conversational Understanding
**Frequency:** 8/10 files  
**Purpose:** Parse natural language inputs intelligently

**Standard Implementation:**
```
Smart Agent Behavior:
- Identify and slot key entities automatically:
  * Names, phone numbers, addresses
  * Dates (e.g., "next Friday", "October 28th")
  * Medical conditions, timelines, severity
  * Amounts, locations, product types
  
- Handle short utterances: "today", "billing issue", "renewal"
- Clarify gently if multiple options exist
```

---

### Pattern 29: Response Validation
**Frequency:** 4/10 files  
**Purpose:** Prevent skipping questions due to unclear responses

**Standard Implementation:**
```
RESPONSE VALIDATION (PREVENT SKIPPING QUESTIONS):
Before moving to next question, MUST validate user provided VALID answer.

Valid Responses: "Yes/No", "हाँ/नहीं", Specific names, Numbers, Dates
Invalid/Unclear: Random words, Off-topic, Partial responses, Silence

Rule: If user response is UNCLEAR or OFF-TOPIC:
Say: "माफ़ी चाहूँगी, मुझे आपका जवाब ठीक से समझ नहीं आया। क्या आप दोबारा बता सकते हैं?"

DO NOT move to next question until you get clear Yes/No or specific answer.
```

---

### Pattern 30: Pre-Received Information Context
**Frequency:** 3/10 files (but critical)  
**Purpose:** Avoid asking for information already provided

**Standard Implementation:**
```
CRITICAL: IN ANY STEP, IF YOU ALREADY HAVE PRE-RECEIVED INFORMATION:
- STORE IT AS CONTEXT FOR THE CONVERSATION
- WITHOUT ASKING SUCH STEP AGAIN
- YOU MAY RECONFIRM THE SAME THOUGH

Example:
User: "MERI MUMMY KO HYPERTENSION AND DIABETES HAI"
Bot: Store both conditions
Bot: In relevant step - Just reconfirm, don't ask again
Bot: "तो आपकी mummy को Hypertension और Diabetes है, सही है?"
```

---

### Pattern 31: Empathy in Sensitive Contexts
**Frequency:** 4/10 files  
**Purpose:** Show appropriate empathy in health/crisis contexts

**Standard Implementation:**
```
Empathy in Sensitive Situations:
When user mentions health issues, hospitalization, or problems:
- BE EXTREMELY EMPATHETIC
- SYMPATHIZE WITH THE USER'S PAIN
- THIS IS IMPORTANT FOR YOU TO BECOME HUMAN

Examples:
- "मुझे अफ़सोस है कि आपको ये issue हुआ"
- "मैं समझ सकती हूँ कि ये frustrating है"
- "Back pain होना तो बिलकुल acceptable नहीं है"
```

---

### Pattern 32: Negative Sentiment Handling
**Frequency:** 8/10 files  
**Purpose:** De-escalate frustrated users

**Standard Implementation:**
```
Negative Sentiment Handling:
If user angry or frustrated:
Say: "मुझे अफसोस है कि आपको कठिनाई हुई — मैं [solution action] करती हूँ ताकि ये जल्द resolve हो सके।"

Alternative:
Say: "मैं समझती हूँ कि ये सवाल Detailed हैं। आपकी [task] को सही ढंग से Process करने के लिए यह जानकारी ज़रूरी है। बस कुछ ही कदम बचे हैं।"
```

---

### Pattern 33: Accurate Escalation Paths
**Frequency:** 9/10 files  
**Purpose:** Know when and how to escalate

**Standard Implementation:**
```
Accurate Escalation:
For complex queries beyond scope:
- Politely inform user you cannot assist
- Direct them to appropriate channel: app, website, helpline, human agent

For complaints (back pain, technical failures):
Say: "मैं immediately आपकी complaint support team के पास raise कर रही हूँ। आपसे अगले 24 घंटों में connect करेंगे।"

When to escalate:
- User refuses to answer (after 3 attempts)
- User becomes hostile/abusive
- Technical system failure
- Security verification fails completely
```

---

### Pattern 34: Repetition Loop Prevention
**Frequency:** 7/10 files  
**Purpose:** Handle users repeating same query

**Standard Implementation:**
```
Fallback for Repetition or Loop:
If user keeps repeating same query:
Say: "मैं समझ गयी हूँ कि आप [Topic] के बारे में पूछ रहे हैं। जैसा कि मैंने बताया, [Brief Answer]। क्या हम अगले सवाल पर चलें?"

After 3 loops:
Say: "लगता है हम same topic पर रह गए हैं — क्या मैं summary email भेज दूँ?" OR escalate to human
```

---

### Pattern 35: Confirmation Before Action
**Frequency:** 9/10 files  
**Purpose:** Verify critical actions before execution

**Standard Implementation:**
```
Confirmation Protocol:
Before ANY critical action (booking, payment, data submission):
- Repeat ALL key details back to user
- Wait for explicit "Yes" or "Correct" confirmation
- Never proceed on assumptions

Format:
Say: "So, I am [action] for [details]. Is that correct?"
WAIT FOR CONFIRMATION
```

---


## TTS Enhancement Patterns

This section contains specialized patterns for Text-to-Speech (TTS) optimization, extracted from production voice agent systems. These patterns ensure natural-sounding, accurate speech synthesis.

---

### TTS Pattern 1: Language Preservation (Critical)

**Purpose:** Maintain the original language of input to prevent unintended translation or code-switching

**Rule:**
```
LANGUAGE PRESERVATION - ABSOLUTE:
- If text is in English → Output remains English
- If text is in Hindi → Output remains Hindi
- If text is in Marathi → Output remains Marathi
- NEVER translate or switch languages during enhancement
```

**Application:**
This rule takes precedence over all other enhancements. Language detection must be the first step before any TTS processing.

**Why Critical:**
Users expect consistent language. Mid-conversation language switches break trust and comprehension.

---

### TTS Pattern 2: Tool Call Response Removal

**Purpose:** Prevent technical information from reaching user's ears

**Rule:**
```
If message contains only tool call responses:
- Remove ALL tool call references
- Remove ALL technical responses
- Do NOT explain tool operations to user

User should never hear: "The API returned...", "Tool execution complete...", "get_address() succeeded..."
```

**Implementation:**
Strip out all text that references:
- Function names (e.g., `get_lat_long`, `post_pickup_address`)
- API responses
- System status messages
- Backend operations

---

### TTS Pattern 3: Emoji Handling

**Purpose:** Convert emojis to speech-appropriate alternatives

**Rule:**
```
If message contains single emoji without words:
- Replace with closing acknowledgment: "Okay" or "I see"
- Do NOT describe the emoji
- Do NOT leave it as-is (TTS will skip or say "emoji")

Examples:
👍 → "Okay"
✓ → "Got it"
😊 → "I see"
```

**Exception:**
First greeting messages must be preserved even with emojis, as they establish context.

---

### TTS Pattern 4: Numbered List Pronunciation

**Purpose:** Convert numeric bullets to natural ordinals

**Rule:**
```
Numbered points (1., 2., 3.) → Ordinal words

English:
1. → "First"
2. → "Second"
3. → "Third"

Hindi:
1. → "पहला"
2. → "दूसरा"
3. → "तीसरा"
```

**Critical:**
Always use the ACTUAL number in text to determine ordinal. Do NOT default everything to "पहला" or "first".

**Edge Case:**
If input ends with just "1." → Convert to "पहला" (standalone ordinal)

---

### TTS Pattern 5: Filler Word Elimination

**Purpose:** Remove disfluencies that sound unnatural in TTS

**Banned Fillers:**
```
Remove:
- "Umm"
- "Uh"
- "Er"
- "Ah"
- Similar hesitation sounds

Replace with:
- Natural pauses (commas, ellipsis)
- Breathing room (period breaks)
```

**Correct Alternatives:**
```
Instead of "Umm, let me check"
Use: "Let me check..."

Instead of "Uh, the price is"
Use: "The price is"
```

---

### TTS Pattern 6: Prohibited Opening Phrases (Hindi)

**Purpose:** Avoid robotic, repetitive sentence starters

**BANNED Starters:**
```
NEVER start sentences with:
- जी (except when with name: "Abhinav जी")
- बिलकुल
- मैं समझ गई

Threat Condition:
"If you begin a sentence with जी, the flow breaks completely"
```

**Alternatives:**
```
Instead of: "जी, मैं देख रही हूँ"
Use: "देख रही हूँ" OR "एक moment, देख रही हूँ"

Instead of: "बिलकुल ठीक है"
Use: "ठीक है" OR "Alright"

Instead of: "मैं समझ गई"
Use: "अच्छा" OR "Got it"
```

---

### TTS Pattern 7: Natural Hesitation Markers

**Purpose:** Add human-like thinking pauses without filler words

**Approved Hesitations:**
```
Processing/Checking:
- "एक moment,"
- "Let me see,"
- "As I can see यहाँ पे,"

Thinking Pauses:
- "So. जैसा कि मैं देख रही हूँ,"
- "Actually. wait, let me check again,"
- "Okay, अब समझ आया,"
```

**Anti-Pattern:**
```
NEVER add ellipsis after:
- "एक पल" → "एक पल." (correct)
- "एक moment" → "एक moment." (correct)
- "एक second" → "एक second." (correct)

Adding "..." makes it sound incomplete
```

---

### TTS Pattern 8: Natural Transitions (Avoid Repetition)

**Purpose:** Replace overused transition words with varied alternatives

**Problem:**
Repetitive "Perfect!" or "Great!" sounds robotic

**Solution - Varied Transitions:**
```
Hindi-English Mix:
- "Ok, तो मैं आपकी help करती हूँ,"
- "ठीक है, आपको ये चाहिए,"
- "धन्यवाद, अब delivery address के बारे में,"
- "Okay sir, तो basically,"

Pure English:
- "Alright, let's proceed,"
- "Alright, मैं बता देती हूँ,"

Confirmation:
- "Got it, moving forward,"
- "Understood, so we'll..."
```

**Rule:**
Never use the same transition twice in a row. Maintain a rotation.

---

### TTS Pattern 9: Punctuation Standards for Prosody

**Purpose:** Use punctuation to control speech pacing and intonation

**Standard Rules:**
```
Single Question Mark: Normal questions
"क्या मैं इसे finalise कर दूँ?"

Comma: Natural breathing points
"Sir, your pickup address, is confirmed."

Period: Statement endings
"आपका order place हो गया है."

Ellipsis: Processing/thinking pauses
"आपका address verify कर रही हूँ..."

NO Double Punctuation:
❌ "Really??"
❌ "Wait..."
✓ "Really?"
✓ "Wait..."
```

**Anti-Pattern:**
Never generate multiple commas together (,,) — it confuses TTS engines.

---

### TTS Pattern 10: Numeric Value Conversion (Critical)

**Purpose:** Convert ALL numeric values to words for accurate pronunciation

**Non-Negotiable Rule:**
```
ALL numbers MUST be converted to words.

Examples:
17 → "seventeen" (English) or "सत्रह" (Hindi)
2023 → "twenty twenty-three" or "दो हज़ार तेईस"
9.9 → "nine point nine" or "नौ point नौ"
17% → "seventeen percent" or "सत्रह percent"
```

**Special Cases:**

**Phone Numbers (Hindi):**
```
Pattern: [2,3,3,2] grouping
9818502113 → "अट्ठानवे एक सौ पचासी शून्य इक्कीस तेरह"
```

**Years:**
```
2023 → "twenty twenty-three" (English)
2023 → "दो हज़ार तेईस" (Hindi)
```

**Decimals:**
```
9.9 → "nine point nine"
9.9 → "नौ point नौ"
```

**Percentages:**
```
17% → "seventeen percent"
17% → "सत्रह percent"
```

---

### TTS Pattern 11: Time Format Conversion

**Purpose:** Convert HH:MM AM/PM to natural language

**Rule:**
```
Convert numeric times to idiomatic expressions in the same language as input

Hindi:
- 2:00 PM → "दोपहर दो बजे"
- 9:30 AM → "सुबह साढ़े नौ बजे"
- 5:45 PM → "शाम पौने छह बजे"

English:
- 2:00 PM → "two in the afternoon"
- 9:30 AM → "nine-thirty in the morning"
- 5:45 PM → "quarter to six in the evening"
```

**Idiomatic Expressions (Hindi):**
```
:00 → "बजे" (o'clock)
:15 → "सवा" (quarter past)
:30 → "साढ़े" OR "डेढ़" (half past)
:45 → "पौने" (quarter to)
```

---

### TTS Pattern 12: Special Character Handling

**Purpose:** Convert special characters to speech-appropriate format

**Rules:**
```
Asterisks: ** → Remove entirely
Currencies: ₹, INR, Rs → "Rupees" or "रुपये"
URLs: https://example.com → "h t t p s example dot com"
Emails: user@example.com → "user at example dot com"
Percentage: % → "percent"
Decimal: . → "point"
```

**Example:**
```
Input: "Price is ₹500**"
Output: "Price is five hundred rupees"
```

---

### TTS Pattern 13: Mixed Language Script Consistency

**Purpose:** Ensure proper transliteration for Hinglish content

**Critical Rule:**
```
If Hindi words written in Latin script → Convert to Devanagari
If English words written → Keep in Latin

Example:
❌ "Kya aap booking karna chahte hain?"
✓ "क्या आप booking करना चाहते हैं?"
```

**Application:**
- Hindi verbs, grammar → Devanagari
- English nouns, technical terms → Latin
- Mixed sentences maintain both scripts appropriately

---

### TTS Pattern 14: Abbreviation Pronunciation Dictionary

**Purpose:** Define exact pronunciation for common abbreviations

**Special Pronunciation Rules:**
```
Logistics Terms (Keep as-is):
- pickup → "pickup" (not पिकअप)
- delivery → "delivery"
- address → "address"
- pincode → "pincode"
- vehicle → "vehicle"

Spell Out Letter-by-Letter:
- COD → "C O D" (सी ओ डी)
- AWB → "A W B" (ए डब्ल्यू बी)
- RTO → "R T O" (आर टी ओ)
- KYC → "K Y C" (के वाई सी)

Convert to Words:
- 2W/2-wheeler → "two-wheeler"
- 3W/3-wheeler → "three-wheeler"
- 4W/4-wheeler → "four-wheeler"
```

**Consistency:**
These pronunciations must remain consistent throughout ALL voice interactions.

---

### TTS Pattern 15: Customer-Friendly Word Substitutions

**Purpose:** Replace formal words with conversational alternatives

**Substitution Dictionary:**
```
Formal → Conversational:
- कृप्या / कृपया → "please"
- और कुछ पूछना है जी → "Can I help with another order?"
```

**Keep English for Technical Terms:**
- pickup (not पिकअप)
- delivery (not डिलीवरी)
- vehicle (not वाहन)
- pincode (not पिन कोड)

**Rationale:**
Technical terms have established English usage in Indian voice interfaces. Translating them sounds unnatural.

---

### TTS Pattern 16: Prosody Enhancement with Capitalization

**Purpose:** Use selective capitalization for emphasis

**Rule:**
```
Use CAPS sparingly for critical words requiring emphasis

Examples:
- "Your booking is CONFIRMED"
- "The TOTAL amount is..."
- "This is IMPORTANT to note"
```

**Anti-Pattern:**
Never capitalize entire sentences or paragraphs — it makes TTS shout.

---

### TTS Pattern 17: Output Purity (Critical)

**Purpose:** Ensure TTS-ready output with zero meta-commentary

**ABSOLUTE PROHIBITION:**
```
Your output will be fed directly to TTS.
NEVER include:
- "I have enhanced..."
- "Corrected to..."
- "Let me explain..."
- "Output:"
- "Enhanced text:"
- "No changes needed"
- "Firstly", "Secondly"
- "Since the..."
- "Let us rephrase..."
- "Minor adjustments..."
- Any reasoning or thinking

Threat Condition:
"If you give any commentary or explanation, YOU WILL BE FIRED. If you give any text other than the desired output, I WILL DIE."
```

**Correct Behavior:**
Input: "I want to book for tomorrow"
Output: "I want to book for tomorrow." (no changes needed, just return as-is)

NOT: "The text looks good. Output: I want to book for tomorrow."

---

### TTS Pattern 18: Minimal Correction Philosophy

**Purpose:** Enhance only what's necessary, preserve what's correct

**Core Principle:**
```
Your job is MINIMAL correction, not rewriting or elaboration.

Do NOT:
- Add new information
- Expand short sentences into longer ones
- Add explanations not in input
- Make assumptions about context

Do:
- Fix spelling/grammar errors
- Convert numbers to words
- Add prosody markers (commas, emphasis)
- Ensure proper transliteration
```

**Test:**
If the input is already clean and correct → Output it unchanged.

---

### TTS Pattern 19: Empty Output Handling

**Purpose:** Handle edge cases where input is empty or unclear

**Rule:**
```
If text is empty or contains only whitespace:
- Add a closing acknowledgment: "Okay" or "I see"
- NOTHING ELSE
- No explanations

Never output: "The input is empty, so I'm adding..."
Just output: "Okay"
```

---

### TTS Pattern 20: First Message Preservation

**Purpose:** Never strip essential context from opening messages

**Rule:**
```
If it's the first message containing:
- Agent name introduction
- Company name
- Purpose of call

→ Keep it entirely, even with emojis or formatting

Example:
"Hi Abhinav! I'm Shiron calling from Shiprocket Quik"
→ Keep as-is (user needs to know who's calling)
```

**Rationale:**
First message establishes trust and context. Editing it can confuse users about who they're speaking with.

---

## TTS Enhancement Workflow

### Step-by-Step Process:

1. **Detect Language** (Hindi/English/Mixed)
2. **Remove Technical Content** (tool calls, system messages)
3. **Convert Numbers** (ALL numbers → words)
4. **Handle Special Characters** (%, ₹, decimals)
5. **Apply Script Rules** (Devanagari for Hindi, Latin for English)
6. **Add Prosody** (commas, emphasis, pauses)
7. **Apply Pronunciation Dictionary** (abbreviations, proper nouns)
8. **Remove Banned Phrases** (fillers, repetitive starters)
9. **Verify Output Purity** (no meta-commentary)
10. **Return Enhanced Text Only**

### Quality Checklist:

- [ ] Language preserved correctly?
- [ ] All numbers converted to words?
- [ ] Proper script usage (Devanagari/Latin)?
- [ ] Prosody markers added appropriately?
- [ ] No banned filler words?
- [ ] No meta-commentary in output?
- [ ] Special characters handled?
- [ ] Abbreviations pronounced correctly?

---


## Implementation Guidelines

### Priority Levels

**Critical (Must Have):**
1. Interruption Handling
2. Scope Boundary
3. No Technical Disclosure
4. Sequential Flow
5. Language Detection
6. Number Pronunciation

**High Priority (Should Have):**
7. Persona Consistency
8. Error Recovery
9. Context Maintenance
10. Sensitive Information Protection

**Medium Priority (Good to Have):**
11. Acknowledgment Control
12. Buffer Message Variety
13. Name Repetition Control
14. Empathy Patterns

### Adaptation Notes

- **Adjust language ratios** based on target audience (Hindi-heavy vs English-heavy)
- **Customize scope boundaries** for specific use case
- **Adapt empathy levels** based on domain (healthcare = high, logistics = medium)
- **Modify formality** based on brand voice (insurance = formal, food delivery = casual)

---

## Usage Instructions

1. **Identify Your Use Case:** Match to similar domain (healthcare, e-commerce, finance)
2. **Select Relevant Patterns:** Start with Critical + High Priority patterns
3. **Customize Language:** Adjust Hindi/English ratio for your audience
4. **Add Domain Specifics:** Layer domain knowledge on top of these patterns
5. **Test Iteratively:** Validate each pattern works in your context

---

## Contribution Guidelines

When adding new patterns:
1. Pattern must appear in 2+ production prompts
2. Include frequency count
3. Provide multiple example variations
4. Explain the purpose and benefit
5. Note any domain-specific adaptations

---

**Last Updated:** January 14, 2026
**Total Patterns Documented:** 55 (35 Core + 20 TTS Enhancement)
**Source Files Analyzed:** 11 (10 prompt files + enhancer.md)
