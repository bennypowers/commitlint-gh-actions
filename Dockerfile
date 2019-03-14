# Use the latest version of Node.js
#
# You may prefer the full image:
# FROM node
#
# or even an alpine image (a smaller, faster, less-feature-complete image):
# FROM node:alpine
#
# You can specify a version:
# FROM node:10-slim
FROM node:slim

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="Commitlint"
LABEL "com.github.actions.description"="Runs commitlint against a pr"
# Here all of the available icons: https://feathericons.com/
LABEL "com.github.actions.icon"="play"
# And all of the available colors: https://developer.github.com/actions/creating-github-actions/creating-a-docker-container/#label
LABEL "com.github.actions.color"="gray-dark"

LABEL "repository"="http://github.com/bennypowers/commitlint-gh-actions"
LABEL "homepage"="http://github.com/bennypowers/commitlint-gh-actions"
LABEL "maintainer"="Benny Powers <web@bennypowers.com>"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run `node /entrypoint.js`
ENTRYPOINT ["node", "/entrypoint.js"]