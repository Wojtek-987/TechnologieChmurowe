# Aplikacja Mikroserwisowa „Todo App”

Prosty projekt mikroserwisowy składający się z następujących komponentów:

- **auth-service** – uwierzytelnianie JWT
- **task-service** – CRUD zadań (MongoDB)
- **stats-service** – podstawowe statystyki
- **frontend** – React + Vite
- **mongo** – baza danych MongoDB

---

## Struktura katalogów
├── auth-service

├── task-service

├── stats-service

├── todo-microfrontend

├── docker-compose.yml

└── k8s-manifests/

    ├── 00-namespace.yaml

    ├── … (manifesty k8s dla wszystkich serwisów)

    └── 18-metrics-server-fix.yaml

---

## Jak uruchomić (Docker Compose)

1. Otwórz terminal w katalogu projektu.
2. Zbuduj i uruchom wszystkie serwisy:
   ```powershell
   docker-compose up -d --build
3. Sprawdź status:
    ```powershell
    docker-compose ps
4. Frontend dostępny pod: http://localhost:5173

### Jak uruchomić (Kubernetes + Kind)
```powershell
docker-compose build
docker-compose up -d

kind create cluster --name todo-cluster --config kind-config.yaml
kubectl config use-context kind-todo-cluster

docker tag technologiechmurowe-auth-service:latest   wojtek987/auth-service:latest
docker tag technologiechmurowe-task-service:latest   wojtek987/task-service:latest
docker tag technologiechmurowe-stats-service:latest  wojtek987/stats-service:latest
docker tag technologiechmurowe-frontend:latest       wojtek987/frontend:latest

kind load docker-image wojtek987/auth-service:latest   --name todo-cluster
kind load docker-image wojtek987/task-service:latest   --name todo-cluster
kind load docker-image wojtek987/stats-service:latest  --name todo-cluster
kind load docker-image wojtek987/frontend:latest       --name todo-cluster

kubectl apply -n kube-system `
  -f 'https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml'

kubectl apply -f .\k8s-manifests\00-namespace.yaml

kubectl apply -n todo-app -f .\k8s-manifests\
```

### Inspekcja serwisów:
```powershell
kubectl get all        -n todo-app
kubectl top nodes
kubectl top pods       -n todo-app
```

### Uwaga
HPA skonfigurowany poprawnie, ale lokalny Metrics Server może nie raportować metryk z powodu certyfikatów w klastrze Kind/Docker Desktop.