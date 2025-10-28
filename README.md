# 🚚 Carrydey (formerly Sendr)

**Carrydey** is a peer-to-peer (P2P) logistics platform that connects **senders** who need to deliver packages with **verified travelers** heading in the same direction.  
It enables affordable, fast, and community-driven delivery powered by **Appwrite**, **Next.js**, and **Paystack Escrow** for secure payments.

---

## 🌍 Overview

Carrydey bridges the gap between people who want to send packages quickly and travelers already on that route.  
Senders can post packages, travelers can accept requests, and payments are held securely in escrow until the delivery is confirmed.

---

## ⚙️ Features

### 🧍‍♂️ Sender
- Create and manage delivery packages.
- View requests from interested travelers.
- Accept delivery requests and make payments via escrow (Paystack).
- Track the package status — Pending → Awaiting Pickup → In Transit → Delivered → Completed.
- Release payment once delivery is confirmed.

### 🚗 Traveler
- Browse available packages based on location and destination.
- Send delivery requests with a short message.
- Get notified when the sender accepts.
- Confirm pickup and mark package as delivered.
- Receive payment automatically after sender confirmation.

### 💳 Payments (Escrow)
- Integrated **Paystack** escrow flow via **Appwrite Functions**.
- Funds are held securely until the delivery is completed and confirmed by the sender.
- Optional refund or dispute resolution flow.

### 🔐 Security
- User authentication via **Appwrite Account Service**.
- Traveler verification system (ID, phone number, and trust rating).
- Encrypted transactions and secure data storage.

---

## 🏗️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | Next.js 15 + Tailwind CSS |
| Backend | Appwrite (Database, Auth, Storage, Functions) |
| Payments | Paystack (Escrow) |
| Animations | Framer Motion |
| Deployment | Vercel |

---
