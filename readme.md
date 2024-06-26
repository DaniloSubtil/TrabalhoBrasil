# To-Do List Application

## Descrição
Esta é uma aplicação web para gerenciamento de tarefas (To-Do List), permitindo aos usuários criar, atualizar, visualizar e deletar tarefas. A aplicação também permite upload de arquivos relacionados às tarefas, envia notificações assíncronas quando uma tarefa é criada ou atualizada, e realiza o deploy em uma instância EC2 da AWS.

## Tecnologias Utilizadas
- Node.js com Express
- AWS DynamoDB
- AWS SQS
- AWS S3
- Docker
- Docker-Compose
- GitHub Actions

## Configuração do Ambiente

### Pré-requisitos
- Node.js
- Docker
- Docker-Compose
- AWS CLI

### Inicialização do Projeto
1. Clone o repositório:
    ```bash
    git clone https://github.com/your-username/todo-app.git
    cd todo-app
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Execute a aplicação:
    ```bash
    npm start
    ```

### Dockerização
1. Construa e execute a aplicação usando Docker-Compose:
    ```bash
    docker-compose up --build
    ```

### Deploy na AWS EC2
1. Inicie uma instância EC2 na AWS e configure as permissões de segurança.
2. Conecte-se à instância EC2:
    ```bash
    ssh -i "path/to/your-key-pair.pem" ec2-user@your-ec2-public-dns
    ```
3. Instale Docker e Docker-Compose na instância EC2:
    ```bash
    sudo yum update -y
    sudo amazon-linux-extras install docker
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```
4. Clone o repositório na instância EC2:
    ```bash
    git clone https://github.com/your-username/todo-app.git
    cd todo-app
    ```
5. Inicie a aplicação usando Docker-Compose:
    ```bash
    docker-compose up -d
    ```

## Integração Contínua com GitHub Actions
1. Crie um arquivo `.github/workflows/deploy.yml` no repositório GitHub:
    ```yaml
    name: CI/CD Pipeline

    on:
      push:
        branches:
          - main

    jobs:
      build:
        runs-on: ubuntu-latest

        steps:
        - name: Checkout code
          uses: actions/checkout@v2

        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v1

        - name: Log in to Amazon ECR
          id: login-ecr
          uses: aws-actions/amazon-ecr-login@v1

        - name: Build and push Docker image
          run: |
            docker build -t todo-app .
            docker tag todo-app:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/todo-app:latest
            docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/todo-app:latest

        - name: Deploy to EC2
          uses: appleboy/ssh-action@v0.1.5
          with:
            host: ${{ secrets.EC2_HOST }}
            username: ec2-user
            key: ${{ secrets.EC2_KEY }}
            script: |
              cd todo-app
              git pull origin main
              docker-compose down
              docker-compose up -d
    ```

2. Configure os segredos no GitHub:
    Vá até a aba de "Settings" do seu repositório no GitHub e adicione os seguintes segredos:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
    - `EC2_HOST`
    - `EC2_KEY`

### Teste da Aplicação
1. Verifique se todos os serviços estão funcionando:
    - Acesse o backend em `http://<EC2_PUBLIC_IP>:3000`
    - Teste os endpoints da API usando o Swagger UI em `http://<EC2_PUBLIC_IP>:3000/api-docs`
