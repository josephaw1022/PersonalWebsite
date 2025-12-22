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
        - containerPort: 80
        volumeMounts:
        - name: cache-vol
          mountPath: /var/cache/nginx
        - name: run-vol
          mountPath: /var/run
        - name: conf-vol
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: cache-vol
        emptyDir: {}
      - name: run-vol
        emptyDir: {}
      - name: conf-vol
        emptyDir: {}
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
      targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-cloudflare-and-dns
  namespace: personal-site
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: cloudflare-connector
          podSelector:
            matchLabels:
              app.kubernetes.io/name: cloudflared
  egress:
    # Allow traffic back to the cloudflared pods
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: cloudflare-connector
          podSelector:
            matchLabels:
              app.kubernetes.io/name: cloudflared
    # Allow DNS resolution (required for the cluster to function)
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: openshift-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
EOF
