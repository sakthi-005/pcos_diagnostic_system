document.addEventListener('DOMContentLoaded', function () {

    const answersRaw = sessionStorage.getItem('pcosense_answers');
    const resultRaw = sessionStorage.getItem('pcosense_result');
    if (!answersRaw || !resultRaw) {
        window.location.href = '/assessment';
        return;
    }

    const answers = JSON.parse(answersRaw);
    const result = JSON.parse(resultRaw);
    const bmi = answers.weight / ((answers.height / 100) ** 2);
    const isHighRisk = result.prediction === 1;
    const isOverweight = bmi >= 25;

    // ---------- Meals: chosen dynamically based on BMI + risk level ----------
    let breakfast, lunch, snack, dinner;

    if (isOverweight || isHighRisk) {
        breakfast = 'Vegetable oats or moong dal chilla with mint chutney';
        lunch = 'Grilled paneer/chicken with quinoa and a large salad';
        snack = 'A handful of almonds and green tea';
        dinner = 'Lentil soup with steamed vegetables (light, low-carb)';
    } else {
        breakfast = 'Whole grain toast with peanut butter and banana';
        lunch = 'Brown rice with dal, sabzi, and curd';
        snack = 'Roasted chana or fruit chaat';
        dinner = 'Grilled fish/tofu with sautéed vegetables';
    }

    document.getElementById('mealBreakfast').textContent = breakfast;
    document.getElementById('mealLunch').textContent = lunch;
    document.getElementById('mealSnack').textContent = snack;
    document.getElementById('mealDinner').textContent = dinner;

    // ---------- Foods to prefer / avoid ----------
    const foodsPrefer = [
        'High-fiber vegetables (spinach, broccoli, beans)',
        'Lean protein (fish, eggs, paneer, legumes)',
        'Low-glycemic fruits (berries, apples, pears)',
        'Healthy fats (nuts, seeds, olive oil)'
    ];
    const foodsAvoid = [
        'Refined sugar and sugary drinks',
        'Fried and processed fast food',
        'White bread, maida-based items',
        'Excess caffeine'
    ];
    if (answers.fast_food === 1) {
        foodsAvoid.unshift('Fast food (you flagged this as frequent — priority to reduce)');
    }

    const preferList = document.getElementById('foodsPrefer');
    foodsPrefer.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        preferList.appendChild(li);
    });

    const avoidList = document.getElementById('foodsAvoid');
    foodsAvoid.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        avoidList.appendChild(li);
    });

    // ---------- Water goal ----------
    const waterLiters = (answers.weight * 35 / 1000).toFixed(1);
    document.getElementById('dietWaterGoal').textContent = waterLiters + ' L per day';

});