
# Quake3 Kubernetes/Openshift Operator with [NestJS](https://nestjs.com/)

I'm taking this so serious.
## Disclaimer
The areas you see in the picture are not randomly generated or placed. They are meticulously crafted and positioned to show a specific purpose.

![me.png](docs%2Fme.png)
## Description
Welcome to my wild adventure! 🚀 This is the Quake3 Kubernetes/Openshift Operator, a MARVELous (🤣) creation I've forged with NestJS. My mission? To show that developing Kubernetes operators in TypeScript isn't just a dream—it's a reality!

This operator is still a bit of a beautiful mess. It's my unfinished masterpiece with a long to-do list. But don't let that stop you! I'm adding an elegant Angular frontend, some handy REST APIs, and working to make it look fantastic. Inspired by the Minio operator, this is only the beginning!

So, if you are crazy enough, join me, test it with Kubernetes in Docker (kind).

## Prerequisites

Before diving into this Quake3 operator, you'll need a couple of essential tools. Trust me; they're going to make your life way easier:

- **Kind**: Kubernetes in Docker, or "kind" for short, is a tool for running local Kubernetes clusters. You'll need this for testing and development. Grab it [here](https://kind.sigs.k8s.io/).
- **kubectl**: Your command-line friend for managing Kubernetes clusters. If you don't have it already, you can download it [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
- **oc CLI**: If you're using OpenShift, you'll also need the OpenShift CLI ("oc"). It's like `kubectl` but with some extra OpenShift magic. Find it [here](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html).

Once you've got these installed, you're all set to embark on the Quake3 operator journey. Happy coding!

## Installation

```bash
$ pnpm install
```

## Running the app

TL;DR? 
```bash
# TAKE THE BLUE PILL!
$ pnpm run i-am-lazy:take-blue-pill
# For the watchful eyes (watch mode)
$ pnpm run start:dev
```

For Developers

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
```

```bash
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

## Custom Resource: `servers.q3.magesgate.com`
In the Quake3 Kubernetes/Openshift Operator, the custom resource `servers.q3.magesgate.com` plays a crucial role in configuring and managing Quake3 servers within the cluster.

This custom resource encapsulates the necessary specifications for the Quake3 servers, allowing operators to define the map, player limit, game type, and other critical parameters.

Just a sample, still working on definition.... CODE BEFORE PROJECT!

```yaml
apiVersion: q3.magesgate.com/v1
kind: Server
metadata:
  name: my-awesome-server
spec:
  map: TheLongestYard
  maxPlayers: 16
  gameType: FreeForAll
```
This construct enables precise control over the server instances and provides a structured approach to deploying and managing Quake3 servers in a Kubernetes environment. Operators and administrators can utilize this custom resource to tailor the server configurations to their specific requirements.
### Ongoing Development: Reconciliation
One of the vital aspects of the Quake3 Kubernetes/Openshift Operator's ongoing development is the work on reconciliation, mostly using quake RCON to get information on server status (YEAH, it must be parsed.. U.U but I'm taking something from another [old project](https://github.com/kalik1/q3-server-docker-webUI)... ). I'm actively engaged in ensuring that the operator's state management is robust, efficient, and aligned with the desired configurations.

Reconciliation is the process where the operator continually observes the current state and compares it with the desired state, making necessary adjustments as required. It's the core mechanism that helps in maintaining consistency and stability within the system.

This work is in progress, and I am committed to implementing this functionality with the highest standards. Your insights, feedback, or contributions are welcome, as this will be an essential feature in enhancing the operator's reliability and performance.

## To-Do List

The Quake3 operator is in active development, and there's still a lot to be done. Here's a sneak peek at what's on the horizon:
- [ ] API documentation & validation with swagger
- [ ] Refactor folder structure
- [ ] Implement reconciliation logic
- [ ] Enhance custom resource validation
- [ ] Add support for more game modes
- [ ] Develop the Angular frontend
- [ ] Improve documentation and examples
- [ ] Add more tests for stability and robustness
- [ ] ~~Find very rich founders - NO WAY~~

Your ideas, contributions, and feedback are always welcome. Together, we can make this operator something truly special!

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
