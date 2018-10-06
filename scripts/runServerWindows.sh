# Install Dependencies
pwd
npm install

cd ./src/mobile
pwd
npm install

cd ../server
pwd
npm install
npm run migrate up

npm run start-dev
