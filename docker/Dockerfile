ARG node_lts
ARG version

FROM node:${node_lts}

LABEL name=awsudo/awsudo
LABEL version="v${version}"
LABEL maintainer="awsudo opensource <awsudo.opensource@meltwater.com>"

RUN npm i -g awsudo@${version}

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install
RUN rm -rf awscliv2.zip aws/
