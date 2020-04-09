#!/bin/bash

# abort on errors
set -e

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy for github pages'

git push -f https://snforge@github.com/snforge/analytics.git master:gh-pages

cd -
