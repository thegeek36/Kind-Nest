# Kind-Nest

Welcome to **Kind-Nest**! This project is a full-stack web application that consists of a **frontend** and a **backend** using **Django Rest Framework (DRF)** for the backend and a modern frontend framework.

## Project Structure

```plaintext
Kind-Nest/
│
├── frontend/        # Contains frontend code
│
└── backend/         # Contains backend (DRF) code
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

### Backend Setup (Django Rest Framework)

1. **Navigate to the backend folder:**

   ```bash
   cd backend
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

   - Create a `.env` file in the `backend` folder.
   - Add any necessary environment variables (e.g., `DJANGO_SECRET_KEY`, `DEBUG`, database settings).

5. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

6. **Start the backend server:**

   ```bash
   python manage.py runserver
   ```

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
- **Backend:** API will be available at `http://localhost:8000` (or another port if specified).

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

