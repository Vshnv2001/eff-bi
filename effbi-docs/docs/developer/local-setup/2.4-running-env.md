---
title: Running Environment
description: Running Environment
position: 4
---

## Running your local environment

You need to run the frontend and backend servers.

### Frontend

After you have installed the dependencies, run the following command to start the frontend server (make sure you are in the `frontend` directory):

```bash
npm run dev
```

### Backend

After you have installed the dependencies, run the development server by running the following command (make sure you are in the root `/` directory of the repository):

```
docker-compose up --build -d
```

This will not only start the backend server, but also the PostgreSQL database and apply the migrations.
