FROM node:8-slim
WORKDIR /server
ADD . /server
RUN npm install -g typescript
RUN yarn
RUN grapqlgen
RUN tsc
EXPOSE 4000
CMD [ "node", "dist/index.js"]