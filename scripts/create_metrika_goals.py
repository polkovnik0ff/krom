#!/usr/bin/env python3
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request


DEFAULT_COUNTER_ID = 109608960
API_BASE = "https://api-metrika.yandex.net/management/v1"


GOALS = [
    ("lead_any_success", "Лид: любая форма отправлена"),
    ("lead_popup_kp_success", "Лид: КП отправлено"),
    ("lead_popup_consult_success", "Лид: консультация отправлена"),
    ("lead_popup_price_success", "Лид: фиксация цены отправлена"),
    ("lead_popup_call_success", "Лид: обратный звонок отправлен"),
    ("lead_popup_material_success", "Лид: материал отправлен"),
    ("lead_quiz_success", "Лид: квиз отправлен"),
    ("lead_footer_success", "Лид: финальная форма отправлена"),
    ("form_open_kp", "Форма: открытие КП"),
    ("form_open_consult", "Форма: открытие консультации"),
    ("form_open_price", "Форма: открытие цены"),
    ("form_open_call", "Форма: открытие обратного звонка"),
    ("form_open_material", "Форма: открытие материала"),
    ("product_card_buy_click", "Карточка: клик купить"),
    ("product_card_consult_click", "Карточка: клик консультация"),
    ("product_card_hover_or_view", "Карточка: взаимодействие"),
    ("catalog_filter_click", "Каталог: фильтр"),
    ("catalog_pagination_click", "Каталог: пагинация"),
    ("quiz_start", "Квиз: старт"),
    ("quiz_step_answer", "Квиз: ответ на шаг"),
    ("quiz_final_reached", "Квиз: дошёл до финала"),
    ("widget_open", "Виджет: открыт"),
    ("widget_phone_click", "Виджет: клик телефон"),
    ("widget_max_click", "Виджет: клик Max"),
    ("widget_callback_click", "Виджет: клик обратный звонок"),
    ("header_phone_click", "Шапка: клик телефон"),
    ("footer_phone_click", "Футер: клик телефон"),
    ("hero_quiz_click", "Hero: клик подбор"),
    ("hero_kp_click", "Hero: клик КП"),
    ("hero_price_click", "Hero: клик заказать"),
    ("leadmag_catalog_click", "Лид-магнит: каталог"),
    ("leadmag_checklist_click", "Лид-магнит: чек-лист"),
    ("leadmag_maintenance_click", "Лид-магнит: регламент ТО"),
]


def request_json(method, url, token, payload=None):
    data = None
    headers = {"Authorization": f"OAuth {token}"}
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {url} failed: HTTP {err.code}: {body}") from err
    except urllib.error.URLError as err:
        raise RuntimeError(f"{method} {url} failed: {err.reason}") from err


def goal_identifier(goal):
    if goal.get("type") != "action":
        return None
    for condition in goal.get("conditions") or []:
        if condition and condition.get("type") in {"exact", "action"}:
            return condition.get("url")
    return None


def list_goals(counter_id, token):
    url = f"{API_BASE}/counter/{counter_id}/goals"
    data = request_json("GET", url, token)
    return data.get("goals", [])


def create_goal(counter_id, token, goal_id, name):
    url = f"{API_BASE}/counter/{counter_id}/goals"
    payload = {
        "goal": {
            "name": name,
            "type": "action",
            "conditions": [
                {
                    "type": "exact",
                    "url": goal_id,
                }
            ],
        }
    }
    return request_json("POST", url, token, payload)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Create Yandex Metrica JavaScript event goals for the HITCOM landing."
    )
    parser.add_argument(
        "--counter-id",
        type=int,
        default=int(os.getenv("YANDEX_METRIKA_COUNTER_ID", DEFAULT_COUNTER_ID)),
        help=f"Metrica counter ID. Default: {DEFAULT_COUNTER_ID}",
    )
    parser.add_argument(
        "--token",
        default=os.getenv("YANDEX_METRIKA_TOKEN"),
        help="OAuth token. Can also be set via YANDEX_METRIKA_TOKEN.",
    )
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Actually create goals. Without this flag the script only prints a dry-run plan.",
    )
    parser.add_argument(
        "--sleep",
        type=float,
        default=0.2,
        help="Delay between API calls when creating goals.",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    if not args.token:
        print("ERROR: pass --token or set YANDEX_METRIKA_TOKEN.", file=sys.stderr)
        return 2

    existing_goals = list_goals(args.counter_id, args.token)
    existing_by_identifier = {
        identifier: goal
        for goal in existing_goals
        if (identifier := goal_identifier(goal))
    }

    print(f"Counter: {args.counter_id}")
    print(f"Existing action goals: {len(existing_by_identifier)}")
    print(f"Mode: {'EXECUTE' if args.execute else 'DRY-RUN'}")
    print()

    created = 0
    skipped = 0
    for goal_id, name in GOALS:
        existing = existing_by_identifier.get(goal_id)
        if existing:
            skipped += 1
            print(f"SKIP   {goal_id:<32} already exists: #{existing.get('id')} {existing.get('name')}")
            continue

        if not args.execute:
            print(f"CREATE {goal_id:<32} {name}")
            continue

        result = create_goal(args.counter_id, args.token, goal_id, name)
        created += 1
        goal = result.get("goal", {})
        print(f"CREATED {goal_id:<31} #{goal.get('id')} {goal.get('name', name)}")
        time.sleep(args.sleep)

    print()
    if args.execute:
        print(f"Done. Created: {created}. Skipped: {skipped}.")
    else:
        print("Dry-run only. Re-run with --execute to create missing goals.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
