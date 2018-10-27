# The Server

Welcome to __The Server__.

We are using NodeJS LTS 8.12.0. This release of Node has the highest compatibility across many packages, and will be supported through our release date.

In addition, the server uses Postgres 10.5. This was the current release of Postgres when the project was started.

NOTE: Your postgres instance must have the `citext` extension installed! See the setup instructions for more info.

## Developer Setup

Here are setup instructions for MacOS and Ubuntu. We have had no success as of yet setting up a dev env on Windows.

If you have any questions or get stuck, post in `#server`!

Check out the [API Documentation](docs)!

### MacOS
In `src/server`...
1. Run `./scrips/setup-mac`. This script runs best on Bash.
2. If anything fails, look at the setup script and re-run the commands manually.
3. `npm install`
4. `npm run migrate up`
5. `npm run dev` (this run script should check your environment and tell you if everything is properly setup)

### Ubuntu (Tested on 16.04)

In the following instructions, __<YOUR_USER_NAME>__ refers to your Linux user-account username.

```
# Install Node v8
sudo apt-get update
wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Postgres 10
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
echo 'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main' >> /etc/apt/sources.list.d/pgdg.list
sudo apt-get update
sudo apt-get install postgresql-10

# Create a user for yourself using postgres
sudo -u postgres psql
=# CREATE USER <YOUR_USER_NAME>;
=# ALTER USER <YOUR_USER_NAME> SUPERUSER CREATEDB;
=# \q

# Setup the Development Database and User
createdb <YOUR_USER_NAME>;
createuser jumbosmashdev
createdb jumbosmash
psql -U <YOUR_USER_NAME> -c "alter user jumbosmashdev with encrypted password 'tonysmash2019';"
psql -U <YOUR_USER_NAME> -c "grant all privileges on database jumbosmash to jumbosmashdev;"
psql -U postgres -d jumbosmash -c "CREATE EXTENSION IF NOT EXISTS citext;"

# In /src/server...
npm install
npm run migrate up

# This run script should check your environment and tell you if everything is properly setup
npm run dev
```
