export default {
  mongoose: {
    uri: 'mongodb://localhost/app',
    options: {
      useMongoClient: true,
      poolSize: 5
    }
  },
  secret: 'mysecret',
  jwtSecret: 'jwtSecret',
  server: {
    siteHost: 'http://localhost:8889'
  },
  providers: {
  },
  mailer: {
  },
  crypto: {
    hash: {
      length: 128,
      iterations: process.env.NODE_ENV === 'production' ? 12000 : 1
    }
  },
  root: process.cwd()
}
