"""
Module for fetching data from NASA FIRMS API.
"""
import pandas as pd
import requests 
import yaml
from io import StringIO
import h3

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


def fetch_viirs():
    config = load_config()
    MAP_KEY = config["firms"]["map_key"]
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/VIIRS_NOAA20_NRT/world/3"  
    resp = requests.get(url)
    if resp.status_code != 200:
        print(f"[VIIRS] Error {resp.status_code}: {resp.text[:200]}")
        return None
    try:    
        df = pd.read_csv(StringIO(resp.text))
        df.to_csv("data/raw/fused_latest_raw.csv", index=False)
        return df
    except Exception as e:
        print(f"Error: {e}")
        return None
    


if __name__ == "__main__":
    fetch_viirs()