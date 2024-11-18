FROM python:3.10-slim-buster AS base

WORKDIR /app

ENV PYTHONPATH /app
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ---- Release ----
FROM base AS release

RUN apt update && \
    apt install --no-install-recommends -y software-properties-common gcc mono-mcs git libidn11 libev4 libffi6 libgmp10 libgnutls30 libhogweed4 default-libmysqlclient-dev \
      libffi-dev python3-dev libc-dev libldap-2.4-2 libnettle6 libp11-kit0 libsasl2-dev libtasn1-6 libmagic1 \
      redis-tools && \
    rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install -r requirements.txt && rm -rf /root/.cache

RUN mkdir -p multiproc-tmp && rm -rf multiproc-tmp && mkdir multiproc-tmp

# chown multiproc-tmp to the 33 user
RUN mkdir -p static && chown 33:33 static && chown 33:33 multiproc-tmp

COPY /src /app/

EXPOSE 8000
USER 33

CMD ["sh", "-c", "gunicorn -c gunicorn.conf.py --chdir /app event_afisha.wsgi"]
