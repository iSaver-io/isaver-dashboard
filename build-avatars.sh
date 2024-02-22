echo 'run building avatars from bash script'

rm ./public/index.html
mv ./public/avatars.html ./public/index.html

craco build