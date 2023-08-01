
# Quake3 Kubernetes/Openshift Operator with NestJS

## Disclaimer
The areas you see in the picture are not randomly generated or placed. They are meticulously crafted and positioned to show a specific purpose.

![me.png](docs%2Fme.png)
## Description
Welcome to my wild adventure! 🚀 This is the Quake3 Kubernetes/Openshift Operator, a MARVELous (🤣) creation I've forged with NestJS. My mission? To show that developing Kubernetes operators in TypeScript isn't just a dream—it's a reality!

This operator is still a bit of a beautiful mess. It's my unfinished masterpiece with a long to-do list. But don't let that stop you! I'm adding an elegant Angular frontend, some handy REST APIs, and working to make it look fantastic. Inspired by the Minio operator, this is only the beginning!

So, if you are crazy enough, join me, test it with Kubernetes in Docker (kind).
## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# For the daredevils (development mode)
$ pnpm run start

# For the watchful eyes (watch mode)
$ pnpm run start:dev

# For the serious ones (production mode)
$ pnpm run start:prod
```
Wanna test it with Kubernetes in Docker (kind)? Check out these extra commands:

```bash
# Create a new Kubernetes cluster with the specific configuration
$ pnpm run start:kind

# Create a new namespace for the q3-operator
$ pnpm run start:kind:namespace

# Delete the Kubernetes cluster
$ pnpm run stop:kind

```
These kind commands are your key to building and testing within a local Kubernetes environment. They'll help you set up a cluster, create a namespace for your q3-operator, and tear down the cluster when you're done. Enjoy the ride!

## Test

Who needs test? 

![tests.jpg](docs%2Ftests.jpg)

ONE DAY: 

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
## Dreaming Big: The OperatorHub 😴

I'm not just building this for fun (well, maybe a little). My dream is to publish this operator on OperatorHub, making it accessible to the whole Kubernetes community! 🎉 I'm working hard (really?) to make that dream come true, and I'd love if someone crazy takes part of it. Stay tuned (clicking the star is free, but remember to remove notification, GH spams so much)!

## Running Smooth on Windows, Linux, and Mac
You know what's great about this operator? It doesn't play favorites. Whether you're a Windows fan, a Linux lover, or a Mac enthusiast, I've tested this project on all three, and it runs smoothly every time. No fuss, no drama.

* Windows? It's on board and running well.
* Linux? Feels right at home.
* Mac? It fits like a glove.
* 
So whatever your preferred environment is, rest easy. This operator is ready to roll right out of the box. Give it a spin and see for yourself!

## Support

Building something this awesome is a big task. If you're interested in contributing, finding bugs, or just cheering me on, I'd love to have you! Feel free to fork, create issues, or reach out. Your support means the world to me.
## Stay in touch

- Author - [kalik1](https://github.com/kalik1)

## License

This is [MIT licensed](LICENSE).
