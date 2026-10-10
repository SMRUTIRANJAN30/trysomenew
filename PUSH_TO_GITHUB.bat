@echo off
title Push trysomenew Redesign to GitHub
color 0A
echo ================================================================
echo        TRY遍历 / TRYSOMENEW - PUSH TO GITHUB AUTOMATION
echo ================================================================
echo.
echo All 75 redesigned files and Phase 3 tools are already committed!
echo.
echo Remote Repository: https://github.com/SMRUTIRANJAN30/trysomenew.git
echo Branch:            main
echo.
echo ----------------------------------------------------------------
echo If you don't have a token yet, you can create one directly here:
echo   https://github.com/settings/tokens/new
echo.
echo Instructions:
echo   1. Note: trysomenew
echo   2. Check the [x] repo checkbox
echo   3. Click "Generate token" at bottom
echo   4. Copy the token starting with ghp_...
echo ----------------------------------------------------------------
echo.
set /p GHTOKEN="Enter or Paste your GitHub Token (ghp_...): "

set GIT_EXE="C:\Users\smrut\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe"

if "%GHTOKEN%"=="" (
    echo.
    echo No token entered. Trying push with standard credentials...
    %GIT_EXE% push origin main
) else (
    echo.
    echo Pushing code to GitHub using provided token...
    %GIT_EXE% push https://%GHTOKEN%@github.com/SMRUTIRANJAN30/trysomenew.git main
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================
    echo [SUCCESS] Code pushed successfully to GitHub!
    echo Netlify will now automatically build and deploy your updated website!
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo [ERROR] Push failed. 
    echo Please make sure your token is correct and has the 'repo' permission.
    echo ================================================================
)

echo.
pause
