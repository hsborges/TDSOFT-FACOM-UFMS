from __future__ import annotations

from functools import reduce
import json
from pathlib import Path
from typing import Any

JsonObject = dict[str, Any]
FileRecords = tuple[Path, tuple[JsonObject, ...]]
SpreadEvent = dict[str, str]
RepoStats = dict[str, dict[str, int]]


def list_json_files(data_dir: Path) -> tuple[Path, ...]:
    """Lista todos os arquivos JSON do diretório informado."""
    return tuple(sorted(data_dir.glob("*.json")))


def load_json_file(file_path: Path) -> tuple[JsonObject, ...]:
    """Carrega um arquivo JSON como array de objetos."""
    with file_path.open(mode="r", encoding="utf-8") as file_handle:
        raw_data: list[JsonObject] = json.load(file_handle)
    return tuple(raw_data)


def read_json_files(data_dir: Path) -> tuple[FileRecords, ...]:
    """Lê todos os arquivos JSON do diretório."""
    json_files: tuple[Path, ...] = list_json_files(data_dir)
    return tuple(map(lambda file_path: (file_path, load_json_file(file_path)), json_files))


def spread_events(file_records: tuple[FileRecords, ...]) -> tuple[SpreadEvent, ...]:
    """Espalha os eventos de cada registro em uma estrutura tabular única."""
    # Evitamos concentrar toda a transformação em lambdas aninhadas, pois isso reduz a legibilidade.
    def spread_file_record(file_record: FileRecords) -> tuple[SpreadEvent, ...]:
        """Espalha os eventos de um único arquivo."""
        file_path: Path = file_record[0]
        records: tuple[JsonObject, ...] = file_record[1]

        def spread_record(record: JsonObject) -> tuple[SpreadEvent, ...]:
            """Espalha os eventos de um único registro."""
            user_login: str = str(record.get("login", ""))
            events: list[JsonObject] = record.get("events", [])
            return tuple(
                map(
                    lambda event: {
                        "repo": file_path.name,
                        "user_login": user_login,
                        "event_type": str(event.get("type", "")),
                        "event_date": str(event.get("date", "")),
                    },
                    events,
                )
            )

        return reduce(
            lambda acc, record: acc + spread_record(record),
            records,
            tuple(),
        )

    spread_per_file: tuple[tuple[SpreadEvent, ...], ...] = tuple(
        map(spread_file_record, file_records)
    )
    return reduce(lambda acc, events: acc + events, spread_per_file, tuple())


def read_and_spread(data_dir: Path) -> tuple[SpreadEvent, ...]:
    """Compõe leitura e espalhamento dos eventos em uma única função."""
    file_records: tuple[FileRecords, ...] = read_json_files(data_dir)
    spread_per_file: tuple[tuple[SpreadEvent, ...], ...] = tuple(
        map(lambda file_record: spread_events((file_record,)), file_records)
    )
    return reduce(lambda acc, events: acc + events, spread_per_file, tuple())


def count_records(spread_records: tuple[SpreadEvent, ...], field: str) -> dict[str, int]:
    """Conta a quantidade de registros agrupando pelo campo informado."""
    return reduce(
        lambda acc, event: {
            **acc,
            str(event.get(field, "")): acc.get(str(event.get(field, "")), 0) + 1,
        },
        spread_records,
        {},
    )


def rank_users_by_events(
    spread_records: tuple[SpreadEvent, ...],
    limit: int = 10,
) -> tuple[tuple[str, int], ...]:
    """Gera o ranking de usuários por número de eventos (maior para menor)."""
    if limit <= 0:
        return tuple()

    users_count: dict[str, int] = count_records(spread_records, "user_login")
    sorted_users: list[tuple[str, int]] = sorted(
        users_count.items(),
        key=lambda item: (-item[1], item[0]),
    )
    return tuple(sorted_users[:limit])


def repo_stats(spread_records: tuple[SpreadEvent, ...]) -> RepoStats:
    """Calcula estatísticas por repositório a partir dos eventos espalhados."""
    aggregate: dict[str, tuple[int, frozenset[str], frozenset[str]]] = reduce(
        lambda acc, event: {
            **acc,
            event["repo"]: (
                acc.get(event["repo"], (0, frozenset(), frozenset()))[0] + 1,
                acc.get(event["repo"], (0, frozenset(), frozenset()))[1]
                | frozenset((event["user_login"],)),
                acc.get(event["repo"], (0, frozenset(), frozenset()))[2]
                | frozenset((event["event_type"],)),
            ),
        },
        spread_records,
        {},
    )
    return {
        repo: {
            "total_events": values[0],
            "unique_users": len(values[1]),
            "event_type_diversity": len(values[2]),
        }
        for repo, values in aggregate.items()
    }


def main() -> int:
    """Executa a leitura dos arquivos da pasta data e exibe um resumo."""
    spread_records: tuple[SpreadEvent, ...] = read_and_spread(Path("data"))
    
    print("Contagem por tipo:")
    event_counts: dict[str, int] = count_records(spread_records, "event_type")
    event_lines: tuple[str, ...] = tuple(
        map(lambda item: f"{item[0]}: {item[1]}", sorted(event_counts.items()))
    )
    print("\n".join(event_lines))


    print("\nTop usuarios por eventos:")
    ranking: tuple[tuple[str, int], ...] = rank_users_by_events(spread_records)
    ranking_lines: tuple[str, ...] = tuple(
        map(
            lambda item: f"{item[0]}. {item[1][0]}: {item[1][1]}",
            enumerate(ranking, start=1),
        )
    )
    print("\n".join(ranking_lines))

    print("\nEstatisticas por repositorio:")
    stats_by_repo: RepoStats = repo_stats(spread_records)
    repo_stats_lines: tuple[str, ...] = tuple(
        map(
            lambda item: (
                f"{item[0]} -> events={item[1]['total_events']}, "
                f"users={item[1]['unique_users']}, "
                f"diversity={item[1]['event_type_diversity']}"
            ),
            sorted(
                stats_by_repo.items(),
                key=lambda item: (-item[1]["total_events"], item[0]),
            ),
        )
    )
    print("\n".join(repo_stats_lines))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
