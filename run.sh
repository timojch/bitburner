
# When launching the .exe directly, you'll need the steam_appid.txt file in the root
# If not using windows, change this line accordingly
cp .build/bitburner-win32-x64/resources/app/steam_appid.txt .build/bitburner-win32-x64/steam_appid.txt

# And run the game...
.build/bitburner-win32-x64/bitburner.exe > /dev/null &