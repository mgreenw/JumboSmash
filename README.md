# Project GEM [![Build Status](https://travis-ci.com/mgreenw/ProjectGEM.svg?token=Gqw9uK7j5g8prgyHD4xx&branch=master)](https://travis-ci.com/mgreenw/ProjectGEM)
Team: Jacob Jaffe, Emily Colwell, Max Greenwald, Bianca Capretta, Jillian Howarth, Erin Hsu

# Getting Started
Follow the steps below for the appropriate directory you are trying to develop in.

## Mobile

### iOS
1. Make sure Xcode is installed.
2. Ensure iOS Emulator is installed via Xcode.
3. Install Expo for testing the app on your phone.
4. Ensure that you have npm or yarn.
5. Ensure that you have node and watchman `brew install node` and `brew install watchman`
6. In order to test, you need to run the mobile app and server simultaneously

   **In mobile directory**
    1. Run `npm install -g react-native-cli` to use the react-native command line interface
    2. Run `react-native run-ios` to run the mobile app and iOS emulator (Xcode)
    3. OR run `npm install` and run the previous command again
    
    **In server directory**
    1. Run `npm install` and then `npm run dev`
    2. You might also need to run `nvm use 8.12.0` and then `npm run dev` again
    3. If migrations are not up-to-date, you may need to remove all the rows from the table (should be documented in the error message - thanks Max!). First try `npm run migrate up`. If not working, you need to add the extension citext by running: `psql -U postgres -d jumbosmash -c "create extension citext;"` and then enter your password. If that doesn't work, run `psql -U postgres -c "alter user jumbosmashdev with encrypted password 'tonysmash2019';"` and then run `psql -U postgres`. In the postgres environment, enter `\c jumbosh create extension citext;` then quit with `\q`. Try running `npm run migrate up` again.

7. Xcode should open up with your iOS emulator! If you have more problems, probably ask Max :)
8. To test the app on your phone, open your camera. On the tab that's running the mobile app in your terminal, a big QR code should appear. Point your camera at the QR code (no need to take a picture) and then Expo should display a notification to reroute you to Expo. Here you should be able to the see the app! If it's not happy, make sure the wifi networks match on both phone and computer.

To edit you can directly change the file. Upon saving, you will see immediate changes on the iOS Emulator.

### How to Setup Flow on VSCode
1. Go to Extensions
2. Search for and download "Flow Language Support"
3. Click "Reload to activate" under module on right-hand side
4. Search for and download "ESLint" and similarly click "Reload to activate"
5. In the app, go to Code -> Preferences -> Settings
6. Click the "..." button on the top right corner, and click "Open settings.json"
7. Add `"flow.useNPMPackagedFlow":true` to the right panel called USER SETTINGS in between the curly brackets
8. Restart VSCode
9. To confirm if Flow was correctly added, you should see the blue bar at the bottom now saying `Flow: xx%` with some number in place of xx

### Android
Coming soon...

## Server
Go to `./src/server` and check out the README there for more instructions!
