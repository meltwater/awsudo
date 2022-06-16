FROM ubuntu:jammy
ARG node_lts
ARG version

LABEL name=awsudo/awsudo
LABEL version="v${version}"
LABEL maintainer="awsudo opensource <awsudo.opensource@meltwater.com>"

RUN apt update && apt install -y curl zip

RUN touch ~/.bashrc && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    bash -i -c "nvm install lts/${node_lts}" \
    bash -i -c "npm i -g awsudo@${version}"

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install
RUN rm -rf awscliv2.zip aws/

RUN apt autoremove -y curl zip
