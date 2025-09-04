
# FleetLink - Logistics Vehicle Booking System



**FleetLink**, a platform to manage and book logistics vehicles for B2B clients.

The backend will:

* Manage the vehicle fleet.
* Check availability based on **capacity, route, and time**.
* Handle booking requests.

The frontend will:

* Allow administrators/users to **add vehicles**.
* **Search available vehicles** based on given criteria.
* **Initiate bookings** for selected vehicles.

**Reliability** and **accurate availability checking** remain paramount.


##  Objective

it is a full-stack application (**Node.js backend, React frontend, MongoDB database**) to:

1. **Backend**

   * Implement robust logic for managing vehicles.
   * Calculate availability considering existing bookings and estimated ride times.
   * Handle booking requests with **data integrity**.

2. **Frontend**

   * Add new vehicles to the fleet.
   * Search for available vehicles based on **capacity, route (pincodes), and desired start time**.
   * View search results with available vehicles and **estimated ride duration**.
   * Initiate bookings for selected vehicles.

3. **Testing**

   * Write **unit tests** for backend logic:

     * Availability checks.
     * Booking validation.

---

##  Tech Stack

* **Frontend:** ReactJS
* **Backend:** NodeJS
* **Database:** MongoDB
* **Testing:** Jest

---

## ⚙️ Prerequisites

* [Docker](https://docs.docker.com/get-docker/) installed
* [Docker Compose](https://docs.docker.com/compose/) installed

---

##  Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/theprince29/logistics-vehicle-booking-system.git
cd logistics-vehicle-booking-system
```

### 2. Environment Variables

Create a `.env` file inside the **backend** folder:

```env
PORT=5000
MONGODB_URI=mongodb://user:pass@mongodb:27017/logistics?authSource=admin
```

⚠️ The credentials (`user:pass`) should match those in `docker-compose.yml`.

---

### 3. Build & Run with Docker

```sh
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

Services started:

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000](http://localhost:5000)
* MongoDB → `localhost:27017`

---

### 4. Stopping Containers

```sh
docker-compose down
```

To also remove volumes (MongoDB data):

```sh
docker-compose down -v
```

---

## 🛠 Development

* **Backend**: Node.js + Express (API routes under `src/`)
* **Frontend**: Next.js (UI with Shadcn, Tailwind)
* **Database**: MongoDB with authentication

If you want hot reload during dev:

* Run `npm run dev` inside `backend` locally (instead of Docker)
* Or adjust `docker-compose.override.yml` with `volumes` + `nodemon`




##  Useful Commands

```sh
# View logs for a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Rebuild without cache
docker-compose build --no-cache
```

---

##  License

This project is licensed under the **ISC License** – feel free to use and modify.





