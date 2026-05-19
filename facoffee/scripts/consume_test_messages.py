#!/usr/bin/env python3
import json
import os

import pika


RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "facoffee")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "facoffee")
RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")

QUEUES = [
    "participation.user-deactivated",
    "notification.finance-pendency-created",
    "reporting.finance-pendency-created",
]


def read_one_from_queue(channel: pika.adapters.blocking_connection.BlockingChannel, queue: str) -> None:
    method_frame, header_frame, body = channel.basic_get(queue=queue, auto_ack=False)

    if method_frame is None:
        print(f"[vazio] Nenhuma mensagem na fila '{queue}'")
        return

    try:
        payload = json.loads(body.decode("utf-8"))
    except json.JSONDecodeError:
        payload = body.decode("utf-8", errors="replace")

    print(f"\n[fila] {queue}")
    print(f"[tag] {method_frame.delivery_tag}")
    print("[mensagem]")
    print(json.dumps(payload, indent=2, ensure_ascii=True) if isinstance(payload, dict) else payload)

    channel.basic_ack(delivery_tag=method_frame.delivery_tag)
    print("[ok] Mensagem confirmada (ack)")


def main() -> None:
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    params = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        virtual_host=RABBITMQ_VHOST,
        credentials=credentials,
    )

    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    for queue in QUEUES:
        read_one_from_queue(channel, queue)

    connection.close()
    print("\nConcluido.")


if __name__ == "__main__":
    main()
