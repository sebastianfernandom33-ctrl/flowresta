pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO = '252556588994.dkr.ecr.us-east-1.amazonaws.com/flowresta'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t flowresta:${IMAGE_TAG} .
                '''
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image flowresta:${IMAGE_TAG}
                '''
            }
        }

        stage('Login ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-creds',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                    aws ecr get-login-password \
                    --region $AWS_REGION \
                    | docker login \
                    --username AWS \
                    --password-stdin $ECR_REPO
                    '''
                }
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker tag flowresta:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}
                docker push ${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }

        stage('Helm Upgrade') {
            steps {
                sh '''
                export AWS_SHARED_CREDENTIALS_FILE=/var/jenkins_home/.aws/credentials
                export AWS_CONFIG_FILE=/var/jenkins_home/.aws/config
                export AWS_PAGER=""

                kubectl get nodes

                helm upgrade --install flowresta ./helm/flowresta \
                  --set image.repository=252556588994.dkr.ecr.us-east-1.amazonaws.com/flowresta \
                  --set image.tag=${BUILD_NUMBER}
                '''
            }
        }
    }
}
