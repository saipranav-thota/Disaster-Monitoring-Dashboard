"""
Module for preprocessing and cleaning the raw data.
"""
from fetch import fetch_viirs
import h3
import pandas as pd

def normalize(df):
    df["time_bucket"] = pd.to_datetime(df["acq_time"]).dt.floor("30min")
    df["h3_cell"] = df.apply(
                            lambda r: h3.latlng_to_cell(r["latitude"], r["longitude"], 6),
                            axis=1
                            )
    return df[["h3_cell", "time_bucket", "confidence", "frp", "daynight"]]


def run_pipeline():
    viirs = fetch_viirs()
    v_norm = normalize(viirs)
    v_norm.to_csv("data/processed/fused_latest_processed.csv", index=False)
    print("Stored data as csv file")

if __name__ == "__main__":
    run_pipeline()

