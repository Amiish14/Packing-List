# Procam Load Planning Platform — UAT v1.0

AI-powered trailer type and count optimisation for Procam Logistics Pvt. Ltd.  
**Delivering Innovation & Commitment.™**

---

## Quick Deploy to Render

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Procam Load Planning Platform UAT v1.0"
git remote add origin https://github.com/YOUR_USERNAME/procam-platform.git
git push -u origin main

# 2. Render → New → Static Site → connect repo
#    Publish directory: .  (dot = root)
#    Build command:     (leave blank)
#    Deploy
```

Live URL: `https://procam-load-planner.onrender.com`

---

## Default Credentials

| Username | Password | Role |
|---|---|---|
| `suranjan.aon` | `procam@123` | Admin |
| `nilesh.sinha` | `procam@456` | Admin |
| `planner1` | `procam@789` | Load Planner |
| `supervisor1` | `site@123` | Field Supervisor |

Admins can add more users from User Management in the sidebar.

---

## Features

| Feature | Details |
|---|---|
| Single cargo input | L × W × H × WT → trailer type instantly |
| Multi-item upload | Excel / CSV, any format, any language |
| HMT axle engine | 4-axle + 6-axle unit logic, valid combos only |
| Mechanical plan | Lot-wise, vehicle-by-vehicle, fill % bar |
| Hydraulic plan | Axle unit visual, recommended + alternative combo |
| Print / PDF | A4 ready, Procam header, signature blocks |
| Excel export | 4 sheets: Summary, Vehicle Plan, HYD Axle, Items |
| Expert feedback | Mark correct / wrong, training data capture |
| Session log | All sessions saved, searchable, exportable as JSON |
| User management | Admin adds / removes users |

---

## Brand

- **Red** `#BC1D2F` — primary accent (buttons, borders, headings)
- **Dark Red** `#8E1523` — hover states
- **Charcoal** `#414242` — sidebar, table headers
- **Grey** `#666666` — body copy
- **Off-White** `#F3F3F3` — page background
- **Font** Helvetica Neue / Helvetica / Arial

---

## File Structure

```
procam-deploy/
├── index.html          ← complete application (87 KB, self-contained)
├── assets/
│   └── procam-logo.png ← exact Procam Logistics logo (66 KB PNG)
├── render.yaml         ← Render static site config
├── README.md           ← this file
└── .gitignore
```

---

## Training Data Export

After 20 sessions:  
**Admin → All Sessions → Export JSON**  
Send the JSON to the development team for engine recalibration.
