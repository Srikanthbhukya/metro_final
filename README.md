# 🚇 Metro Route Finder

A full-stack Delhi Metro route planning application that helps users find the fastest route between stations using **Dijkstra's Shortest Path Algorithm**.

🌐 **Live Demo:** https://metro-final-umber.vercel.app/

🔗 **Backend API:** https://metro-route-finder-api.vercel.app/

## 📌 Overview

Metro Route Finder is a web application designed to simplify metro journey planning. Users can select their starting station and destination to discover the fastest available route, estimated travel time, fare, and interchange stations.

The application uses a graph-based representation of the Delhi Metro network and Dijkstra's algorithm to calculate optimal routes.

## ✨ Features

- **Metro Selection:** Select the available metro network.
- **Station Autocomplete:** Quickly search for stations.
- **Shortest Path:** Find optimal routes using Dijkstra's algorithm.
- **Interchange Detection:** Identify stations where passengers need to change lines.
- **Travel Time Estimation:** Calculate estimated journey duration.
- **Fare Estimation:** Estimate ticket fares based on route length.
- **User Authentication:** Register and log in.
- **Route History:** Store and revisit previously calculated journeys.

## 🛠️ Tech Stack

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- SWR

### Backend
- Node.js
- Express.js
- JavaScript
- Prisma ORM
- REST APIs

### Database
- PostgreSQL
- Neon PostgreSQL

### Algorithms & Data Structures
- Dijkstra's Shortest Path Algorithm
- Graphs and Adjacency Lists
- Trie for station autocomplete
- Priority Queue
- LRU Caching

### Deployment
- Vercel
- GitHub

## 🏗️ Architecture

```text
                 User
                  |
                  v
          Next.js Frontend
                  |
                  | REST API
                  v
          Express.js Backend
                  |
          +-------+-------+
          |       |       |
          v       v       v
       Routing  Auth   Station
       Engine   APIs    APIs
          |
          v
      Graph Engine
          |
          v
     Prisma ORM
          |
          v
    Neon PostgreSQL
```

## ⚙️ How It Works

### 1. Graph Representation

The metro network is represented as a graph:

- Stations represent vertices.
- Connections between stations represent edges.
- Travel time represents edge weight.
- Metro lines identify the route associated with each connection.

### 2. Shortest Path Calculation

Dijkstra's algorithm calculates the minimum-travel-time route between two stations.

The algorithm uses a priority queue to process stations with the smallest accumulated travel time.

### 3. Interchange Detection

After calculating the route, the application compares the metro lines associated with consecutive connections to identify interchange stations.

### 4. Fare Estimation

The application estimates fares using the number of station hops and predefined fare bands.

**Note:** Fare and travel-time values are estimates, not live official metro information.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/metros` | Retrieve available metro systems |
| GET | `/api/v1/metros/:metroId/stations?prefix=` | Search stations |
| POST | `/api/v1/metros/:metroId/route` | Calculate shortest route |
| POST | `/api/v1/auth/register` | Register a user |
| POST | `/api/v1/auth/login` | Authenticate a user |

### Example Route Request

**POST**
```text
/api/v1/metros/1/route
```

Request body:

```json
{
  "startStation": "Rithala",
  "endStation": "Rohini West"
}
```

Example response:

```json
{
  "finalPath": [
    {
      "station": "Rithala",
      "color1": null,
      "color2": "ED1C24Color"
    },
    {
      "station": "Rohini West",
      "color1": "ED1C24Color",
      "color2": null
    }
  ],
  "totalTime": 3,
  "interChanges": [],
  "estimatedFare": 11
}
```

## 🚀 Local Installation

### Prerequisites

- Node.js
- npm
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/Srikanthbhukya/metro_final.git
cd metro_final
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8000
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
JWT_SECRET=your_jwt_secret
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply database migrations

```bash
npx prisma migrate deploy
```

### 6. Import metro data

Ensure the required GTFS CSV files are available in the directory expected by `prisma/seed.js`, then run:

```bash
npx prisma db seed
```

### 7. Start the backend

```bash
npm start
```

Backend runs at:

```text
http://localhost:8000
```

### 8. Start the frontend

Open another terminal:

```bash
cd frontend/frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## 📊 Dataset

The project uses Delhi Metro GTFS data containing:

- Stations
- Metro routes
- Trips
- Stop sequences
- Travel-time information

The imported dataset is a November 2025 snapshot and may not reflect current metro operations.

## 🔮 Future Improvements

- Integrate real-time metro information.
- Improve fare estimation using official distance-based data.
- Add live train schedules.
- Support additional metro networks.
- Improve route optimization for complex interchanges.
- Add interactive metro network visualization.

## 👨‍💻 Author

**Bhukya Srikanth**

B.Tech, Engineering Physics — IIT Guwahati

GitHub: https://github.com/Srikanthbhukya

---

⭐ If you find this project interesting, consider giving the repository a star!
