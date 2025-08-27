Project dir structure:
wildfire-monitoring-system/
│── data/
│   ├── raw/                # Raw NASA FIRMS data (JSON/CSV)
│   ├── processed/          # Cleaned datasets
│   ├── external/           # Other datasets (weather, satellite, etc.)
│
│── notebooks/              # Jupyter Notebooks for EDA & experiments
│   ├── 01_data_cleaning.ipynb
│   ├── 02_eda.ipynb
│   ├── 03_model_training.ipynb
│
│── src/                    # Python source code (production ready)
│   ├── etl/                # Data pipeline
│   │   ├── fetch.py        # API calls to NASA FIRMS
│   │   ├── preprocess.py   # Data cleaning, normalization
│   │   ├── loader.py       # Load into DB
│   │   ├── __init__.py
│   │
│   ├── models/             # ML models (once trained)
│   │   ├── train.py
│   │   ├── predict.py
│   │   ├── utils.py
│   │   ├── __init__.py
│   │
│   ├── db/                 # Database layer
│   │   ├── schema.sql      # DB schema
│   │   ├── queries.py      # Query functions
│   │   ├── __init__.py
│   │
│   ├── api/                # FastAPI app
│   │   ├── main.py         # FastAPI entry point
│   │   ├── routes/         # API routes
│   │   │   ├── wildfire.py # wildfire endpoints
│   │   │   ├── health.py   # health check
│   │   │   ├── __init__.py
│   │   ├── services/       # business logic
│   │   ├── __init__.py
│   │
│   ├── utils/              # Shared utilities (logging, config)
│   │   ├── config.py
│   │   ├── logger.py
│   │   ├── __init__.py
│
│── dashboard/              # Streamlit dashboard
│   ├── app.py
│   ├── components/         # UI components
│
│── tests/                  # Unit & integration tests
│   ├── test_etl.py
│   ├── test_api.py
│   ├── test_models.py
│
│── logs/                   # Logs
│   ├── pipeline.log
│   ├── app.log
│
│── requirements.txt        # Dependencies
│── Dockerfile              # Containerization
│── README.md               # Project documentation
