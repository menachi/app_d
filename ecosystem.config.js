module.exports = {
  apps : [{
    name   : "app_d",
    script : "./dist/src/app.js",
    env_production : {
      NODE_ENV: "production"
    }
  }]

}
