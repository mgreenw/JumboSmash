if screen -ls run-jumbosmash-dev > /dev/null; then
    echo 'JumboSmash dev instance is already running. Use `screen -list` then `screen -dr PIN` to reattach to the existing session.'
    exit 1
fi

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 8.12.0

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

cd ../../scripts

screen -S run-jumbosmash-dev -c screenrc
