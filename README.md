# Bilandog-Ecommerce-V2

Remastered version of Bilandog website I made from 2021.

Created for the purpose of practicing Django Stack:

- Frontend: ReactJS with NextJS framework and Tailwind CSS
- Backend: Django
- Database: PostgreSQL
- Runtime: NodeJS

> 📝 **Credits**:  
> Cart and notification modals were inspired by the work of [IEMDomain04](https://github.com/IEMDomain04/).

## Getting Started

### 1. Database Setup

1. In **PostgreSQL**, create a database named `bilandog_db`.
2. Update `/backend/bilandog/settings.py` with your local PostgreSQL credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'bilandog_db',
        'USER': 'your_postgres_username',
        'PASSWORD': 'your_postgres_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 2. Install Dependencies

- In the **project root**:

```bash
npm install
```

- In the **`/backend`** folder:

```bash
pip install -r requirements.txt
```

### 3. Apply Migrations

- In the `/backend` folder:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Run the Development Servers

- In the **project root**:

```bash
npm run dev
```

- In the **`/backend`** folder:

```bash
python manage.py runserver
```

### 5. Open the Website

Go to [http://localhost:3000](http://localhost:3000)

![alt text](public/images/preview.png)
