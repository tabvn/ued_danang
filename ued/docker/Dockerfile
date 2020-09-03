FROM alpine
RUN apk --no-cache add wget
COPY ./ued /bin/
ENTRYPOINT [ "/bin/ued" ]
