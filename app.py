# ============================================================
#  PCOSense — Main Flask Application
# ============================================================

from flask import Flask, render_template, request, jsonify, send_file
import joblib
import random

from database import init_db, save_prediction, get_all_predictions
from report_generator import generate_report_pdf

# ------------------------------------------------------------
# App setup
# ------------------------------------------------------------
app = Flask(__name__)

# Load the trained model, scaler, and feature list ONCE at startup
# (not per-request — that would be slow and wasteful)
model = joblib.load('models/pcos_model.pkl')
scaler = joblib.load('models/scaler.pkl')
feature_names = joblib.load('models/feature_names.pkl')
print('Model loaded. Expected features:', feature_names)


init_db()


# ------------------------------------------------------------
# Page routes
# ------------------------------------------------------------
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/assessment')
def assessment():
    return render_template('assessment.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/diet-plan')
def diet_plan():
    return render_template('diet_plan.html')


@app.route('/exercise-plan')
def exercise_plan():
    return render_template('exercise_plan.html')


@app.route('/analytics')
def analytics():
    return render_template('analytics.html')


@app.route('/history')
def history():
    return render_template('history.html')


# ------------------------------------------------------------
# API routes
# ------------------------------------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    bmi = data['weight'] / ((data['height'] / 100) ** 2)

    input_features = [
        data['age'],
        data['weight'],
        data['height'],
        bmi,
        data['cycle_regularity'],
        data['cycle_length'],
        data['pregnant'],
        data['weight_gain'],
        data['hair_growth'],
        data['skin_darkening'],
        data['hair_loss'],
        data['pimples'],
        data['fast_food'],
        data['reg_exercise']
    ]

    input_scaled = scaler.transform([input_features])

    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0]

    result = {
        'prediction': int(prediction),
        'risk_label': 'High Risk' if prediction == 1 else 'Low Risk',
        'confidence': round(float(probability[prediction]) * 100, 1)
    }

    patient_id = 'PCS-' + str(random.randint(100000, 999999))
    data['bmi'] = bmi
    save_prediction(patient_id, data, result)

    result['patient_id'] = patient_id
    return jsonify(result)


@app.route('/api/history')
def api_history():
    predictions = get_all_predictions()
    return jsonify(predictions)


@app.route('/download-report', methods=['POST'])
def download_report():
    data = request.get_json()
    answers = data['answers']
    result = data['result']

    bmi = answers['weight'] / ((answers['height'] / 100) ** 2)
    is_high_risk = result['prediction'] == 1

    diet_tips = {
        'Breakfast': 'Vegetable oats or moong dal chilla' if bmi >= 25 else 'Whole grain toast with peanut butter',
        'Lunch': 'Grilled protein with quinoa and salad' if bmi >= 25 else 'Brown rice with dal and sabzi',
        'Water Goal': f"{(answers['weight'] * 35 / 1000):.1f} L per day"
    }
    exercise_tips = {
        'Walking': '30-40 min, 5 days/week' if is_high_risk else '20-30 min, 4 days/week',
        'Yoga': '20 min daily' if is_high_risk else '15 min daily',
        'Step Goal': '7,000 steps/day' if is_high_risk else '6,000 steps/day'
    }

    pdf_buffer = generate_report_pdf(data['patient_id'], answers, result, diet_tips, exercise_tips)

    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"PCOSense_Report_{data['patient_id']}.pdf"
    )


# ------------------------------------------------------------
# Entry point
# ------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)