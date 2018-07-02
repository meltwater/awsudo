FROM meltwaterfoundation/drone-awscli:latest
MAINTAINER awsudo opensource <awsudo.opensource@meltwater.com>

RUN apk add --update nodejs
RUN npm i -g awsudo
