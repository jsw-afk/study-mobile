@echo off
rem 정처기 실기 모바일 웹 실행 (정적 서버). 같은 와이파이의 폰에서 접속 가능.
cd /d "%~dp0"
chcp 65001 >nul
echo === 정처기 실기 모바일 웹 ===
python -c "import socket; s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM); s.connect(('8.8.8.8',80)); ip=s.getsockname()[0]; s.close(); print('  폰 브라우저에서:  http://%s:8000' % ip)"
echo   이 PC 에서:      http://localhost:8000
echo   (종료: Ctrl+C)
echo.
python -m http.server 8000
