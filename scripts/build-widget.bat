
@echo off
echo 🚀 Iniciando build do widget...

REM Executar build com configuracao especifica do widget
call npx vite build --config vite.widget.config.ts

if %ERRORLEVEL% neq 0 (
    echo ❌ Erro durante o build
    exit /b 1
)

REM Verificar se o arquivo foi gerado
set OUTPUT_PATH=dist\chatbot-widget.iife.js

if exist "%OUTPUT_PATH%" (
    echo ✅ Widget build concluído!
    echo 📦 Arquivo: dist\chatbot-widget.iife.js
    echo 🌐 Pronto para upload para CDN
    
    REM Mostrar tamanho do arquivo
    for %%A in ("%OUTPUT_PATH%") do (
        set /a FILE_SIZE=%%~zA/1024
        echo 📏 Tamanho: !FILE_SIZE! KB
    )
) else (
    echo ❌ Erro: Arquivo de output não foi encontrado
    exit /b 1
)

echo.
echo Para usar o widget, faça upload do arquivo para seu CDN e use:
echo ^<script src="https://cdn.seuservico.com/chatbot-widget.js"^>^</script^>
