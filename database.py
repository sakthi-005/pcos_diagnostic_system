import sqlite3
from datetime import datetime

DB_PATH = 'pcosense.db'

def init_db():
    """Create the predictions table if it doesn't already exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            age INTEGER,
            height REAL,
            weight REAL,
            bmi REAL,
            cycle_regularity INTEGER,
            cycle_length INTEGER,
            pregnant INTEGER,
            weight_gain INTEGER,
            hair_growth INTEGER,
            hair_loss INTEGER,
            skin_darkening INTEGER,
            pimples INTEGER,
            fast_food INTEGER,
            reg_exercise INTEGER,
            prediction INTEGER,
            risk_label TEXT,
            confidence REAL
        )
    ''')
    conn.commit()
    conn.close()

def save_prediction(patient_id, answers, result):
    """Insert one completed assessment + its prediction into the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO predictions (
            patient_id, created_at, age, height, weight, bmi,
            cycle_regularity, cycle_length, pregnant, weight_gain,
            hair_growth, hair_loss, skin_darkening, pimples,
            fast_food, reg_exercise, prediction, risk_label, confidence
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        patient_id, datetime.now().isoformat(),
        answers['age'], answers['height'], answers['weight'], answers['bmi'],
        answers['cycle_regularity'], answers['cycle_length'], answers['pregnant'],
        answers['weight_gain'], answers['hair_growth'], answers['hair_loss'],
        answers['skin_darkening'], answers['pimples'], answers['fast_food'],
        answers['reg_exercise'], result['prediction'], result['risk_label'], result['confidence']
    ))
    conn.commit()
    conn.close()

def get_all_predictions():
    """Fetch every saved assessment, most recent first."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name, like a dictionary
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM predictions ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]