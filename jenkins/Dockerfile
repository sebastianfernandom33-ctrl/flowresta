FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    wget \
    gnupg \
    apt-transport-https \
    ca-certificates

# AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" \
 && unzip awscliv2.zip \
 && ./aws/install

# kubectl
RUN curl -LO "https://dl.k8s.io/release/v1.35.0/bin/linux/amd64/kubectl" \
 && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Docker CLI
RUN apt-get update \
 && apt-get install -y docker.io

# Trivy
RUN apt-get update && apt-get install -y wget gnupg lsb-release

RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key \
 | gpg --dearmor \
 | tee /usr/share/keyrings/trivy.gpg > /dev/null

RUN echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" \
 | tee /etc/apt/sources.list.d/trivy.list

RUN apt-get update && apt-get install -y trivy

USER jenkins
