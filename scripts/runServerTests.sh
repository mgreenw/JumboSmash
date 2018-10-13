# Run the tests!
echo "\n\nSetting up test database jumbosmash_test...\n\n"
nvm use 8 > /dev/null 2>&1
dropdb jumbosmash_test > /dev/null 2>&1
createdb jumbosmash_test > /dev/null 2>&1
psql -U postgres -c "grant all privileges on database jumbosmash_test to jumbosmashdev;" > /dev/null 2>&1
export NODE_ENV=test > /dev/null 2>&1
npm run migrate up > /dev/null 2>&1

npm run jest

echo "\nCleaning up..."

dropdb jumbosmash_test
