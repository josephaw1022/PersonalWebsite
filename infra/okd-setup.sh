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
    app.kubernetes.io/name: personal-site
    app.kubernetes.io/component: frontend
    app.kubernetes.io/instance: personal-site
    app.openshift.io/runtime: nodejs
  annotations:
    app.openshift.io/vcs-uri: "https://github.com/josephaw1022/PersonalWebsite"
    app.openshift.io/vcs-ref: main
    # Targets the Topology Service created by infra/arc-setup.sh (app.kubernetes.io/instance=personal-site-runner).
    app.openshift.io/connects-to: '["personal-site-runner"]'
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
        app.kubernetes.io/name: personal-site
        app.kubernetes.io/component: frontend
        app.kubernetes.io/instance: personal-site
        app.openshift.io/runtime: nodejs
    spec:
      containers:
      - name: personalwebsite
        image: ghcr.io/josephaw1022/personalwebsite:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"
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
      targetPort: 3000
  type: ClusterIP

EOF
