/**
 * FitClub - BMI Calculator Logic (bmi.js)
 * ======================================
 * Validates user inputs, switches between Metric and Imperial units,
 * calculates BMI to one decimal place, highlights category, and updates
 * the visual range meter.
 */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const metricBtn = document.getElementById('metricBtn');
    const imperialBtn = document.getElementById('imperialBtn');
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');

    const heightCmInput = document.getElementById('heightCm');
    const weightKgInput = document.getElementById('weightKg');

    const heightFtInput = document.getElementById('heightFt');
    const heightInInput = document.getElementById('heightIn');
    const weightLbsInput = document.getElementById('weightLbs');

    const calculateBtn = document.getElementById('calculateBmiBtn');
    const resetBtn = document.getElementById('resetBmiBtn');
    const errorMessage = document.getElementById('bmiErrorMsg');

    const resultPanel = document.getElementById('bmiResultCard');
    const bmiScoreElem = document.getElementById('bmiScore');
    const bmiCategoryBadge = document.getElementById('bmiCategoryBadge');
    const bmiMarker = document.getElementById('bmiMarker');
    const bmiGuidanceText = document.getElementById('bmiGuidanceText');

    let currentUnit = 'metric'; // 'metric' or 'imperial'

    // Switch to Metric Unit
    if (metricBtn && imperialBtn) {
        metricBtn.addEventListener('click', function () {
            currentUnit = 'metric';
            metricBtn.classList.add('active');
            imperialBtn.classList.remove('active');
            metricInputs.style.display = 'block';
            imperialInputs.style.display = 'none';
            clearErrors();
        });

        // Switch to Imperial Unit
        imperialBtn.addEventListener('click', function () {
            currentUnit = 'imperial';
            imperialBtn.classList.add('active');
            metricBtn.classList.remove('active');
            metricInputs.style.display = 'none';
            imperialInputs.style.display = 'block';
            clearErrors();
        });
    }

    function clearErrors() {
        if (errorMessage) errorMessage.textContent = '';
    }

    // Input change clears errors
    [heightCmInput, weightKgInput, heightFtInput, heightInInput, weightLbsInput].forEach(function (inp) {
        if (inp) {
            inp.addEventListener('input', clearErrors);
        }
    });

    // Calculate BMI Handler
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function (e) {
            e.preventDefault();
            clearErrors();

            let bmi = 0;

            if (currentUnit === 'metric') {
                const heightCm = parseFloat(heightCmInput.value);
                const weightKg = parseFloat(weightKgInput.value);

                if (!heightCm || isNaN(heightCm) || heightCm <= 0) {
                    errorMessage.textContent = 'Please enter a valid positive height in centimetres (e.g. 175 cm).';
                    heightCmInput.focus();
                    return;
                }

                if (heightCm < 50 || heightCm > 260) {
                    errorMessage.textContent = 'Please enter a realistic height between 50 cm and 260 cm.';
                    heightCmInput.focus();
                    return;
                }

                if (!weightKg || isNaN(weightKg) || weightKg <= 0) {
                    errorMessage.textContent = 'Please enter a valid positive weight in kilograms (e.g. 70 kg).';
                    weightKgInput.focus();
                    return;
                }

                if (weightKg < 20 || weightKg > 350) {
                    errorMessage.textContent = 'Please enter a realistic weight between 20 kg and 350 kg.';
                    weightKgInput.focus();
                    return;
                }

                const heightMeters = heightCm / 100;
                bmi = weightKg / (heightMeters * heightMeters);

            } else {
                // Imperial Unit
                const feet = parseFloat(heightFtInput.value);
                const inches = parseFloat(heightInInput.value) || 0;
                const weightLbs = parseFloat(weightLbsInput.value);

                if (!feet || isNaN(feet) || feet <= 0) {
                    errorMessage.textContent = 'Please enter a valid height in feet (e.g. 5 ft).';
                    heightFtInput.focus();
                    return;
                }

                if (inches < 0 || inches >= 12) {
                    errorMessage.textContent = 'Inches should be between 0 and 11.';
                    heightInInput.focus();
                    return;
                }

                const totalInches = (feet * 12) + inches;
                if (totalInches < 24 || totalInches > 100) {
                    errorMessage.textContent = 'Please enter a realistic height between 2 ft and 8 ft.';
                    heightFtInput.focus();
                    return;
                }

                if (!weightLbs || isNaN(weightLbs) || weightLbs <= 0) {
                    errorMessage.textContent = 'Please enter a valid positive weight in pounds (e.g. 160 lbs).';
                    weightLbsInput.focus();
                    return;
                }

                if (weightLbs < 45 || weightLbs > 750) {
                    errorMessage.textContent = 'Please enter a realistic weight between 45 lbs and 750 lbs.';
                    weightLbsInput.focus();
                    return;
                }

                bmi = (weightLbs * 703) / (totalInches * totalInches);
            }

            // Display Results
            displayBmiResult(bmi);
        });
    }

    // Display formatted results
    function displayBmiResult(bmiValue) {
        const roundedBmi = bmiValue.toFixed(1);
        if (bmiScoreElem) bmiScoreElem.textContent = roundedBmi;

        let category = '';
        let categoryClass = '';
        let advice = '';

        if (bmiValue < 18.5) {
            category = 'Underweight';
            categoryClass = 'category-underweight';
            advice = 'Your BMI suggests you may be underweight for your height. Focusing on nutrient-dense calorie surplus and progressive resistance training can help build healthy muscle mass.';
        } else if (bmiValue < 25.0) {
            category = 'Normal Weight';
            categoryClass = 'category-normal';
            advice = 'Your BMI is in the normal, healthy range for adults. Maintain your vitality through a balanced diet, consistent cardiovascular activity, and regular strength training.';
        } else if (bmiValue < 30.0) {
            category = 'Overweight';
            categoryClass = 'category-overweight';
            advice = 'Your BMI falls into the overweight category. Combining structured cardiovascular workouts with strength training and mindful caloric moderation can help improve physical conditioning.';
        } else {
            category = 'Obesity';
            categoryClass = 'category-obesity';
            advice = 'Your BMI indicates obesity. Establishing sustainable daily movement habits, low-impact cardio, and consulting with a health specialist or certified trainer is recommended.';
        }

        if (bmiCategoryBadge) {
            bmiCategoryBadge.textContent = category;
            bmiCategoryBadge.className = 'bmi-category-badge ' + categoryClass;
        }

        if (bmiGuidanceText) {
            bmiGuidanceText.textContent = advice;
        }

        // Position the visual marker across the scale (Scale range: 15 to 40)
        if (bmiMarker) {
            const minScale = 15;
            const maxScale = 40;
            let percent = ((bmiValue - minScale) / (maxScale - minScale)) * 100;
            percent = Math.max(3, Math.min(97, percent));
            bmiMarker.style.left = percent + '%';
        }

        if (resultPanel) {
            resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Reset Calculator
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (heightCmInput) heightCmInput.value = '';
            if (weightKgInput) weightKgInput.value = '';
            if (heightFtInput) heightFtInput.value = '';
            if (heightInInput) heightInInput.value = '';
            if (weightLbsInput) weightLbsInput.value = '';

            clearErrors();

            if (bmiScoreElem) bmiScoreElem.textContent = '--';
            if (bmiCategoryBadge) {
                bmiCategoryBadge.textContent = 'Enter Details Above';
                bmiCategoryBadge.className = 'bmi-category-badge';
            }
            if (bmiMarker) bmiMarker.style.left = '0%';
            if (bmiGuidanceText) {
                bmiGuidanceText.textContent = 'Fill in your height and weight above and click "Calculate BMI" to see your personalized classification and recommendations.';
            }
        });
    }
});
