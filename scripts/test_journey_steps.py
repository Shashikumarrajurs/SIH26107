import urllib.request
import json

def test_journey():
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/chat",
        data=json.dumps({"message": "What standard applies to mobile phones?", "language": "en"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        j = data.get("bis_journey", {})
        print(f"Product Name: {j.get('product_name')}")
        print(f"Mandatory: {j.get('is_mandatory_certification')}")
        print(f"Total Stages: {len(j.get('steps', []))}\n")
        for s in j.get("steps", []):
            print(f"Step {s['step_number']}: [{s.get('short_label')}] {s.get('title')}")
            print(f"  • Summary: {s.get('summary')}")
            print(f"  • Details: {s.get('details')}")
            print(f"  • Plain Language: {s.get('plain_language')}\n")

if __name__ == "__main__":
    test_journey()
