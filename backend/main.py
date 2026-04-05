# backend/main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from datetime import datetime
import time

app = FastAPI(title="Anirudha Khemriya | Backend Portfolio API")

start_time = time.time()

# ======================
# PROFESSIONAL DATA
# ======================

about_data = {
    "identity": {
        "name": "Anirudha Khemriya",
        "role": "Backend-Focused Computer Science Student",
        "location": "Gwalior, Madhya Pradesh, India"
    },
    "summary": "Backend-focused engineering student interested in API architecture, asynchronous processing, and database optimization. Focused on building maintainable server-side systems with performance awareness.",
    "education": {
        "degree": "B.Tech in Computer Science",
        "institution": "Institute of Technology and Management, Gwalior",
        "duration": "2024–2028",
        "cgpa": "7.0/10"
    },
    "engineering_profile": {
        "primary_focus": "Backend architecture & distributed task processing",
        "interests": [
            "Asynchronous task queues (Celery)",
            "Workflow automation systems",
            "Database query optimization",
            "RESTful API architecture",
            "System design fundamentals"
        ]
    }
}

# ======================
# CONTACT & PROFILES
# ======================

contact_data = {
    "email": "anirudhakhemriya06@gmail.com",
    "phone": "+91-9109457494",
    "location": "Gwalior, India",
    "availability": "Open to backend internships and engineering roles"
}

profiles_data = {
    "github": "https://github.com/anirudhkhemriyaa",
    "linkedin": "https://www.linkedin.com/in/anirudha-khemriya-0025a631b/",
    "leetcode": "https://leetcode.com/u/Anirudha__khemriya/"
}

# ======================
# PROJECTS
# ======================

projects_data = [
    {
        "module_name": "BACKGROUND_TASK_AUTOMATION_SYSTEM",
        "type": "Backend Automation Platform",
        "tagline": "Asynchronous task processing system for reliable background execution",

        "architecture": {
            "framework": "Django",
            "task_queue": "Celery",
            "broker": "Redis",
            "database": "PostgreSQL"
        },

        "problem_solved": "Reduced repetitive institutional workflows by automating email handling, file processing, and background operations.",

        "engineering_decisions": [
            "Decoupled heavy operations from HTTP lifecycle using Celery workers",
            "Implemented retry mechanisms for fault tolerance",
            "Optimized DB interactions to prevent request blocking",
            "Separated business logic from view logic for maintainability"
        ],

        "focus_area": "Backend reliability & performance isolation",
        "status": "Production-Ready Academic Prototype"
    },

    {
        "module_name": "HIRELINK_JOB_PORTAL",
        "type": "Role-Based Backend System",
        "tagline": "Structured hiring workflow system with role-based access control",

        "architecture": {
            "framework": "Django",
            "database": "PostgreSQL",
            "auth": "Django Auth + Permission System"
        },

        "problem_solved": "Designed structured HR and student workflows for job postings and application management.",

        "engineering_decisions": [
            "Implemented role-based access control using permission layers",
            "Structured efficient query handling for job retrieval",
            "Designed clean separation of business logic from request handling"
        ],

        "focus_area": "Access control & scalable backend design",
        "status": "Functional Backend Implementation"
    },

    {
        "module_name": "REAL_TIME_CLINIC_QUEUE_SYSTEM",
        "type": "Real-Time Distributed System",
        "tagline": "Live token-based queue system with real-time updates",

        "architecture": {
            "framework": "FastAPI",
            "realtime": "WebSockets",
            "cache": "Redis"
        },

        "problem_solved": "Eliminated uncertainty in clinic waiting systems by providing live queue tracking and token management.",

        "engineering_decisions": [
            "Used Redis for low-latency state management",
            "Implemented WebSockets for real-time updates",
            "Designed token system for predictable service flow",
            "Ensured consistent state across concurrent users"
        ],

        "focus_area": "Real-time systems & event-driven architecture",
        "status": "Working Prototype"
    },

    {
        "module_name": "ASSISTIVE_VISION_SYSTEM",
        "type": "Computer Vision System",
        "tagline": "Object detection system for assisting visually impaired users",

        "architecture": {
            "framework": "FastAPI",
            "vision_model": "YOLO",
            "processing": "OpenCV"
        },

        "problem_solved": "Helps visually impaired users detect nearby objects using real-time video processing and audio feedback.",

        "engineering_decisions": [
            "Streamed mobile camera feed to processing unit",
            "Optimized inference for near real-time response (~10 FPS)",
            "Integrated voice guidance for accessibility",
            "Analyzed limitations in low-light and dense environments"
        ],

        "focus_area": "Computer vision & real-world system constraints",
        "status": "Experimental Prototype"
    }
]

# ======================
# SKILLS
# ======================

skills_data = {
    "programming & Systems": ["Python (Primary)", "C++", "SQL","Linux"],
    "backend": [
        "Django (ORM, Middleware, Authentication)",
        "FastAPI",
        "RESTful API design",
        "Asynchronous processing (Celery + Redis)"
    ],
    "databases": [
        "PostgreSQL",
        "MySQL"
    ],
    "tools": [
        "Git",
        "GitHub",
        "Docker",
        "Postman",
        "VS Code"
    ],
    "core_concepts": [
        "Data Structures & Algorithms",
        "Object-Oriented Programming",
        "Basic System Design",
        "Backend performance fundamentals"
    ]
}

# ======================
# ACHIEVEMENTS
# ======================

achievements_data = {
    "leetcode": {
        "problems_solved": "100+",
        "focus": "Arrays, stacks, linked lists, trees, complexity analysis"
    },
    "hackathon": {
        "event": "Kurukshetra - TechRythm",
        "result": "Top 10 National Finish",
        "project": "IGRS-style grievance management system"
    },
    "current_focus": "Improving SQL performance and strengthening backend system design fundamentals."
}

# ======================
# SYSTEM INFO
# ======================

@app.get("/api/system")
def system_status():
    uptime = round(time.time() - start_time, 2)
    return {
        "status": "Operational",
        "server_time": datetime.utcnow().isoformat(),
        "uptime_seconds": uptime,
        "framework": "FastAPI"
    }

# ======================
# ROUTES
# ======================

@app.get("/api/about")
def get_about():
    return about_data


@app.get("/api/projects")
def get_projects():
    return projects_data


@app.get("/api/skills")
def get_skills():
    return skills_data


@app.get("/api/achievements")
def get_achievements():
    return achievements_data


@app.get("/api/contact")
def get_contact():
    return contact_data


@app.get("/api/profiles")
def get_profiles():
    return profiles_data


# ======================
# SERVE FRONTEND
# ======================

app.mount("/", StaticFiles(directory="static", html=True), name="static")