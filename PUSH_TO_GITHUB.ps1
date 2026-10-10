# Push trysomenew redesign to GitHub
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "       TRY遍历 / TRYSOMENEW - PUSH TO GITHUB AUTOMATION" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All 75 redesigned files and Phase 3 tools are already committed!" -ForegroundColor Yellow
Write-Host "Remote Repository: https://github.com/SMRUTIRANJAN30/trysomenew.git" -ForegroundColor White
Write-Host "Branch: main" -ForegroundColor White
Write-Host ""

$gitExe = "C:\Users\smrut\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe"
$token = Read-Host "Enter your GitHub Personal Access Token (or press Enter to try default push)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Pushing with standard git credentials..." -ForegroundColor Yellow
    & $gitExe push origin main
} else {
    Write-Host "Pushing with provided token..." -ForegroundColor Yellow
    & $gitExe push "https://$($token)@github.com/SMRUTIRANJAN30/trysomenew.git" main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n================================================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Code pushed successfully to GitHub!" -ForegroundColor Green
    Write-Host "Netlify will now automatically build and deploy your updated website!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Push failed. Please check your GitHub token or network." -ForegroundColor Red
}

Read-Host "`nPress Enter to exit"
