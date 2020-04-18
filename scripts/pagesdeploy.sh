#!/bin/bash

# abort on errors
set -e

# navigate into the build output directory
cd dist

echo 'oddmango.com' > CNAME

git init
git add -A
git config user.name "snforge"
git config user.email 60017569+snforge@users.noreply.github.com
git commit --author="snforge <60017569+snforge@users.noreply.github.com>" -m 'deploy for github pages'

git push -f https://snforge@github.com/snforge/analytics.git master:gh-pages

cd -
