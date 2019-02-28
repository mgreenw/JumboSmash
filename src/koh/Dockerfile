# Part 1: The Build
# First, we use Node 8.12-alpine. This is a lightweight version of Node
# that includes NO additional boilerplate
FROM node:8.12-alpine AS builder

# Use /home/src/app as our app's root directory. This is standard
WORKDIR /home/src/app
COPY . .

# Install necessary components for bcrypt (using node-gyp). Then, npm install
RUN apk update && apk add python make g++
RUN npm install

# Build the app! This will put the build distribution into the /dist folder
RUN npm run build


# Part 2: The Run
# Again, use Node alipne
FROM node:8.12-alpine
WORKDIR /home/src/app

# Only copy the package files in order to install dependencies.
COPY ./package* ./
RUN apk update && apk add python make g++
RUN npm install --prod

# Copy the built code from the builder (part 1) into the working directory
COPY --from=builder /home/src/app/dist .

# Expose port 3000 and start the container.
# NOTE: npm run start does not specifiy a NODE_ENV. This must be specified
# elsewhere, either in a docker-compose.yml file or when running
# the docker container directly
EXPOSE 3001
CMD ["npm", "run", "start"]
