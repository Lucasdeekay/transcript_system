# 🎓 Transcript Management System

This project is a web application designed to manage student information, courses, results, and generate academic transcripts. It consists of a Django backend API and a React frontend.

## 🚀 Features

### Backend (Django REST Framework)
* **Student Management:** CRUD operations for student records, including personal details (first name, last name, email) linked to Django's `User` model, matriculation number, department, and level.
* **Course Management:** CRUD operations for courses, including course code, title, and credit units.
* **Result Management:** CRUD operations for student results, linking students and courses with grades, semesters, and academic sessions.
* **Transcript Generation:** Ability to generate PDF transcripts for individual students.
* **User Authentication:** Basic authentication for admin access.

### Frontend (React)
* **Dashboard:** An administrative dashboard providing navigation to different management sections.
* **Student Management Page:** Interface to add, view, edit, and delete student records.
* **Course Management Page:** Interface to add, view, edit, and delete course records.
* **Result Management Page:** Interface to add, view, edit, and delete student results. Displays student matriculation numbers and course titles for clarity.
* **Transcript Generation Page:** Dedicated interface to search for students and generate their academic transcripts in PDF format.
* **Search Functionality:** Integrated search across various tables for easy data retrieval.
* **Notifications:** Toast notifications for user feedback on successful operations or errors.
* **Responsive Design:** Built with Tailwind CSS for a mobile-first and responsive user interface.

## 📁 Project Structure

```bash
transcript_system/
├── backend/
│   ├── pycache/
│   ├── results/
│   │   ├── migrations/
│   │   ├── init.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   ├── utils.py
│   │   ├── views.py
│   │   └── viewsets.py
│   ├── transcript_system/
│   │   ├── init.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── venv/                  # Python virtual environment
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Redirect.jsx
│   │   │   └── Sidebar.jsx
│   │   │── functions/
│   │   │   └── Auth.jsx
│   │   ├── pages/
│   │   │   ├── Courses.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Students.jsx
│   │   │   └── Transcripts.jsx
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── input.css
│   │   ├── logo.svg
│   │   ├── output.css
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── .gitignore
├── db.sqlite3
├── manage.py
└── requirements.txt
```

## 🛠️ Technologies Used

### Backend
* **Django:** Web framework
* **Django REST Framework:** For building RESTful APIs
* **Python:** Programming language

### Frontend
* **React:** JavaScript library for building user interfaces
* **Wouter:** A tiny routing library for React
* **Tailwind CSS:** A utility-first CSS framework for styling
* **JavaScript (ES6+):** Programming language

## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd transcript_system
```

### 2. Backend Setup (Django)
Navigate to the backend directory:

```bash
cd backend
```

Create and Activate Virtual Environment

```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Apply Migrations

```bash
python manage.py migrate
```

Create a Superuser (for Admin access)

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin user.

Run the Backend Server

```bash
python manage.py runserver
```

The backend API will be running at http://127.0.0.1:8000/.

3. Frontend Setup (React)
Open a new terminal and navigate to the frontend directory:

```bash
cd ../frontend
```

Install Dependencies

```bash
npm install
# or
yarn install
```

Run the Frontend Development Server

```bash
npm start
# or
yarn start
```

The React application will open in your browser at http://localhost:3000/.

## 🔑 Usage
* **Login:** Access the frontend at http://localhost:3000/ and log in using the superuser credentials you created.
* **Navigate:** Use the sidebar to navigate to different sections:
* **Manage Students:** Add, view, edit, and delete student records.
* **Manage Courses:** Add, view, edit, and delete course details.
* **Manage Results:** Assign grades to students for specific courses, semesters, and sessions.
* **Generate Transcripts:** Select a student and generate their academic transcript in PDF format.

## 🤝 Contributing
Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License
MIT