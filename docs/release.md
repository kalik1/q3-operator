# Ready to go!

```bash
git add . && git commit -m "Ready To Release! Yuppee!"
pnpm version patch
git push && git push --tags
```

# Deploy
## Install
```bash
curl -L https://github.com/kalik1/q3-operator/releases/latest/download/operator.yaml | kubectl apply -f -
```
## Bye Bye
```bash
curl -L https://github.com/kalik1/q3-operator/releases/latest/download/operator.yaml | kubectl delete -f -
```