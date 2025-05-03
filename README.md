# Kind-Nest

Welcome to **Kind-Nest**! This project is a full-stack web application that consists of a **frontend** and a **backend** using **Flask** for the backend and a modern frontend framework.

## Project Structure

```plaintext
Kind-Nest/
│
├── frontend/        # Contains frontend code
│
└── backend/         # Contains backend (Flask) code
    └── app/          # Flask application
```

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- **Python** (>= 3.8)
- **Node.js** (>= 14.x)
- **npm** or **yarn**
- **pip** and **virtualenv** (for Python)

---

### Backend Setup (Flask)

1. **Navigate to the backend folder:**

   ```bash
   cd backend/app
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # For macOS and Linux
   venv\Scripts\activate     # For Windows
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   - Create a `.env` file in the `backend/app` folder.
   - Add any necessary environment variables (e.g., `FLASK_SECRET_KEY`, `DEBUG`, database settings).

5. **Run database migrations (if applicable):**

   Flask doesn't have a built-in migration tool like Django, so make sure you've created any necessary database tables manually or using an ORM like SQLAlchemy.

6. **Start the backend server:**

   ```bash
   flask run
   ```

   By default, Flask will start the server on `http://localhost:5000`.

---

### Frontend Setup

1. **Navigate to the frontend folder:**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm start
   # or
   yarn start
   ```

---

## Usage

- **Frontend:** Open your browser and navigate to `http://localhost:3000` (or the default port your frontend uses).
- **Backend:** API will be available at `http://localhost:5000` (or another port if specified).

---

## Deployment

- **Frontend:** Use a service like **Vercel** or **Netlify**.
- **Backend:** You can use platforms like **Heroku**, **Render**, or **DigitalOcean**.

---

## Contributing

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes.
4. Push the branch.
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
