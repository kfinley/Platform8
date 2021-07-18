# [Choice] .NET version: 5.0, 3.1, 2.1
ARG VARIANT="5.0"
FROM mcr.microsoft.com/vscode/devcontainers/dotnet:0-${VARIANT}

ARG NODE_VERSION="lts/*"
RUN su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"

RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && \
npm install -g \
npm@latest \
lerna \
@vue/cli \
wscat \
typescript \
&& npm cache clean --force >/dev/null" 2>&1

# aws-cli v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN sudo ./aws/install
RUN rm awscliv2.zip

RUN aws configure set aws_access_key_id S3RVER --profile s3local
RUN aws configure set aws_access_key_id S3RVER --profile s3local

RUN npm completion >> ~/.bashrc
