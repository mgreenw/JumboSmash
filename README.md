# Project GEM [![Build Status](https://travis-ci.com/mgreenw/ProjectGEM.svg?token=Gqw9uK7j5g8prgyHD4xx&branch=master)](https://travis-ci.com/mgreenw/ProjectGEM)
Team: Jacob Jaffe, Emily Colwell, Max Greenwald, Bianca Capretta, Jillian Howarth

# Getting Started
Follow the steps below for the appropriate directory you are trying to develop in.

## Mobile

### iOS
1. Make sure Xcode is installed.
2. Ensure iOS Emulator is installed via Xcode.
3. Ensure that you have npm or yarn.
4. Ensure that you have node and watchman `brew install node` and `brew install watchman`
5. Within the clone directory (Mobile), run `npm install -g create-react-native-app`
6. Run `npm install -g react-native-cli`
7. Run `react-native run-ios` to run the mobile app and emulator
8. OR run `npm install` and press i to run in the iOS environment
9. To run the server, cd in to the server, `npm install` and then `npm run dev`

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
