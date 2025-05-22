# 💳 Digital Wallet System

A secure and feature-rich digital wallet application built with *Node.js, **Express, and **MongoDB*. This system enables users to manage multiple currencies, perform transactions, and includes fraud detection mechanisms to ensure the integrity of operations.

---

## 🚀 Features

- *User Authentication & Authorization*  
  Secure login system with JWT-based authentication and role-based access control.

- *Multi-Currency Wallet*  
  Manage balances across various currencies with ease.

- *Transaction Operations*
  - *Deposit*: Add funds to your wallet.
  - *Withdraw*: Remove funds from your wallet.
  - *Transfer*: Send funds to other users within the system.
  - *Transaction History*: View detailed logs of all your transactions.

- *Fraud Detection Middleware*
  - Alerts on high-frequency transactions within a short time frame.
  - Detects sudden large withdrawals or transfers compared to historical averages.
  - Logs suspicious activities and sends email notifications for verification.

- *Admin Panel*  
  Administrative functionalities for managing users and monitoring system activities.

---

## 🧱 Tech Stack

- *Backend*: Node.js, Express.js  
- *Database*: MongoDB with Mongoose ODM  
- *Authentication*: JWT (JSON Web Tokens)  
- *Security*: bcrypt for password hashing  
- *Environment Management*: dotenv  

---

## 🛠️ Installation & Setup

1. *Clone the repository*
   ```bash
   git clone https://github.com/Priya040804/digital-wallet.git
   cd digital-wallet
