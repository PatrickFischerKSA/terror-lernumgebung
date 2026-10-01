@echo off
chcp 65001 >nul
cd /d "%~dp0"
py -3 install-windows.py
if errorlevel 1 echo Hinweise und Voraussetzungen stehen in WINDOWS.md.
pause
