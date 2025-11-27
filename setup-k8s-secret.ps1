# Setup script for creating Kubernetes image pull secret
# Usage: .\setup-k8s-secret.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "$GitHubUsername@users.noreply.github.com",
    
    [Parameter(Mandatory=$false)]
    [string]$Namespace = "default"
)

Write-Host "Creating Kubernetes secret for GitHub Container Registry..." -ForegroundColor Green

$secretName = "ghcr-secret"

# Check if secret already exists
$existingSecret = kubectl get secret $secretName -n $Namespace 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Secret already exists. Deleting..." -ForegroundColor Yellow
    kubectl delete secret $secretName -n $Namespace
}

# Create the secret
kubectl create secret docker-registry $secretName `
    --docker-server=ghcr.io `
    --docker-username=$GitHubUsername `
    --docker-password=$GitHubToken `
    --docker-email=$Email `
    --namespace=$Namespace

if ($LASTEXITCODE -eq 0) {
    Write-Host "Secret created successfully!" -ForegroundColor Green
    Write-Host "Secret name: $secretName" -ForegroundColor Cyan
    Write-Host "Namespace: $Namespace" -ForegroundColor Cyan
} else {
    Write-Host "Failed to create secret!" -ForegroundColor Red
    exit 1
}

