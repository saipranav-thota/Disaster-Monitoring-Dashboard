from fetch import fetch_viirs
from preprocess import normalize
from loader import load_to_db

def main_etl():
    try:
        viirs = fetch_viirs()
        v_norm = normalize(viirs)
        v_norm.to_csv("data/processed/fused_latest_processed.csv", index=False)
        print("Stored data as csv file")
        load_to_db()
        print("Successfully stored VIIRS data in postgresSQL")
    except Exception as e:
        print(f"Error in storting data. Error: {e}")

if __name__ == "__main__":
    main_etl()