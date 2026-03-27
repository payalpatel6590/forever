#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy to github pages'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

# For GitHub Pages deployment, use the following:
# Make sure to update YOUR_USERNAME and YOUR_REPO_NAME
git push -f https://github.com/YOUR_USERNAME/ecommerce-app.git main:gh-pages

cd -
