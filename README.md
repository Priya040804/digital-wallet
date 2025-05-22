💳** Digital Wallet System**
A secure and feature-rich digital wallet application built with Node.js, Express, and MongoDB. This system enables users to manage multiple currencies, perform transactions, and includes fraud detection mechanisms to ensure the integrity of operations.


🚀 **Features**
User Authentication & Authorization: Secure login system with JWT-based authentication and role-based access control.

Multi-Currency Wallet: Manage balances across various currencies with ease.

Transaction Operations:

Deposit: Add funds to your wallet.

Withdraw: Remove funds from your wallet.

Transfer: Send funds to other users within the system.

Transaction History: View detailed logs of all your transactions.

Fraud Detection Middleware:

Alerts on high-frequency transactions within a short time frame.

Detects sudden large withdrawals or transfers compared to historical averages.

Logs suspicious activities and sends email notifications for verification.

Admin Panel: Administrative functionalities for managing users and monitoring system activities.

🧱 **Tech Stack**
Backend: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Authentication: JWT (JSON Web Tokens)

Security: bcrypt for password hashing

Environment Management: dotenv

📁** Project Structure**
digital-wallet/
├── controllers/
│   ├── AdminController.js
│   ├── AuthController.js
│   └── UserController.js
├── middlewares/
│   ├── Authmiddleware.js
│   └── FraudMiddleware.js
├── models/
│   ├── FraudModel.js
│   └── UserModel.js
├── routes/
│   ├── AdminRoutes.js
│   ├── AuthRoute.js
│   └── userRoute.js
├── .env
├── index.js
├── package.json
└── README.md

🛠️ **Installation & Setup**
Clone the repository:
git clone https://github.com/Priya040804/digital-wallet.git
cd digital-wallet

Install dependencies:
npm install
Configure environment variables:

Create a .env file in the root directory and add the following:
env
TOKEN_KEY=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_string

Start the server:
npm start
The server will run on http://localhost:3000 by default.

🔐 **API Endpoints**
Authentication
POST /api/auth/register : Register a new user.

POST /api/auth/login : Authenticate user and retrieve JWT token.
GitHub

User Operations
POST /api/user/deposit : Deposit funds into wallet.

POST /api/user/withdraw : Withdraw funds from wallet.

POST /api/user/transfer : Transfer funds to another user.

GET /api/user/history : Retrieve transaction history.

Admin Operations
GET /api/admin/users : List all registered users.

GET /api/admin/fraud-logs : View all logged fraudulent activities.

🧪 **Fraud Detection Mechanism**
The system incorporates a middleware that monitors and detects potential fraudulent activities:

High-Frequency Transactions: Triggers an alert if more than 5 transactions of the same type occur within a minute.
Sudden Large Transactions: Flags transactions that are significantly larger than the user's average transaction amount or exceed a predefined threshold.
Logging & Notifications: Suspicious activities are logged into the FraudLog model, and email notifications are sent to users for verification.

📧** Email Notifications**
Currently, the system uses a mock function to simulate email notifications. For production use, integrate a real email service provider (e.g., SendGrid, Mailgun) in the sendEmail function located in FraudMiddleware.js.

👤** User Roles**
User: Can perform wallet operations such as deposit, withdraw, transfer, and view transaction history.

Admin: Has additional privileges to view all users and monitor fraudulent activities.

🤝** Contributing**
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
