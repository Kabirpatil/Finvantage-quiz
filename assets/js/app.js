// --- 1. INIT & DATA ---
const defaultQs = {
    easy: [
        {q:"Who regulates Indian banks?", o:["RBI","SBI","Finance Ministry","NITI Aayog"], a:0}, 
        {q:"PIN stands for?", o:["Personal ID Number","Private ID Node","Primary Identity Num","Public Index"], a:0},
        {q:"ATM stands for?", o:["Automated Teller Machine","Any Time Money","Auto Tech Machine","All Time Money"], a:0},
        {q:"Which account pays interest?", o:["Current","Savings","Credit Card","Demat"], a:1},
        {q:"Validity of a cheque?", o:["3 Months","6 Months","1 Year","Lifetime"], a:0},
        {q:"Plastic Money refers to?", o:["Credit Cards","Coins","Paper Notes","Gold"], a:0},
        {q:"Minimum age to open bank account independently?", o:["10 Years","18 Years","21 Years","15 Years"], a:0},
        {q:"CVV stands for?", o:["Card Verification Value","Card Valid Vendor","Code Verify Visa","Cash Value Vault"], a:0},
        {q:"Full form of OTP?", o:["One Time Password","Only The Password","One Text Phone","On Time Payment"], a:0},
        {q:"Safe place to keep jewelry?", o:["Bank Locker","Savings Account","Fixed Deposit","Mutual Fund"], a:0}
    ],
    medium: [
        {q:"Bull Market means?", o:["Prices Rising","Prices Falling","Market Closed","Stable Prices"], a:0}, 
        {q:"KYC Act year?", o:["2002","1999","2010","1947"], a:0},
        {q:"Repo Rate is rate at which?", o:["RBI lends to Banks","Banks lend to RBI","Banks lend to public","RBI lends to Govt"], a:0},
        {q:"Full form of NEFT?", o:["National Electronic Funds Transfer","Net Equity Finance Trust","New Electronic Fund Tool","National Equity Fund"], a:0},
        {q:"What is CIBIL Score related to?", o:["Credit Worthiness","Share Market","Insurance","Mutual Funds"], a:0},
        {q:"Maximum amount in RTGS?", o:["No Limit","2 Lakhs","5 Lakhs","10 Lakhs"], a:0},
        {q:"IFSC code has how many characters?", o:["11","10","12","9"], a:0},
        {q:"What is a 'Bad Bank'?", o:["Bank with high NPAs","Bank that is closed","Bank set up to buy bad loans","Illegal Bank"], a:2},
        {q:"NPA stands for?", o:["Non Performing Asset","Net Profit Asset","New Personal Account","National Public Asset"], a:0},
        {q:"Who signs the 1 Rupee note?", o:["Finance Secretary","RBI Governor","Prime Minister","President"], a:0}
    ],
    hard: [
        {q:"Basel III deals with?", o:["Capital Adequacy","Digital Payments","Customer Service","KYC Norms"], a:0},
        {q:"Headquarters of World Bank?", o:["Washington DC","Geneva","New York","London"], a:0},
        {q:"What is 'Green Banking'?", o:["Eco-friendly practices","Agriculture Finance","Paper money","Digital money"], a:0},
        {q:"Stagflation is?", o:["High Inflation + High Unemployment","Low Inflation + High Growth","Deflation","Hyperinflation"], a:0},
        {q:"SWIFT HQ is located in?", o:["Belgium","USA","Switzerland","UK"], a:0},
        {q:"Which is a derivative?", o:["Futures","Shares","Bonds","Fixed Deposit"], a:0},
        {q:"Teaser Loan rates are?", o:["Initially low then rise","Fixed forever","Very high initially","0% interest"], a:0},
        {q:"Money Laundering Step 1?", o:["Placement","Layering","Integration","Structuring"], a:0},
        {q:"MCLR stands for?", o:["Marginal Cost of Funds based Lending Rate","Max Cost Lending Rate","Min Cash Lending Rate","Money Cost Rate"], a:0},
        {q:"Who regulates Insurance in India?", o:["IRDAI","RBI","SEBI","PFRDA"], a:0}
    ]
};

const db = {
    getUsers: () => JSON.parse(localStorage.getItem('fin_users')) || [],
    saveUsers: (u) => localStorage.setItem('fin_users', JSON.stringify(u)),
    getQs: () => JSON.parse(localStorage.getItem('fin_qs')) || defaultQs,
    saveQs: (q) => localStorage.setItem('fin_qs', JSON.stringify(q))
};

let currentUser = null;

// --- 2. CORE NAVIGATION ---
const app = {
    nav: (id) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        const showNav = ['dashboard-screen', 'leaderboard-screen', 'rewards-screen'].includes(id);
        document.getElementById('btm-nav').style.display = showNav ? 'flex' : 'none';
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        if(id === 'dashboard-screen') document.querySelector('.nav-btn:nth-child(1)').classList.add('active');
        if(id === 'rewards-screen') document.querySelector('.nav-btn:nth-child(2)').classList.add('active');
        if(id === 'leaderboard-screen') document.querySelector('.nav-btn:nth-child(3)').classList.add('active');

        if(id === 'leaderboard-screen') leaderboard.render();
        if(id === 'rewards-screen') rewards.render();
        
        localStorage.setItem('fin_last_screen', id);
    },
    navBack: () => {
        if(currentUser) app.nav('dashboard-screen');
        else app.nav('landing-screen');
    }
};

// --- 3. AUTH ---
const auth = {
    login: () => {
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value.trim();
        if(!u) return alert("Please enter username");

        if(u === 'admin' && p === 'admin123') { 
            localStorage.setItem('fin_session_user', 'admin');
            app.nav('admin-screen'); 
            admin.renderUserList();
            admin.renderQuestionList();
            return; 
        }

        const users = db.getUsers();
        const user = users.find(x => x.username === u && x.password === p);

        if(user) {
            currentUser = user;
            if(!currentUser.rewards) currentUser.rewards = [];
            localStorage.setItem('fin_session_user', currentUser.username);
            if(!currentUser.gamesPlayed) currentUser.gamesPlayed = 0;
            auth.loadDashboard();
        } else {
            alert("User not found or wrong password.");
        }
    },
    signup: () => {
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value.trim();
        if(!u || !p) return alert("Enter details");
        
        const users = db.getUsers();
        if(users.find(x => x.username === u)) return alert("User exists");

        const newUser = { username: u, password: p, xp: 0, gamesPlayed: 0, rewards: [] };
        users.push(newUser);
        db.saveUsers(users);
        currentUser = newUser;
        localStorage.setItem('fin_session_user', currentUser.username);
        auth.loadDashboard();
    },
    loadDashboard: () => {
        document.getElementById('user-name').innerText = currentUser.username;
        document.getElementById('user-xp').innerText = currentUser.xp;
        document.getElementById('total-games').innerText = currentUser.gamesPlayed || 0;

        const users = db.getUsers().sort((a,b) => b.xp - a.xp);
        const rank = users.findIndex(x => x.username === currentUser.username) + 1;
        document.getElementById('dash-rank').innerText = rank > 0 ? "#" + rank : "-";
        app.nav('dashboard-screen');
    },
    logout: () => {
        currentUser = null;
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        localStorage.removeItem('fin_session_user');
        localStorage.removeItem('fin_last_screen');
        app.nav('landing-screen');
    }
};

// --- 4. QUIZ LOGIC ---
const quiz = {
    qList: [],
    idx: 0,
    score: 0,
    
    start: (lvl) => {
        const allQs = db.getQs();
        quiz.qList = allQs[lvl] || allQs['easy'];
        quiz.idx = 0;
        quiz.score = 0;
        document.getElementById('lvl-badge').innerText = lvl.toUpperCase();
        app.nav('quiz-screen');
        quiz.load();
    },
    abort: () => {
        quiz.idx = 0;
        quiz.score = 0;
        app.nav('dashboard-screen');
    },
    load: () => {
        if(quiz.idx >= quiz.qList.length) { quiz.finish(); return; }
        
        const data = quiz.qList[quiz.idx];
        document.getElementById('q-text').innerText = data.q;
        document.getElementById('progress-bar').style.width = ((quiz.idx) / quiz.qList.length) * 100 + "%";
        
        const cont = document.getElementById('options-container');
        cont.innerHTML = "";
        
        let opts = data.o.map((txt, i) => ({ txt, i }));
        opts.sort(() => Math.random() - 0.5);
        
        opts.forEach(optObj => {
            const btn = document.createElement('div');
            btn.className = 'quiz-opt';
            btn.innerText = optObj.txt;
            btn.dataset.idx = optObj.i; 
            btn.onclick = () => quiz.check(optObj.i, btn, data.a);
            cont.appendChild(btn);
        });
    },
    check: (i, btn, correct) => {
        const allBtns = document.getElementsByClassName('quiz-opt');
        Array.from(allBtns).forEach(b => b.onclick = null);
        
        if(i === correct) {
            btn.classList.add('correct');
            quiz.score++;
        } else {
            btn.classList.add('wrong');
            Array.from(allBtns).forEach(b => {
                if(parseInt(b.dataset.idx) === correct) b.classList.add('show-correct');
            });
        }
        setTimeout(() => { quiz.idx++; quiz.load(); }, 2000);
    },
    finish: () => {
        // XP is 30 per question
        const gainedXP = quiz.score * 30;
        currentUser.xp += gainedXP;
        currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
        
        const users = db.getUsers();
        const userIdx = users.findIndex(u => u.username === currentUser.username);
        if(userIdx > -1) { users[userIdx] = currentUser; db.saveUsers(users); }

        document.getElementById('final-score').innerText = Math.round((quiz.score / quiz.qList.length) * 100);
        app.nav('result-screen');
    }
};

// --- 5. LEADERBOARD ---
const leaderboard = {
    render: () => {
        const list = document.getElementById('leaderboard-list');
        const emptyMsg = document.getElementById('empty-lb-msg');
        list.innerHTML = "";
        
        const users = db.getUsers().filter(u => u.username !== 'admin').sort((a, b) => b.xp - a.xp);

        if(users.length === 0) { emptyMsg.style.display = "block"; return; }
        emptyMsg.style.display = "none";

        users.forEach((u, i) => {
            const rank = i + 1;
            let cls = rank === 1 ? "top-1" : "";
            const html = `<div class="rank-card ${cls}"><div class="rank-pos">#${rank}</div><div class="rank-name">${u.username}</div><div class="rank-xp">${u.xp} XP</div></div>`;
            list.innerHTML += html;
        });
    }
};

// --- 6. ADMIN ---
const admin = {
    addQuestion: () => {
        const q = document.getElementById('new-q-text').value;
        const o1 = document.getElementById('new-opt-1').value;
        const o2 = document.getElementById('new-opt-2').value;
        const o3 = document.getElementById('new-opt-3').value;
        const o4 = document.getElementById('new-opt-4').value;
        const correct = parseInt(document.getElementById('new-correct-idx').value);
        const diff = document.getElementById('new-difficulty').value;
        
        if(q && o1 && o2 && o3 && o4) {
            const allQs = db.getQs();
            if(!allQs[diff]) allQs[diff] = [];
            allQs[diff].push({ q: q, o: [o1, o2, o3, o4], a: correct });
            db.saveQs(allQs);
            document.getElementById('admin-msg').innerText = "Saved!";
            setTimeout(() => document.getElementById('admin-msg').innerText = "", 2000);
            
            document.getElementById('new-q-text').value = "";
            document.getElementById('new-opt-1').value = "";
            document.getElementById('new-opt-2').value = "";
            document.getElementById('new-opt-3').value = "";
            document.getElementById('new-opt-4').value = "";
            admin.renderQuestionList();
        } else {
            alert("Please fill all fields");
        }
    },
    renderUserList: () => {
        const users = db.getUsers().filter(u => u.username !== 'admin');
        const list = document.getElementById('admin-user-list');
        if(!list) return;
        list.innerHTML = users.length ? "" : "<p style='font-size:12px;color:#666;'>No students.</p>";
        users.forEach(u => {
            list.innerHTML += `<div class="admin-user-row"><span style="font-size:13px;">${u.username} (${u.xp} XP)</span><button class="btn-sm-danger" onclick="admin.removeUser('${u.username}')">Remove</button></div>`;
        });
    },
    removeUser: (username) => {
        if(confirm("Delete " + username + "?")) {
            let users = db.getUsers().filter(u => u.username !== username);
            db.saveUsers(users);
            admin.renderUserList();
        }
    },
    renderQuestionList: () => {
        const allQs = db.getQs();
        const list = document.getElementById('admin-question-list');
        if(!list) return;
        list.innerHTML = "";
        ['easy', 'medium', 'hard'].forEach(lvl => {
            if(allQs[lvl] && allQs[lvl].length) {
                list.innerHTML += `<div style="color:#10b981; font-size:11px; font-weight:bold; margin:10px 0 5px; text-transform:uppercase;">${lvl} (${allQs[lvl].length})</div>`;
                allQs[lvl].forEach((q, i) => {
                    list.innerHTML += `<div style="display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05);"><div style="font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:70%; color:#94a3b8;">${i+1}. ${q.q}</div><button class="btn-sm-danger" style="padding:2px 6px; font-size:9px; margin:0;" onclick="admin.deleteQuestion('${lvl}', ${i})">×</button></div>`;
                });
            }
        });
    },
    deleteQuestion: (lvl, idx) => {
        if(confirm("Delete this question?")) {
            const allQs = db.getQs();
            allQs[lvl].splice(idx, 1);
            db.saveQs(allQs);
            admin.renderQuestionList();
        }
    }
};

// --- 7. TOOLS ---
const tools = {
    calcEMI: () => {
        const P = document.getElementById('c-amount').value;
        const R = document.getElementById('c-rate').value;
        const N = document.getElementById('c-years').value;
        if(P && R && N) {
            const r = R / 1200, n = N * 12;
            const val = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
            document.getElementById('c-result').innerText = val.toFixed(2);
        }
    }
};

// --- 8. REWARDS SYSTEM (30 Premium Items) ---
const rewardList = [
    // TIER 1: Quick Wins (30 - 250 XP)
    { xp: 30, id: 'r1', icon: '💵', title: "$1 Virtual Cash", desc: "Your first dollar!" },
    { xp: 60, id: 'r2', icon: '🪪', title: "Intern ID Card", desc: "Welcome to the team." },
    { xp: 90, id: 'r3', icon: '☕', title: "Free Coffee", desc: "Stay caffeinated." },
    { xp: 150, id: 'r4', icon: '🛍️', title: "$5 Gift Card", desc: "Treat yourself." },
    { xp: 250, id: 'r5', icon: '📜', title: "Savings Bond", desc: "A safe investment." },

    // TIER 2: Lifestyle (400 - 1600 XP)
    { xp: 400, id: 'r6', icon: '🎧', title: "Spotify Premium", desc: "Music to your ears." },
    { xp: 600, id: 'r7', icon: '💵', title: "$20 Cash Prize", desc: "Dinner is on us." },
    { xp: 900, id: 'r8', icon: '👔', title: "Gold Cufflinks", desc: "Classy business attire." },
    { xp: 1200, id: 'r9', icon: '🎬', title: "Netflix Year Plan", desc: "Binge watch finance movies." },
    { xp: 1600, id: 'r10', icon: '🪙', title: "$50 Crypto", desc: "To the moon!" },

    // TIER 3: Gadgets (2000 - 5000 XP)
    { xp: 2000, id: 'r11', icon: '🕶️', title: "Ray-Ban Aviators", desc: "Look cool while trading." },
    { xp: 2500, id: 'r12', icon: '🎧', title: "AirPods Pro", desc: "Silence the market noise." },
    { xp: 3200, id: 'r13', icon: '💵', title: "$100 Bill", desc: "Benjamin Franklin." },
    { xp: 4000, id: 'r14', icon: '🪑', title: "Ergo Chair", desc: "Sit like a CEO." },
    { xp: 5000, id: 'r15', icon: '📱', title: "iPad Pro", desc: "Trade on the go." },

    // TIER 4: High Value (6500 - 16000 XP)
    { xp: 6500, id: 'r16', icon: '🎮', title: "PlayStation 5", desc: "Play hard." },
    { xp: 8000, id: 'r17', icon: '📈', title: "$500 Invest Fund", desc: "Watch it grow." },
    { xp: 10000, id: 'r18', icon: '📱', title: "iPhone 15 Pro", desc: "Titanium finish." },
    { xp: 12500, id: 'r19', icon: '💻', title: "MacBook Pro M3", desc: "Powerhouse trading station." },
    { xp: 16000, id: 'r20', icon: '🏖️', title: "Bali Trip", desc: "7-Night Luxury Stay." },

    // TIER 5: Luxury (20000 - 50000 XP)
    { xp: 20000, id: 'r21', icon: '⌚', title: "Omega Watch", desc: "Moonwatch edition." },
    { xp: 25000, id: 'r22', icon: '💵', title: "$5,000 Stack", desc: "Make it rain." },
    { xp: 35000, id: 'r23', icon: '🏍️', title: "Ducati Panigale", desc: "Italian speed." },
    { xp: 50000, id: 'r24', icon: '🪙', title: "1 Bitcoin", desc: "Digital Gold." },
    { xp: 75000, id: 'r25', icon: '🚘', title: "Tesla Model S", desc: "Ludicrous mode." },

    // TIER 6: Tycoon (100k - 500k XP)
    { xp: 100000, id: 'r26', icon: '🕰️', title: "Patek Philippe", desc: "Pass it to the next gen." },
    { xp: 150000, id: 'r27', icon: '💰', title: "$250k Trust Fund", desc: "Set for life." },
    { xp: 250000, id: 'r28', icon: '🏙️', title: "NYC Penthouse", desc: "Top of the world." },
    { xp: 350000, id: 'r29', icon: '✈️', title: "Gulfstream Jet", desc: "Fly private only." },
    { xp: 500000, id: 'r30', icon: '🏦', title: "Central Bank", desc: "You own the money printer." }
];

const rewards = {
    render: () => {
        const grid = document.getElementById('reward-grid');
        document.getElementById('reward-user-xp').innerText = currentUser.xp;
        grid.innerHTML = "";

        if(!currentUser.rewards) currentUser.rewards = [];

        rewardList.forEach(r => {
            const div = document.createElement('div');
            const isClaimed = currentUser.rewards.includes(r.id);
            const isUnlocked = currentUser.xp >= r.xp;

            if (isClaimed) {
                div.className = 'reward-card claimed';
                div.innerHTML = `<div class="r-icon">${r.icon}</div><div class="r-title">${r.title}</div>`;
            } else if (isUnlocked) {
                div.className = 'reward-card unclaimed';
                div.innerHTML = `<div class="r-title" style="color:white; font-size:10px;">TAP TO OPEN</div>`;
                div.onclick = () => rewards.open(r);
            } else {
                div.className = 'reward-card locked';
                div.innerHTML = `<div class="r-xp">Needs ${r.xp} XP</div>`;
            }
            grid.appendChild(div);
        });
    },
    open: (r) => {
        currentUser.rewards.push(r.id);
        const users = db.getUsers();
        const idx = users.findIndex(u => u.username === currentUser.username);
        if(idx > -1) { users[idx] = currentUser; db.saveUsers(users); }

        document.getElementById('r-modal-icon').innerText = r.icon;
        document.getElementById('r-modal-title').innerText = r.title;
        document.getElementById('r-modal-desc').innerText = r.desc;
        document.getElementById('reward-modal').style.display = 'flex';
        rewards.render();
    },
    closeModal: () => {
        document.getElementById('reward-modal').style.display = 'none';
    }
};

// --- 9. INIT SESSION & EXPANDED FACTS ---
const lessons = [
    { t: "Oldest Bank", b: "Banca Monte dei Paschi (Italy) has been operating since 1472." },
    { t: "Gold Standard", b: "Ended in 1971. Money is now 'Fiat', backed only by government trust." },
    { t: "Digital Money", b: "Only 8% of the world's currency exists as physical cash." },
    { t: "First ATM", b: "Installed in London (1967). It was inspired by a chocolate vending machine." },
    { t: "Compound Interest", b: "Einstein called it the 'Eighth Wonder of the World'." },
    { t: "Bull vs Bear", b: "Bulls attack up (Market Rises), Bears swipe down (Market Falls)." },
    { t: "Plastic Money", b: "Diners Club issued the first universal credit card in 1950." },
    { t: "Bitcoin", b: "There will only ever be 21 million Bitcoins in existence." },
    { t: "Stock Market", b: "The first official stock exchange started in Amsterdam in 1602." },
    { t: "Inflation", b: "A penny in 1913 had the same buying power as $0.30 today." },
    { t: "Monopoly Money", b: "More Monopoly money is printed annually than real US Dollars." },
    { t: "Credit Score", b: "FICO scores were introduced in 1989 to standardize lending." }
];

let fIdx = 0;
function rotateFact() {
    const c = document.getElementById('fact-text-container');
    if(c) {
        c.classList.add('hidden');
        setTimeout(() => {
            // Randomize facts instead of sequential order for variety
            fIdx = Math.floor(Math.random() * lessons.length);
            document.getElementById('fact-title').innerText = lessons[fIdx].t;
            document.getElementById('fact-body').innerText = lessons[fIdx].b;
            c.classList.remove('hidden');
        }, 500);
    }
}

function initSession() {
    setInterval(rotateFact, 6000); 
    rotateFact();

    const sessionUser = localStorage.getItem('fin_session_user');
    const lastScreen = localStorage.getItem('fin_last_screen');

    if (sessionUser) {
        if (sessionUser === 'admin') {
            app.nav('admin-screen');
            admin.renderUserList();
            admin.renderQuestionList();
        } else {
            const users = db.getUsers();
            const user = users.find(u => u.username === sessionUser);
            if (user) {
                currentUser = user;
                const invalidScreens = ['auth-screen', 'landing-screen', 'quiz-screen', 'result-screen'];
                
                if (lastScreen && !invalidScreens.includes(lastScreen)) {
                    auth.loadDashboard(); 
                    app.nav(lastScreen);
                } else {
                    auth.loadDashboard();
                }
            } else {
                auth.logout();
            }
        }
    } else {
        app.nav('landing-screen');
    }
}

initSession();