# User Notifications Manager

A simple service that allows you to send notifications based on user preferences.

## Runing
### **1. Locally**
Start the service:
```bash
cd Managadr && npm run dev
```
The service will run on `http://localhost:8080`.

### **2. With Docker Compose**

#### Build the Docker Image:
```bash
docker-compose up  --build
```

### Testing
Iv'e used REST extension for vs code (app.http)

## Improvments
 - More tests. i added some integration tests but we should defently 
test each service. (A bit more work though)
- Better types
- Scaling might become an issue in production environments. For better scalability, we should decouple the queue system to handle higher workloads effectively.