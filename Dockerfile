FROM meltwaterfoundation/drone-awscli:1.16.204
LABEL name=awsudo/awsudo
LABEL version="v1.1.0"
LABEL maintainer="awsudo opensource <awsudo.opensource@meltwater.com>"

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm i -g awsudo@1.1.0