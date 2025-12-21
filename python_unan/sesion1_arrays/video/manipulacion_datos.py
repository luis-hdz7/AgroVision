import csv

with open("datos.csv", "r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader, start=1):
        print(f"Fila {i}: {row}")

