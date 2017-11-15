@echo on

call cordova build --debug android

pause 

cd platforms\android\build\outputs\apk


xcopy /y "%~dp0platforms\android\build\outputs\apk\android-armv7-debug.apk" "%~dp0"

del "%~dp0platforms\android\build\outputs\apk\android-armv7-debug.apk" /f /q

pause