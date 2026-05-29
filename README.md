# Procam Load Planning Platform — UAT v1.0

AI-powered trailer type and count optimisation for Procam Logistics Pvt. Ltd.  
**Delivering Innovation & Commitment.™**

---

## Data persistence (read this first)

Earlier versions stored everything in the **browser** (localStorage), so data
vanished on cache-clear or a different device. It now runs as a small Node
server that saves all users and sessions in **SQLite on a Render persistent
disk** mounted at `/data`. The disk survives every redeploy and restart.

> **Do NOT use a free Render PostgreSQL database** — free Postgres on Render is
> **deleted 30 days after creation** (+14-day grace). That is the most common
> cause of "I lost my data". This app avoids that entirely by using a
> persistent disk instead, configured in `render.yaml`.

The web service plan must be **Starter or higher** — Render's *free* web plan
does **not** support persistent disks.

---

## Deploy to Render (Blueprint — recommended)

`render.yaml` already declares the web service **and** the persistent disk, so
Render configures everything automatically.

```bash
# 1. Push to GitHub
git add .
git commit -m "Add backend + SQLite persistence on a Render disk"
git push        # repo: https://github.com/Amiish14/Packing-List.git
```

```text
# 2. In Render dashboard
   New  →  Blueprint
   Connect the GitHub repo  →  Render reads render.yaml
   Review: service "procam-load-planner" (Node, Starter) + disk "procam-data" (1 GB at /data)
   Apply  →  first deploy runs

# 3. Done. Open the live URL Render gives you, e.g.
   https://procam-load-planner.onrender.com
```

### Manual setup (if you prefer not to use the Blueprint)

```text
New  →  Web Service  →  connect repo
   Runtime:        Node
   Build command:  (leave blank)
   Start command:  npm start
   Instance type:  Starter  (NOT Free — Free has no disk)
Advanced  →  Add Disk
   Name:       procam-data
   Mount path: /data
   Size:       1 GB
Advanced  →  Add Environment Variable
   DATA_DIR = /data
Create Web Service
```

> **Important:** never delete the disk. Redeploying, changing code, or
> restarting the service all keep the disk — and your data — intact.

---

## Run locally

```bash
npm start            # no dependencies to install
# open http://localhost:3000
# data is written to ./data/procam.db (git-ignored)
```

## Back up the database

The whole database is a single file. To take a backup from Render:

```text
Render dashboard  →  service  →  Shell tab
   cp /data/procam.db /data/procam-backup-$(date +%F).db
```

Or use the in-app **Admin → All Sessions → Export JSON** for a portable copy.

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
├── server.js           ← Node server: serves the app + persists data in SQLite
├── package.json        ← npm start script, Node >= 22 (zero dependencies)
├── index.html          ← complete front-end application
├── assets/
│   └── procam-logo.png ← Procam Logistics logo (transparent PNG)
├── render.yaml         ← Render web service + persistent disk config
├── .node-version       ← pins Node 22 on Render
├── README.md           ← this file
└── .gitignore          ← ignores node_modules, local data/, etc.
```

---

## Training Data Export

After 20 sessions:  
**Admin → All Sessions → Export JSON**  
Send the JSON to the development team for engine recalibration.
