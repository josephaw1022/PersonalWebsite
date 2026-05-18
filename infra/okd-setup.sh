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
    app.openshift.io/runtime: nodejs
  annotations:
    # Links this workload to the ARC runner scale set component (app.kubernetes.io/instance=personal-site-runner) in Topology.
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
