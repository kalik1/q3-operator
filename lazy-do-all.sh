#!/bin/bash

animate_sword() {
  BLADE="="
  while true; do
    printf -- '-|'"${BLADE}"'==> '
    BLADE="${BLADE}="
    sleep 0.5
    printf "\r" # Move the cursor to the beginning of the line to overwrite the sword! Cheers windows \rn\nrn\n\rn\rn\ \nr\nrn\rn\rn\rn CR LF are 2 SIMBOLS!
  done
}

execute_command() {
  animate_sword &
  ANIMATION_PID=$!
  $1 > /dev/null 2>&1
  kill $ANIMATION_PID
  wait $ANIMATION_PID 2>/dev/null
  printf "\n"
}

echo "🧹 Cleaning up kind. Let's slice it up!"
execute_command "pnpm run cleanup:kind"

echo "🚀 Deploying the dashboard. Cutting edge technology!"
execute_command "pnpm run k8s:deploy:dashboard"

echo "👤 Creating a user. Let's carve out a space for you!"
execute_command "pnpm k8s:create-user-sa"

echo "🔑 Fetching the token. Sharp tools get the job done!"
BASE64_TOKEN=$(pnpm run k8s:get-admin-user-token | tail -n 1)

echo "🌐 Starting the k8s proxy. A blade to cut through the web!"
execute_command sleep 5
echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login"
echo "🍕 Now eat pizza or Login with this Token (you can take your pizza slice in token.txt)"
echo $BASE64_TOKEN
echo $BASE64_TOKEN > token.txt
pnpm run k8s:proxy | tail -f
