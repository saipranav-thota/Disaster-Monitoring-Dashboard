"""
Module for preprocessing and cleaning the raw data.
"""
from fetch import fetch_viirs
import h3
import pandas as pd

def normalize(df):
    df['acq_datetime'] = pd.to_datetime(df['acq_date'] + ' ' + df['acq_time'].astype(str).str.zfill(4), format='%Y-%m-%d %H%M')
    df["time_bucket"] = pd.to_datetime(df["acq_datetime"]).dt.floor("60min")

    df["h3_cell"] = df.apply(
                            lambda r: h3.latlng_to_cell(r["latitude"], r["longitude"], 6),
                            axis=1
                            )
    conf_map = {'l': 1, 'n': 2, 'h': 3}
    df['conf_num'] = df['confidence'].map(conf_map)
    agg_df = (
    df.groupby(["h3_cell", "time_bucket"], as_index=False)
      .agg({
          "conf_num": "mean",   # average confidence
          "frp": "sum",           # total fire radiative power
          "daynight": "first"     # or 'mode' if mixed
      })
    )
    return agg_df[["h3_cell", "time_bucket", "conf_num", "frp", "daynight"]]


def run_pipeline():
    viirs = fetch_viirs()
    v_norm = normalize(viirs)
    v_norm.to_csv("data/processed/fused_latest_processed.csv", index=False)
    print("Stored data as csv file")

if __name__ == "__main__":
    run_pipeline()

