/* ============================================================
   CHORCHA — curriculum content, seed accounts, i18n
   ============================================================ */

const APP = { name: "Chorcha", bn: "চর্চা", version: "2.0" };

/* ---------------- i18n (UI strings) ---------------- */
const I18N = {
  en: {
    dashboard: "Dashboard", learn: "Learn", practice: "Practice", exams: "Exams",
    mistakes: "Mistakes", revision: "Revision", cq: "Creative Qs", analytics: "Analytics",
    friends: "Friends", messages: "Messages", match: "1v1 Match", leaderboard: "Leaderboard",
    videos: "Video Lessons", admin: "Admin", settings: "Settings", profile: "Profile",
    notifications: "Notifications", search: "Search subjects, chapters, questions…",
    welcome: "Welcome back", continueLearning: "Continue learning", viewAll: "View all",
    subjects: "Subjects", chapters: "Chapters", startPractice: "Start practice",
    questions: "questions", minutes: "min", accuracy: "Accuracy", streak: "day streak",
    level: "Level", xp: "XP", rank: "Rank", correct: "Correct", wrong: "Incorrect",
    unanswered: "Unanswered", submit: "Submit", next: "Next question", finish: "Finish",
    previous: "Previous", explanation: "Explanation", bookmark: "Bookmark", report: "Report",
    retry: "Try again", back: "Back", cancel: "Cancel", save: "Save", close: "Close",
    signIn: "Sign in", signUp: "Create account", signOut: "Sign out", email: "Email",
    password: "Password", username: "Username", displayName: "Display name", class: "Class",
    medium: "Medium", group: "Group", bangla: "Bangla", english: "English",
    pendingTitle: "Approval pending", approved: "Approved", rejected: "Rejected",
    allGroups: "All groups", markedGroups: "Marked groups", approve: "Approve", reject: "Reject",
    suspend: "Suspend", resolve: "Resolve case", reason: "Reason", today: "Today",
    yesterday: "Yesterday", empty: "Nothing here yet", due: "Due today", reviewed: "Reviewed",
    noUnread: "You're all caught up", minutesLeft: "min left", publishedDraft: "Draft",
    published: "Published", archived: "Archived", unpublish: "Unpublish", publish: "Publish",
    videoAccess: "Video access", grant: "Grant access", revoke: "Revoke access",
    lockedTitle: "Video lessons are locked", lockedBody: "Video library access is granted by an administrator for your account.",
    language: "Language", theme: "Theme", dark: "Dark", light: "Light", daysLeft: "days left",
    overdue: "Overdue", warning: "Warning", writeAnswer: "Write your answer…", modelAnswer: "Model answer",
    showAnswer: "Show model answer", hideAnswer: "Hide model answer", saveDraft: "Save draft", saved: "Saved",
    selfAssess: "Self-assessment", marksObtained: "Marks obtained", print: "Print / PDF",
    yourAnswer: "Your answer", questionPalette: "Question palette", timeRemaining: "Time remaining",
    flagged: "Flagged", answered: "Answered", instructions: "Instructions", beginExam: "Begin exam",
    searchFriends: "Search by username…", addFriend: "Add friend", pendingRequests: "Requests",
    yourFriends: "Your friends", people: "People", block: "Block", unblock: "Unblock",
    remove: "Remove", accept: "Accept", decline: "Decline", requested: "Requested",
    send: "Send", typeMessage: "Write a message…", reportChat: "Report conversation",
    privateChat: "Private — only you and your friend can read this chat.",
    reportedChat: "Case open — an administrator can review this conversation until the case is resolved.",
    groupNotice: "Group chats may be reviewed by administrators for safety.",
    voiceNote: "Voice note", record: "Record", stop: "Stop", recording: "Recording…",
    overview: "Overview", approvals: "Approvals", users: "Users", content: "Questions",
    reportsTab: "Chat reports", groupsTab: "Groups", announcements: "Announcements",
    audit: "Audit log", videoLibrary: "Video library", createGroup: "New group",
    allSubjects: "All subjects", filter: "Filter", difficulty: "Difficulty", easy: "Easy",
    medium2: "Medium", hard: "Hard", markReviewed: "Mark reviewed", retryMistakes: "Practise mistakes",
    inQueue: "in revision queue", mastery: "Mastery", upcoming: "Upcoming",
    fromTheTeam: "From the team", quickActions: "Quick actions", noActivity: "No activity yet",
    needHelp: "Need help?", privacy: "Privacy", account: "Account", preferences: "Preferences",
    changePassword: "Update password", deleteAccount: "Delete account", sessions: "Active sessions",
    newPassword: "New password", verify: "Verify", resend: "Resend", checkStatus: "Check status",
    registerNote: "Every new account is reviewed by an administrator before learning features unlock.",
    demoAccounts: "Demo accounts", useAccount: "Use account", or: "or",
    fullName: "Full name", confirmPassword: "Confirm password", optional: "optional",
    questionOfTheDay: "Question of the day", upcomingExam: "Next exam", revisionQueue: "Revision queue",
    recentActivity: "Recent activity", subjectPerformance: "Subject performance",
    scoreHistory: "Score history", practiceConsistency: "Practice consistency", totalPoints: "Total XP",
    examsTaken: "Exams taken", avgScore: "Avg score", studyTime: "Study time", dayShort: "d",
    matchLobby: "Match lobby", findOpponent: "Find opponent", challengeFriend: "Challenge a friend",
    matchHistory: "Match history", win: "Win", loss: "Loss", draw: "Draw", rating: "Rating",
    season: "Season", thisMonth: "This month", global: "Global", friendsBoard: "Friends",
    topHundred: "Top 100", league: "League", unlocked: "Unlocked", locked: "Locked",
    achievements: "Achievements", approveAccount: "Approve account", rejectAccount: "Reject with reason",
    suspended: "Suspended", banned: "Banned", active: "Active", status: "Status",
    saveQuestion: "Save question", questionText: "Question text", option: "Option",
    correctOption: "Correct option", upload: "Upload video", title: "Title", description: "Description",
    duration: "Duration", deleteForever: "Delete permanently", archive: "Archive", restore: "Restore",
    caseAge: "Case opened", outcome: "Outcome", closeCase: "Close case",
    warningNotice: "Warning to offender", responseToReporter: "Written response to reporter",
    banOffender: "Ban / suspend offender", visibilityEnds: "Admin visibility ends when the case is resolved.",
    announcementsHint: "Send an announcement to a group of students.",
    audience: "Audience", message: "Message", sendAnnouncement: "Send announcement",
    everything: "All accounts", pendingOnly: "Pending accounts", approvedOnly: "Approved accounts"
  },
  bn: {
    dashboard: "ড্যাশবোর্ড", learn: "শিখুন", practice: "অনুশীলন", exams: "পরীক্ষা",
    mistakes: "ভুলগুলো", revision: "পুনরাবৃত্তি", cq: "সৃজনশীল প্রশ্ন", analytics: "বিশ্লেষণ",
    friends: "বন্ধুরা", messages: "বার্তা", match: "১vs১ লড়াই", leaderboard: "লিডারবোর্ড",
    videos: "ভিডিও পাঠ", admin: "অ্যাডমিন", settings: "সেটিংস", profile: "প্রোফাইল",
    notifications: "বিজ্ঞপ্তি", search: "বিষয়, অধ্যায়, প্রশ্ন খুঁজুন…",
    welcome: "স্বাগতম", continueLearning: "শেখা চালিয়ে যান", viewAll: "সব দেখুন",
    subjects: "বিষয়সমূহ", chapters: "অধ্যায়", startPractice: "অনুশীলন শুরু",
    questions: "প্রশ্ন", minutes: "মিনিট", accuracy: "নির্ভুলতা", streak: "দিনের স্ট্রিক",
    level: "লেভেল", xp: "XP", rank: "র‍্যাঙ্ক", correct: "সঠিক", wrong: "ভুল",
    unanswered: "উত্তরহীন", submit: "জমা দিন", next: "পরের প্রশ্ন", finish: "শেষ করুন",
    previous: "আগের", explanation: "ব্যাখ্যা", bookmark: "বুকমার্ক", report: "রিপোর্ট",
    retry: "আবার চেষ্টা", back: "ফিরে যান", cancel: "বাতিল", save: "সংরক্ষণ", close: "বন্ধ",
    signIn: "সাইন ইন", signUp: "অ্যাকাউন্ট তৈরি", signOut: "সাইন আউট", email: "ইমেইল",
    password: "পাসওয়ার্ড", username: "ইউজারনেম", displayName: "প্রদর্শিত নাম", class: "শ্রেণি",
    medium: "মাধ্যম", group: "গ্রুপ", bangla: "বাংলা", english: "ইংরেজি",
    pendingTitle: "অনুমোদনের অপেক্ষায়", approved: "অনুমোদিত", rejected: "প্রত্যাখ্যাত",
    allGroups: "সব গ্রুপ", markedGroups: "চিহ্নিত গ্রুপ", approve: "অনুমোদন", reject: "প্রত্যাখ্যান",
    suspend: "স্থগিত", resolve: "মামলা নিষ্পত্তি", reason: "কারণ", today: "আজ",
    yesterday: "গতকাল", empty: "এখনো কিছু নেই", due: "আজকের কাজ", reviewed: "পর্যালোচিত",
    noUnread: "সব পড়া হয়েছে", minutesLeft: "মিনিট বাকি", publishedDraft: "খসড়া",
    published: "প্রকাশিত", archived: "সংরক্ষিত", unpublish: "অপ্রকাশ", publish: "প্রকাশ",
    videoAccess: "ভিডিও অ্যাক্সেস", grant: "অ্যাক্সেস দিন", revoke: "অ্যাক্সেস বাতিল",
    lockedTitle: "ভিডিও পাঠ লক করা আছে", lockedBody: "ভিডিও লাইব্রেরির অ্যাক্সেস প্রশাসক আপনার অ্যাকাউন্টে দেন।",
    language: "ভাষা", theme: "থিম", dark: "ডার্ক", light: "লাইট", daysLeft: "দিন বাকি",
    overdue: "মেয়াদোত্তীর্ণ", warning: "সতর্কতা", writeAnswer: "উত্তর লিখুন…", modelAnswer: "মডেল উত্তর",
    showAnswer: "মডেল উত্তর দেখুন", hideAnswer: "মডেল উত্তর লুকান", saveDraft: "খসড়া সংরক্ষণ", saved: "সংরক্ষিত",
    selfAssess: "স্ব-মূল্যায়ন", marksObtained: "প্রাপ্ত নম্বর", print: "প্রিন্ট / PDF",
    yourAnswer: "আপনার উত্তর", questionPalette: "প্রশ্ন তালিকা", timeRemaining: "বাকি সময়",
    flagged: "চিহ্নিত", answered: "উত্তর দেওয়া", instructions: "নির্দেশনা", beginExam: "পরীক্ষা শুরু",
    searchFriends: "ইউজারনেম দিয়ে খুঁজুন…", addFriend: "বন্ধু যোগ করুন", pendingRequests: "অনুরোধ",
    yourFriends: "আপনার বন্ধুরা", people: "শিক্ষার্থী", block: "ব্লক", unblock: "আনব্লক",
    remove: "সরান", accept: "গ্রহণ", decline: "প্রত্যাখ্যান", requested: "অনুরোধ পাঠানো",
    send: "পাঠান", typeMessage: "বার্তা লিখুন…", reportChat: "কথোপকথন রিপোর্ট করুন",
    privateChat: "ব্যক্তিগত — কেবল আপনি ও আপনার বন্ধু এই চ্যাট পড়তে পারেন।",
    reportedChat: "মামলা চলমান — নিষ্পত্তি পর্যন্ত প্রশাসক এই কথোপকথন দেখতে পারেন।",
    groupNotice: "নিরাপত্তার জন্য গ্রুপ চ্যাট প্রশাসক পর্যালোচনা করতে পারেন।",
    voiceNote: "ভয়েস বার্তা", record: "রেকর্ড", stop: "থামান", recording: "রেকর্ড হচ্ছে…",
    overview: "সারসংক্ষেপ", approvals: "অনুমোদন", users: "ব্যবহারকারী", content: "প্রশ্ন",
    reportsTab: "চ্যাট রিপোর্ট", groupsTab: "গ্রুপ", announcements: "ঘোষণা",
    audit: "অডিট লগ", videoLibrary: "ভিডিও লাইব্রেরি", createGroup: "নতুন গ্রুপ",
    allSubjects: "সব বিষয়", filter: "ফিল্টার", difficulty: "কঠিনতা", easy: "সহজ",
    medium2: "মধ্যম", hard: "কঠিন", markReviewed: "পর্যালোচিত করুন", retryMistakes: "ভুলগুলো অনুশীলন",
    inQueue: "পুনরাবৃত্তি তালিকায়", mastery: "দক্ষতা", upcoming: "আসন্ন",
    fromTheTeam: "টিমের পক্ষ থেকে", quickActions: "দ্রুত কাজ", noActivity: "এখনো কার্যক্রম নেই",
    needHelp: "সহায়তা দরকার?", privacy: "গোপনীয়তা", account: "অ্যাকাউন্ট", preferences: "পছন্দ",
    changePassword: "পাসওয়ার্ড পরিবর্তন", deleteAccount: "অ্যাকাউন্ট মুছুন", sessions: "সক্রিয় সেশন",
    newPassword: "নতুন পাসওয়ার্ড", verify: "যাচাই", resend: "আবার পাঠান", checkStatus: "অবস্থা দেখুন",
    registerNote: "শেখার সুবিধা চালু হওয়ার আগে প্রতিটি নতুন অ্যাকাউন্ট প্রশাসক যাচাই করেন।",
    demoAccounts: "ডেমো অ্যাকাউন্ট", useAccount: "অ্যাকাউন্ট ব্যবহার", or: "অথবা",
    fullName: "পূর্ণ নাম", confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন", optional: "ঐচ্ছিক",
    questionOfTheDay: "আজকের প্রশ্ন", upcomingExam: "পরবর্তী পরীক্ষা", revisionQueue: "পুনরাবৃত্তি তালিকা",
    recentActivity: "সাম্প্রতিক কার্যক্রম", subjectPerformance: "বিষয়ভিত্তিক ফলাফল",
    scoreHistory: "স্কোর ইতিহাস", practiceConsistency: "অনুশীলনের ধারাবাহিকতা", totalPoints: "মোট XP",
    examsTaken: "পরীক্ষা দিয়েছেন", avgScore: "গড় স্কোর", studyTime: "পড়ার সময়", dayShort: "দিন",
    matchLobby: "ম্যাচ লবি", findOpponent: "প্রতিপক্ষ খুঁজুন", challengeFriend: "বন্ধুকে চ্যালেঞ্জ",
    matchHistory: "ম্যাচ ইতিহাস", win: "জয়", loss: "হার", draw: "ড্র", rating: "রেটিং",
    season: "সিজন", thisMonth: "এই মাস", global: "বৈশ্বিক", friendsBoard: "বন্ধুরা",
    topHundred: "শীর্ষ ১০০", league: "লিগ", unlocked: "আনলক", locked: "লক করা",
    achievements: "অর্জন", approveAccount: "অ্যাকাউন্ট অনুমোদন", rejectAccount: "কারণসহ প্রত্যাখ্যান",
    suspended: "স্থগিত", banned: "নিষিদ্ধ", active: "সক্রিয়", status: "অবস্থা",
    saveQuestion: "প্রশ্ন সংরক্ষণ", questionText: "প্রশ্নের লেখা", option: "বিকল্প",
    correctOption: "সঠিক উত্তর", upload: "ভিডিও আপলোড", title: "শিরোনাম", description: "বিবরণ",
    duration: "সময়কাল", deleteForever: "স্থায়ীভাবে মুছুন", archive: "সংরক্ষণ", restore: "পুনরুদ্ধার",
    caseAge: "মামলা শুরু", outcome: "ফলাফল", closeCase: "মামলা বন্ধ",
    warningNotice: "অভিযুক্তকে সতর্কবার্তা", responseToReporter: "অভিযোগকারীকে লিখিত উত্তর",
    banOffender: "অভিযুক্তকে নিষিদ্ধ / স্থগিত", visibilityEnds: "মামলা নিষ্পত্তি হলে অ্যাডমিনের দৃশ্যমানতা শেষ হয়।",
    announcementsHint: "শিক্ষার্থীদের একটি দলে ঘোষণা পাঠান।",
    audience: "প্রাপক", message: "বার্তা", sendAnnouncement: "ঘোষণা পাঠান",
    everything: "সব অ্যাকাউন্ট", pendingOnly: "অপেক্ষমাণ অ্যাকাউন্ট", approvedOnly: "অনুমোদিত অ্যাকাউন্ট"
  }
};

/* ---------------- curriculum ---------------- */
const SUBJECTS = [
  { id:"math", name:{en:"Mathematics",bn:"গণিত"}, glyph:"∑", color:["#2E96EB","#1360B4"], group:"all",
    classes:[6,7,8,9,10], chapters:[
      { id:"math-frac", name:{en:"Fractions & Decimals",bn:"ভগ্নাংশ ও দশমিক"}, topics:["Equivalent fractions","Operations","Decimals"] },
      { id:"math-alg", name:{en:"Algebraic Expressions",bn:"বীজগাণিতিক রাশি"}, topics:["Terms","Simplification","Formulae"] },
      { id:"math-eq", name:{en:"Simple Equations",bn:"সরল সমীকরণ"}, topics:["Solving","Word problems"] },
      { id:"math-geo", name:{en:"Geometry & Angles",bn:"জ্যামিতি ও কোণ"}, topics:["Triangles","Angle pairs"] },
      { id:"math-stat", name:{en:"Statistics",bn:"পরিসংখ্যান"}, topics:["Mean","Median"] }
    ]},
  { id:"physics", name:{en:"Physics",bn:"পদার্থবিজ্ঞান"}, glyph:"⚛", color:["#7C5CE0","#4A2FA8"], group:"science",
    classes:[9,10], chapters:[
      { id:"phy-mech", name:{en:"Newtonian Mechanics",bn:"নিউটনীয় বলবিদ্যা"}, topics:["Laws of motion","Momentum"] },
      { id:"phy-energy", name:{en:"Work, Power & Energy",bn:"কাজ, ক্ষমতা ও শক্তি"}, topics:["Work","Power","Kinetic energy"] },
      { id:"phy-elec", name:{en:"Current Electricity",bn:"বর্তমান বিদ্যুৎ"}, topics:["Ohm's law","Series circuits"] }
    ]},
  { id:"chemistry", name:{en:"Chemistry",bn:"রসায়ন"}, glyph:"⚗", color:["#0EA47A","#067054"], group:"science",
    classes:[9,10], chapters:[
      { id:"chem-atom", name:{en:"Atomic Structure",bn:"পারমাণবিক গঠন"}, topics:["Subatomic particles"] },
      { id:"chem-react", name:{en:"Chemical Reactions",bn:"রাসায়নিক বিক্রিয়া"}, topics:["Balancing","Formulae"] },
      { id:"chem-periodic", name:{en:"Periodic Table",bn:"পর্যায় সারণি"}, topics:["Symbols"] }
    ]},
  { id:"biology", name:{en:"Biology",bn:"জীববিজ্ঞান"}, glyph:"✿", color:["#E0486B","#9E2743"], group:"science",
    classes:[9,10], chapters:[
      { id:"bio-cell", name:{en:"Cell & Cell Division",bn:"কোষ ও কোষ বিভাজন"}, topics:["Organelles"] },
      { id:"bio-digest", name:{en:"Human Digestive System",bn:"মানব পরিপাকতন্ত্র"}, topics:["Enzymes","Organs"] }
    ]},
  { id:"ict", name:{en:"ICT",bn:"তথ্য ও যোগাযোগ প্রযুক্তি"}, glyph:"⌘", color:["#E08A0B","#A65B00"], group:"all",
    classes:[6,7,8,9,10], chapters:[
      { id:"ict-num", name:{en:"Number Systems",bn:"সংখ্যা পদ্ধতি"}, topics:["Binary","Hexadecimal"] },
      { id:"ict-sheet", name:{en:"Spreadsheets & Databases",bn:"স্প্রেডশিট ও ডেটাবেস"}, topics:["Formulas","Records"] },
      { id:"ict-prog", name:{en:"Programming Basics",bn:"প্রোগ্রামিং মৌলিক"}, topics:["Loops","Data types"] }
    ]},
  { id:"english", name:{en:"English",bn:"ইংরেজি"}, glyph:"Aa", color:["#2B7FB8","#134A72"], group:"all",
    classes:[6,7,8,9,10], chapters:[
      { id:"eng-tense", name:{en:"Grammar: Tenses",bn:"ব্যাকরণ: কাল"}, topics:["Present","Perfect"] },
      { id:"eng-vocab", name:{en:"Vocabulary & Idioms",bn:"শব্দভান্ডার ও প্রবাদ"}, topics:["Idioms","Antonyms"] }
    ]},
  { id:"bangla", name:{en:"Bangla",bn:"বাংলা"}, glyph:"অ", color:["#B4503A","#7C2E1E"], group:"all",
    classes:[6,7,8,9,10], chapters:[
      { id:"bng-sandhi", name:{en:"Grammar: Sandhi",bn:"ব্যাকরণ: সন্ধি"}, topics:["সন্ধি বিচ্ছেদ"] },
      { id:"bng-poem", name:{en:"Literature: Poetry",bn:"সাহিত্য: কবিতা"}, topics:["কবি পরিচিতি"] }
    ]},
  { id:"bgs", name:{en:"Bangladesh & Global Studies",bn:"বাংলাদেশ ও বিশ্বপরিচয়"}, glyph:"◎", color:["#3E8E7E","#1F5A4F"], group:"all",
    classes:[6,7,8,9,10], chapters:[
      { id:"bgs-land", name:{en:"Bangladesh & the World",bn:"বাংলাদেশ ও বিশ্ব"}, topics:["Divisions","Rivers"] }
    ]}
];

const CHAPTERS = SUBJECTS.flatMap(s => s.chapters.map(c => ({ ...c, subjectId:s.id })));
const subjectOf = id => SUBJECTS.find(s => s.id === id);
const chapterOf = id => CHAPTERS.find(c => c.id === id);

/* ---------------- question builder + bank ---------------- */
function Q(id, subjectId, chapterId, difficulty, source, en, bn) {
  return {
    id, subjectId, chapterId, difficulty, marks:1, source, status:"published",
    en: { q:en[0], opts:en[1], ans:en[2], exp:en[3] },
    bn: bn ? { q:bn[0], opts:bn[1], ans:bn[2], exp:bn[3] } : null
  };
}

const QUESTIONS = [
  /* mathematics */
  Q("q1","math","math-frac","easy","NCTB Class 7 · Mathematics, Ch. 2",
    ["What is 3⁄4 + 1⁄8 ?",["5⁄8","7⁄8","1","1⁄2"],1,"Convert to eighths: 3⁄4 = 6⁄8, then 6⁄8 + 1⁄8 = 7⁄8."],
    ["3⁄4 + 1⁄8 কত?",["5⁄8","7⁄8","1","1⁄2"],1,"হর সমান করি: 3⁄4 = 6⁄8, তাই 6⁄8 + 1⁄8 = 7⁄8।"]),
  Q("q2","math","math-frac","easy","NCTB Class 6 · Mathematics, Ch. 3",
    ["Which decimal is equal to 7⁄20 ?",["0.27","0.35","0.7","0.72"],1,"7 ÷ 20 = 0.35. Multiply numerator and denominator by 5 to get 35⁄100."],
    ["কোন দশমিক ভগ্নাংশটি 7⁄20 এর সমান?",["0.27","0.35","0.7","0.72"],1,"7 ÷ 20 = 0.35। লব ও হরকে ৫ দিয়ে গুণ করলে 35⁄100 হয়।"]),
  Q("q3","math","math-frac","medium","NCTB Class 7 · Mathematics, Ch. 2",
    ["A student solved 2⁄5 of 250 maths problems. How many problems are left?",["100","120","150","175"],2,"Solved = 2⁄5 × 250 = 100, so 250 − 100 = 150 remain."],
    ["এক শিক্ষার্থী ২৫০টি গণিত সমস্যার 2⁄5 অংশ সমাধান করেছে। কতটি বাকি আছে?",["১০০","১২০","১৫০","১৭৫"],2,"সমাধান = 2⁄5 × 250 = 100, তাই বাকি 250 − 100 = 150।"]),
  Q("q4","math","math-frac","hard","NCTB Class 8 · Mathematics, Ch. 1",
    ["Which of these is the largest value?",["0.6","3⁄5","0.599","11⁄18"],3,"3⁄5 = 0.600, 11⁄18 ≈ 0.611, so 11⁄18 is largest."],
    ["এদের মধ্যে কোনটি সবচেয়ে বড়?",["0.6","3⁄5","0.599","11⁄18"],3,"3⁄5 = 0.600 এবং 11⁄18 ≈ 0.611, তাই 11⁄18 সবচেয়ে বড়।"]),
  Q("q5","math","math-alg","easy","NCTB Class 7 · Mathematics, Ch. 4",
    ["If x = 4, what is the value of 3x + 2?",["10","12","14","18"],2,"3 × 4 + 2 = 12 + 2 = 14."],
    ["x = 4 হলে 3x + 2 এর মান কত?",["১০","১২","১৪","১৮"],2,"3 × 4 + 2 = 12 + 2 = 14।"]),
  Q("q6","math","math-alg","easy","NCTB Class 8 · Mathematics, Ch. 4",
    ["Which identity is correct?",["(a+b)² = a² + b²","(a+b)² = a² + 2ab + b²","(a+b)² = a² − 2ab + b²","(a+b)² = 2a + 2b"],1,"(a+b)² expands to a² + 2ab + b² — the square of a binomial."],
    ["কোন অভেদটি সঠিক?",["(a+b)² = a² + b²","(a+b)² = a² + 2ab + b²","(a+b)² = a² − 2ab + b²","(a+b)² = 2a + 2b"],1,"(a+b)² এর বিস্তার a² + 2ab + b²।"]),
  Q("q7","math","math-alg","medium","NCTB Class 8 · Mathematics, Ch. 4",
    ["Simplify 5a − 2a + 3.",["3a + 3","7a + 3","3a","5a + 1"],0,"Like terms combine: 5a − 2a = 3a, so the expression is 3a + 3."],
    ["5a − 2a + 3 সরল করো।",["3a + 3","7a + 3","3a","5a + 1"],0,"সদৃশ পদ একত্র করি: 5a − 2a = 3a, ফলে 3a + 3।"]),
  Q("q8","math","math-eq","easy","NCTB Class 7 · Mathematics, Ch. 6",
    ["Solve for x: 2x − 6 = 10.",["2","6","8","16"],2,"Add 6 to both sides: 2x = 16, then divide by 2: x = 8."],
    ["সমাধান করো: 2x − 6 = 10।",["২","৬","৮","১৬"],2,"উভয় পক্ষে ৬ যোগ করি: 2x = 16, এরপর ২ দিয়ে ভাগ: x = 8।"]),
  Q("q9","math","math-eq","medium","NCTB Class 8 · Mathematics, Ch. 6",
    ["The sum of two consecutive even numbers is 26. What are they?",["12 and 14","10 and 16","11 and 15","13 and 13"],0,"Let them be n and n+2. Then 2n + 2 = 26 → n = 12, giving 12 and 14."],
    ["দুটি ধারাবাহিক জোড় সংখ্যার যোগফল ২৬। সংখ্যা দুটি কী?",["১২ ও ১৪","১০ ও ১৬","১১ ও ১৫","১৩ ও ১৩"],0,"ধরি সংখ্যা দুটি n ও n+2। তাহলে 2n + 2 = 26 → n = 12, অর্থাৎ ১২ ও ১৪।"]),
  Q("q10","math","math-eq","medium","NCTB Class 8 · Mathematics, Ch. 6",
    ["Solve: 3(x − 2) = 9.",["3","5","7","11"],1,"Divide both sides by 3: x − 2 = 3, so x = 5."],
    ["সমাধান করো: 3(x − 2) = 9।",["৩","৫","৭","১১"],1,"উভয় পক্ষকে ৩ দিয়ে ভাগ: x − 2 = 3, তাই x = 5।"]),
  Q("q11","math","math-geo","easy","NCTB Class 7 · Geometry, Ch. 8",
    ["What is the sum of the interior angles of a triangle?",["90°","180°","270°","360°"],1,"The three interior angles of any plane triangle always add to 180°."],
    ["ত্রিভুজের তিন কোণের সমষ্টি কত?",["৯০°","১৮০°","২৭০°","৩৬০°"],1,"যেকোনো সমতল ত্রিভুজের তিন কোণের সমষ্টি সর্বদা ১৮০°।"]),
  Q("q12","math","math-geo","easy","NCTB Class 6 · Geometry, Ch. 7",
    ["What is the complementary angle of 35°?",["45°","55°","65°","145°"],1,"Two angles are complementary when they sum to 90°, so 90° − 35° = 55°."],
    ["৩৫° কোণের পূরক কোণ কত?",["৪৫°","৫৫°","৬৫°","১৪৫°"],1,"পূরক কোণের সমষ্টি ৯০°, তাই ৯০° − ৩৫° = ৫৫°।"]),
  Q("q13","math","math-stat","easy","NCTB Class 7 · Mathematics, Ch. 11",
    ["Find the mean of 4, 6, 8 and 10.",["6","7","8","9"],1,"Mean = (4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4 = 7."],
    ["4, 6, 8 ও 10 এর গড় কত?",["৬","৭","৮","৯"],1,"গড় = (4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4 = 7।"]),
  Q("q14","math","math-stat","medium","NCTB Class 8 · Mathematics, Ch. 11",
    ["What is the median of 3, 7, 9, 11, 15?",["7","9","10","11"],1,"With five ordered values the median is the third: 9."],
    ["3, 7, 9, 11, 15 এর মধ্যক কত?",["৭","৯","১০","১১"],1,"পাঁচটি মান সাজানো থাকলে মধ্যক তৃতীয়টি: ৯।"]),

  /* physics */
  Q("q15","physics","phy-mech","easy","NCTB Class 9-10 · Physics, Ch. 3",
    ["A 4 kg object accelerates at 3 m/s². What force acts on it?",["7 N","12 N","1.33 N","48 N"],1,"Newton's second law: F = ma = 4 × 3 = 12 N."],
    ["৪ কেজি ভরের বস্তুর ত্বরণ ৩ মি/সে²। এর উপর ক্রিয়াশীল বল কত?",["৭ নিউটন","১২ নিউটন","১.৩৩ নিউটন","৪৮ নিউটন"],1,"F = ma = 4 × 3 = 12 N।"]),
  Q("q16","physics","phy-mech","easy","NCTB Class 9-10 · Physics, Ch. 3",
    ["Newton's third law states that…",["Force equals mass times acceleration","Every action has an equal and opposite reaction","Objects resist change in motion","Momentum is always conserved"],1,"Forces occur in pairs: if A pushes B, B pushes A with equal magnitude in the opposite direction."],
    ["নিউটনের তৃতীয় সূত্র অনুযায়ী…",["বল = ভর × ত্বরণ","প্রত্যেক ক্রিয়ার সমান ও বিপরীত প্রতিক্রিয়া আছে","বস্তু গতির পরিবর্তন বাধা দেয়","ভরবেগ সর্বদা সংরক্ষিত"],1,"বল জোড়ায় জোড়ায় কাজ করে: A যদি B-কে ঠেলে, B সমান বলে বিপরীত দিকে ঠেলে।"]),
  Q("q17","physics","phy-mech","medium","NCTB Class 9-10 · Physics, Ch. 3",
    ["The SI unit of momentum is…",["N·m","kg·m/s","J/s","kg/m³"],1,"Momentum p = mv, so the unit is kilogram-metre per second."],
    ["ভরবেগের এসআই একক কী?",["N·m","kg·m/s","J/s","kg/m³"],1,"ভরবেগ p = mv, তাই একক কেজি·মিটার/সেকেন্ড।"]),
  Q("q18","physics","phy-energy","easy","NCTB Class 9-10 · Physics, Ch. 4",
    ["A force of 10 N moves a box 5 m in its direction. Work done?",["2 J","15 J","50 J","500 J"],2,"W = F × d = 10 × 5 = 50 J."],
    ["১০ নিউটন বল একটি বাক্সকে বলের দিকে ৫ মিটার সরায়। কৃতকাজ কত?",["২ জুল","১৫ জুল","৫০ জুল","৫০০ জুল"],2,"W = F × d = 10 × 5 = 50 J।"]),
  Q("q19","physics","phy-energy","easy","NCTB Class 9-10 · Physics, Ch. 4",
    ["The unit of power is the…",["newton","joule","watt","pascal"],2,"Power is work per unit time (J/s), and 1 J/s = 1 watt."],
    ["ক্ষমতার একক কোনটি?",["নিউটন","জুল","ওয়াট","পাস্কাল"],2,"ক্ষমতা = কাজ/সময় (J/s), 1 J/s = 1 ওয়াট।"]),
  Q("q20","physics","phy-energy","medium","NCTB Class 9-10 · Physics, Ch. 4",
    ["Which formula gives kinetic energy?",["mgh","½mv²","Fd","mv"],1,"Kinetic energy of a body of mass m moving with speed v is ½mv²."],
    ["গতিশক্তির সূত্র কোনটি?",["mgh","½mv²","Fd","mv"],1,"m ভরের বস্তু v বেগে চললে গতিশক্তি = ½mv²।"]),
  Q("q21","physics","phy-elec","medium","NCTB Class 9-10 · Physics, Ch. 11",
    ["A 6 V supply is connected across a 3 Ω resistor. What current flows?",["0.5 A","2 A","3 A","18 A"],1,"Ohm's law: I = V/R = 6/3 = 2 A."],
    ["৬ ভোল্টের উৎস ৩ ওহম রোধের সাথে যুক্ত। প্রবাহ কত?",["০.৫ অ্যাম্পিয়ার","২ অ্যাম্পিয়ার","৩ অ্যাম্পিয়ার","১৮ অ্যাম্পিয়ার"],1,"I = V/R = 6/3 = 2 A।"]),
  Q("q22","physics","phy-elec","easy","NCTB Class 9-10 · Physics, Ch. 11",
    ["The SI unit of electrical resistance is the…",["ampere","volt","ohm","coulomb"],2,"Resistance is measured in ohms (Ω), defined by R = V/I."],
    ["রোধের এসআই একক কী?",["অ্যাম্পিয়ার","ভোল্ট","ওহম","কুলম্ব"],2,"রোধ ওহম (Ω)-এ মাপা হয়, R = V/I।"]),
  Q("q23","physics","phy-elec","medium","NCTB Class 9-10 · Physics, Ch. 11",
    ["Two 3 Ω resistors are connected in series. Equivalent resistance?",["1.5 Ω","3 Ω","6 Ω","9 Ω"],2,"In series resistances add: 3 + 3 = 6 Ω."],
    ["দুটি ৩ ওহম রোধ শ্রেণিতে যুক্ত। তুল্য রোধ কত?",["১.৫ ওহম","৩ ওহম","৬ ওহম","৯ ওহম"],2,"শ্রেণিতে রোধ যোগ হয়: 3 + 3 = 6 Ω।"]),

  /* chemistry */
  Q("q24","chemistry","chem-atom","easy","NCTB Class 9-10 · Chemistry, Ch. 3",
    ["The atomic number of an element equals the number of…",["neutrons","protons","nucleons","electrons in the outer shell"],1,"Atomic number Z is the proton count in the nucleus; it defines the element."],
    ["মৌলের পারমাণবিক সংখ্যা কোনটির সমান?",["নিউট্রন","প্রোটন","নিউক্লিয়ন","বহিঃস্থ কক্ষের ইলেকট্রন"],1,"পারমাণবিক সংখ্যা Z = নিউক্লিয়াসের প্রোটন সংখ্যা, যা মৌল নির্ধারণ করে।"]),
  Q("q25","chemistry","chem-atom","easy","NCTB Class 9-10 · Chemistry, Ch. 3",
    ["An electron carries a…",["positive charge","negative charge","no charge","variable charge"],1,"Electrons are negatively charged; protons are positive and neutrons neutral."],
    ["ইলেকট্রনের চার্জ কী?",["ধনাত্মক","ঋণাত্মক","চার্জহীন","পরিবর্তনশীল"],1,"ইলেকট্রন ঋণাত্মক, প্রোটন ধনাত্মক এবং নিউট্রন নিরপেক্ষ।"]),
  Q("q26","chemistry","chem-react","easy","NCTB Class 9-10 · Chemistry, Ch. 6",
    ["The chemical formula of water is…",["H₂O₂","HO","H₂O","OH"],2,"Two hydrogen atoms bond with one oxygen atom: H₂O."],
    ["পানির রাসায়নিক সংকেত কী?",["H₂O₂","HO","H₂O","OH"],2,"দুটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণু মিলে H₂O।"]),
  Q("q27","chemistry","chem-react","medium","NCTB Class 9-10 · Chemistry, Ch. 6",
    ["Balance: __H₂ + O₂ → __H₂O.",["1 and 1","2 and 2","2 and 1","3 and 2"],1,"2H₂ + O₂ → 2H₂O gives equal atoms of H and O on both sides."],
    ["সমীকরণ সমতা করো: __H₂ + O₂ → __H₂O।",["১ ও ১","২ ও ২","২ ও ১","৩ ও ২"],1,"2H₂ + O₂ → 2H₂O সমীকরণে দুই পক্ষে H ও O পরমাণুর সংখ্যা সমান।"]),
  Q("q28","chemistry","chem-periodic","easy","NCTB Class 9-10 · Chemistry, Ch. 4",
    ["The symbol Na stands for…",["Nickel","Nitrogen","Sodium","Neon"],2,"Na comes from the Latin natrium, meaning sodium."],
    ["Na প্রতীকটি কোন মৌলের?",["নিকেল","নাইট্রোজেন","সোডিয়াম","নিয়ন"],2,"Na এসেছে ল্যাটিন natrium থেকে, অর্থ সোডিয়াম।"]),
  Q("q29","chemistry","chem-periodic","medium","NCTB Class 9-10 · Chemistry, Ch. 4",
    ["Elements in the same group of the periodic table share the same…",["number of neutrons","number of electron shells","number of valence electrons","atomic mass"],2,"Group members have identical valence electron counts, giving similar chemical behaviour."],
    ["পর্যায় সারণির একই গ্রুপের মৌলগুলোতে কী একই থাকে?",["নিউট্রন সংখ্যা","ইলেকট্রন কক্ষ সংখ্যা","যোজ্যতা ইলেকট্রন সংখ্যা","পারমাণবিক ভর"],2,"একই গ্রুপের মৌলগুলোর যোজ্যতা ইলেকট্রন সংখ্যা একই, তাই ধর্মও মিলে।"]),

  /* biology */
  Q("q30","biology","bio-cell","easy","NCTB Class 9-10 · Biology, Ch. 2",
    ["Which organelle is known as the powerhouse of the cell?",["Nucleus","Ribosome","Mitochondria","Vacuole"],2,"Mitochondria produce ATP through respiration, supplying cellular energy."],
    ["কোষের পাওয়ারহাউস কোন অঙ্গাণু?",["নিউক্লিয়াস","রাইবোজোম","মাইটোকন্ড্রিয়া","ভ্যাকুওল"],2,"মাইটোকন্ড্রিয়া শ্বসনের মাধ্যমে ATP তৈরি করে কোষকে শক্তি দেয়।"]),
  Q("q31","biology","bio-cell","medium","NCTB Class 9-10 · Biology, Ch. 2",
    ["A cell wall is present in…",["animal cells only","plant cells","all cells","none"],1,"Plant cells have a rigid cellulose wall outside the membrane; animal cells do not."],
    ["কোষপ্রাচীর থাকে…",["কেবল প্রাণিকোষে","উদ্ভিদকোষে","সব কোষে","কোথাও না"],1,"উদ্ভিদকোষে সেলুলোজের শক্ত কোষপ্রাচীর থাকে, প্রাণিকোষে থাকে না।"]),
  Q("q32","biology","bio-digest","easy","NCTB Class 9-10 · Biology, Ch. 4",
    ["Which enzyme is found in saliva?",["Pepsin","Trypsin","Amylase","Lipase"],2,"Salivary amylase begins the digestion of starch into simpler sugars."],
    ["লালায় কোন এনজাইম থাকে?",["পেপসিন","ট্রিপসিন","অ্যামাইলেজ","লাইপেজ"],2,"লালার অ্যামাইলেজ শ্বেতসার ভেঙে সরল শর্করায় পরিণত করা শুরু করে।"]),
  Q("q33","biology","bio-digest","medium","NCTB Class 9-10 · Biology, Ch. 4",
    ["The largest gland in the human body is the…",["pancreas","thyroid","liver","salivary gland"],2,"The liver is the largest gland, secreting bile for fat digestion."],
    ["মানবদেহের বৃহত্তম গ্রন্থি কোনটি?",["অগ্ন্যাশয়","থাইরয়েড","যকৃত","লালাগ্রন্থি"],2,"যকৃত বৃহত্তম গ্রন্থি, যা চর্বি পরিপাকের জন্য পিত্ত নিঃসরণ করে।"]),

  /* ICT */
  Q("q34","ict","ict-num","easy","NCTB Class 8 · ICT, Ch. 3",
    ["The binary number 1010 equals which decimal number?",["8","10","12","20"],1,"1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 10."],
    ["বাইনারি 1010 এর দশমিক মান কত?",["৮","১০","১২","২০"],1,"1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 10।"]),
  Q("q35","ict","ict-num","easy","NCTB Class 8 · ICT, Ch. 3",
    ["Hexadecimal is a base-__ number system.",["2","8","10","16"],3,"Hexadecimal uses sixteen symbols: 0–9 and A–F."],
    ["হেক্সাডেসিমাল কোন ভিত্তির সংখ্যা পদ্ধতি?",["২","৮","১০","১৬"],3,"হেক্সাডেসিমালে ১৬টি প্রতীক: 0–9 এবং A–F।"]),
  Q("q36","ict","ict-sheet","easy","NCTB Class 9-10 · ICT, Ch. 4",
    ["In a spreadsheet, =SUM(A1:A5) will…",["multiply A1 by A5","add all values from A1 to A5","count empty cells","sort the column"],1,"SUM adds every numeric value in the range A1 through A5."],
    ["স্প্রেডশিটে =SUM(A1:A5) কী করবে?",["A1-কে A5 দিয়ে গুণ করবে","A1 থেকে A5 পর্যন্ত সব মান যোগ করবে","খালি ঘর গণনা করবে","কলাম সাজাবে"],1,"SUM রেঞ্জ A1 থেকে A5 এর সব সংখ্যা যোগ করে।"]),
  Q("q37","ict","ict-sheet","medium","NCTB Class 9-10 · ICT, Ch. 4",
    ["In a database table, a row is called a…",["field","record","key","relation"],1,"A record is one complete row; a field is one column attribute."],
    ["ডেটাবেস টেবিলে একটি সারিকে কী বলা হয়?",["ফিল্ড","রেকর্ড","কী","রিলেশন"],1,"একটি সারি = একটি রেকর্ড; একটি কলাম = একটি ফিল্ড।"]),
  Q("q38","ict","ict-prog","easy","NCTB Class 9-10 · ICT, Ch. 5",
    ["A loop in a program is used to…",["store data permanently","repeat a block of instructions","compare two strings","draw shapes only"],1,"Loops repeat statements until a condition is met, avoiding duplication."],
    ["প্রোগ্রামে লুপ ব্যবহৃত হয়…",["ডেটা স্থায়ীভাবে রাখতে","কিছু নির্দেশনা বারবার চালাতে","দুটি স্ট্রিং তুলনা করতে","কেবল ছবি আঁকতে"],1,"শর্ত পূরণ পর্যন্ত লুপ একই নির্দেশনা পুনরাবৃত্তি করে।"]),
  Q("q39","ict","ict-prog","medium","NCTB Class 9-10 · ICT, Ch. 5",
    ["Which data type should store the value 42?",["String","Boolean","Integer","Character"],2,"Whole numbers are stored as integers; 42 has no fractional part."],
    ["42 মানটি রাখতে কোন ডেটা টাইপ ব্যবহার করা উচিত?",["স্ট্রিং","বুলিয়ান","ইন্টিজার","ক্যারেক্টার"],2,"পূর্ণসংখ্যা ইন্টিজারে রাখা হয়; 42 এর কোনো ভগ্নাংশ নেই।"]),

  /* english */
  Q("q40","english","eng-tense","easy","NCTB Class 6 · English, Unit 2",
    ["Choose the correct form: She ___ to school every day.",["go","goes","going","gone"],1,"Third-person singular in the simple present takes -s: she goes."],
    ["সঠিক রূপটি বেছে নাও: She ___ to school every day.",["go","goes","going","gone"],1,"সাধারণ বর্তমানে তৃতীয় পুরুষ একবচনে ক্রিয়ার সাথে -s যোগ হয়: goes।"]),
  Q("q41","english","eng-tense","medium","NCTB Class 8 · English, Unit 4",
    ["Complete the present perfect: I have ___ my homework.",["finish","finishing","finished","finishes"],2,"Present perfect uses have + past participle: have finished."],
    ["বর্তমান পারফেক্ট সম্পূর্ণ করো: I have ___ my homework.",["finish","finishing","finished","finishes"],2,"বর্তমান পারফেক্টে have + past participle হয়: have finished।"]),
  Q("q42","english","eng-vocab","medium","NCTB Class 9-10 · English, Idioms",
    ["\"Once in a blue moon\" means…",["every night","very rarely","immediately","with great anger"],1,"The idiom describes something that happens extremely rarely."],
    ["\"Once in a blue moon\" বাগধারার অর্থ…",["প্রতি রাতে","খুব কম সময়ে","তৎক্ষণাৎ","অত্যন্ত রাগে"],1,"এই বাগধারার অর্থ অত্যন্ত বিরলভাবে ঘটা কিছু।"]),
  Q("q43","english","eng-vocab","medium","NCTB Class 9-10 · English, Vocabulary",
    ["Choose the antonym of \"scarce\".",["rare","limited","abundant","empty"],2,"Scarce means in short supply; abundant means plentiful — the opposite."],
    ["\"Scarce\" এর বিপরীত শব্দ কোনটি?",["rare","limited","abundant","empty"],2,"Scarce অর্থ অভাব, abundant অর্থ প্রচুর — বিপরীত অর্থ।"]),

  /* bangla */
  Q("q44","bangla","bng-sandhi","medium","NCTB Class 8 · বাংলা ব্যাকরণ, সন্ধি",
    ["‘বিদ্যালয়’ শব্দের সন্ধিবিচ্ছেদ কী?",["বিদ্যা + আলয়","বিদ্য + আলয়","বিদ্যা + লয়","বিদ্যাল + য়"],0,"‘বিদ্যা + আলয় = বিদ্যালয়’ — অ-কারের পর আ-কার এলে উভয় মিলে আ-কার হয়।"],
    ["‘বিদ্যালয়’ শব্দের সন্ধিবিচ্ছেদ কী?",["বিদ্যা + আলয়","বিদ্য + আলয়","বিদ্যা + লয়","বিদ্যাল + য়"],0,"‘বিদ্যা + আলয় = বিদ্যালয়’ — অ-কারের পর আ-কার এলে উভয় মিলে আ-কার হয়।"]),
  Q("q45","bangla","bng-sandhi","medium","NCTB Class 9-10 · বাংলা ব্যাকরণ, সন্ধি",
    ["‘হিমালয়’ শব্দের সন্ধিবিচ্ছেদ কোনটি?",["হিম + আলয়","হিমা + লয়","হিম + অলয়","হিমাল + য়"],0,"‘হিম + আলয় = হিমালয়’ — অ + আ = আ।"],
    ["‘হিমালয়’ শব্দের সন্ধিবিচ্ছেদ কোনটি?",["হিম + আলয়","হিমা + লয়","হিম + অলয়","হিমাল + য়"],0,"‘হিম + আলয় = হিমালয়’ — অ + আ = আ।"]),
  Q("q46","bangla","bng-poem","easy","NCTB Class 9-10 · বাংলা সাহিত্য",
    ["‘সোনার তরী’ কবিতাটি কার রচনা?",["কাজী নজরুল ইসলাম","রবীন্দ্রনাথ ঠাকুর","জীবনানন্দ দাশ","জসীমউদ্দীন"],1,"‘সোনার তরী’ রবীন্দ্রনাথ ঠাকুরের বিখ্যাত কবিতা, সংকলিত ‘সোনার তরী’ কাব্যগ্রন্থে।"],
    ["‘সোনার তরী’ কবিতাটি কার রচনা?",["কাজী নজরুল ইসলাম","রবীন্দ্রনাথ ঠাকুর","জীবনানন্দ দাশ","জসীমউদ্দীন"],1,"‘সোনার তরী’ রবীন্দ্রনাথ ঠাকুরের বিখ্যাত কবিতা।"]),
  Q("q47","bangla","bng-poem","medium","NCTB Class 9-10 · বাংলা সাহিত্য",
    ["‘বিদ্রোহী’ কবিতার রচয়িতা কে?",["রবীন্দ্রনাথ ঠাকুর","কাজী নজরুল ইসলাম","সুকান্ত ভট্টাচার্য","জীবনানন্দ দাশ"],1,"‘বিদ্রোহী’ কাজী নজরুল ইসলামের অমর কবিতা, প্রকাশিত হয় ‘অগ্নিবীণা’ কাব্যে।"],
    ["‘বিদ্রোহী’ কবিতার রচয়িতা কে?",["রবীন্দ্রনাথ ঠাকুর","কাজী নজরুল ইসলাম","সুকান্ত ভট্টাচার্য","জীবনানন্দ দাশ"],1,"‘বিদ্রোহী’ কাজী নজরুল ইসলামের কবিতা, ‘অগ্নিবীণা’ কাব্যগ্রন্থের অন্তর্গত।"]),

  /* BGS */
  Q("q48","bgs","bgs-land","easy","NCTB Class 7 · BGS, Ch. 2",
    ["How many administrative divisions does Bangladesh have?",["6","7","8","9"],2,"Bangladesh has eight divisions: Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur and Mymensingh."],
    ["বাংলাদেশে কতটি প্রশাসনিক বিভাগ আছে?",["৬","৭","৮","৯"],2,"বাংলাদেশে আটটি বিভাগ: ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, বরিশাল, সিলেট, রংপুর ও ময়মনসিংহ।"]),
  Q("q49","bgs","bgs-land","medium","NCTB Class 8 · BGS, Ch. 3",
    ["The Padma is the combined downstream course of which two rivers?",["Jamuna and Meghna","Ganges and Jamuna","Teesta and Dharla","Karnaphuli and Sangu"],1,"Below the Ganges–Jamuna confluence the combined river is known as the Padma."],
    ["পদ্মা কোন দুটি নদীর মিলিত প্রবাহের নাম?",["যমুনা ও মেঘনা","গঙ্গা ও যমুনা","তিস্তা ও ধরলা","কর্ণফুলী ও সাঙ্গু"],1,"গঙ্গা ও যমুনার মিলিত প্রবাহই নিচের দিকে পদ্মা নামে পরিচিত।"])
];

/* ---------------- creative questions ---------------- */
function CQ(id, subjectId, chapterId, source, stem, parts, bn) {
  return {
    id, subjectId, chapterId, source, status:"published",
    en: { stem, parts: parts.map(p => ({ label:p[0], marks:p[1], text:p[2], rubric:p[4], answer:p[3] })) },
    bn: bn ? { stem:bn.stem, parts: parts.map((p, i) => ({ label:p[0], marks:p[1], text:bn.parts[i][0], rubric:bn.parts[i][1], answer:bn.parts[i][2] })) } : null
  };
}

const CQS = [
  CQ("cq1","math","math-eq","NCTB Class 8 · Mathematics, Ch. 6 (adapted)",
    "A school buys x chairs at ৳450 each and 12 tables at ৳1,200 each. The total bill is ৳27,000.",
    [["ক",1,"Form an equation from the information.","Let the cost of chairs be 450x. Then 450x + 14,400 = 27,000.","Full 1 mark for 450x + 1200×12 = 27000."],
     ["খ",2,"Find the value of x.","450x = 12,600, so x = 28 chairs.","1 mark for isolating 450x, 1 for x = 28."],
     ["গ",3,"If each chair price rises by 10%, what would the same order cost?","New chair cost = 495 each, so 495×28 + 14,400 = ৳28,260.","1 for 495 per chair, 1 for substituting, 1 for total."],
     ["ঘ",4,"Explain how the equation would change if the school received a ৳2,000 discount, and solve for x again.","450x + 14,400 − 2,000 = 27,000 → 450x = 14,600 → x ≈ 32.44, so 32 complete chairs.","Analysis 1, new equation 1, correct division 1, interpretation of the non-integer answer 1."]],
    { stem:"একটি বিদ্যালয় প্রতিটি ৪৫০ টাকা দরে xটি চেয়ার এবং প্রতিটি ১,২০০ টাকা দরে ১২টি টেবিল কিনেছে। মোট বিল ২৭,০০০ টাকা।",
      parts:[["ক থেকে একটি সমীকরণ গঠন করো।","১ নম্বর: 450x + 1200×12 = 27000।"],
             ["x এর মান নির্ণয় করো।","৪৫০x = ১২,৬০০, তাই x = ২৮টি চেয়ার।"],
             ["প্রতিটি চেয়ারের দাম ১০% বাড়লে একই অর্ডারে কত খরচ হবে?","নতুন দাম ৪৯৫ টাকা; ৪৯৫×২৮ + ১৪,৪০০ = ২৮,২৬০ টাকা।"],
             ["২০০০ টাকা ছাড় পেলে সমীকরণ কীভাবে বদলাবে এবং x কত হবে?","৪৫০x + ১৪,৪০০ − ২,০০০ = ২৭,০০০ → x ≈ ৩২.৪৪, অর্থাৎ ৩২টি পূর্ণ চেয়ার।"]] }),

  CQ("cq2","physics","phy-mech","NCTB Class 9-10 · Physics, Ch. 3 (adapted)",
    "A 1,200 kg car accelerates uniformly from rest to 20 m/s in 8 seconds on a straight road.",
    [["ক",1,"State Newton's second law of motion.","The rate of change of momentum of a body is proportional to the applied force and takes place in the direction of the force.","Correct statement for 1 mark."],
     ["খ",2,"Calculate the acceleration of the car.","a = (v − u)/t = 20/8 = 2.5 m/s².","1 for formula, 1 for 2.5 m/s²."],
     ["গ",3,"Find the force required.","F = ma = 1200 × 2.5 = 3,000 N.","1 for substitution, 2 for correct value with unit."],
     ["ঘ",4,"If friction adds 400 N of opposing force, find the engine force and explain the effect on acceleration.","Engine force = 3,000 + 400 = 3,400 N; net force stays 3,000 N so acceleration is unchanged.","Force analysis 1, engine force 2, explanation 1."]],
    { stem:"১,২০০ কেজি ভরের একটি গাড়ি বিশ্রাম থেকে ৮ সেকেন্ডে ২০ মি/সে বেগে সমত্বরণে চলে।",
      parts:[["নিউটনের দ্বিতীয় সূত্রটি লেখো।","বস্তুর ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক এবং বলের দিকে ঘটে।"],
             ["গাড়ির ত্বরণ নির্ণয় করো।","a = (v − u)/t = 20/8 = 2.5 মি/সে²।"],
             ["প্রয়োজনীয় বল নির্ণয় করো।","F = ma = 1200 × 2.5 = ৩,০০০ নিউটন।"],
             ["ঘর্ষণে ৪০০ নিউটন বিরোধী বল যোগ হলে ইঞ্জিনের বল কত এবং ত্বরণে কী প্রভাব পড়বে?","ইঞ্জিন বল = ৩,৪০০ নিউটন; মোট বল ৩,০০০ নিউটনই থাকে, তাই ত্বরণ অপরিবর্তিত।"]] }),

  CQ("cq3","chemistry","chem-react","NCTB Class 9-10 · Chemistry, Ch. 6",
    "Hydrogen gas burns in oxygen to produce water: 2H₂ + O₂ → 2H₂O.",
    [["ক",1,"What is a balanced chemical equation?","An equation with an equal number of atoms of each element on both sides.","1 mark for definition."],
     ["খ",2,"Why must this equation be balanced?","To obey the law of conservation of mass, since atoms are neither created nor destroyed.","1 for law, 1 for link to atom count."],
     ["গ",3,"How many molecules of water form from 4 molecules of H₂ with excess O₂?","4 molecules of H₂ give 4 molecules of H₂O in a 1:1 ratio.","1 for ratio, 2 for answer with reasoning."],
     ["ঘ",4,"Calculate the mass of water produced from 8 g of H₂ (H=1, O=16).","8 g H₂ = 4 mol, giving 4 mol H₂O = 4 × 18 = 72 g.","Mole conversion 1, ratio 1, mass 2."]],
    { stem:"হাইড্রোজেন গ্যাস অক্সিজেনে পুড়ে পানি উৎপন্ন করে: 2H₂ + O₂ → 2H₂O।",
      parts:[["সমতাকৃত রাসায়নিক সমীকরণ কী?","উভয় পক্ষে প্রতিটি মৌলের পরমাণু সংখ্যা সমান থাকে এমন সমীকরণ।"],
             ["এই সমীকরণ কেন সমতা করতে হয়?","ভরের নিত্যতা সূত্র মানার জন্য; পরমাণু সৃষ্টি বা ধ্বংস হয় না।"],
             ["অতিরিক্ত O₂-তে ৪ অণু H₂ থেকে কত অণু পানি তৈরি হবে?","১:১ অনুপাতে ৪ অণু H₂ থেকে ৪ অণু H₂O তৈরি হবে।"],
             ["৮ গ্রাম H₂ থেকে কত গ্রাম পানি তৈরি হবে? (H=1, O=16)","৮ গ্রাম H₂ = ৪ মোল, ফলে ৪ মোল পানি = ৪ × ১৮ = ৭২ গ্রাম।"]] }),

  CQ("cq4","biology","bio-digest","NCTB Class 9-10 · Biology, Ch. 4",
    "Rahim eats rice and lentils. Digestion begins in the mouth and continues through the alimentary canal.",
    [["ক",1,"Name the enzyme present in saliva.","Salivary amylase (ptyalin).","1 mark."],
     ["খ",2,"What is the role of the liver in digestion?","It produces bile, which emulsifies fats; bile is stored in the gallbladder.","1 for bile, 1 for emulsification."],
     ["গ",3,"Explain how rice is digested from mouth to small intestine.","Amylase converts starch to maltose in the mouth; pancreatic amylase continues in the small intestine, where maltase yields glucose absorbed by villi.","Partial 1, enzyme sequence 1, absorption 1."],
     ["ঘ",4,"Predict the effect on digestion if the pancreas stopped secreting enzymes.","Fats, proteins and carbohydrates would remain largely undigested, causing malnutrition and fatty stools.","Prediction 1, three nutrient classes 2, consequence 1."]],
    { stem:"রহিম ভাত ও ডাল খায়। হজম মুখে শুরু হয়ে পরিপাকতন্ত্রে চলতে থাকে।",
      parts:[["লালায় কোন এনজাইম থাকে?","লালার অ্যামাইলেজ (টায়ালিন)।"],
             ["পরিপাকে যকৃতের ভূমিকা কী?","যকৃত পিত্ত তৈরি করে, যা চর্বিকে ইমালসিফাই করে; পিত্তথলিতে জমা থাকে।"],
             ["ভাত মুখ থেকে ক্ষুদ্রান্ত্র পর্যন্ত কীভাবে হজম হয়?","মুখে অ্যামাইলেজ শ্বেতসারকে মলটোজে ভাঙে; ক্ষুদ্রান্ত্রে অগ্ন্যাশয়ের অ্যামাইলেজ ও মলটেজ গ্লুকোজ তৈরি করে, ভিলাই শোষণ করে।"],
             ["অগ্ন্যাশয় এনজাইম নিঃসরণ বন্ধ করলে পরিপাকে কী প্রভাব পড়বে?","চর্বি, প্রোটিন ও শ্বেতসার অপরিপাক থেকে যাবে, পুষ্টিহীনতা ও চর্বিযুক্ত পায়খানা হতে পারে।"]] }),

  CQ("cq5","ict","ict-num","NCTB Class 8 · ICT, Ch. 3",
    "A computer stores data in binary. The decimal number 45 must be converted for storage.",
    [["ক",1,"What is the base of the binary number system?","Base 2, using only 0 and 1.","1 mark."],
     ["খ",2,"Convert 45 to binary.","45 = 32 + 8 + 4 + 1 = 101101₂.","1 for method, 1 for 101101."],
     ["গ",3,"Add 1011₂ and 110₂.","1011 + 0110 = 10001₂ (11 + 6 = 17).","1 for alignment, 2 for 10001₂."],
     ["ঘ",4,"Explain why hexadecimal is used to represent binary data in computing.","Each hex digit maps exactly to four bits, making long binary strings shorter and less error-prone to read.","Mapping 2, compactness 1, error reduction 1."]],
    { stem:"কম্পিউটার বাইনারিতে তথ্য সংরক্ষণ করে। দশমিক ৪৫-কে স্টোরেজের জন্য রূপান্তর করতে হবে।",
      parts:[["বাইনারি সংখ্যা পদ্ধতির ভিত্তি কত?","ভিত্তি ২; কেবল ০ ও ১ ব্যবহৃত হয়।"],
             ["৪৫-কে বাইনারিতে রূপান্তর করো।","৪৫ = ৩২ + ৮ + ৪ + ১ = 101101₂।"],
             ["1011₂ ও 110₂ যোগ করো।","1011 + 0110 = 10001₂ (১১ + ৬ = ১৭)।"],
             ["কম্পিউটিংয়ে বাইনারি উপস্থাপনে হেক্সাডেসিমাল কেন ব্যবহৃত হয়?","প্রতিটি হেক্স অঙ্ক ঠিক ৪টি বিট নির্দেশ করে, তাই লম্বা বাইনারি সংক্ষিপ্ত ও কম ভুলপ্রবণ হয়।"]] }),

  CQ("cq6","english","eng-vocab","NCTB Class 9-10 · English, Writing",
    "Write a short paragraph on how you prepare for your exams.",
    [["ক",1,"State one habit that helps you study.","Any clear habit, e.g. studying at a fixed time daily.","1 mark for a complete sentence."],
     ["খ",2,"Write two sentences about your revision routine.","Two grammatically correct sentences describing revision.","1 mark each for accuracy and relevance."],
     ["গ",3,"Write a paragraph of 80–100 words on exam preparation.","A coherent paragraph with topic sentence, supporting details and conclusion.","Content 1, organisation 1, language 1."],
     ["ঘ",4,"Suggest three improvements to your study plan and explain why.","Three practical changes with reasons, e.g. timed practice, spaced revision, sleep.","One mark per justified suggestion."]],
    null),

  CQ("cq7","bangla","bng-sandhi","NCTB Class 9-10 · বাংলা ব্যাকরণ, সন্ধি",
    "সন্ধি বাংলা ভাষার শব্দ গঠনের গুরুত্বপূর্ণ প্রক্রিয়া।",
    [["ক",1,"সন্ধি কাকে বলে?","দুটি বর্ণের মিলনকে সন্ধি বলে।","সঠিক সংজ্ঞায় ১ নম্বর।"],
     ["খ",2,"‘পরীক্ষা’ শব্দের সন্ধিবিচ্ছেদ করো।","পরি + ঈক্ষা = পরীক্ষা; ই + ঈ = ঈ।","বিচ্ছেদ ১, নিয়ম ১।"],
     ["গ",3,"স্বরসন্ধির দুটি উদাহরণ দিয়ে নিয়ম ব্যাখ্যা করো।","‘বিদ্যা + আলয় = বিদ্যালয়’ (অ + আ = আ); ‘নর + ইন্দ্র = নরেন্দ্র’ (অ + ই = এ)।","দুটি উদাহরণ ও নিয়মে ৩ নম্বর।"],
     ["ঘ",4,"বাংলা ভাষায় সন্ধির প্রয়োজনীয়তা বিশ্লেষণ করো।","শব্দ সংক্ষিপ্ত ও উচ্চারণসহজ হয়, নতুন শব্দ গঠিত হয়, ভাষা সমৃদ্ধ ও ছন্দময় হয়।","বিশ্লেষণ ২, উদাহরণ ১, ভাষা ১।"]]),

  CQ("cq8","bgs","bgs-land","NCTB Class 8 · BGS, Ch. 3",
    "Bangladesh is a riverine country. Its rivers shape agriculture, transport and settlement.",
    [["ক",1,"Name the largest river of Bangladesh.","The Brahmaputra (Jamuna) is the largest by width and discharge.","1 mark."],
     ["খ",2,"How do rivers support agriculture?","They supply irrigation water and deposit fertile silt during floods.","1 mark each for irrigation and silt."],
     ["গ",3,"Describe two problems caused by river erosion.","Loss of farmland and displacement of families, plus damage to roads and homesteads.","1 mark per problem with explanation."],
     ["ঘ",4,"Evaluate one measure to reduce river erosion and its limitation.","Embankments reduce erosion locally but can shift the problem downstream and need maintenance.","Measure 2, evaluation 2."]],
    null)
];

/* ---------------- video lessons ---------------- */
const VIDEOS = [
  { id:"v1", title:{en:"Fractions that finally make sense",bn:"ভগ্নাংশ এখন সহজ"}, subjectId:"math", chapterId:"math-frac",
    duration:12*60+40, presenter:"Farhana Akter", status:"published", views:1284, hue:["#2E96EB","#0B3F79"], created:"2026-10-02" },
  { id:"v2", title:{en:"Newton's laws with real experiments",bn:"বাস্তব পরীক্ষায় নিউটনের সূত্র"}, subjectId:"physics", chapterId:"phy-mech",
    duration:18*60+5, presenter:"Tanvir Hasan", status:"published", views:942, hue:["#7C5CE0","#3A1E7A"], created:"2026-10-14" },
  { id:"v3", title:{en:"Balancing chemical equations step by step",bn:"ধাপে ধাপে সমীকরণ সমতা"}, subjectId:"chemistry", chapterId:"chem-react",
    duration:9*60+52, presenter:"Nusrat Jahan", status:"published", views:611, hue:["#0EA47A","#04513C"], created:"2026-10-21" },
  { id:"v4", title:{en:"Inside the cell: organelles tour",bn:"কোষের ভেতরে: অঙ্গাণু ভ্রমণ"}, subjectId:"biology", chapterId:"bio-cell",
    duration:15*60+18, presenter:"Sadia Islam", status:"published", views:738, hue:["#E0486B","#7C1F33"], created:"2026-10-28" },
  { id:"v5", title:{en:"Binary to decimal in 10 minutes",bn:"১০ মিনিটে বাইনারি থেকে দশমিক"}, subjectId:"ict", chapterId:"ict-num",
    duration:10*60+12, presenter:"Mahin Chowdhury", status:"published", views:455, hue:["#E08A0B","#7A4A00"], created:"2026-11-04" },
  { id:"v6", title:{en:"Tenses: the four present forms",bn:"কাল: বর্তমানের চার রূপ"}, subjectId:"english", chapterId:"eng-tense",
    duration:14*60+2, presenter:"Farhana Akter", status:"published", views:305, hue:["#2B7FB8","#123D5C"], created:"2026-11-09" },
  { id:"v7", title:{en:"Annual exam strategy session (draft)",bn:"বার্ষিক পরীক্ষার কৌশল (খসড়া)"}, subjectId:"math", chapterId:"math-eq",
    duration:22*60+30, presenter:"Chorcha Team", status:"draft", views:0, hue:["#4A5568","#1A202C"], created:"2026-11-22" }
];

/* ---------------- seed accounts ---------------- */
const PEERS = [
  { id:"u-admin", email:"admin@example.com", username:"nusrat", name:"Nusrat Jahan", role:"admin", status:"approved", cls:10, medium:"bangla", group:"Science", password:"Admin#12345", hue:218, xp:18420, streak:41, videoAccess:true, priv:{online:true,stats:true}, created:"2026-06-01", approvedAt:"2026-06-01" },
  { id:"u-student", email:"student@example.com", username:"rafi", name:"Rafi Ahmed", role:"student", status:"approved", cls:9, medium:"bangla", group:"Science", password:"Student#123", hue:203, xp:6420, streak:12, videoAccess:true, priv:{online:true,stats:true}, created:"2026-08-12", approvedAt:"2026-08-13" },
  { id:"u-pending", email:"pending@example.com", username:"tanvir_h", name:"Tanvir Hasan", role:"student", status:"pending", cls:9, medium:"bangla", group:"Science", password:"Student#123", hue:32, xp:0, streak:0, videoAccess:false, priv:{online:false,stats:false}, created:"2026-11-24" },
  { id:"u-ayesha", email:"ayesha@example.com", username:"ayesha_07", name:"Ayesha Siddika", role:"student", status:"approved", cls:9, medium:"bangla", group:"Science", password:"Student#123", hue:330, xp:9120, streak:23, videoAccess:true, priv:{online:true,stats:true}, created:"2026-07-04", approvedAt:"2026-07-05" },
  { id:"u-mahin", email:"mahin@example.com", username:"mahin_c", name:"Mahin Chowdhury", role:"student", status:"approved", cls:10, medium:"english", group:"Science", password:"Student#123", hue:158, xp:10480, streak:31, videoAccess:false, priv:{online:true,stats:true}, created:"2026-06-22", approvedAt:"2026-06-23" },
  { id:"u-sadia", email:"sadia@example.com", username:"sadia_i", name:"Sadia Islam", role:"student", status:"approved", cls:10, medium:"bangla", group:"Science", password:"Student#123", hue:268, xp:11760, streak:18, videoAccess:true, priv:{online:true,stats:true}, created:"2026-07-18", approvedAt:"2026-07-19" },
  { id:"u-farhan", email:"farhan@example.com", username:"farhan_k", name:"Farhan Kabir", role:"student", status:"approved", cls:10, medium:"english", group:"Commerce", password:"Student#123", hue:12, xp:7980, streak:6, videoAccess:false, priv:{online:false,stats:true}, created:"2026-08-02", approvedAt:"2026-08-03" },
  { id:"u-mim", email:"mim@example.com", username:"mim_akter", name:"Mim Akter", role:"student", status:"approved", cls:9, medium:"bangla", group:"Humanities", password:"Student#123", hue:300, xp:5340, streak:9, videoAccess:false, priv:{online:true,stats:false}, created:"2026-08-19", approvedAt:"2026-08-20" },
  { id:"u-arif", email:"arif@example.com", username:"arif_h", name:"Arif Hossain", role:"student", status:"approved", cls:9, medium:"bangla", group:"Science", password:"Student#123", hue:190, xp:4710, streak:2, videoAccess:false, priv:{online:false,stats:true}, created:"2026-09-01", approvedAt:"2026-09-02" },
  { id:"u-jannat", email:"jannat@example.com", username:"jannat_f", name:"Jannatul Ferdous", role:"student", status:"approved", cls:10, medium:"bangla", group:"Science", password:"Student#123", hue:340, xp:13210, streak:47, videoAccess:true, priv:{online:true,stats:true}, created:"2026-05-30", approvedAt:"2026-05-31" },
  { id:"u-shakib", email:"shakib@example.com", username:"shakib_r", name:"Shakib Rahman", role:"student", status:"approved", cls:10, medium:"english", group:"Science", password:"Student#123", hue:145, xp:8940, streak:14, videoAccess:true, priv:{online:false,stats:true}, created:"2026-07-11", approvedAt:"2026-07-12" },
  { id:"u-tahmid", email:"tahmid@example.com", username:"tahmid_a", name:"Tahmid Alam", role:"student", status:"approved", cls:9, medium:"bangla", group:"Commerce", password:"Student#123", hue:24, xp:3650, streak:4, videoAccess:false, priv:{online:true,stats:true}, created:"2026-09-14", approvedAt:"2026-09-15" },
  { id:"u-rifat", email:"rifat@example.com", username:"rifat_k", name:"Rifat Karim", role:"student", status:"pending", cls:8, medium:"bangla", group:"General", password:"Student#123", hue:210, xp:0, streak:0, videoAccess:false, priv:{online:false,stats:false}, created:"2026-11-25" },
  { id:"u-sumaiya", email:"sumaiya@example.com", username:"sumaiya_a", name:"Sumaiya Akter", role:"student", status:"approved", cls:8, medium:"bangla", group:"General", password:"Student#123", hue:285, xp:6120, streak:11, videoAccess:false, priv:{online:true,stats:false}, created:"2026-08-08", approvedAt:"2026-08-09" }
];

const LEAGUES = [
  { id:"iron", name:{en:"Iron",bn:"আয়রন"}, min:0, color:"#8A939F" },
  { id:"bronze", name:{en:"Bronze",bn:"ব্রোঞ্জ"}, min:3000, color:"#B4794A" },
  { id:"silver", name:{en:"Silver",bn:"সিলভার"}, min:6000, color:"#9AA7B8" },
  { id:"gold", name:{en:"Gold",bn:"গোল্ড"}, min:9000, color:"#E0A32A" },
  { id:"platinum", name:{en:"Platinum",bn:"প্ল্যাটিনাম"}, min:13000, color:"#5AC8D8" }
];

const ACHIEVEMENTS = [
  { id:"a1", name:{en:"First steps",bn:"প্রথম পদক্ষেপ"}, desc:{en:"Finish your first practice set",bn:"প্রথম অনুশীলন সম্পন্ন করো"}, test:s => s.attempts.length >= 1 },
  { id:"a2", name:{en:"Sharp shooter",bn:"সূক্ষ্ম লক্ষ্য"}, desc:{en:"Score 80%+ in a practice set",bn:"একটি অনুশীলনে ৮০%+ স্কোর করো"}, test:s => s.attempts.some(a => a.total && a.correct/a.total >= .8) },
  { id:"a3", name:{en:"Exam ready",bn:"পরীক্ষার জন্য প্রস্তুত"}, desc:{en:"Complete an exam",bn:"একটি পরীক্ষা সম্পন্ন করো"}, test:s => s.examsTaken.length >= 1 },
  { id:"a4", name:{en:"Week warrior",bn:"সপ্তাহের যোদ্ধা"}, desc:{en:"Reach a 7-day streak",bn:"৭ দিনের স্ট্রিক করো"}, test:(s) => s.streak >= 7 },
  { id:"a5", name:{en:"Duelist",bn:"দ্বন্দ্বযোদ্ধা"}, desc:{en:"Win a 1v1 match",bn:"একটি ১vs১ ম্যাচ জিতো"}, test:s => s.matches.some(m => m.winner === s.userId) },
  { id:"a6", name:{en:"Revision master",bn:"পুনরাবৃত্তি মাস্টার"}, desc:{en:"Clear 10 mistakes from revision",bn:"পুনরাবৃত্তি থেকে ১০টি ভুল ঠিক করো"}, test:s => s.reviewedCount >= 10 },
  { id:"a7", name:{en:"Deep diver",bn:"গভীর অনুসন্ধানী"}, desc:{en:"Watch a full video lesson",bn:"একটি সম্পূর্ণ ভিডিও পাঠ দেখো"}, test:s => s.videoProgress.some(v => v.completed) },
  { id:"a8", name:{en:"Social learner",bn:"সামাজিক শিক্ষার্থী"}, desc:{en:"Add your first friend",bn:"প্রথম বন্ধু যোগ করো"}, test:s => s.friendIds.length >= 1 }
];

/* seed chat content */
const SEED_CONVERSATIONS = [
  { id:"c1", type:"dm", members:["u-student","u-ayesha"], createdAt:"2026-11-10T09:12:00Z",
    messages:[
      { id:"m1", from:"u-ayesha", text:"Rafi, have you finished the physics chapter 3 practice?", at:"2026-11-10T09:12:00Z" },
      { id:"m2", from:"u-student", text:"Almost — stuck on the momentum numericals.", at:"2026-11-10T09:20:00Z" },
      { id:"m3", from:"u-ayesha", text:"Same here. Want to do a 1v1 on mechanics after class?", at:"2026-11-10T09:22:00Z" },
      { id:"m4", from:"u-student", text:"Deal. 4 pm.", at:"2026-11-10T09:23:00Z" }
    ] },
  { id:"c2", type:"dm", members:["u-student","u-mahin"], createdAt:"2026-11-18T15:00:00Z",
    messages:[
      { id:"m5", from:"u-mahin", text:"Bhai, the ICT binary worksheet answers are wrong in the school copy 😅", at:"2026-11-18T15:00:00Z" },
      { id:"m6", from:"u-student", text:"Check question 4 — 1010 is ten, not twelve.", at:"2026-11-18T15:06:00Z" },
      { id:"m7", from:"u-mahin", text:"You're right. Saved me from an argument with sir.", at:"2026-11-18T15:09:00Z" },
      { id:"m8", from:"u-mahin", text:"Sending the corrected sheet tonight.", at:"2026-11-18T15:09:00Z" }
    ] },
  { id:"c3", type:"group", name:"Class 9 Science Squad", members:["u-student","u-ayesha","u-arif","u-mim","u-tahmid"], adminJoined:true, createdAt:"2026-11-01T10:00:00Z",
    messages:[
      { id:"m9", from:"u-arif", text:"Tomorrow's chemistry test is on chapter 6 only, right?", at:"2026-11-19T19:02:00Z" },
      { id:"m10", from:"u-mim", text:"Yes — balancing equations and the water reaction.", at:"2026-11-19T19:04:00Z" },
      { id:"m11", from:"u-ayesha", text:"I made a one-page summary. Sharing it in the group after dinner.", at:"2026-11-19T19:06:00Z" },
      { id:"m12", from:"u-student", text:"Legend. I'll run a practice set now to check myself.", at:"2026-11-19T19:10:00Z" }
    ] },
  { id:"c4", type:"group", name:"Math Clinic · Class 10", members:["u-mahin","u-sadia","u-jannat","u-shakib"], adminJoined:true, createdAt:"2026-10-20T08:00:00Z",
    messages:[
      { id:"m13", from:"u-sadia", text:"Post your toughest algebra question here and we'll solve it together at 8 pm.", at:"2026-11-21T17:40:00Z" },
      { id:"m14", from:"u-shakib", text:"(a+b)² identity proofs always trip me up.", at:"2026-11-21T17:44:00Z" }
    ] }
];

const SEED_REPORTS = [
  { id:"r1", conversationId:"c2", reporterId:"u-mahin", subjectId:"u-student", reason:"Shared a school worksheet answer sheet", createdAt:"2026-11-23T11:00:00Z", status:"open", outcome:null, starred:false }
];

/* ---------------- util ---------------- */
const uid = p => (p || "id") + "-" + Math.random().toString(36).slice(2, 9);
function hashStr(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }
function initials(name) { return (name || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase(); }
function avatarGrad(hue) {
  const h = hue % 360;
  return `linear-gradient(150deg,hsl(${h} 76% 60%),hsl(${(h + 34) % 360} 68% 40%))`;
}
function fmtNum(n) { return (n || 0).toLocaleString("en-US"); }
function fmtDur(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  const m = Math.floor(sec / 60), s = sec % 60;
  return m + ":" + String(s).padStart(2, "0");
}
function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec || 0));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
function timeAgo(iso) {
  const then = new Date(iso).getTime(), now = Date.now();
  const d = Math.max(0, now - then);
  const mins = Math.floor(d / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return days + "d ago";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function dayKey(d) { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
