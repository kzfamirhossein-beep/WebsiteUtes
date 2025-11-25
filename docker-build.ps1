# Build and push script for Docker image (PowerShell)
# Usage: .\docker-build.ps1 [tag]

param(
    [string]$Tag = "latest"
)

$Registry = "ghcr.io"
$Username = "kzfamirhossein-beep"
$ImageName = "utes-website"
$FullImageName = "${Registry}/${Username}/${ImageName}:${Tag}"

Write-Host "Building Docker image: $FullImageName" -ForegroundColor Green

# Build the image
docker build -t $FullImageName .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Image built successfully!" -ForegroundColor Green
    
    $push = Read-Host "Do you want to push the image to GitHub Container Registry? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host "Pushing image to $FullImageName..." -ForegroundColor Yellow
        docker push $FullImageName
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Image pushed successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to push image. Make sure you're logged in to GitHub Container Registry." -ForegroundColor Red
            Write-Host "Login with: docker login ghcr.io -u YOUR_USERNAME" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Skipping push. Image is available locally as $FullImageName" -ForegroundColor Yellow
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

