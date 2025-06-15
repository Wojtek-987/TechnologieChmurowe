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

## Wymagania

- Docker Desktop
- (opcjonalnie) Kind lub inna instancja Kubernetes

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
cd .\k8s-manifests
kind create cluster --name todo-cluster --config kind-config.yaml
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
cd .\k8s-manifests
kubectl apply -f .

kubectl get all -n todo-app
```

### Uwaga
HPA skonfigurowany poprawnie, ale lokalny Metrics Server może nie raportować metryk z powodu certyfikatów w klastrze Kind/Docker Desktop.