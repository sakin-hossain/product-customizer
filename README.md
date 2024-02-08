# How to deploy Shopify apps in Heroku step by step

```shell
heroku login
```

```shell
heroku create --org <team-name> --app <app-name>
```

```shell
heroku config:set -a <app-name> <env-name>=<env-value>
```

Using pnpm:

```shell
git push heroku main
```

### After deployment how to push into heroku

First of all push your code into github

Then:

```shell
git push heroku main
```
