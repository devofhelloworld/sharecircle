# ShareCircle

**ShareCircle** is a community-driven platform designed to facilitate item sharing among neighbors. By borrowing instead of buying, users can save money, reduce waste, and build stronger local communities.

![ShareCircle Welcome](https://via.placeholder.com/800x400?text=ShareCircle+Banner)

---

## 🚀 Features

- **Resource Sharing**: Browse and search for items available for rent in your local area.
- **Secure Booking System**: Request, accept, or reject bookings with ease.
- **User Authentication**: Secure login via Email/Password and Google (Firebase + NextAuth).
- **Verified Profiles**: Build trust with community reviews and ratings.
- **Item Management**: List your own items, manage availability, and track earnings.
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) & [Firebase Auth](https://firebase.google.com/docs/auth)
- **State Management**: React Context & Hooks
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or Atlas cluster)
- **Firebase Project** (For Google Auth)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/sharecircle.git
    cd sharecircle
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the root directory and add the following environment variables:

    ```env
    # Database
    MONGODB_URI=mongodb://localhost:27017/sharecircle
    # Or for Atlas: MONGODB_ATLAS_URI=...

    # NextAuth
    AUTH_SECRET=your_super_secret_key_here # Generate with: openssl rand -base64 32
    AUTH_URL=http://localhost:3000

    # Firebase Client (for Frontend)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Firebase Admin (your-service-account.json content)
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project_id.iam.gserviceaccount.com
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```
sharecircle/
├── app/                # Next.js App Router pages and layouts
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages (login/register)
│   ├── bookings/       # Booking management pages
│   ├── browse/         # Item browsing pages
│   ├── items/          # Item details and listing pages
│   └── ...
├── components/         # Reusable React components
│   ├── ui/             # Generic UI components (buttons, inputs, etc.)
│   └── ...
├── lib/                # Utility functions and configurations
│   ├── db.ts           # Database connection
│   ├── firebase*.ts    # Firebase client/admin setup
│   └── ...
├── models/             # Mongoose database models (User, Item, Booking, Review)
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
