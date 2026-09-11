import urllib.request
import urllib.parse
import json

def test_compare(s1, s2):
    url = f"http://127.0.0.1:8000/api/standards/compare?std1={urllib.parse.quote(s1)}&std2={urllib.parse.quote(s2)}"
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            data = json.loads(resp.read().decode())
            print(f"=== Comparing: '{s1}' vs '{s2}' ===")
            print(f"  Standard 1: {data['standard_1']['standard_number']} -> {data['standard_1']['title'][:50]}")
            print(f"  Standard 2: {data['standard_2']['standard_number']} -> {data['standard_2']['title'][:50]}")
            print(f"  Total Matrix Parameters: {len(data['comparison_matrix'])}")
            for p in data['comparison_matrix']:
                print(f"    - {p['parameter']}: '{p['std1'][:30]}' vs '{p['std2'][:30]}'")
            print("  [PASSED]\n")
            return True
    except Exception as e:
        print(f"  [FAILED] {s1} vs {s2}: {e}\n")
        return False

if __name__ == "__main__":
    print("Testing Standard Comparison Matrix API...")
    # 1. User's exact case from screenshot:
    assert test_compare("IS 17803", "IS 17526")
    # 2. Case without 'IS':
    assert test_compare("17803", "17526")
    # 3. IT vs AV/ICT Harmonized standard:
    assert test_compare("IS 13252", "IS/IEC 62368-1")
    # 4. Pressure cookers 5th rev vs 4th rev:
    assert test_compare("IS 2347:2017", "IS 2347:2006")
    # 5. Cross-sector test:
    assert test_compare("IS 17803", "IS 1489")
    print("ALL COMPARISON TESTS PASSED SUCCESSFULLY!")
