#!/bin/bash

echo "Pushing repo : learnchemejs"
cd L:/learnchemejs
git add -A
echo "Enter commit message: "
read REASON
git commit -m "$REASON"
git push
echo "Done with learnchemejs"

echo "All done!"
read