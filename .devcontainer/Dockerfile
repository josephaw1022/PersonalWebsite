FROM mcr.microsoft.com/devcontainers/typescript-node:26

# Install development and infrastructure tools: AWS CLI, Terraform, Kubectl, Helm, Task, and GitHub CLI
RUN set -e \
    && apt-get update \
    && apt-get install -y --no-install-recommends unzip jq curl ca-certificates less bash-completion \
    # AWS CLI v2
    && ARCH="$(uname -m)" \
    && curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-${ARCH}.zip" -o /tmp/awscliv2.zip \
    && unzip -q /tmp/awscliv2.zip -d /tmp \
    && /tmp/aws/install \
    && rm -rf /tmp/awscliv2.zip /tmp/aws \
    # Terraform CLI
    && DARCH="$(dpkg --print-architecture)" \
    && TERRAFORM_VERSION=$(curl -s https://api.github.com/repos/hashicorp/terraform/releases/latest | jq -r ".tag_name" | sed "s/v//") \
    && curl -fsSL "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_${DARCH}.zip" -o /tmp/terraform.zip \
    && unzip -q /tmp/terraform.zip -d /usr/local/bin \
    && rm /tmp/terraform.zip \
    # Kubectl
    && KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt) \
    && curl -fsSL "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/${DARCH}/kubectl" -o /usr/local/bin/kubectl \
    && chmod +x /usr/local/bin/kubectl \
    # Helm
    && curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash \
    # Task
    && sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin \
    # GitHub CLI
    && GH_VERSION=$(curl -s https://api.github.com/repos/cli/cli/releases/latest | jq -r ".tag_name" | sed "s/v//") \
    && curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_${DARCH}.deb" -o /tmp/gh.deb \
    && dpkg -i /tmp/gh.deb \
    && rm /tmp/gh.deb \
    # Cleanup apt
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
