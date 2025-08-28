"""
Module for loading processed data into the database.
"""
import psycopg2


def load_to_db(table_name="viirs_live_data", path="data/processed/fused_latest_processed.csv"):
    """
    Load processed data into the database.
    """
    conn = psycopg2.connect(
        host="localhost",
        database="disastermanagement",
        user="postgres",
        password="postgres@sql"
    )
    cur = conn.cursor()

    # Create table (if not exists)
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
        h3_cell TEXT NOT NULL,
        time_bucket TIMESTAMP NOT NULL,
        confidence TEXT,
        frp FLOAT,
        daynight CHAR(1),
        PRIMARY KEY (h3_cell, time_bucket)
    );
    """)
    conn.commit()

    with open(path, "r") as f:
        next(f)
        cur.copy_from(f, table_name, sep=',')
    conn.commit()
    cur.close()
    conn.close()

