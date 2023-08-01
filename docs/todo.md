# TODOS
## Get File and store in PVC One time only
## WHY
I want to download once the datapack in a PVC. I assume the cluster could not have Read-write-many StorageClasses, but only Read-write-once

This operation must be done once per datapack. Are datapacks stored with server-type ConfigMaps?? 
### Task 1: Create a Persistent Volume Claim (PVC)

- Define the PVC to store the downloaded file
- Apply the PVC configuration to the Kubernetes cluster

### Task 2: Create a Deployment to Download the File

- Define a deployment with a container to download the file
- Mount the PVC in the downloader container
- Apply the download deployment configuration

### Task 3: Create the Main Deployment

- Define the main server with the main container
- Add an init-container to copy the file from the PVC \[one for all datapacks?\]
- Mount the PVC in the init-container and main container as needed, the run CP
- Apply the main deployment configuration

### Temp storage

Sample PVC creation

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: datapack-<name>-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 400Mi
```
Sample Download Deployment (I KNOW, It should be a [JOB](https://kubernetes.io/docs/concepts/workloads/controllers/job/).... I KNOW it will be :) 
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: download-deployment
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: download-deployment
    spec:
      containers:
        - name: download-file,
          image: appropriate/curl
          command: [
           'sh',
           '-c',
           'curl -o /store/pak0.pk3 https://raw.githubusercontent.com/nrempel/q3-server/master/baseq3/pak0.pk3',
          ]
          volumeMounts:
            - name: datapack-volume
              mountPath: /store
      volumes:
        - name: datapack-volume
          persistentVolumeClaim:
            claimName: datapack-<name>-pvc
```
Sample Server Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: server-name-deployment
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: main-deployment
    spec:
      initContainers:
        - name: init-container
          image: alpine #or other?
          command: ['cp']
          args: ['/store/pak0.pk3', '/datapack/pak0.pk3']
          volumeMounts:
            - name: datapack-<name>-volume
              mountPath: /store
            - name: data-pack-data
              mountPath: /datapack,
      containers:
        - name: quake3-server
          image: inanimate/quake3:latest
          volumeMounts:
          - name: data-pack-data
            mountPath: /usr/share/games/quake3/baseq3/
            subPath: /datapack/
          - name: config-volume
            mountPath: /usr/share/games/quake3/baseq3/server.cfg
            subPath: server.cfg
          # OTHER configs... ports...  blah blah blah
      volumes:
        - name: datapack-volume
          persistentVolumeClaim:
            claimName: datapack-pvc
        - name: data-pack-data
          emptyDir: {}
```