#!/usr/bin/env python3
import json
import os
import uuid
from datetime import datetime, timezone

import pika


RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "facoffee")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "facoffee")
RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def publish_to_queue(channel: pika.adapters.blocking_connection.BlockingChannel, queue: str, message: dict) -> None:
    body = json.dumps(message, ensure_ascii=True).encode("utf-8")
    channel.basic_publish(
        exchange="",
        routing_key=queue,
        body=body,
        properties=pika.BasicProperties(content_type="application/json", delivery_mode=2),
    )
    print(f"[ok] Mensagem enviada para fila '{queue}'")


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

    user_deactivated_event = {
        "eventId": f"evt_{uuid.uuid4().hex[:8]}",
        "eventType": "UserDeactivated",
        "occurredAt": iso_now(),
        "version": "1.0",
        "payload": {
            "userId": "usr_123",
            "reason": "Usuario desativado para teste",
        },
    }

    finance_event = {
        "eventId": f"evt_{uuid.uuid4().hex[:8]}",
        "eventType": "FinancialPendencyCreated",
        "occurredAt": iso_now(),
        "version": "1.0",
        "payload": {
            "pendencyId": "pend_001",
            "source": "MONTHLY_PARTICIPATION",
            "sourceId": "mpart_001",
            "userId": "usr_123",
            "cycle": "2026-05",
            "amount": 40.0,
            "status": "PENDING",
        },
    }

    publish_to_queue(channel, "participation.user-deactivated", user_deactivated_event)
    publish_to_queue(channel, "notification.finance-pendency-created", finance_event)
    publish_to_queue(channel, "reporting.finance-pendency-created", finance_event)

    connection.close()
    print("Concluido.")


if __name__ == "__main__":
    main()
