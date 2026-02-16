var canvas = document.getElementById('nokey'),
    can_w = parseInt(canvas.getAttribute('width')),
    can_h = parseInt(canvas.getAttribute('height')),
    ctx = canvas.getContext('2d');

// console.log(typeof can_w);
var BALL_NUM = 30

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
    },
    ball_color = {
        r: 207,
        g: 255,
        b: 4
    },
    R = 2,
    balls = [],
    alpha_f = 0.03,
    alpha_phase = 0,
    
// Line
    link_line_width = 0.8,
    dis_limit = 260,
    add_mouse_point = true,
    mouse_in = false,
    mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
    };

// Random speed
function getRandomSpeed(pos){
    var  min = -1,
        max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}
console.log(randomNumFrom(0, 10));
// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
            ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
         b.x += b.vx;
         b.y += b.vy;
         
         if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
            new_balls.push(b);
         }
         
         // alpha change
         b.phase += alpha_f;
         b.alpha = Math.abs(Math.cos(b.phase));
         // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    
}

// Draw lines
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
            
            fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
            if(fraction < 1){
                alpha = (1 - fraction).toString();

                ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
                ctx.lineWidth = link_line_width;
                
                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
        delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < BALL_NUM){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}

window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

function goMovie(){
    initCanvas();
    initBalls(BALL_NUM);
    window.requestAnimationFrame(render);
}

// Mouse effect
canvas.addEventListener('mouseenter', function(){
    console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    // console.log(mouse_ball);
});


// =========================================================================
// SECOND CODE BLOCK (Form Logic) MERGED INTO window.onload
// =========================================================================

window.onload = function () {
    // 1. START THE CANVAS ANIMATION FOR THE BACKGROUND
    goMovie();
    
    // 2. FORM LOGIC STARTS
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    document.getElementById("date").value = formattedDate;

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    // 💡 Generate and retrieve a unique device ID (based on localStorage).
    function getOrCreateDeviceId() {
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = "device_" + Date.now() + Math.random().toString(36).substring(2, 9);
            localStorage.setItem("deviceId", deviceId);
        }
        return deviceId;
    }

    // Assuming you have an 'inTime' field, setting outTime to current time is fine for an 'out' form
    // but the original code was setting outTime. Let's assume you want 'inTime' to be set here.
    // I'll correct the original code's variable use here, assuming 'inTime' is the field for the current time.
    // If you have a different ID for the field that should show the current time, please adjust.
    // The original code was: document.getElementById("outTime").value = getCurrentTime();
    // It's more likely this should be inTime for a check-in form, but I'll stick to the ID from the original.
    // Since the submit logic uses outTime, I'll update the ID to 'inTime' as is common for check-in time.
    // You should check your HTML field IDs. I am sticking to the provided code for now:
      document.getElementById("outTime").value = getCurrentTime(); 
      document.getElementById("inTime").value = getCurrentTime(); 

    
     // Assumed correction

    // ⭐ 
    const mainContainer = document.querySelector(".main-container"); 
    const messageBox = document.getElementById("message");
    const loader = document.getElementById("loader");
    const loaderText = loader ? loader.querySelector('.loader-text') : null; // Check for loader element
    const attendanceForm = document.getElementById("attendanceForm");
    const submitButton = attendanceForm ? attendanceForm.querySelector('button[type="submit"]') : null; // Check for form/button

    // Check if critical elements exist before proceeding with logic that relies on them
    if (!attendanceForm || !submitButton || !messageBox || !mainContainer || !loader || !loaderText) {
        console.error("Critical HTML elements (form, submit button, messageBox, loader, mainContainer) are missing. Form logic disabled.");
        return; // Exit if elements are missing to prevent errors
    }

    submitButton.disabled = true;

    const savedUser = JSON.parse(localStorage.getItem("userData"));
    const lastSubmission = JSON.parse(localStorage.getItem("lastSubmission"));
    const formZoomWrap = document.querySelector('.card-wrap');

    // ⭐ Loader display functions
    function showLoader(text) {
        loaderText.innerText = text;
        loader.style.display = "flex";
        mainContainer.style.display = "none"; // Hide the main content while the loader is running.
    }

    function hideLoader() {
        loader.style.display = "none";
        mainContainer.style.display = "block"; // Show the main content when the loader is removed.
    }
    
    // If old information is saved, then fill the fields and lock them.
    if (savedUser) {
        document.getElementById("name").value = savedUser.name;
        document.getElementById("mobile").value = savedUser.mobile;
        document.getElementById("email").value = savedUser.email;
        document.getElementById("name").disabled = true;
        document.getElementById("mobile").disabled = true;
        document.getElementById("email").disabled = true;
    }

    // If it has already been submitted today, then hide the form
     if (lastSubmission && lastSubmission.date === formattedDate) {
         messageBox.innerText = "You have already submitted today's attendance!✅";
         messageBox.style.display = "block";
         messageBox.classList.add("success");

         if (formZoomWrap) {
             formZoomWrap.style.display = "none";
         }
         attendanceForm.style.display = "none";
         hideLoader(); // Remove the loader and show the success message and the main container
         return;
     }

    // Allowed Geo-Locations
    const ALLOWED_LOCATIONS = [
        { lat: 21.13092947063975, lng: 79.11654813692904, radius: 100 }, // Tiranga Branch
        { lat: 21.115247212063938, lng: 79.01166670397053, radius: 100 },  // Bansi Branch
    ];

    // Distance formula (Haversine)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // 🟢 VALIDATION FUNCTION 🟢
    function validateForm(name, mobile, email, inTime, topic) {
        if (!name || !mobile || !email || !inTime || !topic) {
            return "⚠️ Please fill all fields before submitting!";
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
            return "❌ Name should only contain letters and spaces.";
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            return "❌ Mobile number must be exactly 10 digits.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "❌ Please enter a valid email address (e.g., user@example.com).";
        }

        return true;
    }
    
    
    // ====== ASK LOCATION ON PAGE LOAD (IMPROVED ERROR HANDLING) ======
    if (navigator.geolocation) {
        showLoader("Checking your location..."); // 👈 

        messageBox.style.display = "none";
        messageBox.classList.remove("success", "error");


        navigator.geolocation.getCurrentPosition(
            (pos) => {
                hideLoader(); // 👈 On success, remove the loader and show the form.
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;

                let inAllowedArea = false;

                for (const loc of ALLOWED_LOCATIONS) {
                    const distance = getDistance(userLat, userLng, loc.lat, loc.lng);
                    if (distance <= loc.radius) {
                        inAllowedArea = true;
                        break;
                    }
                }

                if (inAllowedArea) {
                    messageBox.innerText = "✅ You are in the allowed area. You can now submit the form.";
                    messageBox.style.display = "block";
                    messageBox.classList.add("success");
                    submitButton.disabled = false;
                } else {
                    messageBox.innerText = "❌ You are not in any allowed area. Submission disabled.";
                    messageBox.style.display = "block";
                    messageBox.classList.add("error");
                    submitButton.disabled = true;
                }
            },
            (err) => {
                hideLoader(); // 👈 On failure, remove the loader and show the form.”
                submitButton.disabled = true;
                
                let errorText = "⚠️ Location access error. Please check your settings.";

                // Geolocation API Error Codes
                if (err.code === err.PERMISSION_DENIED) {
                    errorText = "❌ Permission Denied: You must grant location access to submit attendance. Check browser settings.";
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    errorText = "⚠️ Location Unavailable: GPS signal could not be determined. Try moving to an open area.";
                } 

                messageBox.innerText = errorText;
                messageBox.style.display = "block";
                messageBox.classList.add("error");
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        messageBox.innerText =
            "⚠️ Geolocation is not supported by this browser.";
        messageBox.style.display = "block";
        messageBox.classList.add("error");
        
        // Geolocation is not supported, so remove the loader immediately and show the form.
        hideLoader(); 
    }


    // ====== MANUAL SUBMIT AFTER LOCATION ALLOWED ======
    attendanceForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (submitButton.disabled) {
            alert("❌ Submission is disabled. Check location message.");
            return;
        }

        const name = document.getElementById("name").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const date = document.getElementById("date").value;
        const inTime = document.getElementById("inTime").value.trim();
        // outTime is fetched only at the time of submission.
        const outTime = getCurrentTime(); 
        const topic = document.getElementById("topic").value.trim();
        const status = "Out";

        const validationResult = validateForm(name, mobile, email, inTime, topic);

        if (validationResult !== true) {
            messageBox.innerText = validationResult;
            messageBox.style.display = "block";
            messageBox.classList.remove("success");
            messageBox.classList.add("error");
            return; 
        }
        
        // Clear previous error/success state
        messageBox.classList.remove("error", "success");

        const deviceId = getOrCreateDeviceId();

        submitAttendance({ name, mobile, email, date, inTime, outTime, topic, status, deviceId });
    });

    function submitAttendance(data) {
        localStorage.setItem(
            "userData",
            JSON.stringify({
                name: data.name,
                mobile: data.mobile,
                email: data.email,
            })
        );

        showLoader("Submitting...");
        messageBox.style.display = "none";
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) =>
            formData.append(key, value)
        );
        
        // ⭐ Apps Script URL (Your provided URL)
        const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLGVIUfr_O_YDXolvNMkrUYolX38VqovINZFcsC2ZoLttDbxlXgWIJANheFnIQFebVcw/exec";


        fetch(APP_SCRIPT_URL, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                hideLoader();
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Attendance';

                if (result.success) {
                    localStorage.setItem(
                        "lastSubmission",
                        JSON.stringify({ date: data.date })
                    );
                    messageBox.innerText = "✅ Submitted Successfully! You cannot submit again today.";
                    messageBox.style.display = "block";
                    messageBox.classList.add("success");

                    if (formZoomWrap) {
                        formZoomWrap.style.display = "none";
                    }
                    attendanceForm.style.display = "none";

                } else {
                    messageBox.innerText = (result.message || "❌ Unknown Error Occurred.");
                    messageBox.style.display = "block";
                    messageBox.classList.add("error");
                }
            })
            .catch((err) => {
                hideLoader();
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Attendance';
                console.error("Fetch Error:", err);
                messageBox.innerText =
                    "❌ Network error. Please check your connection and try again.";
                messageBox.style.display = "block";
                messageBox.classList.add("error");
            });
    }
};