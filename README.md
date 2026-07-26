# PCOSense — AI-Based PCOS Prediction & Personalized Health Management System

PCOSense is an AI-powered web application that predicts PCOS (Polycystic Ovary
Syndrome) risk from self-reportable health and lifestyle data, and generates a
personalized health dashboard, diet plan, and exercise plan based on the result.

## Overview

Built as a final-year AI/ML project, PCOSense combines a trained Machine
Learning model with a full-stack Flask web application, designed to feel like
a professional clinical screening tool rather than a typical student project.

The app takes a user through a guided health assessment, runs their answers
through a trained classification model, and presents the result as an
EMR-style dashboard — complete with BMI analysis, personalized recommendations,
interactive analytics, saved prediction history, and a downloadable PDF
medical report.

**Disclaimer:** PCOSense is a screening and educational tool, not a medical
diagnostic device. It does not replace professional medical evaluation.

## Features

- **Multi-step Health Assessment** — personal info, menstrual history,
  clinical symptoms, and lifestyle factors, with live validation and a
  live BMI preview
- **AI Risk Prediction** — a trained Logistic Regression model (selected
  after comparing 6 algorithms) predicts PCOS risk with a confidence score
- **Patient Dashboard** — EMR-style summary, BMI analysis, daily health
  summary (water/calorie targets via the Mifflin-St Jeor formula), and
  dynamically generated recommendation cards
- **Personalized Diet & Exercise Plans** — generated from the patient's own
  BMI, age, and risk result, not fixed/hardcoded content
- **Health Analytics** — Chart.js visualizations: BMI gauge, prediction
  probability, and symptom distribution
- **Prediction History** — every assessment saved to a local SQLite database,
  with search and risk-level filtering
- **PDF Medical Report** — a downloadable, professionally formatted report
  generated with ReportLab

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript, Chart.js |
| Backend | Python, Flask |
| Database | SQLite |
| Machine Learning | scikit-learn, pandas, NumPy, joblib |
| PDF Generation | ReportLab |

## Machine Learning

- **Dataset:** A public PCOS clinical dataset (541 patient records, 45
  original features covering demographics, hormone levels, physical
  measurements, and symptoms)
- **Features used:** 14 self-reportable clinical/lifestyle factors (age, BMI,
  cycle regularity/length, pregnancy status, and 7 symptom/lifestyle flags) —
  chosen deliberately so the model only needs information a patient can
  provide from home, without requiring ultrasound or blood test results
- **Data preprocessing:** cleaned inconsistent column formatting, fixed
  invalid numeric entries, imputed missing values with the median, and
  standardized features before training
- **Models compared:** Logistic Regression, Decision Tree, Random Forest,
  SVM, KNN, XGBoost — evaluated on Accuracy, Precision, Recall, and F1 Score
- **Final model:** Logistic Regression — it outperformed all other models on
  every metric, likely due to the dataset's relatively small size and the
  strong, near-linear relationships between the chosen features and the
  target, while remaining the most interpretable choice

## Installation

1. Clone this repository:

git clone https://github.com/YOUR-USERNAME/pcos_diagnostic_system.git
cd pcos_diagnostic_system

2. Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate

3. Install dependencies:

pip install -r requirements.txt


## How to Run

python app.py


Then open `http://127.0.0.1:5000` in your browser.

## Screenshots

*(Screenshots to be added: landing page, assessment form, dashboard, diet
plan, analytics, history, and PDF report)*

## Future Enhancements

- User authentication and multi-patient accounts
- Deployment to a cloud platform for remote access
- Integration of optional clinical parameters (AMH, follicle count) for
  patients who have that data available
- Doctor-facing view for reviewing multiple patients

## License

This project is licensed under the MIT License — you're free to use, modify,
and share it, as long as the original copyright notice is included. See the
`LICENSE` file for full details.