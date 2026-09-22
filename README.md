# Peptide Progress Hub

🚀 LOVABLE APP PROMPT

Build a professional web and mobile app called BioPeptideX Client Progress Tracker designed for tracking client results and protocols for peptides such as Tirzepatide, Retatrutide, and other performance peptides.

🎯 CORE PURPOSE
The app must allow:

Clients to track their weight, dose, progress, and side effects

Admin (me) to monitor all clients and optimize protocols

Provide education, guidance, and compliance support

Visually show objective vs expected vs actual progress

👤 USER ROLES

1. Client Dashboard

Secure login/authentication

Personal profile: Age, Height, Starting Weight, Goal Weight, Selected peptide protocol

Daily/weekly tracking: • Weight • Dose (mg + units visual) • Injection day tracking • Hunger levels (1–10) • Energy levels (1–10) • Side effects checklist • Notes

Timeline view: Past doses + auto-calculated next scheduled dose

Visual progress charts: Weight loss curve, Dose progression, Adherence tracking

2. Admin Dashboard (Operator View)

CRM-style table of all clients

Each client card shows: Protocol, Current dose, Compliance rate, Progress vs expected outcome

Alerts for: Missed doses, Severe side effects

Ability to: Adjust protocol, Add notes, Send recommendations

📄 1. CLIENT TRACKING STRUCTURE (CORE LOGIC)
Fields to track:
• Full Name • Age • Height • Starting Weight • Current Weight • Goal Weight
• Peptide Type (Tirzepatide, Retatrutide, etc.) • Start Date

Weekly Tracking:
• Week # • Dose (mg) • Units injected • Injection Day • Weight • Hunger Level (1–10) • Energy Level (1–10) • Side Effects (checkbox list) • Notes

Auto Calculations:
• Weight change per week • Total weight lost • % progress to goal • Next dose date • Estimated vial usage remaining

📄 2. PROTOCOL DATABASE (VERY IMPORTANT)
Tirzepatide
• Starting Dose: 5mg weekly
• Progression: Increase every 4 weeks → 7.5mg, 10mg, 12.5mg, 15mg
• Mechanism: GLP-1 + GIP receptor activation, slows gastric emptying, reduces appetite, improves insulin sensitivity

Retatrutide
• Starting Dose: 1–2mg weekly
• Mechanism: GLP-1 + GIP + Glucagon receptor activation, increases energy expenditure, enhances fat burning, strong appetite suppression

📄 3. WHAT HAPPENS AFTER INJECTION (TIMELINE ENGINE)
Post-Injection Effects Timeline
0–24 Hours → Appetite drops significantly, gastric emptying slows, mild nausea possible
1–3 Days → Reduced calorie intake, stable blood sugar, increased satiety
Week 1–2 → Noticeable weight drop (water + fat), cravings reduced
Week 3–6 → Fat loss accelerates, metabolism improves
Long-Term → Sustained fat loss, hormonal balance improves

📄 4. SIDE EFFECT MANAGEMENT SYSTEM
Interactive system with:
Nausea – Cause: Delayed gastric emptying → Fix: Smaller meals, avoid fatty foods, hydration
Fatigue – Cause: Caloric deficit → Fix: Electrolytes, sleep, slight calorie adjustment
Constipation – Cause: Slower digestion → Fix: Fiber, magnesium, hydration
Appetite Too Low – Cause: Strong receptor activation → Fix: Lower dose or intentional meal spacing

📄 5. EXPECTED VS REAL PROGRESS MODEL
Expected Weight Loss: 0.5kg – 1.5kg per week
Flags:
• Too Slow → Possible underdosing or poor adherence
• Too Fast → Risk of muscle loss or nutritional imbalance
Comparison Model: Goal Weight Timeline + Expected Curve + Actual Curve (user data)

📄 6. CLIENT DASHBOARD EXPERIENCE
Client sees: Current weight vs goal, Progress percentage, Next dose countdown, Weekly graph, Side effect insights, Personalized recommendations

📄 7. ADMIN CONTROL PANEL

View all clients, sortable by Progress / Compliance / Risk alerts

Alerts for missed dose or severe side effects

Full control to adjust protocols and send recommendations

💉 PROTOCOL TRACKING SYSTEM

Weekly dose schedule with auto-calculation of next dose date and remaining vial usage

Injection guidance with visual syringe UI showing exact units

🧠 EDUCATION MODULE
Dedicated section explaining the full post-injection timeline and expected vs real progress with visual overlays.

⚠️ SIDE EFFECT MANAGEMENT SYSTEM
Fully interactive with cause, severity scale, and step-by-step action plans.

📊 ANALYTICS & VISUALS
Clean, modern, medical-grade UI
Charts: Weight over time, Dose vs results, Compliance rate, Objective goal vs Expected trajectory vs Actual result

🔔 SMART FEATURES

Push notifications: “Next dose due”, “Log your weight today”, Weekly progress summary

Plateau detection alerts

Recommendations engine that suggests dose adjustments based on data

🎨 DESIGN STYLE
Premium, medical-grade aesthetic. Clean, futuristic but professional. Colors: white, black, blue accents. Full BioPeptideX branding. Mobile-first responsive design.

🔐 COMPLIANCE
Include clear disclaimer: “Educational and tracking purposes only. Not a substitute for medical advice.” Secure data storage with HIPAA-style privacy.

🔧 TECH FEATURES
Scalable backend, API-ready, Export PDF progress reports for clients.

💰 MONETIZATION (OPTIONAL)
Subscription model – Free basic tracking, premium insights upgrade.

🧩 FUTURE EXPANSION
Add more peptides, AI protocol recommendations, wearable device integration.

🔥 PRO TIP (THIS IS WHAT MAKES YOUR APP POWERFUL)
Build the app so it perfectly matches how I actually operate with clients. Also train Lovable on my real workflow by incorporating:
• Screenshots of my current client chats
• My sales explanations
• My protocol recommendations
(This trains Lovable to build something that matches how I actually operate, not some generic health app.)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://biopeptide-pulse.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a89fa247-b936-413d-949a-dc2ae0d1a94d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
