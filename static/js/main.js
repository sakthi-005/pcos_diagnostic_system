document.addEventListener('DOMContentLoaded', function () {

    // ---------- Toggle buttons (Regular/Irregular, Yes/No) ----------
    document.querySelectorAll('.btn-toggle-group').forEach(function (group) {
        group.querySelectorAll('.btn-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                group.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // ---------- Live BMI preview (Step 1) ----------
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiPreview = document.getElementById('bmiPreview');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');

    if (heightInput && weightInput) {
        function updateBmiPreview() {
            const h = parseFloat(heightInput.value);
            const w = parseFloat(weightInput.value);
            if (h > 0 && w > 0) {
                const heightM = h / 100;
                const bmi = w / (heightM * heightM);
                bmiValue.textContent = bmi.toFixed(1);

                let category;
                if (bmi < 18.5) category = 'Underweight';
                else if (bmi < 25) category = 'Normal range';
                else if (bmi < 30) category = 'Overweight';
                else category = 'Obese';
                bmiCategory.textContent = category;

                bmiPreview.style.display = 'flex';
            } else {
                bmiPreview.style.display = 'none';
            }
        }
        heightInput.addEventListener('input', updateBmiPreview);
        weightInput.addEventListener('input', updateBmiPreview);
    }

    // ---------- Multi-step navigation ----------
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    function goToStep(stepNum) {
        steps.forEach(s => s.classList.toggle('active', s.dataset.step === String(stepNum)));
        progressSteps.forEach(function (p) {
            const n = parseInt(p.dataset.step);
            p.classList.toggle('active', n === stepNum);
            p.classList.toggle('completed', n < stepNum);
        });
        const card = document.querySelector('.assessment-card');
        if (card) window.scrollTo({ top: card.offsetTop - 40, behavior: 'smooth' });
    }

    function validateStep(stepNum) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        const requiredInputs = currentStepEl.querySelectorAll('input[required]');
        for (const input of requiredInputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }

    document.querySelectorAll('[data-next]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const currentStep = parseInt(btn.closest('.form-step').dataset.step);
            if (!validateStep(currentStep)) return;
            goToStep(parseInt(btn.dataset.next));
        });
    });

    document.querySelectorAll('[data-back]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            goToStep(parseInt(btn.dataset.back));
        });
    });

    // ---------- Form submission ----------
    const form = document.getElementById('assessmentForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateStep(4)) return;

            const payload = {
                age: parseFloat(document.getElementById('age').value),
                height: parseFloat(document.getElementById('height').value),
                weight: parseFloat(document.getElementById('weight').value),
                cycle_regularity: parseInt(document.querySelector('#cycleRegularity .active').dataset.value),
                cycle_length: parseFloat(document.getElementById('cycleLength').value),
                pregnant: parseInt(document.querySelector('#pregnant .active').dataset.value),
                weight_gain: document.getElementById('weightGain').checked ? 1 : 0,
                hair_growth: document.getElementById('hairGrowth').checked ? 1 : 0,
                hair_loss: document.getElementById('hairLoss').checked ? 1 : 0,
                skin_darkening: document.getElementById('skinDarkening').checked ? 1 : 0,
                pimples: document.getElementById('pimples').checked ? 1 : 0,
                fast_food: parseInt(document.querySelector('#fastFood .active').dataset.value),
                reg_exercise: parseInt(document.querySelector('#regExercise .active').dataset.value)
            };

            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Analyzing...';

            fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(result => {
                    sessionStorage.setItem('pcosense_answers', JSON.stringify(payload));
                    sessionStorage.setItem('pcosense_result', JSON.stringify(result));
                    window.location.href = '/dashboard';
                })
                .catch(function (error) {
                    console.error('Prediction failed:', error);
                    alert('Something went wrong getting your results. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Get My Results';
                });
        });
    }
});