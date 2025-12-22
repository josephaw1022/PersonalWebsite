#!/bin/bash

set -euo pipefail

# Create the namespace/project if it doesn't exist
oc new-project personal-site 2>/dev/null || oc project personal-site

oc apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: personal-site
  namespace: personal-site
  labels:
    app: personal-site
    app.kubernetes.io/part-of: personal-website-app
    app.openshift.io/runtime: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: personal-site
  template:
    metadata:
      labels:
        app: personal-site
        app.kubernetes.io/part-of: personal-website-app
    spec:
      containers:
      - name: personalwebsite
        image: ghcr.io/josephaw1022/personalwebsite:be71a9e8cef6d7bfd392a630f242c50f7cbf3663
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: cache-vol
          mountPath: /var/cache/nginx
        - name: run-vol
          mountPath: /var/run
        - name: nginx-conf
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: cache-vol
        emptyDir: {}
      - name: run-vol
        emptyDir: {}
      - name: nginx-conf
        configMap:
          name: nginx-config
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: personal-site
data:
  default.conf: |
    server {
      listen 8080;
      server_name _;

      root /usr/share/nginx/html;

      index index.html;

      location / {
        try_files \$uri /index.html =404;
      }
    }
---
apiVersion: v1
kind: Service
metadata:
  name: personal-site
  namespace: personal-site
  labels:
    app.kubernetes.io/part-of: personal-website-app
spec:
  selector:
    app: personal-site
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP

EOF
