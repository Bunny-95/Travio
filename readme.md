# 🍽️ Easy Eats
### Smart Campus Food Ordering & Pickup Platform

> **Fast • Smart • Contactless** — Order from class. Pick up when it's ready. Skip the queue entirely.


---

## 🎥 Demo Video

> 📹 Watch the full product walkthrough → https://drive.google.com/file/d/1W49qaM83zZKU0Zhzj6AeXadYHdxH8fnf/view?usp=drive_link

---

## 📸 Screenshots

| Landing Page | Student Home | Menu Page |

|[Landing](https://drive.google.com/file/d/1WU6Pqj-5aQGIc7E0_keQGCVUHudC6818/view?usp=sharing) | 
[Home](https://drive.google.com/file/d/14dow4CyqiBLbkqIgXE_AkoRCRpo1by_g/view?usp=sharing) |
[Menu](https://drive.google.com/file/d/18qW8iabTKoRXo52qWD8g_LZN-q_F1PFS/view?usp=sharing) |

| Cart | Payment | Order Tracking |

|[Cart](https://drive.google.com/file/d/1t5ZC76coNq8UpbP9LMB8dvhvwJ6c7wsb/view?usp=sharing) |
[Payment](https://drive.google.com/file/d/1tDRRf5MOSKURND0cXAapi6UzXYZ1ZBxa/view?usp=sharing) | 
[Tracking](https://drive.google.com/file/d/1J9H-LocNaHhP0WO0sJAyfbMbcoWn_o0S/view?usp=sharing) |

| Kitchen Login | Kitchen Dashboard |

|[Kitchen Login](https://drive.google.com/file/d/1z8ea49xXhQi7sEkzKyIm2gxw-CqG5EM2/view?usp=sharing) | 
[Dashboard](https://drive.google.com/file/d/1KZPJeUlVT8JyX3kBn3LXGSydhoC7_xpf/view?usp=sharing) |

---

## 🚀 The Problem

Every college student knows this story:

- 🕙 Break starts at 10:30. You rush to the mess.
- 🧍 20 people already in line ahead of you.
- ⏳ You wait 15 minutes. Break is already half over.
- 🍱 Food arrives cold. You eat standing up.
- 😤 Repeat tomorrow.

On the kitchen side — zero orders before the break, then 200 students all arriving at once. Chaos, cold food, unhappy everyone.

**Easy Eats fixes both sides of this problem.**

---

## 💡 The Solution

Easy Eats is a full-stack campus food ordering platform. Students browse stalls, order food, pay digitally, and track their order live — all before they even leave the classroom. The kitchen gets orders in advance, prepares ahead, and uses pickup codes to hand off orders in seconds.

**No queue. No cash. No confusion.**

---

## ✨ Key Features

### 👨‍🎓 For Students
| Feature | What it does |
|---|---|
| Browse stalls | See all campus food outlets with real-time open/closed status |
| Search & filter | Find food by name or category |
| Add to cart | Select items with quantity control |
| Digital payment | Pay via Razorpay — UPI, cards, wallets, net banking |
| Live order tracking | ETA countdown, real-time status: Placed → Accepted → Preparing → Ready |
| Pickup code | Unique 4-digit code per order — no name confusion at the counter |
| Order history | View all past orders |

### 🍳 For Kitchen / Stall Owners
| Feature | What it does |
|---|---|
| Dedicated dashboard | Separate kitchen login and operations view |
| Live order feed | Auto-refreshes every 4 seconds — no manual reload |
| One-click status update | Accept → Preparing → Ready → Collected |
| Revenue tracking | Today's orders, revenue, pending count at a glance |
| Pickup code display | Large-format code shown on each order card |

---

## 🛠️ Tech Stack

### Frontend
![React]
![Vite]
![TailwindCSS]
![React Router]
![Axios]

### Backend
![FastAPI]
![Python]
![PostgreSQL]
![SQLAlchemy]

### Payments & Real-time
![Razorpay]
![Socket.io]

### Deployment
![Vercel]
![Render]

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 🌍 Frontend (Student + Kitchen) | https://easy-eats-two.vercel.app |
| ⚙️ Backend API | https://easy-eats-822q.onrender.com |
| 📖 API Docs (Swagger) | https://easy-eats-822q.onrender.com/docs |

---

## 🗄️ Database Schema

```
users           → id, name, email, password_hash, role, phone
stalls          → id, owner_id, name, category, is_open, logo_url
menu_items      → id, stall_id, name, price, category, is_available
orders          → id, student_id, stall_id, status, total_amount, token_number, payment_id
order_items     → id, order_id, menu_item_id, quantity, price_at_order
notifications   → id, user_id, message, is_read, type
```

---

## 🚦 How It Works

```
Student                          Easy Eats                        Kitchen
   │                                 │                               │
   │── Browse stalls & menu ────────►│                               │
   │                                 │                               │
   │── Add to cart ─────────────────►│                               │
   │                                 │                               │
   │── Place order + Pay ───────────►│── New order notification ────►│
   │        (Razorpay)               │                               │
   │                                 │                               │── Accept order
   │◄── Order confirmed + Token ─────│◄── Status: Accepted ──────────│
   │                                 │                               │
   │   [Live ETA countdown]          │                               │── Mark Preparing
   │◄── Status: Preparing ───────────│◄── Status: Preparing ─────────│
   │                                 │                               │
   │◄── "Order Ready!" notification ─│◄── Status: Ready ─────────────│── Mark Ready
   │                                 │                               │
   │── Walk in, show Token ─────────►│──────────────────────────────►│── Collected ✓
```

---

## ⚡ Real-time Features

- **Student places order** → kitchen dashboard updates instantly (Socket.IO)
- **Kitchen changes status** → student's tracking page updates live
- **Kitchen marks Ready** → student gets a notification
- **Dashboard auto-refreshes** every 4 seconds — no page reload ever needed

---

## 💳 Payment Flow (Razorpay)

```
1. Student clicks "Place Order"
2. Backend creates Razorpay order → returns order_id
3. Frontend opens Razorpay checkout modal
4. Student pays (test card: 4111 1111 1111 1111)
5. Backend verifies payment signature (HMAC SHA256)
6. Order created in DB with status: paid
7. Kitchen notified via Socket.IO
```

> **Test Mode:** Use card `4111 1111 1111 1111`, any future date, any CVV

---

## 📂 Project Structure

```
Easy-Eats/
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── pages/              # Student and Kitchen pages
│   │   ├── components/         # Reusable UI components
│   │   ├── api/                # Axios API calls
│   │   └── context/            # Auth context
│   └── package.json
├── backend/                    # FastAPI Python server
│   ├── routes/                 # API route handlers
│   ├── models/                 # SQLAlchemy DB models
│   ├── schemas/                # Pydantic request/response schemas
│   ├── main.py                 # App entry point
│   └── requirements.txt
├── documents/                  # Project documentation
│   ├── product_statement.md
│   └── product_requirements_spec.md
├── weekly_reports/             # Weekly progress reports
│   └── week_01_2026-03-21.md
├── screenshots/                # App screenshots for README
└── README.md
```

---

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your environment variables
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local      # Add your API URL
npm run dev
```

### Environment Variables
```bash
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/easyeats
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_secret

# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
```

---

## 👥 Team

| Name | SRN | Role |
|------|-----|------|
| Ullas | R23EF288 | Customer research + interviews |
| Srujan L | R23EF263 | GitHub + Backend + Frontend |
| Thejas M G | R23EF283 | Presentation|
| Shreyas D | R23EF252 | Customer research + interviews |
| Shreyas B R | R23EF251 | Customer research + interviews |
| Shashank Ganapati Naik | R23EF245 | Google Form + Testing |

---


---

## 🧗 Challenges Faced

- **Understanding and implementing JWT authentication**
- **Designing efficient database schema**
- **Handling API errors and debugging**
- **Synchronizing frontend with backend APIs**

---

## 🧠 Key Learnings

- **Practical knowledge of FastAPI backend development**
- **Experience with authentication and security (JWT)**
- **Improved API design and testing skills**
- **Better teamwork and task coordination**

---

## 📄 License

This project was built for academic purposes as part of an AI Applications course project.

---

<div align="center">
  <strong>Easy Eats</strong> — Smart Campus Pickup Experience<br>
  Fast • Smart • Contactless
</div>