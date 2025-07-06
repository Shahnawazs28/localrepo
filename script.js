document.addEventListener('DOMContentLoaded', function() {
    const birthdateInput = document.getElementById('birthdate');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('result');
    const errorSection = document.getElementById('error');
    const errorText = document.getElementById('errorText');
    
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    birthdateInput.max = today;
    
    // Calculate age when button is clicked
    calculateBtn.addEventListener('click', calculateAge);
    
    // Calculate age when Enter is pressed in the input
    birthdateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateAge();
        }
    });
    
    // Hide error when user starts typing
    birthdateInput.addEventListener('input', function() {
        hideError();
    });
    
    function calculateAge() {
        const birthdate = birthdateInput.value;
        
        if (!birthdate) {
            showError('Please select your birth date');
            return;
        }
        
        const birthDate = new Date(birthdate);
        const currentDate = new Date();
        
        // Check if birth date is in the future
        if (birthDate > currentDate) {
            showError('Birth date cannot be in the future');
            return;
        }
        
        // Check if birth date is too far in the past (more than 150 years)
        const maxAge = new Date();
        maxAge.setFullYear(maxAge.getFullYear() - 150);
        if (birthDate < maxAge) {
            showError('Please enter a valid birth date');
            return;
        }
        
        hideError();
        
        // Calculate age
        const ageData = getDetailedAge(birthDate, currentDate);
        displayResults(ageData);
    }
    
    function getDetailedAge(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        
        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total days lived
        const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        
        // Calculate total hours lived
        const totalHours = totalDays * 24;
        
        // Calculate next birthday
        const nextBirthday = getNextBirthday(birthDate, currentDate);
        
        return {
            years,
            months,
            days,
            totalDays,
            totalHours,
            nextBirthday
        };
    }
    
    function getNextBirthday(birthDate, currentDate) {
        const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        // If birthday has passed this year, set it for next year
        if (nextBirthday <= currentDate) {
            nextBirthday.setFullYear(currentDate.getFullYear() + 1);
        }
        
        const timeDiff = nextBirthday - currentDate;
        const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysUntilBirthday === 0) {
            return "Today! 🎉";
        } else if (daysUntilBirthday === 1) {
            return "Tomorrow! 🎂";
        } else {
            return `${daysUntilBirthday} days`;
        }
    }
    
    function displayResults(ageData) {
        // Update age display
        document.getElementById('years').textContent = ageData.years;
        document.getElementById('months').textContent = ageData.months;
        document.getElementById('days').textContent = ageData.days;
        
        // Update additional info
        document.getElementById('totalDays').textContent = ageData.totalDays.toLocaleString();
        document.getElementById('totalHours').textContent = ageData.totalHours.toLocaleString();
        document.getElementById('nextBirthday').textContent = ageData.nextBirthday;
        
        // Show results with animation
        resultSection.classList.remove('hidden');
        
        // Add animation class for smooth appearance
        setTimeout(() => {
            resultSection.style.opacity = '1';
        }, 50);
    }
    
    function showError(message) {
        errorText.textContent = message;
        errorSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    }
    
    function hideError() {
        errorSection.classList.add('hidden');
    }
    
    // Add some fun birthday messages for special cases
    function getBirthdayMessage(years) {
        if (years === 0) return "Welcome to the world! 👶";
        if (years === 1) return "Happy 1st birthday! 🎂";
        if (years === 18) return "You're officially an adult! 🎓";
        if (years === 21) return "Cheers to 21! 🥂";
        if (years === 50) return "Half a century of wisdom! 👑";
        if (years === 100) return "A century of life! 🌟";
        return null;
    }
});