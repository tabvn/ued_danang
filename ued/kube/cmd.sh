CLUSTER_NAME="cluster-1"
ZONE="us-central1-c"
gcloud container clusters get-credentials $CLUSTER_NAME --zone "$ZONE"
#kubectl get pods
#kubectl apply -f deployment.yaml
