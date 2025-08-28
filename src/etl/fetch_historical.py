"""
Module for fetching data from NASA FIRMS API.
"""
import pandas as pd
import requests 
import yaml
from io import StringIO
from preprocess import normalize
from loader import load_to_db

def load_config(path="config.yaml"):
    with open("config.yaml", "r") as f:
        return yaml.safe_load(f)

def fetch_firms_data(source):
    """
    Fetch wildfire data from NASA FIRMS API for given source.
    """
    config = load_config()
    url = config["firms"]["base_url"] + "/" + config["firms"]["map_key"] + "/" + config["sources"][source]
    try:
        response = requests.get(url)
        response.raise_for_status()
        df = pd.read_csv(StringIO(response.text))
        return df
    except Exception as e:
        print(f"[{source.upper()}] Error: {e}")
        return None


def fetch_historical(dataset_name, start_date, end_date):
    config = load_config()
    MAP_KEY = config["firms"]["map_key"]
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/VIIRS_NOAA20_NRT/world/1"  
    resp = requests.get(url)
    if resp.status_code != 200:
        print(f"[VIIRS] Error {resp.status_code}: {resp.text[:200]}")
        return None
    try:    
        df = pd.read_csv(StringIO(resp.text))
        return df
    except Exception as e:
        print(f"Error: {e}")
        return None
    

HISTORICAL_DATASET = {"dataset": "VIIRS_SNPP_SP", "start": "2012-01-20", "end": "2025-02-28"}

def run_pipeline():
    data = fetch_historical(
        HISTORICAL_DATASET["dataset"],
        HISTORICAL_DATASET["start"],
        HISTORICAL_DATASET["end"]
    )
    df = normalize(data)
    file_path = "data/archive/historical_data.csv"
    df.to_csv(file_path, index=False)
    print("Stored data as csv file")
    load_to_db(table_name="viirs_historical_data", path="data/archive/historical_data.csv")
    print("Data stored in viirs_historical_data")
    



if __name__ == "__main__":
    run_pipeline()