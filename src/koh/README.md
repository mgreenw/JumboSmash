# Koh

Welcome to __Koh__.

![Koh's Faces](https://vignette.wikia.nocookie.net/avatar/images/9/9c/Koh%27s_faces.png)

Koh is used to get member information from the LDAP server and act as a cache for this information so that the LDAP Server can be 1) batch queried and 2) hit as few times as possible.

Koh is based off the server and uses NodeJS LTS 8.12.0 and Postgres 10.5, similar to the server. See the [Server README](../server/README.md) for more information.

## Developer Setup

Setup your develpment environment for the server first. Then, create a new database following the development.config
Specifically, you need to create a database for koh!

Run:
1. `createdb koh`
2. `psql -U postgres -c "grant all privileges on database koh to jumbosmashdev;"`
3. `psql -U postgres -d koh -c "CREATE EXTENSION IF NOT EXISTS citext;"`

If you have any questions or get stuck, post in `#koh`!

Check out the [API Documentation](docs)!

### Running Koh
In `src/koh`...
1. `npm install`
2. `npm run migrate up`
3. `npm run dev` (this run script should check your environment and tell you if everything is properly setup)

### Building Koh

0. Select a `TAG` - be smart about semantic versioning (is it backwards compatible?)
1. `docker image build -t ecolwe/koh:TAG .`
2. `docker push ecolwe/koh:TAG`
