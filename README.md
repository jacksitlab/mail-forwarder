# Mail Forwarder

A simple email forwarder for services which do not support protocol of you mail provider like matrix with TLS (not STARTTLS)

## How does it work


```
|--------------|             |----------------|                |--------------|
|   whatever   |   send      |      Mail      |    send        |    your      |   send email
|   service    |-----------> |    Forwarder   |--------------->|    email     |----------->
|              |   email     |                |    email       |   provider   |   to destination
|--------------|             |----------------|                |--------------|
```

In fact that this mail forwarder uses insecure protocol for incoming messages it should only be used inside of a closed network like in one docker network.

## local test

 * edit your config in ```config/config.json```
 * build

```
$ npm run build
$ npm run start
```
 * send test mail in another console
```
$ npm test
```

## Build container

```
$ ./build_docker
```

## License

Apache 2.0